"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MoreHorizontal,
  Eye,
  AlertTriangle,
  RefreshCw,
  Check,
  X,
  MessageSquare,
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  CreditCard,
  Ban,
  ArrowRight,
  User,
} from "lucide-react";

// Mock order data
const mockOrders = [
  {
    id: "ord-2847",
    orderNumber: "ORD-2847",
    buyer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 111-2222",
    },
    vendor: {
      name: "Nature's Best Garden",
      id: "v1",
    },
    items: [
      { name: "Organic Heirloom Tomato Seeds", quantity: 2, price: 24.99 },
      { name: "Premium Compost Starter Kit", quantity: 1, price: 49.99 },
    ],
    subtotal: 99.97,
    shipping: 8.99,
    tax: 8.50,
    total: 117.46,
    platformFee: 15.00,
    vendorEarnings: 84.97,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-8X7Y6Z5W",
    createdAt: "2024-12-08T14:30:00Z",
    shippingAddress: {
      street: "123 Garden Ave",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "US",
    },
    trackingNumber: null,
    hasDispute: false,
    hasRefund: false,
  },
  {
    id: "ord-2846",
    orderNumber: "ORD-2846",
    buyer: {
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "(555) 222-3333",
    },
    vendor: {
      name: "Green Thumb Supplies",
      id: "v2",
    },
    items: [
      { name: "Hydroponic LED Grow Light 1000W", quantity: 1, price: 159.99 },
    ],
    subtotal: 159.99,
    shipping: 0,
    tax: 13.60,
    total: 173.59,
    platformFee: 24.00,
    vendorEarnings: 135.99,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-7Y8X9Z0W",
    createdAt: "2024-12-07T10:15:00Z",
    shippingAddress: {
      street: "456 Urban St",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "US",
    },
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    shippedAt: "2024-12-07T16:00:00Z",
    hasDispute: false,
    hasRefund: false,
  },
  {
    id: "ord-2845",
    orderNumber: "ORD-2845",
    buyer: {
      name: "Michael Brown",
      email: "m.brown@email.com",
      phone: "(555) 333-4444",
    },
    vendor: {
      name: "Eco Garden Co.",
      id: "v3",
    },
    items: [
      { name: "Ceramic Self-Watering Planter", quantity: 3, price: 45.99 },
    ],
    subtotal: 137.97,
    shipping: 12.99,
    tax: 11.73,
    total: 162.69,
    platformFee: 20.70,
    vendorEarnings: 117.27,
    status: "disputed",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-6Z7Y8X9W",
    createdAt: "2024-12-05T09:45:00Z",
    shippingAddress: {
      street: "789 Green Blvd",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "US",
    },
    trackingNumber: "9400111899223334445566",
    carrier: "USPS",
    shippedAt: "2024-12-05T14:00:00Z",
    hasDispute: true,
    dispute: {
      reason: "Item not as described - water reservoir leaks",
      openedAt: "2024-12-07T10:00:00Z",
      status: "open",
      buyerMessage: "The water reservoir on all three planters leaks after filling. This is not mentioned in the product description.",
    },
    hasRefund: false,
  },
  {
    id: "ord-2844",
    orderNumber: "ORD-2844",
    buyer: {
      name: "Sarah Wilson",
      email: "sarah.w@email.com",
      phone: "(555) 444-5555",
    },
    vendor: {
      name: "Organic Seeds Direct",
      id: "v4",
    },
    items: [
      { name: "Drought-Resistant Wildflower Mix", quantity: 2, price: 19.99 },
      { name: "Native Pollinator Seed Mix", quantity: 1, price: 22.99 },
    ],
    subtotal: 62.97,
    shipping: 5.99,
    tax: 5.35,
    total: 74.31,
    platformFee: 9.45,
    vendorEarnings: 53.52,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "PayPal",
    paypalOrderId: null,
    createdAt: "2024-12-08T16:00:00Z",
    shippingAddress: {
      street: "321 Seed Lane",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "US",
    },
    trackingNumber: null,
    hasDispute: false,
    hasRefund: false,
  },
  {
    id: "ord-2843",
    orderNumber: "ORD-2843",
    buyer: {
      name: "David Lee",
      email: "david.lee@email.com",
      phone: "(555) 555-6666",
    },
    vendor: {
      name: "Terra Nova Gardens",
      id: "v8",
    },
    items: [
      { name: "Rare Succulent Collection", quantity: 2, price: 79.99 },
    ],
    subtotal: 159.98,
    shipping: 15.99,
    tax: 13.60,
    total: 189.57,
    platformFee: 24.00,
    vendorEarnings: 135.98,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-5X6Y7Z8W",
    createdAt: "2024-12-06T11:30:00Z",
    shippingAddress: {
      street: "555 Tropical Way",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "US",
    },
    trackingNumber: null,
    hasDispute: false,
    hasRefund: false,
  },
  {
    id: "ord-2842",
    orderNumber: "ORD-2842",
    buyer: {
      name: "Amanda Clark",
      email: "a.clark@email.com",
      phone: "(555) 666-7777",
    },
    vendor: {
      name: "Coastal Garden Supply",
      id: "v10",
    },
    items: [
      { name: "Bamboo Garden Tool Set", quantity: 1, price: 39.99 },
    ],
    subtotal: 39.99,
    shipping: 7.99,
    tax: 3.40,
    total: 51.38,
    platformFee: 6.00,
    vendorEarnings: 33.99,
    status: "refunded",
    paymentStatus: "refunded",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-4W5X6Y7Z",
    createdAt: "2024-12-04T08:20:00Z",
    shippingAddress: {
      street: "888 Beach Dr",
      city: "San Diego",
      state: "CA",
      zip: "92101",
      country: "US",
    },
    trackingNumber: null,
    hasDispute: false,
    hasRefund: true,
    refund: {
      reason: "Customer requested cancellation before shipping",
      amount: 51.38,
      processedAt: "2024-12-04T10:00:00Z",
      status: "completed",
    },
  },
  {
    id: "ord-2841",
    orderNumber: "ORD-2841",
    buyer: {
      name: "Robert Taylor",
      email: "r.taylor@email.com",
      phone: "(555) 777-8888",
    },
    vendor: {
      name: "Nature's Best Garden",
      id: "v1",
    },
    items: [
      { name: "Gardening Masterclass PDF Bundle", quantity: 1, price: 19.99 },
    ],
    subtotal: 19.99,
    shipping: 0,
    tax: 0,
    total: 19.99,
    platformFee: 3.00,
    vendorEarnings: 16.99,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-3Z4W5X6Y",
    createdAt: "2024-12-03T15:45:00Z",
    shippingAddress: {
      street: "222 Digital Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "US",
    },
    trackingNumber: null,
    deliveredAt: "2024-12-03T15:46:00Z",
    hasDispute: false,
    hasRefund: false,
  },
  {
    id: "ord-2840",
    orderNumber: "ORD-2840",
    buyer: {
      name: "Jennifer White",
      email: "j.white@email.com",
      phone: "(555) 888-9999",
    },
    vendor: {
      name: "Green Thumb Supplies",
      id: "v2",
    },
    items: [
      { name: "Hydroponic LED Grow Light 1000W", quantity: 1, price: 159.99 },
      { name: "Premium Potting Soil 25lb Bag", quantity: 2, price: 34.99 },
    ],
    subtotal: 229.97,
    shipping: 25.99,
    tax: 19.55,
    total: 275.51,
    platformFee: 34.50,
    vendorEarnings: 195.47,
    status: "disputed",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    paypalOrderId: "PAYPAL-2Y3Z4W5X",
    createdAt: "2024-12-02T12:00:00Z",
    shippingAddress: {
      street: "999 Grow St",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
      country: "US",
    },
    trackingNumber: "1Z888AA10123456784",
    carrier: "UPS",
    shippedAt: "2024-12-02T18:00:00Z",
    hasDispute: true,
    dispute: {
      reason: "Package damaged during shipping",
      openedAt: "2024-12-06T09:00:00Z",
      status: "under_review",
      buyerMessage: "The grow light arrived with a cracked housing. The soil bags were also torn open during shipping.",
    },
    hasRefund: false,
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="border border-yellow-500 text-yellow-600 bg-yellow-50">Pending</Badge>;
    case "processing":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>;
    case "shipped":
      return <Badge className="bg-cyan-500 hover:bg-cyan-600">Shipped</Badge>;
    case "delivered":
      return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    case "refunded":
      return <Badge variant="outline" className="border-purple-500 text-purple-600">Refunded</Badge>;
    case "disputed":
      return <Badge variant="destructive" className="bg-red-600">Disputed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="outline" className="border-green-500 text-green-600">Paid</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
    case "failed":
      return <Badge variant="outline" className="border-red-500 text-red-600">Failed</Badge>;
    case "refunded":
      return <Badge variant="outline" className="border-purple-500 text-purple-600">Refunded</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function OrdersOversight() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [orderToAction, setOrderToAction] = useState<typeof mockOrders[0] | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [disputeResponse, setDisputeResponse] = useState("");

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const disputedOrders = mockOrders.filter((o) => o.hasDispute).length;
  const refundedOrders = mockOrders.filter((o) => o.hasRefund || o.status === "refunded").length;
  const totalRevenue = mockOrders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);
  const totalPlatformFees = mockOrders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.platformFee, 0);

  const handleViewOrder = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleRefundOrder = (order: typeof mockOrders[0]) => {
    setOrderToAction(order);
    setRefundReason("");
    setShowRefundDialog(true);
  };

  const handleResolveDispute = (order: typeof mockOrders[0]) => {
    setOrderToAction(order);
    setDisputeResponse("");
    setShowDisputeDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Oversight</h1>
          <p className="text-muted-foreground">Manage orders across all vendors</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{disputedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{refundedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${totalPlatformFees.toFixed(2)} fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts for Disputes */}
      {disputedOrders > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-red-600">
                {disputedOrders} open dispute{disputedOrders > 1 ? "s" : ""} require attention
              </p>
              <p className="text-sm text-red-500">
                Review and resolve disputes to maintain customer satisfaction
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setStatusFilter("disputed")}>
              View Disputes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders by number, buyer, or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="disputed">Disputed</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {order.buyer.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{order.buyer.name}</div>
                          <div className="text-xs text-muted-foreground">{order.buyer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.vendor.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(order.status)}
                        {order.hasDispute && (
                          <Badge variant="destructive" className="text-xs gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Dispute
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell>
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        Fee: ${order.platformFee.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {order.hasDispute && (
                            <DropdownMenuItem
                              onClick={() => handleResolveDispute(order)}
                              className="text-orange-600"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Resolve Dispute
                            </DropdownMenuItem>
                          )}
                          {order.paymentStatus === "paid" && !order.hasRefund && order.status !== "refunded" && (
                            <DropdownMenuItem
                              onClick={() => handleRefundOrder(order)}
                              className="text-red-600"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Process Refund
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Buyer
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Contact Vendor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order {selectedOrder?.orderNumber}
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </DialogTitle>
            <DialogDescription>View order details and manage disputes</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Dispute Alert */}
                {selectedOrder.hasDispute && selectedOrder.dispute && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Dispute Open</span>
                      <Badge variant="destructive" className="ml-auto">
                        {selectedOrder.dispute.status === "open" ? "Needs Attention" : "Under Review"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-red-600">Reason: </span>
                        <span className="text-sm text-red-600">{selectedOrder.dispute.reason}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-red-600">Buyer Message: </span>
                        <p className="text-sm text-red-600 mt-1">{selectedOrder.dispute.buyerMessage}</p>
                      </div>
                      <div className="text-xs text-red-500">
                        Opened: {new Date(selectedOrder.dispute.openedAt).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setShowDetailModal(false);
                        handleResolveDispute(selectedOrder);
                      }}
                    >
                      Resolve Dispute
                    </Button>
                  </div>
                )}

                {/* Refund Info */}
                {selectedOrder.hasRefund && selectedOrder.refund && (
                  <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <RefreshCw className="h-5 w-5" />
                      <span className="font-semibold">Refund Processed</span>
                    </div>
                    <div className="space-y-1 text-sm text-purple-600">
                      <div>Amount: ${selectedOrder.refund.amount.toFixed(2)}</div>
                      <div>Reason: {selectedOrder.refund.reason}</div>
                      <div>
                        Processed: {new Date(selectedOrder.refund.processedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Order Items</h4>
                  <div className="rounded-lg border">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Buyer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.buyer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.buyer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.buyer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Shipping Address</h4>
                    <div className="space-y-1 text-sm">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.zip}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                {selectedOrder.trackingNumber && (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Tracking</span>
                    </div>
                    <div className="text-sm">
                      {selectedOrder.carrier}: {selectedOrder.trackingNumber}
                    </div>
                  </div>
                )}

                {/* Payment & Totals */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Payment Details</h4>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Fee (15%)</span>
                      <span className="text-green-600">${selectedOrder.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vendor Earnings</span>
                      <span>${selectedOrder.vendorEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {selectedOrder.paymentMethod}
                    </span>
                    <span>Order ID: {selectedOrder.paypalOrderId || "N/A"}</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            {selectedOrder?.hasDispute && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDetailModal(false);
                  if (selectedOrder) handleResolveDispute(selectedOrder);
                }}
              >
                Resolve Dispute
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Issue a refund for order <strong>{orderToAction?.orderNumber}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <span>Refund Amount</span>
                <span className="font-bold">${orderToAction?.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Refund Reason</Label>
              <Textarea
                placeholder="Enter the reason for this refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-sm text-orange-600">
              <strong>Note:</strong> This will refund the full amount to the buyer via PayPal. The
              vendor&apos;s earnings will be deducted accordingly.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Process Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Resolution Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Resolve the dispute for order <strong>{orderToAction?.orderNumber}</strong>
            </DialogDescription>
          </DialogHeader>
          {orderToAction?.dispute && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="font-medium text-red-600 mb-1">Dispute Reason</div>
                <p className="text-sm text-red-600">{orderToAction.dispute.reason}</p>
                <div className="mt-2 font-medium text-red-600">Buyer Message</div>
                <p className="text-sm text-red-600">{orderToAction.dispute.buyerMessage}</p>
              </div>
              <div className="space-y-2">
                <Label>Your Response</Label>
                <Textarea
                  placeholder="Enter your response to the buyer..."
                  value={disputeResponse}
                  onChange={(e) => setDisputeResponse(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Deny Dispute
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Accept & Refund
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
