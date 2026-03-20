import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/subscriptions - List all subscriptions with stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    // Get subscriptions with pagination
    const [subscriptions, total] = await Promise.all([
      db.subscription.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: {
            orderBy: { paymentDate: "desc" },
            take: 5,
          },
          _count: {
            select: { payments: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.subscription.count({ where }),
    ]);

    // Calculate stats
    const stats = await db.subscription.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        totalPaid: true,
        planPrice: true,
      },
      where: { status: "ACTIVE" },
    });

    // Get status breakdown
    const statusBreakdown = await db.subscription.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    // Get monthly revenue (current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyRevenue = await db.subscriptionPayment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "SUCCESS",
        paymentDate: {
          gte: firstDayOfMonth,
        },
      },
    });

    // Calculate expected monthly revenue (active subscriptions)
    const activeSubscriptions = await db.subscription.count({
      where: { status: "ACTIVE" },
    });
    const expectedMonthlyRevenue = activeSubscriptions * 29;

    return NextResponse.json({
      subscriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalSubscriptions: total,
        activeSubscriptions,
        totalRevenue: stats._sum.totalPaid || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        expectedMonthlyRevenue,
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/subscriptions - Update subscription status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionId, action } = body;

    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case "cancel":
        updateData = {
          status: "CANCELLED",
          cancelledAt: new Date(),
        };
        // TODO: Cancel subscription in PayPal
        break;
      case "pause":
        updateData = {
          status: "PAUSED",
          pausedAt: new Date(),
        };
        // TODO: Suspend subscription in PayPal
        break;
      case "activate":
        updateData = {
          status: "ACTIVE",
          pausedAt: null,
        };
        // TODO: Reactivate subscription in PayPal
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await db.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
