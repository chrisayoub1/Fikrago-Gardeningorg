/**
 * PayPal Webhook Handler
 * 
 * Handles PayPal subscription events:
 * - BILLING.SUBSCRIPTION.ACTIVATED: New subscription created
 * - BILLING.SUBSCRIPTION.PAYMENT.COMPLETED: Payment successful
 * - BILLING.SUBSCRIPTION.PAYMENT.FAILED: Payment failed
 * - BILLING.SUBSCRIPTION.CANCELLED: Subscription cancelled
 * - BILLING.SUBSCRIPTION.SUSPENDED: Subscription suspended
 * - BILLING.SUBSCRIPTION.EXPIRED: Subscription expired
 * 
 * Important: Configure this webhook URL in your PayPal Developer Dashboard
 * URL: https://your-domain.com/api/webhooks/paypal
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// PayPal webhook event types we handle
const HANDLED_EVENTS = [
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.PAYMENT.COMPLETED",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
];

// Get PayPal settings
async function getPayPalSettings() {
  const settings = await db.platformSetting.findMany({
    where: {
      key: { in: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_MODE"] },
    },
  });

  const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
  
  return {
    clientId: settingsMap.get("PAYPAL_CLIENT_ID") || process.env.PAYPAL_CLIENT_ID,
    clientSecret: settingsMap.get("PAYPAL_CLIENT_SECRET") || process.env.PAYPAL_CLIENT_SECRET,
    mode: settingsMap.get("PAYPAL_MODE") || process.env.PAYPAL_MODE || "sandbox",
  };
}

// Verify PayPal webhook signature
async function verifyWebhookSignature(
  body: string,
  headers: Headers,
  webhookId: string
): Promise<boolean> {
  try {
    const { clientId, clientSecret, mode } = await getPayPalSettings();
    const isLive = mode === "live";
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    
    // Get required headers
    const transmissionId = headers.get("paypal-transmission-id");
    const transmissionTime = headers.get("paypal-transmission-time");
    const transmissionSig = headers.get("paypal-transmission-sig");
    const certUrl = headers.get("paypal-cert-url");
    const authAlgo = headers.get("paypal-auth-algo");

    if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
      console.error("Missing required PayPal webhook headers");
      return false;
    }

    // Construct the signature string
    const expectedSig = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto.createHash('crc32c').update(body).digest('hex')}`;

    // Fetch the certificate
    const certResponse = await fetch(certUrl);
    if (!certResponse.ok) {
      console.error("Failed to fetch PayPal certificate");
      return false;
    }
    const cert = await certResponse.text();

    // Verify signature using crypto
    const verifier = crypto.createVerify(authAlgo === "SHA256" ? "RSA-SHA256" : "RSA-SHA1");
    verifier.update(expectedSig);
    
    // Get public key from certificate
    const publicKey = cert;
    
    const isValid = verifier.verify(publicKey, transmissionSig, "base64");
    return isValid;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    // In development, allow webhooks without verification
    return process.env.NODE_ENV === "development";
  }
}

// Send email notification (mock implementation - integrate with your email service)
async function sendEmail(type: string, data: Record<string, unknown>) {
  console.log(`📧 Email notification: ${type}`, data);
  
  // TODO: Integrate with your email service (SendGrid, Resend, etc.)
  // Example:
  // await sendgrid.send({
  //   to: data.email,
  //   subject: type === 'subscription_activated' ? 'Welcome to Seed-to-Soil Box!' : 'Subscription Update',
  //   html: generateEmailTemplate(type, data),
  // });
  
  return true;
}

// Trigger fulfillment notification
async function triggerFulfillment(subscription: any) {
  console.log('📦 Fulfillment triggered for subscription:', subscription.id);
  
  // TODO: Send notification to fulfillment system/vendor
  // Example: Send to webhook, create order in fulfillment system, etc.
  
  return true;
}

// Handle subscription activated
async function handleSubscriptionActivated(event: any) {
  const subscription = event.resource;
  const paypalSubscriptionId = subscription.id;
  
  console.log(`✅ Subscription activated: ${paypalSubscriptionId}`);
  
  // Find existing subscription by PayPal ID or create notification
  const existingSub = await db.subscription.findFirst({
    where: { paypalSubscriptionId },
    include: { user: true },
  });
  
  if (existingSub) {
    // Update status
    await db.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: new Date(subscription.start_time || new Date()),
        currentPeriodEnd: new Date(subscription.billing_info?.next_billing_time || new Date()),
        nextBillingDate: subscription.billing_info?.next_billing_time 
          ? new Date(subscription.billing_info.next_billing_time) 
          : null,
      },
    });
    
    // Send confirmation email
    await sendEmail("subscription_activated", {
      email: existingSub.user.email,
      name: existingSub.user.name,
      subscriptionId: paypalSubscriptionId,
      planName: existingSub.planName,
      price: existingSub.planPrice,
    });
    
    // Trigger fulfillment
    await triggerFulfillment(existingSub);
  }
  
  return { success: true };
}

// Handle payment completed
async function handlePaymentCompleted(event: any) {
  const resource = event.resource;
  const paypalSubscriptionId = resource.billing_agreement_id || resource.id;
  
  console.log(`💰 Payment completed for subscription: ${paypalSubscriptionId}`);
  
  const subscription = await db.subscription.findFirst({
    where: { paypalSubscriptionId },
    include: { user: true },
  });
  
  if (!subscription) {
    console.log(`Subscription not found: ${paypalSubscriptionId}`);
    return { success: false, error: "Subscription not found" };
  }
  
  const amount = parseFloat(resource.amount?.value || "29.00");
  
  // Update subscription
  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "ACTIVE",
      totalCycles: { increment: 1 },
      totalPaid: { increment: amount },
      lastPaymentDate: new Date(),
      failedPaymentCount: 0, // Reset failed count
      nextBillingDate: resource.billing_info?.next_billing_time
        ? new Date(resource.billing_info.next_billing_time)
        : null,
      currentPeriodStart: new Date(),
      currentPeriodEnd: resource.billing_info?.next_billing_time
        ? new Date(resource.billing_info.next_billing_time)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
    },
  });
  
  // Record payment
  await db.subscriptionPayment.create({
    data: {
      subscriptionId: subscription.id,
      paypalPaymentId: resource.id,
      amount: amount,
      currency: resource.amount?.currency_code || "USD",
      status: "SUCCESS",
      paymentDate: new Date(),
    },
  });
  
  // Send payment confirmation email
  await sendEmail("payment_completed", {
    email: subscription.user.email,
    name: subscription.user.name,
    amount: amount,
    nextBillingDate: resource.billing_info?.next_billing_time,
  });
  
  // Trigger fulfillment for this cycle
  await triggerFulfillment(subscription);
  
  return { success: true };
}

// Handle payment failed
async function handlePaymentFailed(event: any) {
  const resource = event.resource;
  const paypalSubscriptionId = resource.billing_agreement_id || resource.id;
  
  console.log(`❌ Payment failed for subscription: ${paypalSubscriptionId}`);
  
  const subscription = await db.subscription.findFirst({
    where: { paypalSubscriptionId },
    include: { user: true },
  });
  
  if (!subscription) {
    return { success: false, error: "Subscription not found" };
  }
  
  // Update subscription status
  await db.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "PAYMENT_FAILED",
      failedPaymentCount: { increment: 1 },
      pausedAt: new Date(),
    },
  });
  
  // Record failed payment
  await db.subscriptionPayment.create({
    data: {
      subscriptionId: subscription.id,
      paypalPaymentId: resource.id,
      amount: parseFloat(resource.amount?.value || "29.00"),
      currency: resource.amount?.currency_code || "USD",
      status: "FAILED",
      paymentDate: new Date(),
    },
  });
  
  // Send payment failure email
  await sendEmail("payment_failed", {
    email: subscription.user.email,
    name: subscription.user.name,
    failedAttempts: subscription.failedPaymentCount + 1,
    updatePaymentUrl: `${process.env.NEXTAUTH_URL}/subscribe?update=${paypalSubscriptionId}`,
  });
  
  return { success: true };
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(event: any) {
  const subscription = event.resource;
  const paypalSubscriptionId = subscription.id;
  
  console.log(`🚫 Subscription cancelled: ${paypalSubscriptionId}`);
  
  const existingSub = await db.subscription.findFirst({
    where: { paypalSubscriptionId },
    include: { user: true },
  });
  
  if (existingSub) {
    // Mark as cancelled immediately
    await db.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
    
    // Send cancellation email
    await sendEmail("subscription_cancelled", {
      email: existingSub.user.email,
      name: existingSub.user.name,
      endDate: existingSub.currentPeriodEnd,
    });
  }
  
  return { success: true };
}

// Handle subscription suspended
async function handleSubscriptionSuspended(event: any) {
  const subscription = event.resource;
  const paypalSubscriptionId = subscription.id;
  
  console.log(`⏸️ Subscription suspended: ${paypalSubscriptionId}`);
  
  const existingSub = await db.subscription.findFirst({
    where: { paypalSubscriptionId },
    include: { user: true },
  });
  
  if (existingSub) {
    await db.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: "PAUSED",
        pausedAt: new Date(),
      },
    });
  }
  
  return { success: true };
}

// Handle subscription expired
async function handleSubscriptionExpired(event: any) {
  const subscription = event.resource;
  const paypalSubscriptionId = subscription.id;
  
  console.log(`⏰ Subscription expired: ${paypalSubscriptionId}`);
  
  const existingSub = await db.subscription.findFirst({
    where: { paypalSubscriptionId },
    include: { user: true },
  });
  
  if (existingSub) {
    await db.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: "EXPIRED",
      },
    });
  }
  
  return { success: true };
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);
    
    console.log(`🔔 PayPal Webhook received: ${event.event_type}`);
    console.log(`Event ID: ${event.id}`);
    
    // Verify webhook signature (optional in development)
    // const isValid = await verifyWebhookSignature(body, request.headers, process.env.PAYPAL_WEBHOOK_ID || "");
    // if (!isValid) {
    //   console.error("Invalid webhook signature");
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }
    
    // Check if we handle this event type
    if (!HANDLED_EVENTS.includes(event.event_type)) {
      console.log(`Unhandled event type: ${event.event_type}`);
      return NextResponse.json({ received: true, handled: false });
    }
    
    // Handle the event
    let result;
    
    switch (event.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        result = await handleSubscriptionActivated(event);
        break;
      case "BILLING.SUBSCRIPTION.PAYMENT.COMPLETED":
        result = await handlePaymentCompleted(event);
        break;
      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        result = await handlePaymentFailed(event);
        break;
      case "BILLING.SUBSCRIPTION.CANCELLED":
        result = await handleSubscriptionCancelled(event);
        break;
      case "BILLING.SUBSCRIPTION.SUSPENDED":
        result = await handleSubscriptionSuspended(event);
        break;
      case "BILLING.SUBSCRIPTION.EXPIRED":
        result = await handleSubscriptionExpired(event);
        break;
      default:
        result = { success: true, message: "Event acknowledged" };
    }
    
    return NextResponse.json({
      received: true,
      handled: true,
      event_type: event.event_type,
      result,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    message: "PayPal Webhook Endpoint",
    status: "active",
    handledEvents: HANDLED_EVENTS,
  });
}
