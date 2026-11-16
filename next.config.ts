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
  // /our-community renders the exact same content as /community -- two
  // indexable URLs for identical content splits SEO ranking signals, so
  // consolidate onto the canonical path. The old /services -> /products
  // redirect is gone now that /services is a real "What We Do" page in
  // its own right, distinct from the Products/Work page.
  async redirects() {
    return [
      { source: "/our-community", destination: "/community", permanent: true },
    ];
  },
};

export default nextConfig;
