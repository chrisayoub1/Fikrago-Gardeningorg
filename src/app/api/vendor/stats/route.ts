import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/vendor/stats - Get vendor dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorId = session.user.id;

    // Get vendor profile
    const vendorProfile = await db.vendorProfile.findUnique({
      where: { userId: vendorId },
    });

    // Get total earnings from completed orders
    const orders = await db.order.findMany({
      where: {
        vendorId,
        paymentStatus: "PAID",
      },
    });

    // Calculate totals
    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let pendingPayout = 0;
    let totalOrders = 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    orders.forEach((order) => {
      totalEarnings += order.vendorEarnings;
      totalOrders++;
      
      if (order.createdAt >= startOfMonth) {
        thisMonthEarnings += order.vendorEarnings;
      }
      
      if (order.status === "DELIVERED") {
        pendingPayout += order.vendorEarnings;
      }
    });

    // Get product count
    const productCount = await db.product.count({
      where: { vendorId },
    });

    // Get active products
    const activeProducts = await db.product.count({
      where: { vendorId, status: "ACTIVE" },
    });

    // Get pending orders count
    const pendingOrders = await db.order.count({
      where: { vendorId, status: "PENDING" },
    });

    // Get top selling products
    const topProducts = await db.product.findMany({
      where: { vendorId },
      orderBy: { totalSales: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        totalSales: true,
        images: true,
      },
    });

    // Get recent orders
    const recentOrders = await db.order.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Order status counts
    const orderStatusCounts = await db.order.groupBy({
      by: ["status"],
      where: { vendorId },
      _count: true,
    });

    const statusCounts: Record<string, number> = {
      PENDING: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orderStatusCounts.forEach((item) => {
      statusCounts[item.status] = item._count;
    });

    return NextResponse.json({
      stats: {
        totalEarnings,
        thisMonthEarnings,
        pendingPayout,
        totalOrders,
        productCount,
        activeProducts,
        pendingOrders,
      },
      vendorProfile,
      topProducts: topProducts.map((p) => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
        revenue: p.price * (p.totalSales || 0),
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.shippingFirstName + " " + order.shippingLastName,
        email: "",
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: 0,
      })),
      orderStatusCounts: statusCounts,
    });
  } catch (error) {
    console.error("Error fetching vendor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
