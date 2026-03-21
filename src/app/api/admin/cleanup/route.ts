import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow ADMINs to run this
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🧹 Starting database cleanup via API...");

    // Correct order to avoid foreign key constraint violations
    await db.orderItem.deleteMany({});
    await db.order.deleteMany({});
    await db.review.deleteMany({});
    await db.cartItem.deleteMany({});
    await db.wishlistItem.deleteMany({});
    await db.product.deleteMany({});
    await db.vendorProfile.deleteMany({});
    await db.address.deleteMany({});
    await db.notification.deleteMany({});
    await db.subscriptionPayment.deleteMany({});
    await db.subscription.deleteMany({});
    await db.payout.deleteMany({});
    await db.account.deleteMany({
      where: {
        user: {
          role: { not: "ADMIN" }
        }
      }
    });
    await db.session.deleteMany({
      where: {
        user: {
          role: { not: "ADMIN" }
        }
      }
    });

    const deleteResult = await db.user.deleteMany({
      where: {
        role: { not: "ADMIN" }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Database cleaned successfully",
      deletedUsers: deleteResult.count
    });

  } catch (error: any) {
    console.error("❌ Cleanup API failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
