"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, ArrowRight, Loader2, Leaf } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  vendor: {
    id: string;
    name: string | null;
    vendorProfile: { businessName: string } | null;
  };
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=8");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
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

  const getVendorName = (product: Product) => {
    return product.vendor?.vendorProfile?.businessName || product.vendor?.name || "Vendor";
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return "🌱";
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 max-w-xl">
                Hand-picked selections from our trusted vendors
              </p>
            </div>
          </div>
          <div className="text-center py-12">
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-xl">
              Hand-picked selections from our trusted vendors, perfect for your regenerative garden
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 border-emerald-200 hover:bg-emerald-50" asChild>
            <Link href="/shop">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white">
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
                <p className="text-xs text-emerald-600 font-medium mb-1">{getVendorName(product)}</p>
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
                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
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
      </div>
    </section>
  );
}
