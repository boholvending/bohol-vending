import { EnquirySection } from "@/components/enquiry-section";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Globe2, Settings2, ShieldCheck } from "lucide-react";
import { getProduct, getProductDocument, getProducts } from "@/lib/keystatic-content";
import { BreadcrumbJson, SiteShell } from "@/components/site-shell";
import { JsonLd } from "@/components/json-ld";
import { productJsonLd, siteUrl } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: `${product.name} | BOHOL`, description: `${product.summary} Built and configured by BOHOL for brands, distributors and operators worldwide.`, keywords: [product.name, `${product.name} manufacturer`, "custom vending machine", "global vending solution", product.category], alternates: { canonical: `/vending-machines/${slug}` }, openGraph: { title: product.name, description: product.summary, images: [{ url: product.image, alt: `${product.name} by BOHOL` }] }, twitter: { images: [product.image] } };
}

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const document = await getProductDocument(slug);
  const richContent = document ? <DocumentRenderer document={document} /> : null;
  return <SiteShell>
    <JsonLd data={productJsonLd(product)} />
    <BreadcrumbJson items={[{ name: "Home", url: siteUrl }, { name: "Vending Machines", url: `${siteUrl}/vending-machines` }, { name: product.name, url: `${siteUrl}/vending-machines/${slug}` }]} />
    <main className="product-detail">
      <div className="detail-image"><span className="image-index">BOHOL / 01</span><div className="image-orbit" /><Image src={product.image} alt={product.name} width={800} height={1100} priority sizes="(max-width:800px) 100vw, 48vw" /><span className="image-caption">ENGINEERED FOR GLOBAL RETAIL</span></div>
      <div className="product-copy"><Link className="back-link" href="/vending-machines"><ArrowLeft size={14} /> All vending machines</Link><p className="section-tag">{product.category}</p><h1>{product.name}</h1><p className="inner-lead">{product.summary}</p><ul>{product.features.map((feature) => <li key={feature}><Check size={17} />{feature}</li>)}</ul><div className="product-assurance"><span><Settings2 size={18} /><b>Configurable</b><small>Built around your product</small></span><span><ShieldCheck size={18} /><b>Factory tested</b><small>Quality controlled</small></span><span><Globe2 size={18} /><b>Export ready</b><small>For global deployment</small></span></div><div className="product-actions"><Link className="primary-button" href="#enquiry">Request specifications <ArrowUpRight size={18} /></Link><Link className="outline-button" href="/oem-odm">Explore customization</Link></div></div>
    </main>
    {richContent && <article className="editorial product-rich-content">{richContent}</article>}
    <EnquirySection productName={product.name} />
  </SiteShell>;
}
