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

// POST /api/paypal/capture-subscription - Activate and save subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paypalSubscriptionId, shippingAddress } = body;

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

    // Get subscription details from PayPal
    const subResponse = await fetch(`${baseUrl}/v1/billing/subscriptions/${paypalSubscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!subResponse.ok) {
      const error = await subResponse.json();
      console.error("Failed to get subscription details:", error);
      return NextResponse.json(
        { error: "Failed to verify subscription" },
        { status: 400 }
      );
    }

    const paypalSubscription = await subResponse.json();

    // Calculate billing dates
    const now = new Date();
    const nextBillingDate = paypalSubscription.billing_info?.next_billing_time
      ? new Date(paypalSubscription.billing_info.next_billing_time)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

    // Check if subscription already exists
    const existingSubscription = await db.subscription.findFirst({
      where: { paypalSubscriptionId },
    });

    if (existingSubscription) {
      // Update existing subscription
      const subscription = await db.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: nextBillingDate,
          nextBillingDate,
          totalPaid: { increment: 29 },
          totalCycles: { increment: 1 },
          lastPaymentDate: now,
        },
      });

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          planName: subscription.planName,
          planPrice: subscription.planPrice,
          status: subscription.status,
          nextBillingDate: subscription.nextBillingDate,
        },
      });
    }

    // Create new subscription in database with shipping address
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planName: "Seed-to-Soil Box",
        planPrice: 29.00,
        billingCycle: "MONTHLY",
        status: "ACTIVE",
        paypalSubscriptionId: paypalSubscriptionId,
        paypalPlanId: paypalSubscription.plan_id,
        // Shipping address
        shippingName: shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName}` : null,
        shippingAddress1: shippingAddress?.addressLine1 || null,
        shippingAddress2: shippingAddress?.addressLine2 || null,
        shippingCity: shippingAddress?.city || null,
        shippingState: shippingAddress?.state || null,
        shippingZip: shippingAddress?.zipCode || null,
        shippingCountry: shippingAddress?.country || "United States",
        shippingPhone: shippingAddress?.phone || null,
        // Dates
        currentPeriodStart: now,
        currentPeriodEnd: nextBillingDate,
        nextBillingDate: nextBillingDate,
        lastPaymentDate: now,
        totalPaid: 29.00,
        totalCycles: 1,
      },
    });

    // Create first payment record
    await db.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,
        amount: 29.00,
        currency: "USD",
        status: "SUCCESS",
        paymentDate: now,
      },
    });

    // TODO: Send confirmation email
    // TODO: Trigger fulfillment notification

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        planPrice: subscription.planPrice,
        status: subscription.status,
        nextBillingDate: subscription.nextBillingDate,
      },
    });
  } catch (error) {
    console.error("Error capturing subscription:", error);
    return NextResponse.json(
      { error: "Failed to activate subscription" },
      { status: 500 }
    );
  }
}
