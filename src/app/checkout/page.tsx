"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Truck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Script from "next/script";

interface PayPalConfig {
  configured: boolean;
  clientId?: string;
  isLive?: boolean;
  message?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [hasOrderBump, setHasOrderBump] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<PayPalConfig | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
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

  const subtotal = getSubtotal();
  const orderBumpPrice = hasOrderBump ? 19 : 0;
  const shipping = subtotal + orderBumpPrice >= 50 ? 0 : 9.99;
  const total = subtotal + orderBumpPrice + shipping;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

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

  const createPayPalOrder = useCallback(async () => {
    // Validate required fields first
    const required = ["firstName", "lastName", "email", "addressLine1", "city", "state", "zipCode"];
    const missing = required.filter((field) => !shippingAddress[field as keyof typeof shippingAddress]);
    
    if (missing.length > 0) {
      toast.error("Please fill in all required fields");
      throw new Error("Missing required fields");
    }

    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        hasOrderBump,
        shippingAddress,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }

    const data = await response.json();
    return data.orderId;
  }, [items, hasOrderBump, shippingAddress]);

  const onApprove = useCallback(async (data: { orderID: string }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress,
          hasOrderBump,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment capture failed");
      }

      const result = await response.json();
      
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-success?order=${result.order.orderNumber}`);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [items, shippingAddress, hasOrderBump, clearCart, router]);

  // Render PayPal buttons when SDK is loaded
  useEffect(() => {
    if (!paypalConfig?.configured || !paypalConfig.clientId || paypalReady) return;

    const renderPayPalButtons = () => {
      if (typeof window !== "undefined" && (window as any).paypal) {
        const paypal = (window as any).paypal;
        
        paypal.Buttons({
          createOrder: createPayPalOrder,
          onApprove: onApprove,
          onError: (err: Error) => {
            console.error("PayPal error:", err);
            toast.error("PayPal payment failed. Please try again.");
          },
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 50,
          },
        }).render("#paypal-button-container").then(() => {
          setPaypalReady(true);
        }).catch((err: Error) => {
          console.error("Failed to render PayPal buttons:", err);
        });
      }
    };

    // Wait a bit for the script to fully load
    const timer = setTimeout(renderPayPalButtons, 500);
    return () => clearTimeout(timer);
  }, [paypalConfig, paypalReady, createPayPalOrder, onApprove]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Load PayPal SDK */}
      {paypalConfig?.configured && paypalConfig.clientId && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=USD&intent=capture`}
          strategy="lazyOnload"
        />
      )}
      
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Back to Cart */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push("/cart")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
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
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="saveAddress"
                      checked={saveAddress}
                      onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                    />
                    <Label htmlFor="saveAddress" className="text-sm text-gray-600">
                      Save this address for future orders
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Order Bump - Digital Masterclass */}
              <Card className={`border-2 ${hasOrderBump ? "border-emerald-500 bg-emerald-50/50" : "border-gray-200"}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="orderBump"
                      checked={hasOrderBump}
                      onCheckedChange={(checked) => setHasOrderBump(checked as boolean)}
                      className="mt-1 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-amber-100 text-amber-800">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Special Offer
                        </Badge>
                        <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                          Save $10
                        </Badge>
                      </div>
                      <Label
                        htmlFor="orderBump"
                        className="text-lg font-semibold cursor-pointer"
                      >
                        Add: Regenerative Gardening Masterclass PDF
                      </Label>
                      <p className="text-gray-600 text-sm mt-1">
                        A comprehensive 87-page guide covering soil health, composting, 
                        heirloom seed saving, and year-round garden planning.
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm text-gray-600">87 pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm text-gray-600">Instant download</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-emerald-600">$19</span>
                        <span className="text-sm text-gray-400 line-through ml-2">$29</span>
                      </div>
                    </div>
                    <div className="hidden sm:block w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="w-12 h-12 bg-emerald-50 rounded flex items-center justify-center shrink-0">
                          <span className="text-xl">{item.image}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Bump Item */}
                  {hasOrderBump && (
                    <>
                      <Separator />
                      <div className="flex gap-3 bg-emerald-50 p-2 rounded-lg">
                        <div className="w-12 h-12 bg-emerald-100 rounded flex items-center justify-center shrink-0">
                          <BookOpen className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Masterclass PDF</p>
                          <p className="text-xs text-gray-500">Digital download</p>
                        </div>
                        <p className="text-sm font-medium text-emerald-600">$19.00</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${(subtotal + orderBumpPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      {shipping === 0 ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">FREE</Badge>
                      ) : (
                        <span>${shipping.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Platform Fee Notice */}
                  <div className="bg-emerald-50 rounded-lg p-3 text-sm">
                    <p className="text-emerald-700 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Platform Service Fee included
                    </p>
                    <p className="text-emerald-600 text-xs mt-1">
                      15% supports marketplace operations
                    </p>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* PayPal Not Configured Warning */}
                  {paypalConfig && !paypalConfig.configured && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800">PayPal Not Configured</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Please configure PayPal credentials in Admin Settings to enable payments.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* PayPal Button Container */}
                  {paypalConfig?.configured && (
                    <div id="paypal-button-container" className="min-h-[50px]">
                      {!paypalReady && (
                        <div className="flex items-center justify-center h-[50px]">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    Secure checkout powered by PayPal
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t text-center">
                    <div>
                      <ShieldCheck className="h-5 w-5 text-emerald-600 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">Secure</p>
                    </div>
                    <div>
                      <Truck className="h-5 w-5 text-emerald-600 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">Fast Ship</p>
                    </div>
                    <div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">Guaranteed</p>
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
