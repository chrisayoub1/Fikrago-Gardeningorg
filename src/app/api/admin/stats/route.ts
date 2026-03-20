import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get platform revenue (15% commission from all orders)
    const orders = await db.order.findMany({
      where: { paymentStatus: "PAID" },
      select: { platformFee: true, createdAt: true },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.platformFee, 0);

    // Get today's date range
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthRevenue = orders
      .filter((o) => o.createdAt >= startOfMonth)
      .reduce((sum, o) => sum + o.platformFee, 0);

    // Today's revenue
    const todayRevenue = orders
      .filter((o) => o.createdAt >= startOfToday)
      .reduce((sum, o) => sum + o.platformFee, 0);

    // New orders today
    const newOrders = await db.order.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // Get vendor stats
    const totalVendors = await db.user.count({
      where: { role: "VENDOR" },
    });

    const pendingVendors = await db.user.count({
      where: { role: "VENDOR", vendorStatus: "PENDING" },
    });

    const approvedVendors = await db.user.count({
      where: { role: "VENDOR", vendorStatus: "APPROVED" },
    });

    // Get user stats
    const totalUsers = await db.user.count();
    const buyers = await db.user.count({ where: { role: "BUYER" } });

    // Get product stats
    const totalProducts = await db.product.count();
    const activeProducts = await db.product.count({ where: { status: "ACTIVE" } });
    const pendingProducts = await db.product.count({ where: { status: "PENDING_APPROVAL" } });

    // Get order stats
    const totalOrders = await db.order.count();
    const pendingOrders = await db.order.count({ where: { status: "PENDING" } });
    const processingOrders = await db.order.count({ where: { status: "PROCESSING" } });

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    // Get top vendors
    const topVendors = await db.user.findMany({
      where: { role: "VENDOR", vendorStatus: "APPROVED" },
      include: {
        vendorProfile: {
          select: { businessName: true, totalSales: true, rating: true },
        },
        _count: { select: { products: true } },
      },
      orderBy: { vendorProfile: { totalSales: "desc" } },
      take: 5,
    });

    // Recent activity (notifications)
    const recentActivity = await db.notification.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    // Monthly revenue for chart (last 12 months)
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthOrders = orders.filter(
        (o) => o.createdAt >= date && o.createdAt <= endDate
      );
      
      monthlyRevenue.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthOrders.reduce((sum, o) => sum + o.platformFee, 0),
      });
    }

    return NextResponse.json({
      // Stats for admin layout badges
      pendingVendors,
      pendingProducts,
      pendingOrders,
      todayRevenue,
      newOrders,
      // Detailed stats
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        today: todayRevenue,
        monthly: monthlyRevenue,
      },
      vendors: {
        total: totalVendors,
        pending: pendingVendors,
        approved: approvedVendors,
        top: topVendors,
      },
      users: {
        total: totalUsers,
        buyers,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        pending: pendingProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        recent: recentOrders,
      },
      activity: recentActivity,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
