import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, RefreshCw, Gift, CheckCircle } from "lucide-react";

const features = [
  "5-7 curated gardening products",
  "Seasonal seed varieties",
  "Premium soil amendments",
  "Expert growing guides",
  "Exclusive member discounts",
];

export function SubscriptionBox() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl overflow-hidden shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Image/Visual */}
            <div className="relative p-8 lg:p-12">
              <Badge className="bg-amber-500 text-white mb-4">Monthly Subscription</Badge>
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-amber-200 to-orange-300 rounded-2xl flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <div className="text-8xl mb-4">📦</div>
                  <div className="text-white font-bold text-2xl">Seed-to-Soil Box</div>
                  <div className="text-amber-100">Delivered Monthly</div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Seed-to-Soil Monthly Box
              </h2>
              
              <p className="text-gray-600 text-lg mb-6">
                Get a curated box of regenerative gardening products delivered to your door every month. Perfect for gardeners who want to discover new products and techniques.
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
                <Badge variant="outline" className="ml-2 border-green-500 text-green-600">
                  Save 20%
                </Badge>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-lg px-8" asChild>
                  <Link href="/subscribe">
                    <Package className="mr-2 h-5 w-5" />
                    Subscribe Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/subscription/learn-more">Learn More</Link>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Cancel anytime. No commitment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
