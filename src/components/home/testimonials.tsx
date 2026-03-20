import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Home Gardener",
    location: "Portland, OR",
    content: "I've tried so many soil amendments over the years, but the quality from Fikrago vendors is unmatched. My tomatoes have never looked better!",
    rating: 5,
    avatar: "👩‍🌾",
  },
  {
    name: "Michael T.",
    role: "Market Farmer",
    location: "Austin, TX",
    content: "The compost tea kit I bought here completely transformed my soil biology. The vendor was knowledgeable and the product shipped fast.",
    rating: 5,
    avatar: "👨‍🌾",
  },
  {
    name: "Emily R.",
    role: "Beginner Gardener",
    location: "Seattle, WA",
    content: "As someone new to regenerative gardening, the starter kit was perfect. Easy to follow instructions and everything I needed in one box.",
    rating: 5,
    avatar: "🌱",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied gardeners who trust Fikrago for their gardening needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative overflow-hidden border-0 shadow-lg bg-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full" />
              <Quote className="absolute top-4 right-4 h-8 w-8 text-emerald-200" />
              <CardContent className="p-6 md:p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
