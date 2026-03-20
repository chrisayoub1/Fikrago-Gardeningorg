"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VendorStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingPayout: number;
  totalOrders: number;
  productCount: number;
  activeProducts: number;
  pendingOrders: number;
}

interface TopProduct {
  id: string;
  name: string;
  price: number;
  totalSales: number;
  images: string[];
  revenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  items: number;
}

interface OrderStatusCounts {
  PENDING: number;
  PROCESSING: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function getStatusBadge(status: string) {
  return (
    <Badge className={`${statusColors[status] || "bg-gray-100 text-gray-800"} border-0 font-medium`}>
      {status}
    </Badge>
  );
}

export default function VendorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState<OrderStatusCounts | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/vendor/dashboard");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "VENDOR") {
      router.push("/");
      return;
    }

    fetchStats();
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/vendor/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTopProducts(data.topProducts || []);
        setRecentOrders(data.recentOrders || []);
        setOrderStatusCounts(data.orderStatusCounts || null);
      }
    } catch (error) {
      console.error("Error fetching vendor stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      change: stats.thisMonthEarnings > 0 ? `+$${stats.thisMonthEarnings.toFixed(2)} this month` : "No sales yet",
      trend: stats.thisMonthEarnings > 0 ? "up" : "neutral",
      icon: DollarSign,
      description: "Lifetime vendor earnings",
    },
    {
      title: "This Month",
      value: `$${stats.thisMonthEarnings.toFixed(2)}`,
      change: "",
      trend: "",
      icon: TrendingUp,
      description: "Current month revenue",
    },
    {
      title: "Pending Payout",
      value: `$${stats.pendingPayout.toFixed(2)}`,
      change: "",
      trend: "",
      icon: Package,
      description: "Available for withdrawal",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : "All processed",
      trend: stats.pendingOrders > 0 ? "up" : "neutral",
      icon: ShoppingCart,
      description: "All time orders",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            Download Report
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            View Store
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {stat.change && (
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      stat.trend === "up" ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {stat.trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                    {stat.trend === "down" && <ArrowDownRight className="h-4 w-4" />}
                    {stat.change}
                  </span>
                )}
                {!stat.change && (
                  <span className="text-xs text-gray-500">{stat.description}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Products</CardTitle>
            <CardDescription>
              {topProducts.length > 0 
                ? "Best selling products" 
                : "No products yet. Add products to see sales data."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 truncate mr-4">
                        {index + 1}. {product.name}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-gray-500">{product.totalSales || 0} sales</span>
                        <span className="font-semibold text-emerald-600">
                          ${product.revenue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all"
                        style={{ 
                          width: `${topProducts[0]?.revenue 
                            ? (product.revenue / topProducts[0].revenue) * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No products yet</p>
                <Button 
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => router.push("/vendor/products")}
                >
                  Add Your First Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
            <CardDescription>Orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            {orderStatusCounts ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">Pending</span>
                    <Badge className="bg-yellow-200 text-yellow-800 border-0">
                      {orderStatusCounts.PENDING}
                    </Badge>
                  </div>
                  <p className="text-xs text-yellow-600 mt-2">Awaiting processing</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Processing</span>
                    <Badge className="bg-blue-200 text-blue-800 border-0">
                      {orderStatusCounts.PROCESSING}
                    </Badge>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Being prepared</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">Shipped</span>
                    <Badge className="bg-purple-200 text-purple-800 border-0">
                      {orderStatusCounts.SHIPPED}
                    </Badge>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">In transit</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-800">Delivered</span>
                    <Badge className="bg-emerald-200 text-emerald-800 border-0">
                      {orderStatusCounts.DELIVERED}
                    </Badge>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2">Completed</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <CardDescription>Latest orders from your store</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700">
            View All Orders
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber || order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{order.items}</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No orders yet. Orders will appear here once customers make purchases.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
