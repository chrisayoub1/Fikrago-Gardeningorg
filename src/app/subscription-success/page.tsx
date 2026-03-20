"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Calendar, Leaf, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Seed-to-Soil Box!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Your subscription has been activated successfully. Get ready for your first curated gardening box!
          </p>

          {/* Subscription Details Card */}
          <Card className="mb-8 text-left">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-amber-500" />
                <h2 className="text-xl font-semibold">Subscription Details</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium">Seed-to-Soil Monthly Box</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">$29.00/month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">First Box</p>
                  <p className="font-medium">Shipping soon!</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">What&apos;s Next?</span>
                </div>
                <p className="text-sm text-amber-600 mt-2">
                  Your first box will be prepared and shipped within 3-5 business days. 
                  You&apos;ll receive a tracking number via email once it ships.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="p-4 bg-white rounded-lg border">
              <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium">5-7 Products</p>
              <p className="text-xs text-gray-500">Curated monthly</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-500">To your door</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Flexible</p>
              <p className="text-xs text-gray-500">Pause anytime</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }>
        <SubscriptionSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
