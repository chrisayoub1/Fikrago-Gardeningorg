import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Truck, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-200"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              <span>Regenerative Gardening Marketplace</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Grow Healthy Soil,
              <span className="text-emerald-600"> Grow Healthy Plants</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with boutique vendors who specialize in regenerative gardening. Shop premium soil amendments, heirloom seeds, and complete gardening kits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8" asChild>
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-emerald-200 hover:bg-emerald-50" asChild>
                <Link href="/vendor/apply">Become a Vendor</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                Free Shipping $50+
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Secure Payments
              </span>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-8xl mb-4">🌱</div>
                  <h3 className="text-2xl font-bold">Healthy Soil</h3>
                  <p className="text-emerald-100">Healthy Plants</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">100% Organic</p>
                  <p className="text-sm text-gray-500">Verified Products</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">4.9 Rating</p>
                  <p className="text-sm text-gray-500">2,500+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
