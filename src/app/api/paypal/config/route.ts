import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/paypal/config - Get PayPal client ID for frontend
export async function GET() {
  try {
    // Get PayPal settings from database
    const settings = await db.platformSetting.findMany({
      where: {
        key: { in: ["PAYPAL_CLIENT_ID", "PAYPAL_MODE"] },
      },
    });

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));
    
    // Fall back to environment variables
    const clientId = settingsMap.get("PAYPAL_CLIENT_ID") || process.env.PAYPAL_CLIENT_ID;
    const mode = settingsMap.get("PAYPAL_MODE") || process.env.PAYPAL_MODE || "sandbox";

    if (!clientId || clientId === "your-paypal-client-id") {
      return NextResponse.json({
        configured: false,
        message: "PayPal is not configured",
      });
    }

    return NextResponse.json({
      configured: true,
      clientId,
      isLive: mode === "live",
    });
  } catch (error) {
    console.error("Error fetching PayPal config:", error);
    return NextResponse.json(
      { error: "Failed to fetch PayPal config" },
      { status: 500 }
    );
  }
}
