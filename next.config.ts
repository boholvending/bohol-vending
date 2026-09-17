import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function config(phase: string): NextConfig {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    // Do not let production builds overwrite the running preview's chunks.
    distDir: development ? ".next-preview" : ".next",
    compress: true,
    poweredByHeader: false,
    images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 31536000 },
    async headers() {
      // Next.js manages hashed asset caching. Never make development chunks immutable.
      return [
        { source: "/:path*", headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ...(development ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
        ] },
        { source: "/images/:path*", headers: [{ key: "Cache-Control", value: development ? "no-store" : "public, max-age=31536000, immutable" }] },
        { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
        { source: "/keystatic/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
        { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      ];
    },
  };
}
