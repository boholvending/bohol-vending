import type { MetadataRoute } from "next";
import { products } from "@/lib/content";
import { sectionDetails } from "@/lib/section-details";
import { stories } from "@/lib/stories";
import { insightArticles } from "@/lib/insight-articles";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.boholvending.com").replace(/\/$/, "");
  const routes = ["", "about", "contact", "vending-machines", ...Object.keys(sectionDetails), ...products.map(p=>`vending-machines/${p.slug}`), ...Object.entries(stories).flatMap(([kind,items])=>Object.keys(items).map(slug=>`${kind}/${slug}`))];
  const additional = insightArticles.filter(a => !stories.insights[a.slug]).map(a => ({ url: `${base}/insights/${a.slug}` }));
  return [...additional, ...routes.flatMap(route=>{const en=`${base}${route?`/${route}`:""}`; const zh=`${base}/zh${route?`/${route}`:""}`;const languages={en,"zh-CN":zh};return [{url:en,alternates:{languages}},{url:zh,alternates:{languages}}];})];
}
