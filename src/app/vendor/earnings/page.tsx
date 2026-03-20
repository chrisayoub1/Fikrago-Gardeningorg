"use client";

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

// Mock data
const earningsSummary = {
  totalEarnings: 24580.00,
  thisMonth: 3245.80,
  lastMonth: 2890.50,
  pendingPayout: 1842.30,
  availableBalance: 603.80,
  totalPayouts: 22135.90,
};

const monthlyBreakdown = [
  { month: "Nov 2024", orders: 45, revenue: 3245.80, earnings: 2758.93, platformFee: 486.87 },
  { month: "Oct 2024", orders: 38, revenue: 2890.50, earnings: 2456.93, platformFee: 433.58 },
  { month: "Sep 2024", orders: 52, revenue: 4120.30, earnings: 3502.26, platformFee: 618.05 },
  { month: "Aug 2024", orders: 41, revenue: 3156.80, earnings: 2683.28, platformFee: 473.52 },
  { month: "Jul 2024", orders: 47, revenue: 3645.20, earnings: 3098.42, platformFee: 546.78 },
  { month: "Jun 2024", orders: 35, revenue: 2780.90, earnings: 2363.77, platformFee: 417.14 },
];

const payoutHistory = [
  {
    id: "PAY-2024-011",
    amount: 2456.93,
    status: "COMPLETED",
    period: "Oct 1 - Oct 31, 2024",
    processedAt: "2024-11-01",
    paypalTransactionId: "TXN-8X7Y6Z5W4V",
  },
  {
    id: "PAY-2024-010",
    amount: 3502.26,
    status: "COMPLETED",
    period: "Sep 1 - Sep 30, 2024",
    processedAt: "2024-10-01",
    paypalTransactionId: "TXN-9Y8Z7X6W5V",
  },
  {
    id: "PAY-2024-009",
    amount: 2683.28,
    status: "COMPLETED",
    period: "Aug 1 - Aug 31, 2024",
    processedAt: "2024-09-01",
    paypalTransactionId: "TXN-0Z9Y8X7W6V",
  },
  {
    id: "PAY-2024-008",
    amount: 3098.42,
    status: "COMPLETED",
    period: "Jul 1 - Jul 31, 2024",
    processedAt: "2024-08-01",
    paypalTransactionId: "TXN-1A0Z9Y8X7W",
  },
  {
    id: "PAY-2024-007",
    amount: 2363.77,
    status: "FAILED",
    period: "Jun 1 - Jun 30, 2024",
    processedAt: "2024-07-01",
    paypalTransactionId: null,
  },
  {
    id: "PAY-2024-006",
    amount: 2890.45,
    status: "COMPLETED",
    period: "May 1 - May 31, 2024",
    processedAt: "2024-06-01",
    paypalTransactionId: "TXN-2B1A0Z9Y8X",
  },
];

const payoutSchedule = [
  { date: "Dec 1, 2024", amount: 2758.93, status: "upcoming" },
  { date: "Jan 1, 2025", amount: "TBD", status: "future" },
  { date: "Feb 1, 2025", amount: "TBD", status: "future" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
  COMPLETED: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
  PROCESSING: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  PENDING: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  FAILED: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function EarningsPage() {
  const monthlyGrowth = ((earningsSummary.thisMonth - earningsSummary.lastMonth) / earningsSummary.lastMonth * 100).toFixed(1);

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
            <div className="text-3xl font-bold">${earningsSummary.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-sm text-emerald-100 mt-1">Lifetime vendor earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${earningsSummary.thisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
            <div className="text-2xl font-bold text-gray-900">${earningsSummary.pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-500 mt-1">Next payout: Dec 1, 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${earningsSummary.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
              <span className="text-xl font-bold">${earningsSummary.thisMonth.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600">Your Share (85%)</span>
                <span className="font-medium">${(earningsSummary.thisMonth * 0.85).toFixed(2)}</span>
              </div>
              <Progress value={85} className="h-3 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Platform Fee (15%)</span>
                <span className="font-medium">${(earningsSummary.thisMonth * 0.15).toFixed(2)}</span>
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
                ${(earningsSummary.thisMonth * 0.85).toFixed(2)}
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

            <div className="space-y-3">
              {payoutSchedule.map((payout, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    payout.status === "upcoming"
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      payout.status === "upcoming" ? "bg-emerald-100" : "bg-gray-100"
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        payout.status === "upcoming" ? "text-emerald-600" : "text-gray-400"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payout.date}</p>
                      <p className="text-xs text-gray-500">
                        {payout.status === "upcoming" ? "Next scheduled payout" : "Scheduled payout"}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    payout.status === "upcoming" ? "text-emerald-600" : "text-gray-400"
                  }`}>
                    {typeof payout.amount === "number" ? `$${payout.amount.toFixed(2)}` : payout.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-2">PayPal Account</p>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">vendor@gardens.com</span>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Platform Fee (15%)</TableHead>
                <TableHead className="text-right">Your Earnings (85%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyBreakdown.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right">{row.orders}</TableCell>
                  <TableCell className="text-right">${row.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-gray-500">${row.platformFee.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">
                    ${row.earnings.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>All your completed payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Processed</TableHead>
                <TableHead className="hidden lg:table-cell">Transaction ID</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => {
                const status = statusConfig[payout.status];
                return (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.id}</TableCell>
                    <TableCell className="text-gray-500">{payout.period}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.bg} ${status.color} border-0 gap-1`}>
                        <status.icon className="h-3 w-3" />
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-500">
                      {payout.processedAt}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {payout.paypalTransactionId ? (
                        <span className="font-mono text-sm text-gray-500">
                          {payout.paypalTransactionId}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {payout.paypalTransactionId && (
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
