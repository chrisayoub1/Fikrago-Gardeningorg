"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Truck,
  RefreshCw,
  Gift,
  CheckCircle,
  Loader2,
  AlertCircle,
  Leaf,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Script from "next/script";

const featuresStandard = [
  "5-7 curated gardening products",
  "Seasonal seed varieties",
  "Premium soil amendments",
  "Expert growing guides (PDF)",
  "Exclusive member discounts",
  "Cancel anytime",
];

const featuresEnthusiast = [
  "10-12 premium gardening products",
  "Rare heirloom seed varieties",
  "Advanced soil/microbe kits",
  "1-on-1 Digital Support",
  "Priority Shipping",
  "Full Digital Success Portal",
];

interface PayPalConfig {
  configured: boolean;
  clientId?: string;
  isLive?: boolean;
  message?: string;
}

export default function SubscribePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<PayPalConfig | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"STANDARD" | "ENTHUSIAST">("STANDARD");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  useEffect(() => {
    // Fetch PayPal config
    fetch("/api/paypal/config")
      .then((res) => res.json())
      .then((data) => setPaypalConfig(data))
      .catch(() => setPaypalConfig({ configured: false }));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const createSubscription = useCallback(async () => {
    // Validate required fields
    const required = ["firstName", "lastName", "email", "addressLine1", "city", "state", "zipCode"];
    const missing = required.filter((field) => !shippingAddress[field as keyof typeof shippingAddress]);
    
    if (missing.length > 0) {
      toast.error("Please fill in all required fields");
      throw new Error("Missing required fields");
    }

    const response = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddress,
        selectedPlan,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create subscription");
    }

    const data = await response.json();
    return data.subscriptionId;
  }, [shippingAddress]);

  const onApprove = useCallback(async (data: { subscriptionID: string }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/paypal/capture-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paypalSubscriptionId: data.subscriptionID,
          shippingAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription activation failed");
      }

      const result = await response.json();
      
      toast.success("Subscription activated successfully!");
      router.push(`/subscription-success?id=${result.subscription.id}`);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Subscription activation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [shippingAddress, router]);

  // Render PayPal buttons
  useEffect(() => {
    if (!paypalConfig?.configured || !paypalConfig.clientId || paypalReady) return;

    const renderPayPalButtons = () => {
      if (typeof window !== "undefined" && (window as any).paypal) {
        const paypal = (window as any).paypal;
        
        paypal.Buttons({
          createSubscription: createSubscription,
          onApprove: onApprove,
          onError: (err: Error) => {
            console.error("PayPal error:", err);
            toast.error("PayPal payment failed. Please try again.");
          },
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "subscribe",
            height: 50,
          },
        }).render("#paypal-subscribe-button-container").then(() => {
          setPaypalReady(true);
        }).catch((err: Error) => {
          console.error("Failed to render PayPal buttons:", err);
        });
      }
    };

    const timer = setTimeout(renderPayPalButtons, 500);
    return () => clearTimeout(timer);
  }, [paypalConfig, paypalReady, createSubscription, onApprove]);

  return (
    <>
      {/* Load PayPal SDK with subscriptions */}
      {paypalConfig?.configured && paypalConfig.clientId && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=USD&intent=subscription&vault=true`}
          strategy="lazyOnload"
        />
      )}
      
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <Badge className="bg-emerald-600 text-white mb-4">Regenerative Subscriptions</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Seed-to-Soil Experience
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join the movement. Choose the plan that fits your garden goals and restore your soil biodiversity.
            </p>
          </div>

          {/* Plan Selection Row */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Standard Plan */}
            <Card 
              className={cn(
                "relative cursor-pointer transition-all border-2",
                selectedPlan === "STANDARD" ? "border-emerald-600 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
              )}
              onClick={() => setSelectedPlan("STANDARD")}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Garden Starter</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-gray-500">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {featuresStandard.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Enthusiast Plan (The $79 Goal) */}
            <Card 
              className={cn(
                "relative cursor-pointer transition-all border-2",
                selectedPlan === "ENTHUSIAST" ? "border-emerald-600 shadow-xl" : "border-transparent opacity-80 hover:opacity-100"
              )}
              onClick={() => setSelectedPlan("ENTHUSIAST")}
            >
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 hover:bg-amber-600 border-none px-4 py-1 text-xs">
                RECOMMENDED: BEST FOR GROWTH
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Garden Enthusiast</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$79</span>
                  <span className="text-gray-500">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {featuresEnthusiast.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-amber-500" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Left - Why subscribe */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-0 shadow-sm bg-gray-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <Gift className="h-5 w-5" />
                    Member Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Post-Purchase Portal</h4>
                    <p className="text-xs text-gray-500">Every box unlocks exclusive step-by-step digital instructions tailored to your specific seeds and soil types.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Climate Intelligence</h4>
                    <p className="text-xs text-gray-500">We cross-reference your shipping zone to ensure you only get plants that will thrive in your local area.</p>
                  </div>
                  <Separator />
                  <div className="text-center py-4 bg-white rounded-lg shadow-inner">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total Savings</p>
                    <p className="text-2xl font-bold text-emerald-600">Save Up to 35%</p>
                    <p className="text-[10px] text-gray-400">vs individual shop purchases</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right - Shipping Form & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                  <CardDescription>Where should we send your monthly box?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                      placeholder="Apt, Suite, Unit, etc."
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Los Angeles"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="California"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input
                        id="zip"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="90001"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Payment</CardTitle>
                  <CardDescription>
                    {selectedPlan === "STANDARD" ? "$29/month" : "$79/month"} - Billed on the same day each month
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* PayPal Not Configured Warning */}
                  {paypalConfig && !paypalConfig.configured && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">PayPal Not Configured</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Please configure PayPal credentials in Admin Settings to enable subscriptions.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* PayPal Button */}
                  {paypalConfig?.configured && (
                    <div id="paypal-subscribe-button-container" className="min-h-[50px]">
                      {!paypalReady && (
                        <div className="flex items-center justify-center h-[50px]">
                          <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4">
                    <Calendar className="h-3 w-3" />
                    You&apos;ll be billed {selectedPlan === "STANDARD" ? "$29" : "$79"}/month. Cancel anytime from your account.
                  </div>
                </CardContent>
              </Card>

              {/* Trust Section */}
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-3 text-center">
                    <div>
                      <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-emerald-800">Eco-Friendly</h3>
                      <p className="text-sm text-emerald-600">Sustainable packaging</p>
                    </div>
                    <div>
                      <Gift className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-emerald-800">Curated</h3>
                      <p className="text-sm text-emerald-600">Expert-selected items</p>
                    </div>
                    <div>
                      <RefreshCw className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-emerald-800">Flexible</h3>
                      <p className="text-sm text-emerald-600">Pause or cancel anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
