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
import {
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Flag,
  Package,
  DollarSign,
  Tag,
  Store,
  Calendar,
  AlertTriangle,
  Filter,
  Download,
  Image as ImageIcon,
  FileText,
  Shield,
  Ban,
  Leaf,
} from "lucide-react";

// Mock product data
const mockProducts = [
  {
    id: "p1",
    name: "Organic Heirloom Tomato Seeds Pack",
    vendor: "Nature's Best Garden",
    vendorId: "v1",
    status: "pending_approval",
    price: 24.99,
    comparePrice: 29.99,
    stock: 150,
    category: "Seeds",
    createdAt: "2024-12-08",
    description: "Premium organic heirloom tomato seeds. Includes 5 varieties: Brandywine, Cherokee Purple, Black Krim, Green Zebra, and San Marzano. Non-GMO, certified organic.",
    images: ["/products/tomato-seeds.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "NBG-TOM-001",
    type: "PHYSICAL",
  },
  {
    id: "p2",
    name: "Premium Compost Starter Kit",
    vendor: "Eco Garden Co.",
    vendorId: "v3",
    status: "pending_approval",
    price: 49.99,
    comparePrice: null,
    stock: 75,
    category: "Composting",
    createdAt: "2024-12-07",
    description: "Everything you need to start composting. Includes compost bin, starter mix, and detailed guide. Made from recycled materials.",
    images: ["/products/compost-kit.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "EGC-COM-001",
    type: "PHYSICAL",
  },
  {
    id: "p3",
    name: "Hydroponic LED Grow Light 1000W",
    vendor: "Green Thumb Supplies",
    vendorId: "v2",
    status: "pending_approval",
    price: 159.99,
    comparePrice: 199.99,
    stock: 30,
    category: "Lighting",
    createdAt: "2024-12-06",
    description: "Full spectrum LED grow light for indoor gardening. Energy efficient with 50,000 hour lifespan. Includes hanging kit.",
    images: ["/products/grow-light.jpg"],
    isFlagged: true,
    flagReason: "Price seems unusually high compared to similar products",
    sku: "GTS-LED-001",
    type: "PHYSICAL",
  },
  {
    id: "p4",
    name: "Drought-Resistant Wildflower Mix",
    vendor: "Sustainable Roots",
    vendorId: "v5",
    status: "pending_approval",
    price: 19.99,
    comparePrice: null,
    stock: 200,
    category: "Seeds",
    createdAt: "2024-12-05",
    description: "Native wildflower mix designed for drought-prone areas. Contains 15 varieties of native wildflowers.",
    images: ["/products/wildflower-mix.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "SR-WF-001",
    type: "PHYSICAL",
  },
  {
    id: "p5",
    name: "Organic Pest Control Spray",
    vendor: "Nature's Best Garden",
    vendorId: "v1",
    status: "pending_approval",
    price: 18.99,
    comparePrice: 24.99,
    stock: 100,
    category: "Pest Control",
    createdAt: "2024-12-04",
    description: "All-natural pest control spray made from neem oil and essential oils. Safe for organic gardens and beneficial insects.",
    images: ["/products/pest-spray.jpg"],
    isFlagged: true,
    flagReason: "Contains claims that need verification - 'Safe for beneficial insects'",
    sku: "NBG-PEST-001",
    type: "PHYSICAL",
  },
  {
    id: "p6",
    name: "Gardening Masterclass PDF Bundle",
    vendor: "Nature's Best Garden",
    vendorId: "v1",
    status: "active",
    price: 19.99,
    comparePrice: null,
    stock: 999,
    category: "Digital",
    createdAt: "2024-11-20",
    description: "Complete gardening guide with 5 PDF modules covering soil health, pest management, seed starting, and more.",
    images: ["/products/masterclass.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "NBG-DIG-001",
    type: "DIGITAL",
  },
  {
    id: "p7",
    name: "Premium Potting Soil 25lb Bag",
    vendor: "Eco Garden Co.",
    vendorId: "v3",
    status: "active",
    price: 34.99,
    comparePrice: null,
    stock: 85,
    category: "Soil",
    createdAt: "2024-11-15",
    description: "Premium organic potting soil with added perlite for drainage. Ideal for container gardening.",
    images: ["/products/potting-soil.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "EGC-SOIL-001",
    type: "PHYSICAL",
  },
  {
    id: "p8",
    name: "Ceramic Self-Watering Planter",
    vendor: "Bloom & Grow",
    vendorId: "v6",
    status: "flagged",
    price: 45.99,
    comparePrice: 59.99,
    stock: 25,
    category: "Pots & Planters",
    createdAt: "2024-10-10",
    description: "Beautiful ceramic planter with self-watering system. Available in 3 colors.",
    images: ["/products/planter.jpg"],
    isFlagged: true,
    flagReason: "Customer complaints - quality issues with water reservoir",
    sku: "BG-PLAN-001",
    type: "PHYSICAL",
  },
  {
    id: "p9",
    name: "Vertical Garden Wall Kit",
    vendor: "Urban Garden Solutions",
    vendorId: "v7",
    status: "rejected",
    price: 89.99,
    comparePrice: null,
    stock: 0,
    category: "Vertical Gardens",
    createdAt: "2024-11-25",
    description: "Modular vertical garden system for walls. Includes 12 planter pockets and irrigation system.",
    images: ["/products/vertical-kit.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "UGS-VERT-001",
    type: "PHYSICAL",
    rejectionReason: "Vendor account rejected - incomplete documentation",
  },
  {
    id: "p10",
    name: "Rare Succulent Collection",
    vendor: "Terra Nova Gardens",
    vendorId: "v8",
    status: "active",
    price: 79.99,
    comparePrice: 99.99,
    stock: 15,
    category: "Plants",
    createdAt: "2024-12-01",
    description: "Collection of 6 rare succulents. Each plant comes in a 2-inch pot with care instructions.",
    images: ["/products/succulents.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "TNG-SUC-001",
    type: "PHYSICAL",
  },
  {
    id: "p11",
    name: "Native Pollinator Seed Mix",
    vendor: "Mountain Meadow Seeds",
    vendorId: "v9",
    status: "pending_approval",
    price: 22.99,
    comparePrice: null,
    stock: 180,
    category: "Seeds",
    createdAt: "2024-12-08",
    description: "Specially formulated mix to attract bees, butterflies, and other pollinators. Covers 500 sq ft.",
    images: ["/products/pollinator-mix.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "MMS-POL-001",
    type: "PHYSICAL",
  },
  {
    id: "p12",
    name: "Bamboo Garden Tool Set",
    vendor: "Coastal Garden Supply",
    vendorId: "v10",
    status: "active",
    price: 39.99,
    comparePrice: 49.99,
    stock: 40,
    category: "Tools",
    createdAt: "2024-11-28",
    description: "Sustainable bamboo tool set with 6 essential garden tools. Includes ergonomic handles and storage bag.",
    images: ["/products/bamboo-tools.jpg"],
    isFlagged: false,
    flagReason: null,
    sku: "CGS-TOOL-001",
    type: "PHYSICAL",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case "pending_approval":
      return <Badge variant="secondary" className="border border-orange-500 text-orange-600 bg-orange-50">Pending</Badge>;
    case "flagged":
      return <Badge variant="destructive" className="bg-red-500">Flagged</Badge>;
    case "rejected":
      return <Badge variant="outline" className="border-red-500 text-red-600">Rejected</Badge>;
    case "out_of_stock":
      return <Badge variant="secondary">Out of Stock</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function ProductsModeration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [productToAction, setProductToAction] = useState<typeof mockProducts[0] | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalProducts = mockProducts.length;
  const pendingProducts = mockProducts.filter((p) => p.status === "pending_approval").length;
  const activeProducts = mockProducts.filter((p) => p.status === "active").length;
  const flaggedProducts = mockProducts.filter((p) => p.isFlagged || p.status === "flagged").length;

  const handleViewProduct = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleApproveProduct = (product: typeof mockProducts[0]) => {
    setProductToAction(product);
    setShowApproveDialog(true);
  };

  const handleRejectProduct = (product: typeof mockProducts[0]) => {
    setProductToAction(product);
    setRejectReason("");
    setShowRejectDialog(true);
  };

  const handleFlagProduct = (product: typeof mockProducts[0]) => {
    setProductToAction(product);
    setFlagReason(product.flagReason || "");
    setShowFlagDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Moderation</h1>
          <p className="text-muted-foreground">Review and moderate product listings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedProducts}</div>
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
                placeholder="Search products by name, vendor, or SKU..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending_approval">Pending</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="flagged">Flagged</TabsTrigger>
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

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="max-w-[200px]">
                          <div className="font-medium truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.sku}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{product.vendor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusBadge(product.status)}
                        {product.isFlagged && (
                          <Flag className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{product.price.toFixed(2)}</span>
                        {product.comparePrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={product.stock < 20 ? "text-red-600" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {product.status === "pending_approval" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApproveProduct(product)}
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectProduct(product)}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {product.status === "active" && (
                            <DropdownMenuItem
                              onClick={() => handleFlagProduct(product)}
                              className="text-orange-600"
                            >
                              <Flag className="mr-2 h-4 w-4" />
                              Flag Product
                            </DropdownMenuItem>
                          )}
                          {product.status === "flagged" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApproveProduct(product)}
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Unflag & Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectProduct(product)}
                                className="text-red-600"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Take Down
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            View History
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

      {/* Product Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>Review product information before approval</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Product Images */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2 aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                    {getStatusBadge(selectedProduct.status)}
                    {selectedProduct.isFlagged && (
                      <Badge variant="destructive" className="gap-1">
                        <Flag className="h-3 w-3" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>

                {/* Flag Warning */}
                {selectedProduct.isFlagged && selectedProduct.flagReason && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-semibold">Flag Reason</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{selectedProduct.flagReason}</p>
                  </div>
                )}

                {/* Product Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Vendor</Label>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedProduct.vendor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">SKU</Label>
                    <p className="font-mono text-sm">{selectedProduct.sku}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Category</Label>
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Type</Label>
                    <Badge variant="secondary">{selectedProduct.type}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Price</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">${selectedProduct.price.toFixed(2)}</span>
                      {selectedProduct.comparePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${selectedProduct.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Stock</Label>
                    <span className={selectedProduct.stock < 20 ? "text-red-600 font-semibold" : ""}>
                      {selectedProduct.stock} units
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Submitted</Label>
                    <p>{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Commission (15%)</Label>
                    <p className="text-green-600 font-semibold">
                      ${(selectedProduct.price * 0.15).toFixed(2)} per sale
                    </p>
                  </div>

                  <div className="col-span-2 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-4">
                      <Leaf className="h-4 w-4" />
                      Strategic Marketplace Data (2026)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Climate Zone</Label>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {(selectedProduct as any).climateZone || "All Zones"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Growing Season</Label>
                        <p>{(selectedProduct as any).growingSeason || "Not specified"}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">B2B Bulk Price</Label>
                        <p className="font-semibold">
                          {(selectedProduct as any).bulkPrice 
                            ? `$${(selectedProduct as any).bulkPrice.toFixed(2)}` 
                            : "Not offered"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Min Bulk Qty</Label>
                        <p>{(selectedProduct as any).minOrderQuantity || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            {selectedProduct?.status === "pending_approval" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetailModal(false);
                    if (selectedProduct) handleRejectProduct(selectedProduct);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    if (selectedProduct) handleApproveProduct(selectedProduct);
                  }}
                >
                  Approve Product
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
            <AlertDialogTitle>Approve Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve <strong>{productToAction?.name}</strong>? It will be
              listed on the marketplace and available for purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700">
              Approve Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting <strong>{productToAction?.name}</strong>. This
              will be shared with the vendor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Reject Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Product</DialogTitle>
            <DialogDescription>
              Flag <strong>{productToAction?.name}</strong> for review. The product will remain
              active but marked for investigation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Flag Reason</Label>
              <Textarea
                placeholder="Enter the reason for flagging..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Flag Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
