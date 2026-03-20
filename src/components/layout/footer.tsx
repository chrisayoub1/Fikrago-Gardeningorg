import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Leaf,
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Gardening Kits", href: "/shop?category=kits" },
    { name: "Seeds", href: "/shop?category=seeds" },
    { name: "Soil Amendments", href: "/shop?category=soil" },
    { name: "Tools", href: "/shop?category=tools" },
  ],
  vendors: [
    { name: "Become a Vendor", href: "/vendor/apply" },
    { name: "Vendor Login", href: "/auth/signin" },
    { name: "Seller Guidelines", href: "/vendor/guidelines" },
    { name: "Success Stories", href: "/blog?tag=vendors" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Mission", href: "/about#mission" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Refunds", href: "/returns" },
    { name: "Track Order", href: "/track-order" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-emerald-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl font-bold">🌱 Subscribe to Our Newsletter</h3>
              <p className="text-emerald-100 text-sm mt-1">
                Get gardening tips, exclusive deals, and new product alerts!
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200 w-full md:w-64"
              />
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <span className="font-bold text-xl text-white">Fikrago</span>
                <span className="font-light text-xl text-gray-400"> Gardening</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted marketplace for regenerative gardening products. Connect with boutique vendors who care about soil health.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Vendors</h4>
            <ul className="space-y-2">
              {footerLinks.vendors.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-500" />
              support@fikrago.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-500" />
              1-800-FIKRAGO
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" />
              California, USA
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span>© {new Date().getFullYear()} Fikrago Gardening. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Leaf className="h-4 w-4" />
              <span>Powered by <Link href="https://www.fikrago.com" className="underline hover:text-emerald-300">www.fikrago.com</Link></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
