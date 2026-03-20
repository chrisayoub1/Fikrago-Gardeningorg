import { ShoppingBag, Store, Truck, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    title: "Browse & Shop",
    description: "Explore our curated selection of regenerative gardening products from verified vendors",
    color: "bg-emerald-500",
  },
  {
    icon: Store,
    title: "Support Small Vendors",
    description: "Connect directly with boutique sellers who are passionate about soil health",
    color: "bg-teal-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your products delivered quickly with free shipping on orders over $50",
    color: "bg-green-500",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "All products are vetted for quality and backed by our satisfaction guarantee",
    color: "bg-lime-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Fikrago Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A simple, transparent marketplace connecting gardeners with quality vendors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent" />
              )}
              
              <div className="relative z-10">
                <div className={`w-24 h-24 mx-auto rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto left-1/2 -translate-x-1/2">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
