"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Store,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Users,
  Truck,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const benefits = [
  {
    icon: DollarSign,
    title: "Keep 85% of Sales",
    description: "Fair commission structure - you keep the majority of your earnings",
  },
  {
    icon: Users,
    title: "Reach More Customers",
    description: "Access our growing community of regenerative gardening enthusiasts",
  },
  {
    icon: Truck,
    title: "Easy Order Management",
    description: "Simple dashboard to track orders, inventory, and earnings",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Automatic PayPal payouts directly to your account",
  },
];

export default function VendorApplyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: session?.user?.email || "",
    businessPhone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    website: "",
    instagram: "",
    facebook: "",
    paypalEmail: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to apply as a vendor");
      router.push("/auth/signin?callbackUrl=/vendor/apply");
      return;
    }

    // Validate required fields
    const required = ["businessName", "businessEmail", "description", "paypalEmail"];
    const missing = required.filter((field) => !formData[field as keyof typeof formData]);

    if (missing.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center py-12">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in becoming a vendor on Fikrago Gardening.
                Our team will review your application and get back to you within 2-3 business days.
              </p>
              <Alert className="bg-blue-50 border-blue-200 text-left mb-6">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">What happens next?</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>We&apos;ll review your business information</li>
                    <li>Verify your PayPal account for payouts</li>
                    <li>Send approval notification via email</li>
                    <li>You&apos;ll get access to your vendor dashboard</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Go Home
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => router.push("/shop")}
                >
                  Browse Shop
                </Button>
              </div>
            </CardContent>
          </Card>
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
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-4">
                Join Our Marketplace
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Become a Vendor
              </h1>
              <p className="text-xl text-emerald-100">
                Sell your regenerative gardening products to thousands of passionate gardeners
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Benefits */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Sell on Fikrago?
                </h2>
                <p className="text-gray-600">
                  Join a curated marketplace dedicated to regenerative gardening. 
                  We connect boutique soil-health vendors with passionate home gardeners.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <Card key={benefit.title} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                        <benefit.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                        <p className="text-sm text-gray-500">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Commission Info */}
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-emerald-600 font-medium mb-2">
                    Platform Commission
                  </p>
                  <div className="flex justify-center items-end gap-4">
                    <div>
                      <p className="text-4xl font-bold text-emerald-700">85%</p>
                      <p className="text-xs text-emerald-600">Your earnings</p>
                    </div>
                    <div className="text-gray-400 text-2xl mb-1">/</div>
                    <div>
                      <p className="text-2xl font-bold text-gray-500">15%</p>
                      <p className="text-xs text-gray-500">Platform fee</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-emerald-600" />
                    Vendor Application
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below to apply as a vendor on our platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!session && (
                    <Alert className="bg-amber-50 border-amber-200 mb-6">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">Sign in required</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Please{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-amber-800 underline"
                          onClick={() => router.push("/auth/signin?callbackUrl=/vendor/apply")}
                        >
                          sign in with Google
                        </Button>
                        {" "}before submitting your application.
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Business Information</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                            placeholder="Your Garden Store"
                            disabled={!session}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessEmail">Business Email *</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={formData.businessEmail}
                            onChange={(e) => handleInputChange("businessEmail", e.target.value)}
                            placeholder="contact@yourstore.com"
                            disabled={!session}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessPhone">Business Phone</Label>
                        <Input
                          id="businessPhone"
                          value={formData.businessPhone}
                          onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          disabled={!session}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Business Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Tell us about your business, what products you sell, and your commitment to regenerative gardening..."
                          rows={4}
                          disabled={!session}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Address */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Business Address</h3>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="123 Main Street"
                          disabled={!session}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Los Angeles"
                            disabled={!session}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            placeholder="California"
                            disabled={!session}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            placeholder="90001"
                            disabled={!session}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Social Links (Optional)</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            placeholder="https://yourstore.com"
                            disabled={!session}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            value={formData.instagram}
                            onChange={(e) => handleInputChange("instagram", e.target.value)}
                            placeholder="@yourstore"
                            disabled={!session}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            value={formData.facebook}
                            onChange={(e) => handleInputChange("facebook", e.target.value)}
                            placeholder="facebook.com/yourstore"
                            disabled={!session}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* PayPal */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Payment Setup</h3>
                      <div className="space-y-2">
                        <Label htmlFor="paypalEmail">PayPal Email for Payouts *</Label>
                        <Input
                          id="paypalEmail"
                          type="email"
                          value={formData.paypalEmail}
                          onChange={(e) => handleInputChange("paypalEmail", e.target.value)}
                          placeholder="payments@yourstore.com"
                          disabled={!session}
                        />
                        <p className="text-xs text-gray-500">
                          This is where we&apos;ll send your 85% earnings from each sale
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg"
                      disabled={!session || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
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
