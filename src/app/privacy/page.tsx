import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Cookie, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2024";

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-4">
                Legal Document
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Privacy Policy
              </h1>
              <p className="text-emerald-100">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Quick Overview */}
            <Card className="mb-8 border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Your Privacy Matters
                </h2>
                <p className="text-gray-600">
                  At Fikrago Gardening, we are committed to protecting your privacy. This policy
                  outlines how we collect, use, and safeguard your personal information when you
                  use our marketplace platform.
                </p>
              </CardContent>
            </Card>

            <div className="prose prose-gray max-w-none">
              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                    <li>Name and email address (via Google OAuth)</li>
                    <li>Shipping address for orders</li>
                    <li>Payment information (processed securely by PayPal)</li>
                    <li>Phone number (optional)</li>
                  </ul>
                  
                  <h3 className="font-medium text-gray-900 mb-3">Vendor Information</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Business name and description</li>
                    <li>Business address and contact details</li>
                    <li>PayPal email for payouts</li>
                    <li>Social media links (optional)</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate about your purchases and account</li>
                    <li>Send promotional emails (with your consent)</li>
                    <li>Process vendor payouts and commissions</li>
                    <li>Improve our platform and services</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-emerald-600" />
                  3. Cookies and Tracking
                </h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Keep you signed in</li>
                    <li>Remember your shopping cart</li>
                    <li>Analyze site traffic (anonymized)</li>
                    <li>Personalize your experience</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    You can control cookie settings through your browser. Disabling cookies may
                    affect some features of our platform.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  4. Data Security
                </h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    We implement industry-standard security measures to protect your data:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>SSL/TLS encryption for all data transmission</li>
                    <li>Secure password hashing</li>
                    <li>Regular security audits</li>
                    <li>Limited access to personal data</li>
                    <li>PayPal handles all payment processing securely</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Information Sharing</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    We <strong>never sell</strong> your personal information. We may share data with:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>Vendors:</strong> Shipping details for order fulfillment only</li>
                    <li><strong>Payment Processors:</strong> PayPal for secure transactions</li>
                    <li><strong>Service Providers:</strong> Analytics, email services (all bound by confidentiality)</li>
                    <li><strong>Legal Authorities:</strong> When required by law</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Export your data in a portable format</li>
                    <li>Lodge a complaint with a supervisory authority</li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Vendor-Specific Terms</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    As a vendor on Fikrago Gardening, additional data handling applies:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Business information may be displayed publicly on your vendor profile</li>
                    <li>Sales data is used for commission calculations and payouts</li>
                    <li>You are responsible for handling customer shipping information lawfully</li>
                    <li>Customer reviews and ratings may be displayed publicly</li>
                  </ul>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600">
                    Our platform is not intended for children under 13. We do not knowingly collect
                    personal information from children. If you believe a child has provided us with
                    personal information, please contact us immediately.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600">
                    We may update this Privacy Policy periodically. We will notify you of significant
                    changes via email or a prominent notice on our website. Continued use of our
                    platform after changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  10. Contact Us
                </h2>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    If you have questions about this Privacy Policy or our data practices, contact us:
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> privacy@fikrago.com</p>
                    <p><strong>Website:</strong> www.fikrago.com</p>
                    <p><strong>Address:</strong> Fikrago Gardening, 123 Garden Lane, Green City, Earth</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <p className="text-emerald-700 text-sm">
                This Privacy Policy is compliant with GDPR, CCPA, and other applicable data protection regulations.
                <br />
                Powered by <a href="https://www.fikrago.com" className="underline">www.fikrago.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
