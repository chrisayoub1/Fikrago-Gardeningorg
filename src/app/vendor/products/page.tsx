"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Package,
  Filter,
  Download,
  ChevronDown,
  Leaf,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const statusColors: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-800" },
  DRAFT: { bg: "bg-gray-100", text: "text-gray-800" },
  OUT_OF_STOCK: { bg: "bg-red-100", text: "text-red-800" },
  PENDING_APPROVAL: { bg: "bg-yellow-100", text: "text-yellow-800" },
};

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [realCategories, setRealCategories] = useState<{id: string, name: string}[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setRealCategories(Array.isArray(data) ? data : []))
      .catch(() => setRealCategories([]));

    // Fetch vendor's own products
    fetch("/api/products?limit=100")
      .then(res => res.json())
      .then(data => {
        const items = data?.products || (Array.isArray(data) ? data : []);
        setProducts(items);
        setLoading(false);
      })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p: any) => p.status === "ACTIVE").length;
  const draftProducts = products.filter((p: any) => p.status === "DRAFT").length;
  const outOfStockProducts = products.filter((p: any) => p.status === "OUT_OF_STOCK" || p.stock === 0).length;

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to your catalog.
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                categories={realCategories} 
                onClose={() => setIsAddDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            <p className="text-sm text-gray-500">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">{activeProducts}</div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{draftProducts}</div>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
            <p className="text-sm text-gray-500">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
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
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700">
              Activate Selected
            </Button>
            <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Sales</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category?.name || product.category || ""}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-sm text-gray-500">
                    {product.sku}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">${Number(product.price || 0).toFixed(2)}</p>
                      {product.comparePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ${product.comparePrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={product.stock === 0 ? "text-red-600 font-medium" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusColors[product.status].bg} ${statusColors[product.status].text} border-0`}
                    >
                      {product.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-500">
                    {product.totalSales || 0}
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
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details.
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            product={editingProduct} 
            categories={realCategories}
            onClose={() => setEditingProduct(null)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({ 
  product, 
  categories,
  onClose 
}: { 
  product?: any; 
  categories: {id: string, name: string}[];
  onClose: () => void 
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || "",
    sku: product?.sku || "",
    stock: product?.stock || 0,
    categoryId: product?.categoryId || (categories[0]?.id || ""),
    status: product?.status || "DRAFT",
    climateZone: product?.climateZone || "All",
    growingSeason: product?.growingSeason || "",
    bulkPrice: product?.bulkPrice || "",
    minOrderQuantity: product?.minOrderQuantity || "",
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(product ? "Product updated!" : "Product created successfully!");
        onClose();
        window.location.reload(); 
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your product..."
            className="mt-1.5 min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="comparePrice">Compare at Price ($)</Label>
            <Input
              id="comparePrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              placeholder="SKU-001"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />
        <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          Strategic Marketplace Data (2026 Optimization)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="climateZone">Climate Zone Compatibility</Label>
            <Select 
              value={formData.climateZone} 
              onValueChange={(val) => setFormData({ ...formData, climateZone: val })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Zone 1-3", "Zone 4-6", "Zone 7-9", "Zone 10-12"].map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="growingSeason">Growing Season</Label>
            <Input
              id="growingSeason"
              placeholder="e.g. Spring/Summer"
              value={formData.growingSeason}
              onChange={(e) => setFormData({ ...formData, growingSeason: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bulkPrice">B2B Bulk Price ($)</Label>
            <Input
              id="bulkPrice"
              type="number"
              step="0.01"
              placeholder="Wholesale price"
              value={formData.bulkPrice}
              onChange={(e) => setFormData({ ...formData, bulkPrice: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="minOrderQuantity">Min Bulk Order Qty</Label>
            <Input
              id="minOrderQuantity"
              type="number"
              placeholder="e.g. 10"
              value={formData.minOrderQuantity}
              onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label>Product Images</Label>
          <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Drop images here or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700" 
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            product ? "Save Changes" : "Add Product"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
