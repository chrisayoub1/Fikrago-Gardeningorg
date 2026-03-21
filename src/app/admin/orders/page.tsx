"use client";

import React, { useState, useEffect } from "react";
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
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [orderToAction, setOrderToAction] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [disputeResponse, setDisputeResponse] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?limit=200")
      .then(res => res.json())
      .then(data => {
        const items = data?.orders || (Array.isArray(data) ? data : []);
        // Map API fields to display format
        setOrders(items.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          buyer: {
            name: o.buyer?.name || (o.shippingFirstName + " " + (o.shippingLastName || "")),
            email: o.buyer?.email || "",
            phone: o.shippingPhone || "",
          },
          vendor: {
            name: o.vendor?.vendorProfile?.businessName || o.vendor?.name || "",
            id: o.vendorId,
          },
          items: (o.items || []).map((item: any) => ({
            name: item.productName || item.product?.name || "Product",
            quantity: item.quantity || 1,
            price: item.price || 0,
          })),
          subtotal: o.subtotal || 0,
          shipping: 0,
          tax: 0,
          total: o.total || 0,
          platformFee: o.platformFee || 0,
          vendorEarnings: o.vendorEarnings || 0,
          status: (o.status || "").toLowerCase(),
          paymentStatus: (o.paymentStatus || "").toLowerCase(),
          paymentMethod: "PayPal",
          paypalOrderId: o.paypalOrderId || null,
          createdAt: o.createdAt,
          shippingAddress: {
            street: o.shippingAddress1 || "",
            city: o.shippingCity || "",
            state: o.shippingState || "",
            zip: o.shippingZip || "",
            country: o.shippingCountry || "",
          },
          trackingNumber: o.trackingNumber || null,
          hasDispute: false,
          hasRefund: (o.status || "").toLowerCase() === "refunded",
        })));
        setLoading(false);
      })
      .catch(() => { setOrders([]); setLoading(false); });
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      (order.orderNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.buyer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.buyer?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === "pending" || o.status === "processing").length;
  const disputedOrders = orders.filter((o: any) => o.hasDispute).length;
  const refundedOrders = orders.filter((o: any) => o.hasRefund || o.status === "refunded").length;
  const totalRevenue = orders.filter((o: any) => o.paymentStatus === "paid").reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const totalPlatformFees = orders.filter((o: any) => o.paymentStatus === "paid").reduce((sum: number, o: any) => sum + Number(o.platformFee || 0), 0);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleRefundOrder = (order: any) => {
    setOrderToAction(order);
    setRefundReason("");
    setShowRefundDialog(true);
  };

  const handleResolveDispute = (order: any) => {
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
