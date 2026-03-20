import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/settings/paypal - Get PayPal settings (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const settings = await db.platformSetting.findMany({
      where: {
        key: {
          in: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_MODE"],
        },
      },
    });

    const result: Record<string, string> = {};
    settings.forEach((setting) => {
      result[setting.key] = setting.value;
    });

    return NextResponse.json({
      clientId: result.PAYPAL_CLIENT_ID || "",
      clientSecret: result.PAYPAL_CLIENT_SECRET ? "••••••••" : "", // Masked
      mode: result.PAYPAL_MODE || "sandbox",
      hasSecret: !!result.PAYPAL_CLIENT_SECRET,
    });
  } catch (error) {
    console.error("Error fetching PayPal settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch PayPal settings" },
      { status: 500 }
    );
  }
}

// POST /api/settings/paypal - Update PayPal settings (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { clientId, clientSecret, mode } = body;

    // Update or create each setting
    const updates = [];
    
    if (clientId !== undefined) {
      updates.push(
        db.platformSetting.upsert({
          where: { key: "PAYPAL_CLIENT_ID" },
          create: {
            key: "PAYPAL_CLIENT_ID",
            value: clientId,
            description: "PayPal Client ID for API integration",
          },
          update: { value: clientId },
        })
      );
    }

    if (clientSecret) {
      updates.push(
        db.platformSetting.upsert({
          where: { key: "PAYPAL_CLIENT_SECRET" },
          create: {
            key: "PAYPAL_CLIENT_SECRET",
            value: clientSecret,
            description: "PayPal Client Secret for API integration",
          },
          update: { value: clientSecret },
        })
      );
    }

    if (mode) {
      updates.push(
        db.platformSetting.upsert({
          where: { key: "PAYPAL_MODE" },
          create: {
            key: "PAYPAL_MODE",
            value: mode,
            description: "PayPal mode: sandbox or live",
          },
          update: { value: mode },
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "PayPal settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating PayPal settings:", error);
    return NextResponse.json(
      { error: "Failed to update PayPal settings" },
      { status: 500 }
    );
  }
}
