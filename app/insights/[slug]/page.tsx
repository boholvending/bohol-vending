import type { Metadata } from "next";
import { EnquirySection } from "@/components/enquiry-section";
import Link from "next/link";
import Image from "next/image";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { notFound } from "next/navigation";
import { SiteShell, BreadcrumbJson } from "@/components/site-shell";
import { StoryContent } from "@/components/story-content";
import { JsonLd } from "@/components/json-ld";
import { stories } from "@/lib/stories";
import { getNews, getNewsArticle } from "@/lib/keystatic-content";
import { siteUrl } from "@/lib/seo";

import { insightArticles, insightDate } from "@/lib/insight-articles";
import { InsightArticleView } from "@/components/insight-editorial";
const kind = "insights";
export async function generateStaticParams() {
  const cms = await getNews();
  return Array.from(new Set([...Object.keys(stories[kind]), ...insightArticles.map(a => a.slug), ...cms.map((article) => article.slug)])).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getNewsArticle(slug);
  const article = insightArticles.find(a => a.slug === slug);
  const fallback = stories[kind][slug];
  if (!cms && article) return { title: article.title, description: article.description, keywords: article.keywords, alternates: { canonical: `/insights/${slug}`, languages: { en: `/insights/${slug}` } }, openGraph: { type: "article", title: article.title, description: article.description, publishedTime: insightDate, modifiedTime: insightDate, images: [{ url: article.image, alt: article.imageAlt }] }, twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [article.image] } };
  if (!cms && !fallback) return {};
  const title = cms?.seoTitle || cms?.title || fallback.title.en;
  const description = cms?.seoDescription || cms?.excerpt || fallback.intro.en;
  const image = cms?.coverImage ? [cms.coverImage] : [];
  return { title, description, alternates: { canonical: `/${kind}/${slug}`, languages: { en: `/${kind}/${slug}`, "zh-CN": `/zh/${kind}/${slug}` } }, openGraph: { title, description, images: image }, twitter: { title, description, images: image } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cms = await getNewsArticle(slug);
  const article = insightArticles.find(a => a.slug === slug);
  const fallback = stories[kind][slug];
  if (!cms && article) return <SiteShell><BreadcrumbJson items={[{ name: "Home", url: siteUrl }, { name: "Vending industry news", url: `${siteUrl}/insights` }, { name: article.title, url: `${siteUrl}/insights/${slug}` }]} /><InsightArticleView article={article}/></SiteShell>;
  if (!cms && !fallback) notFound();
  if (!cms) return <SiteShell><StoryContent kind={kind} slug={slug} /></SiteShell>;
  const document = await cms.content();
  const content = <DocumentRenderer document={document} />;
  const canonical = `${siteUrl}/insights/${slug}`;
  const articleLd = { "@context": "https://schema.org", "@type": "Article", headline: cms.title, description: cms.seoDescription || cms.excerpt, datePublished: cms.publishedAt, dateModified: cms.modifiedAt || cms.publishedAt, image: cms.coverImage ? [`${siteUrl}${cms.coverImage}`] : undefined, url: canonical, mainEntityOfPage: { "@type": "WebPage", "@id": canonical }, author: { "@id": `${siteUrl}/#organization` }, publisher: { "@id": `${siteUrl}/#organization` } };
  const faqLd = cms.faq?.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: cms.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
  return <SiteShell><JsonLd data={articleLd} />{faqLd && <JsonLd data={faqLd} />}<BreadcrumbJson items={[{ name: "Home", url: siteUrl }, { name: "Insights", url: `${siteUrl}/insights` }, { name: cms.title, url: canonical }]} /><article className="editorial"><Link href="/insights">← Back to all stories</Link><p className="section-tag">BOHOL / INSIGHTS</p><h1>{cms.title}</h1><p className="article-lead">{cms.excerpt}</p>{cms.geoSummary && <aside className="answer-box"><strong>Quick answer:</strong> {cms.geoSummary}</aside>}<time dateTime={cms.publishedAt}>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(`${cms.publishedAt}T00:00:00`))}</time>{cms.coverImage && <figure className="story-hero-image"><Image src={cms.coverImage} alt={cms.coverImageAlt || cms.title} width={1200} height={675} sizes="(max-width:900px) 100vw, 980px" /></figure>}<div className="article-body">{content}</div>{cms.faq?.length ? <section className="article-body"><h2>Frequently asked questions</h2>{cms.faq.map((item) => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section> : null}</article><EnquirySection /></SiteShell>;
}
