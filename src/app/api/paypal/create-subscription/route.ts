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

// Get or create PayPal Plan
async function getOrCreatePlan(accessToken: string, isLive: boolean): Promise<string> {
  const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const planId = `SEED-SOIL-MONTHLY-${isLive ? "LIVE" : "SANDBOX"}`;
  
  // Try to get existing plan
  const checkResponse = await fetch(`${baseUrl}/v1/billing/plans/${planId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  
  if (checkResponse.ok) {
    return planId;
  }
  
  // Create product first
  const productId = "SEED-TO-SOIL-BOX";
  
  // Check if product exists
  const productCheck = await fetch(`${baseUrl}/v1/catalogs/products/${productId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  
  if (!productCheck.ok) {
    // Create product
    await fetch(`${baseUrl}/v1/catalogs/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: productId,
        name: "Seed-to-Soil Monthly Box",
        description: "Monthly gardening subscription box",
        type: "SERVICE",
        category: "GARDENING_SUBSCRIPTION",
      }),
    });
  }
  
  // Create plan
  const planResponse = await fetch(`${baseUrl}/v1/billing/plans`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: planId,
      product_id: productId,
      name: "Seed-to-Soil Monthly Subscription",
      description: "$29/month subscription",
      status: "ACTIVE",
      billing_cycles: [{
        frequency: { interval_unit: "MONTH", interval_count: 1 },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: { value: "29.00", currency_code: "USD" },
        },
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: "0", currency_code: "USD" },
        payment_failure_threshold: 3,
      },
    }),
  });
  
  if (planResponse.ok) {
    return planId;
  }
  
  // If plan creation failed, try to list plans and find it
  const listResponse = await fetch(`${baseUrl}/v1/billing/plans?product_id=${productId}`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
  });
  
  if (listResponse.ok) {
    const listData = await listResponse.json();
    if (listData.plans?.length > 0) {
      return listData.plans[0].id;
    }
  }
  
  throw new Error("Failed to create or find PayPal plan");
}

// POST /api/paypal/create-subscription - Create PayPal subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddress } = body;

    // Get PayPal settings
    const settings = await db.platformSetting.findMany({
      where: { key: { in: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_MODE"] } },
    });

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
    
    const clientId = settingsMap.get("PAYPAL_CLIENT_ID") || process.env.PAYPAL_CLIENT_ID;
    const clientSecret = settingsMap.get("PAYPAL_CLIENT_SECRET") || process.env.PAYPAL_CLIENT_SECRET;
    const mode = settingsMap.get("PAYPAL_MODE") || process.env.PAYPAL_MODE || "sandbox";
    const isLive = mode === "live";

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "PayPal is not configured" }, { status: 400 });
    }

    // Get access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret, isLive);
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    // Get or create plan
    const planId = await getOrCreatePlan(accessToken, isLive);

    // Create subscription
    const subscriptionData = {
      plan_id: planId,
      start_time: new Date().toISOString(),
      quantity: 1,
      subscriber: {
        name: {
          given_name: shippingAddress?.firstName || session.user?.name?.split(" ")[0] || "Customer",
          surname: shippingAddress?.lastName || session.user?.name?.split(" ").slice(1).join(" ") || "",
        },
        email_address: session.user?.email || "",
        shipping_address: shippingAddress ? {
          name: { full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}` },
          address: {
            address_line_1: shippingAddress.addressLine1,
            address_line_2: shippingAddress.addressLine2 || "",
            admin_area_2: shippingAddress.city,
            admin_area_1: shippingAddress.state,
            postal_code: shippingAddress.zipCode,
            country_code: "US",
          },
        } : undefined,
      },
      application_context: {
        brand_name: "Fikrago Gardening",
        locale: "en-US",
        shipping_preference: shippingAddress ? "SET_PROVIDED_ADDRESS" : "GET_FROM_FILE",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: `${process.env.NEXTAUTH_URL}/subscription-success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/subscribe`,
      },
    };

    const response = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "PayPal-Request-Id": `sub-${Date.now()}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("PayPal subscription error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create subscription" },
        { status: 400 }
      );
    }

    const subscription = await response.json();

    // Find approval link
    const approvalLink = subscription.links?.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    )?.href;

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      approvalUrl: approvalLink,
      planId,
      links: subscription.links,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
