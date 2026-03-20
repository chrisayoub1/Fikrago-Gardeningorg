"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Leaf } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { products: number };
}

const defaultIcons: Record<string, string> = {
  "seeds": "🌻",
  "soil": "🌍",
  "compost": "🍵",
  "tools": "🔧",
  "kits": "🌱",
  "care": "💚",
  "fertilizers": "🧪",
  "plants": "🌿",
};

const defaultColors = [
  "from-emerald-400 to-green-500",
  "from-amber-400 to-orange-500",
  "from-amber-600 to-yellow-700",
  "from-teal-400 to-cyan-500",
  "from-gray-400 to-slate-500",
  "from-lime-400 to-green-500",
];

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        setCategories(await response.json());
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category: Category, index: number) => {
    if (category.icon) return category.icon;
    const slugKey = category.slug.toLowerCase();
    if (defaultIcons[slugKey]) return defaultIcons[slugKey];
    return "🌱";
  };

  const getColor = (index: number) => {
    return defaultColors[index % defaultColors.length];
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of regenerative gardening products from trusted vendors
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/shop?category=${category.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gray-50 hover:bg-white">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl bg-gradient-to-br ${getColor(index)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl md:text-4xl">{getIcon(category, index)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 hidden md:block">
                    {category._count.products} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
