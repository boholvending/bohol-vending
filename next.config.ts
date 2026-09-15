import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function config(phase: string): NextConfig {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    // Do not let production builds overwrite the running preview's chunks.
    distDir: development ? ".next-preview" : ".next",
    compress: true,
    poweredByHeader: false,
    images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 3600 },
    async headers() {
      // Next.js manages hashed asset caching. Never make development chunks immutable.
      return [{ source: "/images/:path*", headers: [{ key: "Cache-Control", value: development ? "no-store" : "public, max-age=3600, must-revalidate" }] }];
    },
  };
}
