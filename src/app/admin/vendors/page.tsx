"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Ban,
  Play,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Star,
  ExternalLink,
  Filter,
  Download,
  Plus,
} from "lucide-react";

// Mock vendor data
const mockVendors = [
  {
    id: "v1",
    businessName: "Nature's Best Garden",
    email: "contact@naturesbest.com",
    phone: "(555) 123-4567",
    owner: "John Anderson",
    status: "approved",
    joinDate: "2024-01-15",
    totalSales: 45890,
    totalOrders: 312,
    commission: 6883.5,
    products: 45,
    rating: 4.8,
    city: "Portland",
    state: "OR",
    description: "Premium organic gardening supplies and sustainable products for eco-conscious gardeners.",
    categories: ["Seeds", "Fertilizers", "Tools"],
  },
  {
    id: "v2",
    businessName: "Green Thumb Supplies",
    email: "info@greenthumb.com",
    phone: "(555) 234-5678",
    owner: "Sarah Miller",
    status: "approved",
    joinDate: "2024-02-20",
    totalSales: 32450,
    totalOrders: 198,
    commission: 4867.5,
    products: 32,
    rating: 4.6,
    city: "Seattle",
    state: "WA",
    description: "Specializing in hydroponic systems and indoor gardening solutions.",
    categories: ["Hydroponics", "Indoor Growing", "Lighting"],
  },
  {
    id: "v3",
    businessName: "Eco Garden Co.",
    email: "hello@ecogarden.com",
    phone: "(555) 345-6789",
    owner: "Mike Chen",
    status: "approved",
    joinDate: "2024-03-10",
    totalSales: 28750,
    totalOrders: 156,
    commission: 4312.5,
    products: 28,
    rating: 4.7,
    city: "San Francisco",
    state: "CA",
    description: "Sustainable garden products made from recycled and eco-friendly materials.",
    categories: ["Pots & Planters", "Composting", "Water Conservation"],
  },
  {
    id: "v4",
    businessName: "Organic Seeds Direct",
    email: "seeds@organicdirect.com",
    phone: "(555) 456-7890",
    owner: "Emily Watson",
    status: "pending",
    joinDate: "2024-12-01",
    totalSales: 0,
    totalOrders: 0,
    commission: 0,
    products: 15,
    rating: 0,
    city: "Denver",
    state: "CO",
    description: "Heirloom and organic seeds sourced from certified organic farms.",
    categories: ["Seeds", "Seedlings", "Rare Varieties"],
  },
  {
    id: "v5",
    businessName: "Sustainable Roots",
    email: "grow@sustainableroots.com",
    phone: "(555) 567-8901",
    owner: "David Park",
    status: "pending",
    joinDate: "2024-12-05",
    totalSales: 0,
    totalOrders: 0,
    commission: 0,
    products: 22,
    rating: 0,
    city: "Austin",
    state: "TX",
    description: "Native plants and drought-resistant gardening solutions for sustainable landscapes.",
    categories: ["Native Plants", "Xeriscaping", "Drought Tolerant"],
  },
  {
    id: "v6",
    businessName: "Bloom & Grow",
    email: "info@bloomandgrow.com",
    phone: "(555) 678-9012",
    owner: "Lisa Thompson",
    status: "suspended",
    joinDate: "2024-04-05",
    totalSales: 18900,
    totalOrders: 89,
    commission: 2835,
    products: 18,
    rating: 4.2,
    city: "Phoenix",
    state: "AZ",
    description: "Flower bulbs and flowering plants for vibrant gardens.",
    categories: ["Flowers", "Bulbs", "Perennials"],
    suspensionReason: "Policy violation - selling non-organic products as organic",
  },
  {
    id: "v7",
    businessName: "Urban Garden Solutions",
    email: "contact@urbangarden.com",
    phone: "(555) 789-0123",
    owner: "James Wilson",
    status: "rejected",
    joinDate: "2024-11-20",
    totalSales: 0,
    totalOrders: 0,
    commission: 0,
    products: 0,
    rating: 0,
    city: "New York",
    state: "NY",
    description: "Urban farming solutions and balcony gardening kits.",
    categories: ["Urban Farming", "Vertical Gardens", "Small Space"],
    rejectionReason: "Incomplete business documentation",
  },
  {
    id: "v8",
    businessName: "Terra Nova Gardens",
    email: "sales@terranova.com",
    phone: "(555) 890-1234",
    owner: "Anna Garcia",
    status: "approved",
    joinDate: "2024-05-15",
    totalSales: 52300,
    totalOrders: 287,
    commission: 7845,
    products: 52,
    rating: 4.9,
    city: "Miami",
    state: "FL",
    description: "Tropical plants and exotic gardening supplies for warm climates.",
    categories: ["Tropical Plants", "Exotic Seeds", "Palm Trees"],
  },
  {
    id: "v9",
    businessName: "Mountain Meadow Seeds",
    email: "hello@mountainmeadow.com",
    phone: "(555) 901-2345",
    owner: "Robert Brown",
    status: "pending",
    joinDate: "2024-12-08",
    totalSales: 0,
    totalOrders: 0,
    commission: 0,
    products: 35,
    rating: 0,
    city: "Boise",
    state: "ID",
    description: "Wildflower seeds and meadow mixtures for natural landscapes.",
    categories: ["Wildflowers", "Meadow Mixes", "Pollinator Plants"],
  },
  {
    id: "v10",
    businessName: "Coastal Garden Supply",
    email: "info@coastalgarden.com",
    phone: "(555) 012-3456",
    owner: "Karen White",
    status: "approved",
    joinDate: "2024-06-20",
    totalSales: 38700,
    totalOrders: 215,
    commission: 5805,
    products: 38,
    rating: 4.5,
    city: "San Diego",
    state: "CA",
    description: "Salt-tolerant plants and coastal gardening essentials.",
    categories: ["Coastal Plants", "Salt-Tolerant", "Beach Gardens"],
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case "pending":
      return <Badge variant="secondary" className="border border-orange-500 text-orange-600 bg-orange-50">Pending</Badge>;
    case "suspended":
      return <Badge variant="destructive">Suspended</Badge>;
    case "rejected":
      return <Badge variant="outline" className="border-red-500 text-red-600">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function VendorsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<typeof mockVendors[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [vendorToAction, setVendorToAction] = useState<typeof mockVendors[0] | null>(null);

  // Filter vendors
  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalVendors = mockVendors.length;
  const approvedVendors = mockVendors.filter((v) => v.status === "approved").length;
  const pendingVendors = mockVendors.filter((v) => v.status === "pending").length;
  const suspendedVendors = mockVendors.filter((v) => v.status === "suspended").length;

  const handleViewVendor = (vendor: typeof mockVendors[0]) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
  };

  const handleApproveVendor = (vendor: typeof mockVendors[0]) => {
    setVendorToAction(vendor);
    setShowApproveDialog(true);
  };

  const handleRejectVendor = (vendor: typeof mockVendors[0]) => {
    setVendorToAction(vendor);
    setShowRejectDialog(true);
  };

  const handleSuspendVendor = (vendor: typeof mockVendors[0]) => {
    setVendorToAction(vendor);
    setShowSuspendDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground">Manage vendor applications and accounts</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedVendors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingVendors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{suspendedVendors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name, owner, or email..."
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
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="suspended">Suspended</TabsTrigger>
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

      {/* Vendors Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/vendors/${vendor.id}.png`} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {vendor.businessName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{vendor.businessName}</div>
                          <div className="text-xs text-muted-foreground">{vendor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.owner}</TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell>{vendor.products}</TableCell>
                    <TableCell>
                      {vendor.totalSales > 0 ? `$${vendor.totalSales.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      {vendor.commission > 0 ? (
                        <span className="text-green-600">${vendor.commission.toLocaleString()}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{vendor.rating}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{new Date(vendor.joinDate).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewVendor(vendor)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {vendor.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApproveVendor(vendor)}
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectVendor(vendor)}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {vendor.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleSuspendVendor(vendor)}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {vendor.status === "suspended" && (
                            <DropdownMenuItem className="text-green-600">
                              <Play className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
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

      {/* Vendor Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>View and manage vendor information</DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/vendors/${selectedVendor.id}.png`} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {selectedVendor.businessName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{selectedVendor.businessName}</h3>
                      {getStatusBadge(selectedVendor.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedVendor.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Package className="h-5 w-5 mx-auto text-muted-foreground" />
                    <div className="mt-1 text-lg font-semibold">{selectedVendor.products}</div>
                    <div className="text-xs text-muted-foreground">Products</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <DollarSign className="h-5 w-5 mx-auto text-muted-foreground" />
                    <div className="mt-1 text-lg font-semibold">
                      ${selectedVendor.totalSales.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Sales</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <Star className="h-5 w-5 mx-auto text-muted-foreground" />
                    <div className="mt-1 text-lg font-semibold">
                      {selectedVendor.rating > 0 ? selectedVendor.rating : "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <DollarSign className="h-5 w-5 mx-auto text-green-600" />
                    <div className="mt-1 text-lg font-semibold text-green-600">
                      ${selectedVendor.commission.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Commission</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedVendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedVendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedVendor.city}, {selectedVendor.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date(selectedVendor.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVendor.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Owner</h4>
                  <p className="text-sm">{selectedVendor.owner}</p>
                </div>

                {/* Status Info */}
                {selectedVendor.status === "suspended" && selectedVendor.suspensionReason && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <h4 className="text-sm font-semibold text-red-600">Suspension Reason</h4>
                    <p className="text-sm text-red-600">{selectedVendor.suspensionReason}</p>
                  </div>
                )}
                {selectedVendor.status === "rejected" && selectedVendor.rejectionReason && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <h4 className="text-sm font-semibold text-red-600">Rejection Reason</h4>
                    <p className="text-sm text-red-600">{selectedVendor.rejectionReason}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            {selectedVendor?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetailModal(false);
                    if (selectedVendor) handleRejectVendor(selectedVendor);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    if (selectedVendor) handleApproveVendor(selectedVendor);
                  }}
                >
                  Approve Vendor
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve <strong>{vendorToAction?.businessName}</strong>? They
              will be able to list products and receive orders on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700">
              Approve Vendor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Vendor Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject the application from{" "}
              <strong>{vendorToAction?.businessName}</strong>? The vendor will be notified of this
              decision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{vendorToAction?.businessName}</strong>? Their
              products will be taken offline and they will not be able to process orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Suspend Vendor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
