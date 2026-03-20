import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Users,
  Truck,
  Shield,
  Award,
  Heart,
  Sprout,
  Globe,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "We believe in regenerative practices that heal the earth, not harm it. Every product on our platform supports soil health and biodiversity.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We connect passionate gardeners with boutique vendors who share their commitment to organic, sustainable growing practices.",
  },
  {
    icon: Truck,
    title: "Supporting Small Businesses",
    description:
      "Our marketplace empowers small-scale producers and artisans to reach customers who value quality and sustainability over mass production.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description:
      "Every vendor is vetted and every product is reviewed. We maintain high standards so you can shop with confidence.",
  },
];

const stats = [
  { value: "500+", label: "Active Vendors" },
  { value: "10K+", label: "Happy Gardeners" },
  { value: "15K+", label: "Products Sold" },
  { value: "98%", label: "Satisfaction Rate" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former organic farmer turned marketplace builder. Passionate about connecting people with healthy soil.",
  },
  {
    name: "Michael Green",
    role: "Head of Vendor Relations",
    bio: "Works directly with our vendor community to ensure quality and satisfaction.",
  },
  {
    name: "Emma Rodriguez",
    role: "Community Manager",
    bio: "Keeps our gardening community thriving with tips, events, and support.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-4">
                Our Story
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Fikrago Gardening
              </h1>
              <p className="text-xl text-emerald-100">
                We&apos;re on a mission to make regenerative gardening accessible to everyone,
                one healthy garden at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-4">
                  Fikrago Gardening was born from a simple belief: everyone deserves access to
                  high-quality, sustainable gardening products that support soil health and
                  biodiversity.
                </p>
                <p className="text-gray-600 mb-4">
                  We saw a gap in the market. Large retailers offered mass-produced gardening
                  supplies with questionable ingredients, while small, passionate producers
                  struggled to reach customers who would value their products.
                </p>
                <p className="text-gray-600">
                  So we built Fikrago Gardening — a curated marketplace where boutique
                  soil-health vendors connect with home gardeners who care about what goes
                  into their soil and onto their tables.
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Sprout className="h-32 w-32 text-emerald-600 mx-auto mb-4" />
                  <p className="text-emerald-700 font-medium italic">
                    &ldquo;Healthy soil, healthy plants, healthy people&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-emerald-700 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-emerald-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do at Fikrago Gardening
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value) => (
                <Card key={value.title} className="border-0 shadow-sm">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <value.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform connects vendors and gardeners in a fair, transparent way
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Vetted Vendors</h3>
                <p className="text-gray-600 text-sm">
                  Every seller is reviewed and approved. We ensure quality and authenticity.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fair Commissions</h3>
                <p className="text-gray-600 text-sm">
                  Vendors keep 85% of every sale. Our 15% fee supports platform operations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Growing Community</h3>
                <p className="text-gray-600 text-sm">
                  Join thousands of gardeners committed to regenerative practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Passionate gardeners and technologists working to transform how people grow
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {team.map((member) => (
                <Card key={member.name} className="border-0 shadow-sm text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-emerald-600">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-emerald-600 text-sm mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join our community of passionate gardeners and quality vendors today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                <Link href="/shop">Browse Products</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/vendor/apply">Become a Vendor</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
