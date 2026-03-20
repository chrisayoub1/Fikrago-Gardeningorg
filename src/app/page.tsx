import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
  HowItWorks,
  VendorCTA,
  Testimonials,
  SubscriptionBox,
  BlogPreview
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <HowItWorks />
        <SubscriptionBox />
        <VendorCTA />
        <Testimonials />
        <BlogPreview />
      </main>
      <Footer />
    </>
  );
}
// Build fix: Fri Mar 20 05:09:25 UTC 2026
