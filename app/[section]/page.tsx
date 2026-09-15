import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sections } from "@/lib/content";
import { sectionDetails } from "@/lib/section-details";
import { BreadcrumbJson, SiteShell } from "@/components/site-shell";
import { SectionContent } from "@/components/section-content";

export function generateStaticParams() { return Object.keys(sectionDetails).map(section => ({ section })); }
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const p = sections[section];
  if (!p || !sectionDetails[section]) return {};
  const seo: Record<string, { title: string; description: string; keywords: string[]; image?: string }> = {
    insights: {
      title: "Vending Industry News, Market Research & Buying Guides",
      description: "Explore sourced vending industry analysis, European and US market trends, cashless payment guidance and OEM buying advice from BOHOL.",
      keywords: ["vending industry news", "vending market research", "cashless vending", "OEM vending machine guide"],
      image: "/images/cases/hotel-lobby-bohol.png",
    },
    solutions: {
      title: "Overseas Vending Solutions for Offices, Hotels, Gyms and Campuses",
      description: "BOHOL smart vending solutions for overseas offices, apartments, hotels, gyms, hospitals, schools and public facilities, with OEM/ODM hardware, payment and operation support.",
      keywords: ["overseas vending solutions", "smart vending machine", "office vending machine", "hotel vending machine", "gym vending machine", "apartment lobby vending", "custom vending machine manufacturer", "China vending machine supplier"],
      image: "/images/cases/office-smart-store-bohol.png",
    },
    "oem-odm": {
      title: "OEM ODM Custom Vending Machine Manufacturer for Global Markets",
      description: "BOHOL builds custom vending machines for global rollout, including cabinet branding, product channels, payment integration, prototypes and mass production.",
      keywords: ["OEM vending machine", "ODM vending machine", "custom vending machine manufacturer", "vending machine factory China", "smart vending cabinet", "global vending machine supplier"],
      image: "/images/cases/team-installation.jpg",
    },
    projects: {
      title: "Overseas Smart Vending Application Cases | BOHOL",
      description: "Explore BOHOL overseas vending application cases for the United States, Canada, Europe, UK, UAE, Singapore, Australia and global distributors.",
      keywords: ["vending machine case study", "overseas vending cases", "USA office vending", "Canada apartment vending", "Europe hotel vending", "UAE gym vending", "Singapore hospital vending", "Australia campus vending"],
      image: "/images/cases/customer-buying.jpg",
    },
  };
  const meta = seo[section];
  return { title: meta?.title || p.eyebrow, description: meta?.description || p.intro, keywords: meta?.keywords, alternates: { canonical: `/${section}`, languages: { en: `/${section}`, "zh-CN": `/zh/${section}` } }, openGraph: { title: meta?.title || p.eyebrow, description: meta?.description || p.intro, images: meta?.image ? [meta.image] : [] }, twitter: { title: meta?.title || p.eyebrow, description: meta?.description || p.intro, images: meta?.image ? [meta.image] : [] } };
}
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const p = sections[section];
  if (!p || !sectionDetails[section]) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.boholvending.com";
  return <SiteShell><BreadcrumbJson items={[{ name: "Home", url: base }, { name: p.eyebrow, url: `${base}/${section}` }]}/><main className="inner-page"><p className="section-tag">{p.eyebrow}</p><h1>{p.title}</h1><p className="inner-lead">{p.intro}</p><SectionContent section={section}/></main></SiteShell>;
}
