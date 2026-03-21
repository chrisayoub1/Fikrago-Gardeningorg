"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  DollarSign,
  TrendingUp,
  Calendar,
  Wallet,
  ArrowUpRight,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  COMPLETED: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  PROCESSING: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  PENDING: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  FAILED: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function EarningsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendor/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data?.stats || null);
        setLoading(false);
      })
      .catch(() => { setStats(null); setLoading(false); });
  }, []);

  const totalEarnings = stats?.totalEarnings || 0;
  const thisMonth = stats?.thisMonthEarnings || 0;
  const pendingPayout = stats?.pendingPayout || 0;
  const monthlyGrowth = "0.0";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500">Track your revenue and payouts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-sm text-emerald-100 mt-1">Lifetime vendor earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${thisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-emerald-600 font-medium">+{monthlyGrowth}%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-500 mt-1">Based on delivered orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">$0.00</div>
            <Button size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700 w-full">
              Request Payout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
            <CardDescription>How your earnings are calculated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Your Revenue</span>
              <span className="text-xl font-bold">${thisMonth.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600">Your Share (85%)</span>
                <span className="font-medium">${(thisMonth * 0.85).toFixed(2)}</span>
              </div>
              <Progress value={85} className="h-3 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Platform Fee (15%)</span>
                <span className="font-medium">${(thisMonth * 0.15).toFixed(2)}</span>
              </div>
              <Progress value={15} className="h-3 bg-gray-100 [&>div]:bg-gray-400" />
            </div>

            <Separator />

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">Your Earnings</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                ${(thisMonth * 0.85).toFixed(2)}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                85% of total revenue goes to you
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payout Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Schedule</CardTitle>
            <CardDescription>Automatic monthly payouts to your PayPal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Payout Frequency</span>
              </div>
              <p className="text-sm text-blue-700">
                Payouts are processed on the 1st of each month for the previous month&apos;s earnings.
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-2">PayPal Account</p>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">Connected via PayPal</span>
                </div>
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Your earnings by month</CardDescription>
          </div>
          <Select defaultValue="6months">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Earnings data will appear here as orders are completed.</p>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>All your completed payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Payout history will appear here once payouts are processed.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
