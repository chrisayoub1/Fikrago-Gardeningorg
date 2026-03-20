import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, DollarSign, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Keep 85% of every sale - transparent commission",
  "Reach thousands of passionate gardeners",
  "Easy-to-use vendor dashboard",
  "Fast & secure payouts via PayPal",
];

export function VendorCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="vendorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#vendorGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Store className="h-4 w-4" />
              <span>Vendor Opportunity</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Become a Vendor on Fikrago Gardening
            </h2>
            
            <p className="text-emerald-100 text-lg mb-8">
              Join our marketplace of boutique soil-health vendors. Sell your regenerative gardening products to thousands of passionate gardeners.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8" asChild>
                <Link href="/vendor/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8" asChild>
                <Link href="/vendor/guidelines">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <DollarSign className="h-10 w-10 mx-auto mb-3 text-emerald-300" />
              <p className="text-3xl md:text-4xl font-bold mb-1">85%</p>
              <p className="text-emerald-200 text-sm">Vendor Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 text-emerald-300" />
              <p className="text-3xl md:text-4xl font-bold mb-1">10K+</p>
              <p className="text-emerald-200 text-sm">Active Buyers</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <BarChart3 className="h-10 w-10 mx-auto mb-3 text-emerald-300" />
              <p className="text-3xl md:text-4xl font-bold mb-1">$2M+</p>
              <p className="text-emerald-200 text-sm">Vendor Payouts</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <Store className="h-10 w-10 mx-auto mb-3 text-emerald-300" />
              <p className="text-3xl md:text-4xl font-bold mb-1">150+</p>
              <p className="text-emerald-200 text-sm">Verified Vendors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
