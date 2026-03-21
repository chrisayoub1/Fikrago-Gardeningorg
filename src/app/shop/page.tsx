"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ShoppingCart,
  Heart,
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  Leaf,
  Package,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  bulkPrice: number | null;
  minOrderQuantity: number | null;
  climateZone: string | null;
  growingSeason: string | null;
  images: string[];
  vendor: {
    id: string;
    name: string | null;
    vendorProfile: { 
      businessName: string;
      isVetted: boolean;
    } | null;
  };
  category: { id: string; name: string } | null;
  rating: number;
  reviewCount: number;
  totalSales: number;
  isFeatured: boolean;
  isBestseller: boolean;
}

interface Category {
  id: string;
  name: string;
  _count: { products: number };
}

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "bestselling", label: "Best Selling" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const { addItem } = useCartStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products?status=ACTIVE"),
        fetch("/api/categories"),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const productList = productsData.products || productsData;
        setProducts(productList);
        
        // Set max price based on products
        if (productList.length > 0) {
          const prices = productList.map((p: Product) => p.price);
          const max = Math.max(...prices, 500);
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
      }

      if (categoriesRes.ok) {
        setCategories(await categoriesRes.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.vendor?.vendorProfile?.businessName || product.vendor?.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) => product.category && selectedCategories.includes(product.category.id)
      );
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) =>
        selectedRatings.some((rating) => Math.floor(product.rating) >= rating)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Climate Zone filter
    if (selectedZones.length > 0) {
      filtered = filtered.filter(
        (product) => product.climateZone && selectedZones.includes(product.climateZone)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "bestselling":
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
      default:
        // Featured - show featured first, then bestsellers
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategories, selectedRatings, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone)
        ? prev.filter((z) => z !== zone)
        : [...prev, zone]
    );
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "🌱",
      vendorId: product.vendor.id,
      vendorName: product.vendor?.vendorProfile?.businessName || product.vendor?.name || "Vendor",
      quantity: 1,
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setSelectedZones([]);
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedRatings.length > 0 ||
    selectedZones.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice;

  const getVendorName = (product: Product) => {
    return product.vendor?.vendorProfile?.businessName || product.vendor?.name || "Vendor";
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return "🌱";
  };

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Categories
          {selectedCategories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCategories.length}
            </Badge>
          )}
        </h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="flex items-center gap-2 cursor-pointer text-sm flex-1"
                >
                  <span className="flex-1">{category.name}</span>
                  <span className="text-gray-400 text-xs">({category._count.products})</span>
                </Label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories yet</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={maxPrice}
            min={0}
            step={5}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      <Separator />

      {/* Climate Zone */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Climate & Zone
          {selectedZones.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedZones.length}
            </Badge>
          )}
        </h3>
        <div className="space-y-3">
          {["All", "Zone 1-3", "Zone 4-6", "Zone 7-9", "Zone 10-12"].map((zone) => (
            <div key={zone} className="flex items-center space-x-3">
              <Checkbox
                id={`zone-${zone}`}
                checked={selectedZones.includes(zone)}
                onCheckedChange={() => toggleZone(zone)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label
                htmlFor={`zone-${zone}`}
                className="text-sm cursor-pointer flex-1"
              >
                {zone}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Rating
          {selectedRatings.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedRatings.length}
            </Badge>
          )}
        </h3>
        <div className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => toggleRating(rating)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 cursor-pointer"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop</h1>
            <p className="text-emerald-100">
              Browse our collection of regenerative gardening products from trusted vendors
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile Filter Toggle & Search */}
          <div className="lg:hidden mb-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <Button
                variant="outline"
                className="border-emerald-200"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-emerald-600 text-white text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </div>

            {mobileFiltersOpen && (
              <Card className="p-4 border-0 shadow-lg">
                <FilterSidebar />
              </Card>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Card className="p-6 border-0 shadow-sm sticky top-24">
                <FilterSidebar />
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="hidden lg:block relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full lg:w-auto">
                  <p className="text-sm text-gray-500">
                    {filteredProducts.length > 0 ? (
                      <>
                        Showing{" "}
                        <span className="font-medium text-gray-900">
                          {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                        </span>{" "}
                        -{" "}
                        <span className="font-medium text-gray-900">
                          {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-900">{filteredProducts.length}</span>{" "}
                        products
                      </>
                    ) : (
                      "No products found"
                    )}
                  </p>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-gray-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map((catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    return cat ? (
                      <Badge
                        key={catId}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        {cat.name}
                        <button
                          onClick={() => toggleCategory(catId)}
                          className="ml-2 hover:text-emerald-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      ${priceRange[0]} - ${priceRange[1]}
                      <button
                        onClick={() => setPriceRange([0, maxPrice])}
                        className="ml-2 hover:text-emerald-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Product Grid or Empty State */}
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white"
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
                        {getProductImage(product).startsWith("http") ? (
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
                            {getProductImage(product)}
                          </span>
                        )}
                        {product.isBestseller && (
                          <Badge className="absolute top-3 left-3 bg-emerald-500 text-white">
                            Bestseller
                          </Badge>
                        )}
                        {product.isFeatured && !product.isBestseller && (
                          <Badge className="absolute top-3 left-3 bg-blue-500 text-white">
                            Featured
                          </Badge>
                        )}
                        {product.bulkPrice && (
                          <Badge className="absolute top-3 right-3 bg-orange-500 text-white border-0 z-10">
                            Bulk Deals
                          </Badge>
                        )}
                        {product.vendor?.vendorProfile?.isVetted && (
                          <Badge className="absolute bottom-3 left-3 bg-white/90 text-emerald-700 border-emerald-200 backdrop-blur-sm">
                            Vetted Expert
                          </Badge>
                        )}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            wishlist.includes(product.id)
                              ? "bg-red-500 text-white"
                              : "bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-white"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              wishlist.includes(product.id)
                                ? "fill-white"
                                : "text-gray-600 hover:text-red-500"
                            }`}
                          />
                        </button>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-emerald-600 font-medium mb-1">
                          {getVendorName(product)}
                        </p>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors text-sm md:text-base">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {product.rating > 0 ? product.rating.toFixed(1) : "New"}
                          </span>
                          {product.reviewCount > 0 && (
                            <span className="text-sm text-gray-500">
                              ({product.reviewCount})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.comparePrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ${product.comparePrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Products Yet
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Products will appear here once vendors add them to the marketplace.
                  </p>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/vendor/apply">Become a Vendor</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
