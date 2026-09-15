import Image from "next/image";
import { EnquirySection } from "./enquiry-section";
import Link from "next/link";
import { insightArticles, insightDate, insightReadingMinutes, type InsightArticle } from "@/lib/insight-articles";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/seo";
import s from "./insight-editorial.module.css";

function RichText({ text }: { text: string }) {
  return <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return match ? <Link key={i} href={match[2]}>{match[1]}</Link> : part;
  })}</>;
}

export function InsightIndex({ cms = [] }: { cms?: { slug: string; title: string; excerpt: string; coverImage?: string | null; publishedAt: string }[] }) {
  const featured = insightArticles[0];
  const customSlugs = new Set(cms.map(a => a.slug));
  const items = [...cms.map(a => ({ ...a, description: a.excerpt, image: a.coverImage, category: "Industry news", region: "BOHOL", minutes: undefined as number | undefined })), ...insightArticles.filter(a => !customSlugs.has(a.slug) && a.slug !== featured.slug).map(a => ({ ...a, publishedAt: insightDate, minutes: insightReadingMinutes(a) }))];
  return <div className={s.index}>
    {!customSlugs.has(featured.slug) && <Link className={s.feature} href={`/insights/${featured.slug}`}><div className={s.featurePhoto}><Image src={featured.image} alt={featured.imageAlt} fill sizes="(max-width:800px) 100vw, 60vw" priority /></div><div className={s.featureText}><span>{featured.category} · {featured.region}</span><h2>{featured.title}</h2><p>{featured.description}</p><small>12 September 2026 · {insightReadingMinutes(featured)} min read</small><strong>European vending market analysis →</strong></div></Link>}
    <h2 className={s.latest}>Industry updates & buying intelligence</h2>
    <div className={s.grid}>{items.map(a => <article className={s.card} key={a.slug}><Link href={`/insights/${a.slug}`}>{a.image && <div className={s.cover}><Image src={a.image} alt={a.title} fill sizes="(max-width:700px) 100vw, (max-width:1050px) 50vw, 33vw" /></div>}<span>{a.category} · {a.region}</span><h3>{a.title}</h3></Link><p>{a.description}</p><small><time dateTime={a.publishedAt}>{a.publishedAt}</time>{a.minutes ? ` · ${a.minutes} min read` : ""}</small></article>)}</div>
    <p className={s.policy}>Published by BOHOL. Industry reporting links to original sources; buying guides reflect BOHOL’s analysis. Brand scenario images are AI-edited illustrations, not photographs of the reported events.</p>
  </div>;
}

export function InsightArticleView({ article: a }: { article: InsightArticle }) {
  const related = insightArticles.filter(x => x.slug !== a.slug).slice(0, 3);
  const url = `${siteUrl}/insights/${a.slug}`;
  return <><main className={s.article} lang="en">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, datePublished: `${insightDate}T09:00:00+08:00`, dateModified: `${insightDate}T09:00:00+08:00`, inLanguage: "en", image: [`${siteUrl}${a.image}`], mainEntityOfPage: url, url, articleSection: a.category, keywords: a.keywords, author: { "@type": "Organization", name: "BOHOL", url: `${siteUrl}/about` }, publisher: { "@id": `${siteUrl}/#organization` }, citation: a.sources.map(x => x.url) }} />
    <Link className={s.back} href="/insights">Vending industry news & insights</Link>
    <header className={s.articleHead}><h1>{a.title}</h1><p className={s.lead}>{a.description}</p><div className={s.meta}><Link href="/about">BOHOL Editorial</Link><time dateTime={insightDate}>12 September 2026</time><span>{a.category}</span><span>{insightReadingMinutes(a)} min read</span></div></header>
    <figure className={s.hero}><Image src={a.image} alt={a.imageAlt} width={1672} height={941} sizes="(max-width:1200px) 100vw, 1120px" priority /><figcaption>BOHOL application illustration · AI-edited image; not a photograph of the reported event.</figcaption></figure>
    <div className={s.readingLayout}><nav className={s.toc} aria-label="Article contents"><b>In this article</b>{a.sections.map((x,i)=><a href={`#section-${i+1}`} key={x.heading}>{x.heading}</a>)}<a href="#questions">Common questions</a><a href="#sources">Sources & further reading</a></nav><div className={s.body}><section className={s.answer}><h2>At a glance</h2><p>{a.summary}</p></section><p className={s.sourceNote}>{a.sourceNote}</p>
      {a.sections.map((x,i)=><section className={s.section} id={`section-${i+1}`} key={x.heading}><h2>{x.heading}</h2>{x.paragraphs.map(p=><p key={p}><RichText text={p}/></p>)}</section>)}
      <section className={s.section} id="questions"><h2>Common questions</h2>{a.faq.map(f=><div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}</section>
      <section className={s.sources} id="sources"><h2>Sources & further reading</h2><p>Original sources checked on 12 September 2026. Industry bodies cited here do not endorse this article or BOHOL products.</p><ul>{a.sources.map(x=><li key={x.url}><a href={x.url}>{x.label}</a></li>)}</ul></section>
      <section className={s.section}><h2>Plan the right vending configuration</h2><p>Connect the research to your product, location and service model.</p><Link href="/contact">Discuss your vending machine requirements →</Link></section>
    </div></div><section className={s.related}><h2>Continue reading</h2>{related.map(x=><Link key={x.slug} href={`/insights/${x.slug}`}>{x.title} →</Link>)}</section>
  </main><EnquirySection /></>;
}
