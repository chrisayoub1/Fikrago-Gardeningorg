import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Chatbot } from "@/components/chatbot/chatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fikrago Gardening - Premium Regenerative Gardening Marketplace",
  description: "Your trusted marketplace for regenerative gardening products. Shop gardening kits, heirloom seeds, soil amendments, and more from boutique vendors who care about soil health.",
  keywords: ["regenerative gardening", "organic gardening", "heirloom seeds", "soil health", "gardening kits", "compost tea", "no-till gardening"],
  authors: [{ name: "Fikrago Gardening" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fikrago Gardening - Premium Regenerative Gardening Marketplace",
    description: "Shop premium gardening products from boutique vendors who care about soil health.",
    url: "https://www.fikrago.com",
    siteName: "Fikrago Gardening",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fikrago Gardening",
    description: "Premium regenerative gardening marketplace",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <SessionProvider>
            <div className="min-h-screen flex flex-col bg-white">
              {children}
            </div>
            <Toaster position="top-right" />
            <Chatbot />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
