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
    throw new Error("Failed to authenticate with PayPal");
  }

  const data = await response.json();
  return data.access_token;
}

// POST /api/paypal/capture-order - Capture PayPal payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paypalOrderId, items, shippingAddress, hasOrderBump } = body;

    // Get PayPal settings
    const settings = await db.platformSetting.findMany({
      where: {
        key: { in: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_MODE"] },
      },
    });

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
    
    const clientId = settingsMap.get("PAYPAL_CLIENT_ID") || process.env.PAYPAL_CLIENT_ID;
    const clientSecret = settingsMap.get("PAYPAL_CLIENT_SECRET") || process.env.PAYPAL_CLIENT_SECRET;
    const mode = settingsMap.get("PAYPAL_MODE") || process.env.PAYPAL_MODE || "sandbox";
    const isLive = mode === "live";

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "PayPal is not configured" },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret, isLive);
    
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    // Capture the order
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("PayPal capture error:", error);
      return NextResponse.json(
        { error: error.message || "Payment capture failed" },
        { status: 400 }
      );
    }

    const captureResult = await response.json();
    
    // Get capture ID
    const captureId = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    // Calculate totals
    const COMMISSION_RATE = 0.15;
    let subtotal = 0;
    let platformFee = 0;
    let vendorEarnings = 0;

    // Get product details
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { vendor: true },
    });

    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const itemTotal = product.price * item.quantity;
      const itemPlatformFee = itemTotal * COMMISSION_RATE;
      const itemVendorEarnings = itemTotal - itemPlatformFee;
      
      subtotal += itemTotal;
      platformFee += itemPlatformFee;
      vendorEarnings += itemVendorEarnings;

      return {
        productId: product.id,
        productName: product.name,
        productImage: JSON.parse(product.images)[0] || "",
        price: product.price,
        quantity: item.quantity,
        vendorEarnings: itemVendorEarnings,
        platformFee: itemPlatformFee,
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

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Get vendor ID
    const vendorId = products[0]?.vendorId || "";

    // Create order in database
    const order = await db.order.create({
      data: {
        orderNumber,
        buyerId: session.user.id,
        vendorId,
        shippingFirstName: shippingAddress.firstName,
        shippingLastName: shippingAddress.lastName,
        shippingAddress1: shippingAddress.addressLine1,
        shippingAddress2: shippingAddress.addressLine2,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.zipCode,
        shippingCountry: shippingAddress.country || "United States",
        shippingPhone: shippingAddress.phone,
        subtotal,
        shippingCost: shipping,
        platformFee,
        vendorEarnings,
        total,
        hasOrderBump: hasOrderBump || false,
        orderBumpPrice: hasOrderBump ? 19 : 0,
        paypalOrderId,
        paypalCaptureId: captureId,
        status: "PROCESSING",
        paymentStatus: "PAID",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Update vendor's total sales
    if (vendorId) {
      await db.vendorProfile.updateMany({
        where: { userId: vendorId },
        data: {
          totalSales: { increment: vendorEarnings },
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture payment" },
      { status: 500 }
    );
  }
}
