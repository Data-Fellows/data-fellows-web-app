import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Vercel sets VERCEL_ENV ("production" | "preview" | "development")
  // server-side only -- re-expose it under a NEXT_PUBLIC_ name so
  // lib/supabase/env.ts can also read it from browser-bundled code (the
  // browser Supabase client), not just from getServerSideProps/API routes.
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.VERCEL_ENV ?? "development",
  },
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
  // its own right. /products is now /work, per the handoff's IA --
  // redirected rather than kept as a second live page so the two don't
  // split SEO signal the same way /our-community did.
  async redirects() {
    return [
      { source: "/our-community", destination: "/community", permanent: true },
      { source: "/products", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
