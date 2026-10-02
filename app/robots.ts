import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
const privatePaths = [
  "/login",
  "/admin",
  "/admin/",
  "/bohol-control-7e9c2f",
  "/bohol-control-7e9c2f/",
  "/keystatic/",
  "/api/admin/",
  "/api/keystatic/",
];
export default function robots(): MetadataRoute.Robots { return { rules: [
  { userAgent: "*", allow: "/", disallow: privatePaths },
  { userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "PerplexityBot", "Perplexity-User"], allow: "/", disallow: privatePaths },
], sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl }; }
