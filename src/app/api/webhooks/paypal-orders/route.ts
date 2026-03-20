/**
 * PayPal Orders Webhook Handler
 * 
 * Handles PayPal one-time payment events for product orders:
 * - CHECKOUT.ORDER.APPROVED: Order approved by buyer
 * - PAYMENT.CAPTURE.COMPLETED: Payment successful
 * - PAYMENT.CAPTURE.DENIED: Payment denied
 * - PAYMENT.CAPTURE.REFUNDED: Refund issued
 * - PAYMENT.CAPTURE.REVERSED: Chargeback/dispute
 * 
 * Configure this webhook URL in PayPal Developer Dashboard
 * URL: https://your-domain.com/api/webhooks/paypal-orders
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PayPal webhook event types we handle for orders
const HANDLED_EVENTS = [
  "CHECKOUT.ORDER.APPROVED",
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
  "PAYMENT.CAPTURE.PENDING",
];

// Send email notification
async function sendEmail(type: string, data: Record<string, unknown>) {
  console.log(`📧 Email notification: ${type}`, data);
  
  // TODO: Integrate with your email service
  // Example for SendGrid, Resend, etc.
  
  return true;
}

// Trigger vendor notification
async function notifyVendor(order: any, type: string) {
  console.log(`📦 Vendor notification: ${type} for order ${order.id}`);
  
  // TODO: Send notification to vendor about new order
  // Could be email, SMS, or push notification
  
  return true;
}

// Handle order approved (buyer approved payment in PayPal)
async function handleOrderApproved(event: any) {
  const order = event.resource;
  const paypalOrderId = order.id;
  
  console.log(`✅ Order approved: ${paypalOrderId}`);
  
  // Check if order exists in our database
  const existingOrder = await db.order.findFirst({
    where: { paypalOrderId },
    include: { buyer: true, vendor: true, items: true },
  });
  
  if (!existingOrder) {
    console.log(`Order not found in database: ${paypalOrderId}`);
    return { success: false, error: "Order not found" };
  }
  
  // Update order status
  await db.order.update({
    where: { id: existingOrder.id },
    data: {
      status: "PROCESSING",
      paymentStatus: "PAID",
    },
  });
  
  // Send confirmation email to buyer
  await sendEmail("order_confirmed", {
    email: existingOrder.buyer.email,
    name: existingOrder.buyer.name,
    orderNumber: existingOrder.orderNumber,
    total: existingOrder.total,
    items: existingOrder.items,
  });
  
  // Notify vendor
  await notifyVendor(existingOrder, "new_order");
  
  return { success: true };
}

// Handle payment captured successfully
async function handlePaymentCaptured(event: any) {
  const capture = event.resource;
  const paypalCaptureId = capture.id;
  const paypalOrderId = capture.supplementary_data?.related_ids?.order_id;
  
  console.log(`💰 Payment captured: ${paypalCaptureId}`);
  
  // Find order by capture ID or order ID
  const order = await db.order.findFirst({
    where: {
      OR: [
        { paypalCaptureId },
        { paypalOrderId },
      ],
    },
    include: { buyer: true, vendor: true, items: { include: { product: true } } },
  });
  
  if (!order) {
    console.log(`Order not found for capture: ${paypalCaptureId}`);
    return { success: false, error: "Order not found" };
  }
  
  // Update order with capture details
  await db.order.update({
    where: { id: order.id },
    data: {
      paypalCaptureId,
      status: "PROCESSING",
      paymentStatus: "PAID",
    },
  });
  
  // Update vendor sales
  if (order.vendorId) {
    await db.vendorProfile.updateMany({
      where: { userId: order.vendorId },
      data: {
        totalSales: { increment: order.vendorEarnings },
      },
    });
  }
  
  // Send payment confirmation
  await sendEmail("payment_completed", {
    email: order.buyer.email,
    name: order.buyer.name,
    orderNumber: order.orderNumber,
    total: order.total,
  });
  
  // Trigger fulfillment
  await notifyVendor(order, "payment_received");
  
  return { success: true };
}

// Handle payment denied
async function handlePaymentDenied(event: any) {
  const capture = event.resource;
  const paypalCaptureId = capture.id;
  
  console.log(`❌ Payment denied: ${paypalCaptureId}`);
  
  const order = await db.order.findFirst({
    where: { paypalCaptureId },
    include: { buyer: true },
  });
  
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  // Update order status
  await db.order.update({
    where: { id: order.id },
    data: {
      status: "CANCELLED",
      paymentStatus: "FAILED",
    },
  });
  
  // Notify buyer
  await sendEmail("payment_failed", {
    email: order.buyer.email,
    name: order.buyer.name,
    orderNumber: order.orderNumber,
    reason: capture.status_details?.reason || "Payment was denied",
  });
  
  return { success: true };
}

// Handle refund
async function handlePaymentRefunded(event: any) {
  const refund = event.resource;
  const paypalCaptureId = refund.links?.find((l: any) => l.rel === "up")?.href?.split("/").pop();
  
  console.log(`💸 Payment refunded: ${refund.id}`);
  
  const order = await db.order.findFirst({
    where: { paypalCaptureId },
    include: { buyer: true, vendor: true },
  });
  
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  // Update order status
  await db.order.update({
    where: { id: order.id },
    data: {
      status: "REFUNDED",
      paymentStatus: "REFUNDED",
    },
  });
  
  // Notify buyer and vendor
  await sendEmail("order_refunded", {
    email: order.buyer.email,
    name: order.buyer.name,
    orderNumber: order.orderNumber,
    amount: refund.amount?.value,
  });
  
  // Notify vendor about refund
  if (order.vendor?.email) {
    await sendEmail("vendor_order_refunded", {
      email: order.vendor.email,
      orderNumber: order.orderNumber,
    });
  }
  
  return { success: true };
}

// Handle chargeback/reversal
async function handlePaymentReversed(event: any) {
  const reversal = event.resource;
  const paypalCaptureId = reversal.links?.find((l: any) => l.rel === "up")?.href?.split("/").pop();
  
  console.log(`🔄 Payment reversed (chargeback): ${reversal.id}`);
  
  const order = await db.order.findFirst({
    where: { paypalCaptureId },
    include: { buyer: true },
  });
  
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  // Update order status
  await db.order.update({
    where: { id: order.id },
    data: {
      status: "DISPUTED",
      paymentStatus: "REFUNDED",
    },
  });
  
  // Notify admin about dispute
  await sendEmail("admin_chargeback_alert", {
    email: "admin@fikrago.com",
    orderNumber: order.orderNumber,
    amount: reversal.amount?.value,
    reason: reversal.reason_code,
  });
  
  return { success: true };
}

// Handle pending payment
async function handlePaymentPending(event: any) {
  const capture = event.resource;
  const paypalCaptureId = capture.id;
  
  console.log(`⏳ Payment pending: ${paypalCaptureId}`);
  
  const order = await db.order.findFirst({
    where: { paypalCaptureId },
  });
  
  if (!order) {
    return { success: false, error: "Order not found" };
  }
  
  // Update order status
  await db.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PENDING",
    },
  });
  
  return { success: true };
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);
    
    console.log(`🔔 PayPal Orders Webhook received: ${event.event_type}`);
    console.log(`Event ID: ${event.id}`);
    
    // Check if we handle this event type
    if (!HANDLED_EVENTS.includes(event.event_type)) {
      console.log(`Unhandled event type: ${event.event_type}`);
      return NextResponse.json({ received: true, handled: false });
    }
    
    // Handle the event
    let result;
    
    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED":
        result = await handleOrderApproved(event);
        break;
      case "PAYMENT.CAPTURE.COMPLETED":
        result = await handlePaymentCaptured(event);
        break;
      case "PAYMENT.CAPTURE.DENIED":
        result = await handlePaymentDenied(event);
        break;
      case "PAYMENT.CAPTURE.REFUNDED":
        result = await handlePaymentRefunded(event);
        break;
      case "PAYMENT.CAPTURE.REVERSED":
        result = await handlePaymentReversed(event);
        break;
      case "PAYMENT.CAPTURE.PENDING":
        result = await handlePaymentPending(event);
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
    message: "PayPal Orders Webhook Endpoint",
    status: "active",
    type: "one-time-payments",
    handledEvents: HANDLED_EVENTS,
  });
}
