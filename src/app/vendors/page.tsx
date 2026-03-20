"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  MapPin,
  Leaf,
  Award,
  Package,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  rating: number;
  reviewCount: number;
  totalSales: number;
  isActive: boolean;
  isVerified: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    products: number;
  };
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/vendors");
      if (res.ok) {
        const data = await res.json();
        setVendors(data.vendors || data || []);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVendorInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

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
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-4">Our Community</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Our Vendors
              </h1>
              <p className="text-xl text-emerald-100 mb-8">
                Passionate boutique growers, artisan producers, and soil health experts
                dedicated to bringing you the finest gardening products
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/95 text-gray-900 placeholder:text-gray-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{vendors.length}</p>
                <p className="text-sm text-gray-500">Active Vendors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {vendors.reduce((sum, v) => sum + (v._count?.products || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Products Listed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {vendors.reduce((sum, v) => sum + v.totalSales, 0)}
                </p>
                <p className="text-sm text-gray-500">Orders Fulfilled</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vendors Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredVendors.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-white"
                  >
                    {/* Banner */}
                    <div className="h-24 bg-gradient-to-r from-emerald-400 to-green-500 relative">
                      {vendor.banner && (
                        <img
                          src={vendor.banner}
                          alt={vendor.businessName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Logo & Info */}
                    <CardContent className="pt-0 relative">
                      <div className="flex justify-between items-end mb-4">
                        <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center -mt-8 relative z-10">
                          {vendor.logo ? (
                            <img
                              src={vendor.logo}
                              alt={vendor.businessName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-emerald-600">
                              {getVendorInitial(vendor.businessName)}
                            </span>
                          )}
                        </div>
                        {vendor.isVerified && (
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <Award className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {vendor.businessName}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            United States
                          </p>
                        </div>

                        {vendor.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {vendor.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-medium">
                              {vendor.rating > 0 ? vendor.rating.toFixed(1) : "New"}
                            </span>
                            {vendor.reviewCount > 0 && (
                              <span className="text-gray-400">
                                ({vendor.reviewCount})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Package className="h-4 w-4" />
                            {vendor._count?.products || 0} products
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <TrendingUp className="h-4 w-4" />
                          {vendor.totalSales} sales
                        </div>

                        <Button
                          asChild
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Link href={`/vendor/${vendor.id}`}>
                            Visit Store
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? "No Vendors Found" : "No Vendors Yet"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Be the first to join our marketplace as a vendor!"}
                </p>
                {!searchQuery && (
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/vendor/apply">Apply to Become a Vendor</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Become a Vendor?</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join our growing community of passionate garden vendors. Keep 85% of every
              sale and reach thousands of customers who care about soil health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                <Link href="/vendor/apply">Apply Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
