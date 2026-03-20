import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-116eefcc-88f4-41f7-bb22-e9d1e9b3442f.space.z.ai",
    ".space.z.ai",
  ],
};

export default nextConfig;
