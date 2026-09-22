import type { MetadataRoute } from "next";
import { products as translatedProducts } from "@/lib/content";
import { getNews, getProducts } from "@/lib/keystatic-content";
import { siteUrl } from "@/lib/seo";
import { sectionDetails } from "@/lib/section-details";
import { stories } from "@/lib/stories";
import { insightArticles } from "@/lib/insight-articles";
// Next.js serializes this metadata route as XML and sets application/xml.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, news] = await Promise.all([getProducts(), getNews()]);
  const sharedRoutes = [
    "", "about", "contact", "vending-machines",
    ...Object.keys(sectionDetails),
    ...Object.keys(stories.projects).map(slug => `projects/${slug}`),
    ...Object.keys(stories.insights).map(slug => `insights/${slug}`),
  ];
  const englishRoutes = new Set([
    "vending",
    ...sharedRoutes,
    ...products.map(product => `vending-machines/${product.slug}`),
    ...insightArticles.map(article => `insights/${article.slug}`),
    ...news.map(article => `insights/${article.slug}`),
  ]);
  // The Chinese catch-all only supports the translated catalog and stories.
  // Do not manufacture /zh URLs for English-only articles (they return 404).
  const chineseRoutes = new Set([
    ...sharedRoutes,
    ...translatedProducts.map(product => `vending-machines/${product.slug}`),
  ]);
  return [
    ...Array.from(englishRoutes, route => ({ url: `${siteUrl}${route ? `/${route}` : "/"}` })),
    ...Array.from(chineseRoutes, route => ({ url: `${siteUrl}/zh${route ? `/${route}` : ""}` })),
  ];
}
