"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Leaf,
  Sprout,
  Droplets,
  Sun,
  TreeDeciduous,
  Flower2,
} from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    slug: "getting-started-with-regenerative-gardening",
    title: "Getting Started with Regenerative Gardening",
    excerpt:
      "Learn the fundamentals of regenerative gardening and how to build healthy soil that produces nutrient-dense food year after year.",
    category: "Beginner Tips",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "8 min read",
    featured: true,
    icon: Sprout,
  },
  {
    id: 2,
    slug: "compost-tea-benefits",
    title: "The Magic of Compost Tea: A Complete Guide",
    excerpt:
      "Discover how compost tea can supercharge your garden's health, boost plant immunity, and increase yields naturally.",
    category: "Soil Health",
    author: "Michael Green",
    date: "2024-01-12",
    readTime: "6 min read",
    featured: true,
    icon: Droplets,
  },
  {
    id: 3,
    slug: "heirloom-seeds-guide",
    title: "Why Heirloom Seeds Matter for Your Garden",
    excerpt:
      "Explore the benefits of heirloom seeds, from superior flavor to genetic diversity, and learn how to save your own seeds.",
    category: "Seeds",
    author: "Emma Rodriguez",
    date: "2024-01-10",
    readTime: "7 min read",
    featured: false,
    icon: Flower2,
  },
  {
    id: 4,
    slug: "no-till-gardening-methods",
    title: "No-Till Gardening: Working with Nature",
    excerpt:
      "Learn why no-till gardening is better for soil health and how to transition from traditional tilling methods.",
    category: "Techniques",
    author: "Sarah Chen",
    date: "2024-01-08",
    readTime: "9 min read",
    featured: false,
    icon: TreeDeciduous,
  },
  {
    id: 5,
    slug: "winter-garden-preparation",
    title: "Preparing Your Garden for Winter Success",
    excerpt:
      "Essential steps to protect your soil and prepare for an abundant spring garden, including cover crops and mulching.",
    category: "Seasonal",
    author: "Michael Green",
    date: "2024-01-05",
    readTime: "5 min read",
    featured: false,
    icon: Leaf,
  },
  {
    id: 6,
    slug: "beneficial-insects-guide",
    title: "Attracting Beneficial Insects to Your Garden",
    excerpt:
      "Create a thriving ecosystem by attracting pollinators and predatory insects that keep pests in check naturally.",
    category: "Pest Control",
    author: "Emma Rodriguez",
    date: "2024-01-03",
    readTime: "6 min read",
    featured: false,
    icon: Sun,
  },
];

const categories = [
  "All",
  "Beginner Tips",
  "Soil Health",
  "Seeds",
  "Techniques",
  "Seasonal",
  "Pest Control",
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-white/20 text-white mb-4">Garden Wisdom</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fikrago Gardening Blog
              </h1>
              <p className="text-xl text-emerald-100 mb-8">
                Expert tips, guides, and inspiration for regenerative gardening
                enthusiasts of all skill levels
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/95 text-gray-900 placeholder:text-gray-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {selectedCategory === "All" && !searchQuery && featuredPosts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Featured Articles
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-gray-50 group"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-32 md:h-auto bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                          <post.icon className="h-16 w-16 text-emerald-600" />
                        </div>
                        <div className="flex-1 p-6">
                          <Badge className="bg-emerald-100 text-emerald-700 mb-2">
                            {post.category}
                          </Badge>
                          <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{post.author}</span>
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-white group"
                  >
                    <div className="h-40 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                      <post.icon className="h-16 w-16 text-emerald-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <p className="font-medium text-gray-700">{post.author}</p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Articles Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or category filter
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-emerald-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for weekly gardening tips, seasonal guides,
              and exclusive vendor spotlights
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/95 text-gray-900 placeholder:text-gray-500"
              />
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
