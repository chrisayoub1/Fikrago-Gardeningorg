"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  PROCESSING: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Processing" },
  SHIPPED: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  DELIVERED: { color: "bg-emerald-100 text-emerald-800", icon: CheckCircle, label: "Delivered" },
  CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
};

const paymentStatusColors: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  REFUNDED: "bg-gray-100 text-gray-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?limit=100")
      .then(res => res.json())
      .then(data => {
        const items = data?.orders || (Array.isArray(data) ? data : []);
        setOrders(items);
        setLoading(false);
      })
      .catch(() => { setOrders([]); setLoading(false); });
  }, []);

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      (order.orderNumber || order.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.buyer?.name || order.shippingFirstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.buyer?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o: any) => o.status === "PENDING").length;
  const processingCount = orders.filter((o: any) => o.status === "PROCESSING").length;
  const shippedCount = orders.filter((o: any) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o: any) => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter((o: any) => o.status === "CANCELLED").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border-0 font-medium gap-1`}>
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and fulfill customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card className="cursor-pointer hover:border-yellow-300 transition-colors" onClick={() => setStatusFilter("PENDING")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setStatusFilter("PROCESSING")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Processing</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{processingCount}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-purple-300 transition-colors" onClick={() => setStatusFilter("SHIPPED")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Shipped</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{shippedCount}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => setStatusFilter("DELIVERED")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Delivered</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{deliveredCount}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-red-300 transition-colors" onClick={() => setStatusFilter("CANCELLED")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Cancelled</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{cancelledCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID, customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Payment</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: any) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedOrder(order)}>
                  <TableCell className="font-medium">{order.orderNumber || order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{order.buyer?.name || (order.shippingFirstName + " " + (order.shippingLastName || ""))}</p>
                      <p className="text-xs text-gray-500">{order.buyer?.email || ""}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-gray-600">{order.items?.length || 0} item(s)</span>
                  </TableCell>
                  <TableCell className="font-medium">${Number(order.total || 0).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge className={`${paymentStatusColors[order.paymentStatus] || ""} border-0`}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-500">
                    {new Date(order.createdAt || order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order {selectedOrder.id}
                  {getStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription>
                  Placed on {formatDate(selectedOrder.createdAt || selectedOrder.date)}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                            <Package className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.productName || item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity || item.qty}</p>
                          </div>
                        </div>
                        <p className="font-medium">${(Number(item.price) * (item.quantity || item.qty || 1)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>${Number(selectedOrder.shipping || 0).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>${Number(selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Your Earnings (85%)</span>
                      <span className="font-medium">${Number(selectedOrder.vendorEarnings || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="customer" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedOrder.buyer?.email || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedOrder.shippingPhone || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="font-medium">{selectedOrder.shippingFirstName} {selectedOrder.shippingLastName}</p>
                        <p className="text-gray-600">
                          {selectedOrder.shippingAddress1}<br />
                          {selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingZip}<br />
                          {selectedOrder.shippingCountry}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fulfillment" className="space-y-4">
                  {selectedOrder.trackingNumber ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-sm text-emerald-600 font-medium mb-2">Tracking Information</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Carrier</span>
                          <span className="font-medium">{selectedOrder.carrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tracking #</span>
                          <span className="font-mono font-medium">{selectedOrder.trackingNumber}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-700">
                          This order needs to be shipped. Add tracking information below.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="carrier">Carrier</Label>
                          <Select value={carrierInput} onValueChange={setCarrierInput}>
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Select carrier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UPS">UPS</SelectItem>
                              <SelectItem value="USPS">USPS</SelectItem>
                              <SelectItem value="FedEx">FedEx</SelectItem>
                              <SelectItem value="DHL">DHL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tracking">Tracking Number</Label>
                          <Input
                            id="tracking"
                            placeholder="Enter tracking number"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {selectedOrder.status === "PENDING" && (
                      <Button className="bg-emerald-600 hover:bg-emerald-700 flex-1">
                        <Package className="h-4 w-4 mr-2" />
                        Mark as Processing
                      </Button>
                    )}
                    {(selectedOrder.status === "PROCESSING" || selectedOrder.status === "PENDING") && (
                      <Button className="bg-purple-600 hover:bg-purple-700 flex-1">
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
