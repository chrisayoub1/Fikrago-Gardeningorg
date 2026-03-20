"use client";

import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Activity,
  CreditCard,
  Calendar,
  MoreVertical,
  Pause,
  Play,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  expectedMonthlyRevenue: number;
  statusBreakdown: Record<string, number>;
}

interface Subscription {
  id: string;
  planName: string;
  planPrice: number;
  status: string;
  totalPaid: number;
  totalCycles: number;
  failedPaymentCount: number;
  nextBillingDate: string | null;
  lastPaymentDate: string | null;
  createdAt: string;
  cancelledAt: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    paymentDate: string;
  }>;
  _count: {
    payments: number;
  };
}

interface SubscriptionsResponse {
  subscriptions: Subscription[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: SubscriptionStats;
}

function getStatusBadge(status: string) {
  const styles: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: "bg-green-100", text: "text-green-700" },
    PAUSED: { bg: "bg-yellow-100", text: "text-yellow-700" },
    CANCELLED: { bg: "bg-red-100", text: "text-red-700" },
    EXPIRED: { bg: "bg-gray-100", text: "text-gray-700" },
    PAYMENT_FAILED: { bg: "bg-red-100", text: "text-red-700" },
  };
  
  const style = styles[status] || styles.ACTIVE;
  
  return (
    <Badge variant="secondary" className={`${style.bg} ${style.text}`}>
      {status.replace("_", " ")}
    </Badge>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
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
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
            {trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState<SubscriptionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    subscription: Subscription | null;
    action: "cancel" | "pause" | "activate" | null;
  }>({ open: false, subscription: null, action: null });

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      
      const response = await fetch(`/api/admin/subscriptions?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleAction = async () => {
    if (!actionDialog.subscription || !actionDialog.action) return;
    
    try {
      const response = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: actionDialog.subscription.id,
          action: actionDialog.action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }

      toast.success(`Subscription ${actionDialog.action}d successfully`);
      fetchData();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setActionDialog({ open: false, subscription: null, action: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to Load</h2>
        <p className="text-muted-foreground">Unable to fetch subscription data</p>
        <Button onClick={fetchData} className="mt-4">Retry</Button>
      </div>
    );
  }

  const { subscriptions, pagination, stats } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage Seed-to-Soil Box monthly subscriptions</p>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-amber-500" />
          <span className="font-medium">$29/month</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          description="Currently paying"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toFixed(2)}`}
          description="This month"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Expected Revenue"
          value={`$${stats.expectedMonthlyRevenue.toFixed(2)}`}
          description={`${stats.activeSubscriptions} × $29`}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          description="All time"
          icon={CreditCard}
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(stats.statusBreakdown).map(([status, count]) => (
          <Card key={status} className="cursor-pointer hover:border-emerald-300 transition-colors"
            onClick={() => setStatusFilter(status)}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground">{status.replace("_", " ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>{pagination.total} total subscriptions</CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="PAYMENT_FAILED">Payment Failed</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No subscriptions yet</h3>
              <p className="text-muted-foreground">Subscriptions will appear here when customers sign up</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Cycles</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sub.user.name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{sub.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sub.planName}</p>
                          <p className="text-xs text-muted-foreground">${sub.planPrice}/month</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${sub.totalPaid.toFixed(2)}</p>
                          {sub.failedPaymentCount > 0 && (
                            <p className="text-xs text-red-500">{sub.failedPaymentCount} failed</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{sub.totalCycles}</TableCell>
                      <TableCell>
                        {sub.nextBillingDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(sub.nextBillingDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {sub.status === "ACTIVE" && (
                              <>
                                <DropdownMenuItem onClick={() => setActionDialog({
                                  open: true,
                                  subscription: sub,
                                  action: "pause",
                                })}>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => setActionDialog({
                                    open: true,
                                    subscription: sub,
                                    action: "cancel",
                                  })}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </>
                            )}
                            {(sub.status === "PAUSED" || sub.status === "PAYMENT_FAILED") && (
                              <DropdownMenuItem onClick={() => setActionDialog({
                                open: true,
                                subscription: sub,
                                action: "activate",
                              })}>
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/subscriptions/${sub.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Webhook Info */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">PayPal Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Configure webhook in PayPal Developer Dashboard:
          </p>
          <code className="text-xs bg-muted p-2 rounded block">
            {process.env.NEXTAUTH_URL}/api/webhooks/paypal
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Subscribe to: BILLING.SUBSCRIPTION.* events
          </p>
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => 
        setActionDialog({ ...actionDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === "cancel" && "Cancel Subscription?"}
              {actionDialog.action === "pause" && "Pause Subscription?"}
              {actionDialog.action === "activate" && "Activate Subscription?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === "cancel" && 
                "This will immediately cancel the subscription. The customer will not be charged again."}
              {actionDialog.action === "pause" && 
                "This will pause the subscription. The customer will not be charged until reactivated."}
              {actionDialog.action === "activate" && 
                "This will reactivate the subscription. The customer will be charged on the next billing date."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={actionDialog.action === "cancel" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
              onClick={handleAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
