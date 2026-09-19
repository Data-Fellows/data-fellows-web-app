import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // /our-community and /services render the exact same content as /community
  // and /products -- two indexable URLs for identical content splits SEO
  // ranking signals, so consolidate onto the canonical path.
  async redirects() {
    return [
      { source: "/our-community", destination: "/community", permanent: true },
      { source: "/services", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
