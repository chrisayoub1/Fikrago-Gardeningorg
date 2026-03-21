import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Truck, Shield, Leaf, Info } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      vendor: {
        include: {
          vendorProfile: true,
        },
      },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-emerald-50 rounded-2xl flex items-center justify-center overflow-hidden border">
                {product.images[0] && product.images[0].startsWith("http") ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-9xl">{product.images[0] || "🌱"}</span>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 mb-2">
                  {product.category?.name || "Gardening"}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500 text-sm">({product.reviewCount} reviews)</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-gray-500">{product.totalSales} sold</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
                )}
              </div>

              {/* B2B / Bulk Logic */}
              {product.bulkPrice && (
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-800">B2B Bulk Pricing Available</p>
                      <p className="text-sm text-orange-700">
                        Order {product.minOrderQuantity || 10}+ for only ${product.bulkPrice.toFixed(2)}/unit.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Climate Compatibility */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-800">Climate Compatibility</p>
                    <p className="text-sm text-blue-700">
                      Optimal for: <span className="font-bold">{product.climateZone || "All Zones"}</span>. 
                      Growing Season: {product.growingSeason || "Year-round"}.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <div className="prose prose-sm text-gray-600 max-w-none">
                <p>{product.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-lg">
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1 h-12 text-lg border-emerald-200">
                  Buy Now
                </Button>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-b">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Vetted Vendor</p>
                    <p className="text-xs text-gray-500">{product.vendor?.vendorProfile?.isVetted ? "Verified Expert" : "Community Seller"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
