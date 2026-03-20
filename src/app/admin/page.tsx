"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Users,
  Store,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Package,
  AlertTriangle,
  CreditCard,
  Activity,
  Leaf,
} from "lucide-react";
import Link from "next/link";

interface AdminStats {
  pendingVendors: number;
  pendingProducts: number;
  pendingOrders: number;
  todayRevenue: number;
  newOrders: number;
  revenue: {
    total: number;
    thisMonth: number;
    today: number;
    monthly: { month: string; revenue: number }[];
  };
  vendors: {
    total: number;
    pending: number;
    approved: number;
    top: Array<{
      id: string;
      name: string | null;
      email: string;
      vendorProfile: {
        businessName: string;
        totalSales: number;
        rating: number;
      } | null;
      _count: { products: number };
    }>;
  };
  users: {
    total: number;
    buyers: number;
  };
  products: {
    total: number;
    active: number;
    pending: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    recent: Array<{
      id: string;
      orderNumber: string;
      status: string;
      total: number;
      createdAt: string;
      buyer: { name: string | null };
    }>;
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PROCESSING":
      return <Badge variant="secondary">Processing</Badge>;
    case "SHIPPED":
      return <Badge variant="default" className="bg-blue-500">Shipped</Badge>;
    case "DELIVERED":
      return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
    case "PENDING":
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Pending</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Leaf className="h-12 w-12 text-emerald-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Welcome to Fikrago Admin</h2>
        <p className="text-muted-foreground">No data available yet. Start by approving vendors!</p>
      </div>
    );
  }

  const hasData = stats?.revenue?.total > 0 || stats?.vendors?.total > 0 || stats?.orders?.total > 0 || stats?.users?.total > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your platform.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Platform Revenue (15%)"
          value={stats?.revenue?.total > 0 ? `$${stats.revenue.total.toFixed(2)}` : "$0.00"}
          icon={DollarSign}
          description={stats?.revenue?.thisMonth > 0 ? `$${stats.revenue.thisMonth.toFixed(2)} this month` : "No revenue yet"}
        />
        <StatCard
          title="Active Vendors"
          value={stats?.vendors?.approved || 0}
          icon={Store}
          description={stats?.vendors?.pending > 0 ? `${stats.vendors.pending} pending approval` : "No pending vendors"}
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          icon={ShoppingCart}
          description={stats?.orders?.pending > 0 ? `${stats.orders.pending} pending` : "No orders yet"}
        />
        <StatCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={Users}
          description={`${stats?.users?.buyers || 0} buyers, ${stats?.vendors?.total || 0} vendors`}
        />
      </div>

      {/* Quick Actions - Only show if there are pending items */}
      {((stats?.vendors?.pending || 0) > 0 || (stats?.products?.pending || 0) > 0 || (stats?.orders?.pending || 0) > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Action Required</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(stats?.vendors?.pending || 0) > 0 && (
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <Link href="/admin/vendors">
                    <Store className="h-5 w-5" />
                    <span>Approve Vendors</span>
                    <Badge variant="secondary" className="text-xs">{stats?.vendors?.pending} pending</Badge>
                  </Link>
                </Button>
              )}
              {(stats?.products?.pending || 0) > 0 && (
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <Link href="/admin/products">
                    <Package className="h-5 w-5" />
                    <span>Review Products</span>
                    <Badge variant="secondary" className="text-xs">{stats?.products?.pending} pending</Badge>
                  </Link>
                </Button>
              )}
              {(stats?.orders?.pending || 0) > 0 && (
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                  <Link href="/admin/orders">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Pending Orders</span>
                    <Badge variant="secondary" className="text-xs">{stats?.orders?.pending} pending</Badge>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!hasData && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Leaf className="h-16 w-16 text-emerald-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Marketplace is Ready!</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              No data yet. When vendors sign up and customers place orders, you&apos;ll see all the stats here.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/admin/settings">Configure PayPal Settings</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Data Tables - Only show if there's data */}
      {hasData && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Vendors */}
          {stats.vendors.top.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Top Vendors</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/vendors">
                    View all
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {stats.vendors.top.map((vendor, index) => (
                      <div key={vendor.id} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {vendor.vendorProfile?.businessName || vendor.name || vendor.email}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>${(vendor.vendorProfile?.totalSales || 0).toFixed(2)} sales</span>
                            <span>•</span>
                            <span>{vendor._count.products} products</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            ${((vendor.vendorProfile?.totalSales || 0) * 0.15).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">commission</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Recent Orders */}
          {stats.orders.recent.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/orders">
                    View all
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">Order</TableHead>
                        <TableHead className="text-xs">Customer</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.orders.recent.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-xs">{order.orderNumber}</TableCell>
                          <TableCell className="text-xs">{order.buyer.name || "Customer"}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-xs text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Platform Stats Summary */}
      {hasData && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{stats.products.active}</span>
                <span className="text-sm text-muted-foreground">active</span>
              </div>
              <Progress value={stats.products.total > 0 ? (stats.products.active / stats.products.total) * 100 : 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.products.total} total products
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Vendor Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{stats.vendors.approved}</span>
                <span className="text-sm text-muted-foreground">approved</span>
              </div>
              <Progress value={stats.vendors.total > 0 ? (stats.vendors.approved / stats.vendors.total) * 100 : 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.vendors.total} total vendors
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Order Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{stats.orders.total - stats.orders.pending}</span>
                <span className="text-sm text-muted-foreground">processed</span>
              </div>
              <Progress value={stats.orders.total > 0 ? ((stats.orders.total - stats.orders.pending) / stats.orders.total) * 100 : 0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.orders.total} total orders
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
