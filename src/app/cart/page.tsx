"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  const platformFee = subtotal * 0.15;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "garden10") {
      setPromoApplied(true);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1">
              {items.length === 0
                ? "Your cart is empty"
                : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <Card className="max-w-2xl mx-auto text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Looks like you haven&apos;t added any products yet.
                </p>
                <Button
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/shop">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.productId}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-4xl">{item.image}</span>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <div>
                              <Link
                                href={`/product/${item.productId}`}
                                className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-500 mt-1">
                                by {item.vendorName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 shrink-0"
                              onClick={() => removeItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-gray-500">
                                  ${item.price.toFixed(2)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Clear Cart */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      {shipping === 0 ? (
                        <Badge className="bg-green-100 text-green-700">FREE</Badge>
                      ) : (
                        <span className="font-medium">${shipping.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Discount */}
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Platform Fee Notice */}
                    <div className="bg-emerald-50 rounded-lg p-3 text-sm">
                      <p className="text-emerald-700 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Platform Service Fee included
                      </p>
                      <p className="text-emerald-600 text-xs mt-1">
                        15% of each sale supports our marketplace operations
                      </p>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    {/* Promo Code */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyPromo}
                          disabled={promoApplied || !promoCode}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                      {promoApplied && (
                        <p className="text-sm text-green-600">
                          ✓ Promo code applied!
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Try: GARDEN10 for 10% off
                      </p>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    {/* Free Shipping Notice */}
                    {subtotal < 50 && (
                      <p className="text-xs text-center text-gray-500">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ShieldCheck className="h-4 w-4" />
                        Secure
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Truck className="h-4 w-4" />
                        Fast Shipping
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
