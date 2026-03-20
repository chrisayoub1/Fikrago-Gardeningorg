import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    title: "The Best Regenerative Gardening Kits of 2026: A Complete Buyer's Guide",
    excerpt: "Discover the top-rated regenerative gardening kits that will transform your garden. Our comprehensive guide covers everything from soil health to plant selection.",
    category: "Guide",
    readTime: "12 min",
    image: "🌱",
    slug: "best-regenerative-gardening-kits-2026",
    featured: true,
  },
  {
    title: "No-Till Gardening: A Beginner's Complete Guide",
    excerpt: "Learn the principles of no-till gardening and how it can improve your soil health while reducing labor.",
    category: "Techniques",
    readTime: "8 min",
    image: "🌍",
    slug: "no-till-gardening-beginners-guide",
    featured: false,
  },
  {
    title: "Compost Tea for Beginners: Brew Your Way to Better Soil",
    excerpt: "Everything you need to know about brewing compost tea and using it to boost your plants' health.",
    category: "Soil Health",
    readTime: "6 min",
    image: "🍵",
    slug: "compost-tea-beginners-guide",
    featured: false,
  },
  {
    title: "Heirloom Seeds: Why They Matter and How to Save Them",
    excerpt: "Explore the world of heirloom seeds and learn why they're essential for sustainable gardening.",
    category: "Seeds",
    readTime: "7 min",
    image: "🌻",
    slug: "heirloom-seeds-guide",
    featured: false,
  },
];

export function BlogPreview() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Our Blog
            </h2>
            <p className="text-gray-600 max-w-xl">
              Expert tips, guides, and insights on regenerative gardening
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Featured Post */}
          <Card className="group overflow-hidden border-0 shadow-lg bg-white">
            <div className="aspect-video bg-gradient-to-br from-emerald-200 to-green-300 flex items-center justify-center relative">
              <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                {featuredPost.image}
              </span>
              <Badge className="absolute top-4 left-4 bg-emerald-600 text-white">
                Featured Guide
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  {featuredPost.category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime} read
                </span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`}>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {featuredPost.title}
                </h3>
              </Link>
              <p className="text-gray-600">{featuredPost.excerpt}</p>
            </CardContent>
          </Card>

          {/* Other Posts */}
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <Card key={post.slug} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {post.image}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
