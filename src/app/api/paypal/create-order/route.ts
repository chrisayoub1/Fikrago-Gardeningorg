import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get PayPal access token
async function getPayPalAccessToken(clientId: string, clientSecret: string, isLive: boolean) {
  const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("PayPal auth error:", error);
    throw new Error("Failed to authenticate with PayPal");
  }

  const data = await response.json();
  return data.access_token;
}

// POST /api/paypal/create-order - Create PayPal order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, hasOrderBump, shippingAddress } = body;

    // Get PayPal settings from database
    const settings = await db.platformSetting.findMany({
      where: {
        key: { in: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_MODE"] },
      },
    });

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
    
    // Fall back to environment variables if not in database
    const clientId = settingsMap.get("PAYPAL_CLIENT_ID") || process.env.PAYPAL_CLIENT_ID;
    const clientSecret = settingsMap.get("PAYPAL_CLIENT_SECRET") || process.env.PAYPAL_CLIENT_SECRET;
    const mode = settingsMap.get("PAYPAL_MODE") || process.env.PAYPAL_MODE || "sandbox";
    const isLive = mode === "live";

    if (!clientId || !clientSecret || clientId === "your-paypal-client-id" || clientSecret === "NEED_CLIENT_SECRET_HERE") {
      return NextResponse.json(
        { error: "PayPal is not configured. Please add credentials in Admin Settings." },
        { status: 400 }
      );
    }

    // Calculate totals
    const COMMISSION_RATE = 0.15;
    let subtotal = 0;
    let platformFee = 0;

    // Get product details
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { vendor: { include: { vendorProfile: true } } },
    });

    // Calculate item totals
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const itemTotal = product.price * item.quantity;
      const itemPlatformFee = itemTotal * COMMISSION_RATE;
      
      subtotal += itemTotal;
      platformFee += itemPlatformFee;

      return {
        product,
        quantity: item.quantity,
        itemTotal,
        itemPlatformFee,
      };
    });

    // Add order bump if selected
    if (hasOrderBump) {
      subtotal += 19;
      platformFee += 19 * COMMISSION_RATE;
    }

    // Calculate shipping
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret, isLive);
    
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: `order-${Date.now()}`,
          description: "Fikrago Gardening Marketplace Order",
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: subtotal.toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: shipping.toFixed(2),
              },
            },
          },
          items: orderItems.map((item) => ({
            name: item.product.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: item.product.price.toFixed(2),
            },
          })),
          shipping: {
            name: {
              full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            },
            address: {
              address_line_1: shippingAddress.addressLine1,
              address_line_2: shippingAddress.addressLine2 || "",
              admin_area_2: shippingAddress.city,
              admin_area_1: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country_code: "US",
            },
          },
        },
      ],
      application_context: {
        brand_name: "Fikrago Gardening",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXTAUTH_URL}/order-success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      },
    };

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "PayPal-Request-Id": `fikrago-${Date.now()}`,
      },
      body: JSON.stringify(paypalOrder),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("PayPal order creation error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create PayPal order" },
        { status: 400 }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      links: order.links,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
