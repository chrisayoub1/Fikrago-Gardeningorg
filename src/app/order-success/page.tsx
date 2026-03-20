"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Download, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

import { Suspense } from "react";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Confirming your order...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <Card className="text-center mb-8">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              
              <Badge className="bg-emerald-100 text-emerald-700 mb-4">
                Order Confirmed
              </Badge>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You for Your Order!
              </h1>
              
              <p className="text-gray-600 mb-4">
                Your order has been successfully placed and is being processed.
              </p>
              
              {orderNumber && (
                <div className="bg-gray-50 rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order Processing</h3>
                    <p className="text-sm text-gray-600">
                      The vendor will prepare your order within 1-2 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Shipping</h3>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Your package will arrive within 3-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Download Notice */}
          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Download className="h-6 w-6 text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800">Digital Downloads</h3>
                  <p className="text-sm text-amber-700">
                    If you purchased any digital products, download links will be sent to your email address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700">
              <Link href="/shop">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/account/orders">
                View Order Details
              </Link>
            </Button>
          </div>

          {/* Platform Notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your email address.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Platform Service Fee (15%) has been included in your purchase.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </main>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
