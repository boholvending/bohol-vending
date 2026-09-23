import { EnquirySection } from "@/components/enquiry-section";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Download, FileText, Globe2, Settings2, ShieldCheck } from "lucide-react";
import { getProduct, getProductDocument, getProducts, type ProductRecord } from "@/lib/keystatic-content";
import { BreadcrumbJson, SiteShell } from "@/components/site-shell";
import { siteUrl } from "@/lib/seo";
import { ProductGallery } from "@/components/product-gallery";

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const title = product.seoTitle || `${product.name} | BOHOL`;
  const description = product.seoDescription || `${product.summary} Built and configured by BOHOL for brands, distributors and operators worldwide.`;
  const image = product.ogImage || product.image;
  return {
    title,
    description,
    keywords: [product.name, `${product.name} manufacturer`, "custom vending machine", "global vending solution", product.category, ...(product.seoKeywords || [])],
    alternates: { canonical: product.canonicalUrl || `/vending-machines/${slug}` },
    openGraph: { title, description, images: [{ url: image, alt: `${product.name} by BOHOL` }] },
    twitter: { images: [image] },
  };
}

function formatPrice(product: ProductRecord | null) {
  if (!product || product.priceMode === "quote" || !product.price) return "Request quote";
  const amount = new Intl.NumberFormat("en", { style: "currency", currency: product.currency || "USD", maximumFractionDigits: 0 }).format(product.price);
  return product.priceMode === "starting" ? `From ${amount}` : amount;
}

function labelList(values?: readonly string[]) {
  const labels: Record<string, string> = {
    global: "Global",
    us: "United States",
    canada: "Canada",
    europe: "Europe",
    uk: "United Kingdom",
    australia: "Australia",
    "uae-middle-east": "UAE / Middle East",
    "singapore-sea": "Singapore / Southeast Asia",
    card: "Card payment",
    mobile: "Mobile wallet",
    cash: "Cash",
    qr: "QR payment",
    custom: "Custom integration",
  };
  return (values || []).map((value) => labels[value] || value).join(", ");
}

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const document = await getProductDocument(slug);
  const richContent = product.portableText?.length ? <PortableText value={[...product.portableText]} /> : document ? <DocumentRenderer document={document} /> : null;
  const gallery = [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))].map((src, index) => ({ src, alt: index === 0 ? product.name : `${product.name} product detail ${index + 1}` }));
  const factoryGallery = product.factoryGallery?.length ? product.factoryGallery : ["/images/bohol-guangzhou-factory.webp", "/images/partnerships/bohol-production.webp", "/images/partnerships/bohol-design-production.webp"];
  const highlights = product.highlights?.length ? product.highlights : product.features.slice(0, 3).map((feature) => ({ title: feature.split(":")[0], description: feature.includes(":") ? feature.split(":").slice(1).join(":").trim() : "Configured by BOHOL engineering for production-ready vending projects." }));
  const keyDetails = [
    ["Price", formatPrice(product)],
    ["MOQ", product.minimumOrderQuantity ? `${product.minimumOrderQuantity} unit${product.minimumOrderQuantity > 1 ? "s" : ""}` : "Project based"],
    ["Lead time", product.leadTime || "Confirm after requirements"],
    ["Target markets", labelList(product.marketRegions) || "Global"],
    ["Payment", labelList(product.paymentOptions) || "Custom options"],
  ];
  return <SiteShell>
    <BreadcrumbJson items={[{ name: "Home", url: siteUrl }, { name: "Vending Machines", url: `${siteUrl}/vending-machines` }, { name: product.name, url: `${siteUrl}/vending-machines/${slug}` }]} />
    <main className="product-detail product-detail-redesign">
      <div className="product-media-panel">
        <Link className="back-link" href="/vending-machines"><ArrowLeft size={14} /> All vending machines</Link>
        <ProductGallery images={gallery} productName={product.name} />
      </div>
      <div className="product-copy product-buy-panel">
        <p className="section-tag">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="inner-lead">{product.summary}</p>
        <dl className="product-meta-grid">{keyDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <ul>{product.features.slice(0, 6).map((feature) => <li key={feature}><Check size={17} />{feature}</li>)}</ul>
        <div className="product-assurance"><span><Settings2 size={18} /><b>Configurable</b><small>Built around your product</small></span><span><ShieldCheck size={18} /><b>Factory tested</b><small>Quality controlled</small></span><span><Globe2 size={18} /><b>Export ready</b><small>{labelList(product.marketRegions) || "Global markets"}</small></span></div>
        <div className="product-actions"><Link className="primary-button" href="#enquiry">Request specifications <ArrowUpRight size={18} /></Link><Link className="outline-button" href="/oem-odm">Explore customization</Link></div>
      </div>
    </main>
    <section className="product-story-section">
      <div>
        <h2>See how the machine works for your retail format.</h2>
        <p>Each configuration combines the cabinet, interface, payment layout and delivery system around the products you plan to sell.</p>
      </div>
      <div className="product-highlight-grid">{highlights.map((item, index) => { const visual = gallery[(index + 1) % gallery.length]; return <article key={item.title}><Image src={visual.src} alt={`${product.name}: ${item.title}`} width={720} height={520} sizes="(max-width:980px) 100vw, 30vw" /><div><h3>{item.title}</h3><p>{item.description}</p></div></article>; })}</div>
    </section>
    <section className="product-factory-section">
      <div className="product-factory-copy"><h2>{product.companyStrengthTitle || "Built by a source-direct vending machine factory."}</h2><p>{product.companyStrengthDescription || "BOHOL brings product planning, cabinet engineering, assembly, testing and OEM/ODM customization together in Guangzhou. Buyers can review the machine configuration with the team before sampling and production."}</p><dl><div><dt>20,000 m²</dt><dd>Manufacturing facility</dd></div><div><dt>8 years</dt><dd>Manufacturing and R&amp;D</dd></div><div><dt>30+ markets</dt><dd>International project experience</dd></div></dl><Link href="/about">Explore BOHOL company strength <ArrowUpRight size={17} /></Link></div>
      <div className="product-factory-gallery">{factoryGallery.slice(0,3).map((image, index) => <a href={image} target="_blank" rel="noreferrer" key={image} aria-label={`View BOHOL factory image ${index + 1}`}><Image src={image} alt={["BOHOL factory exterior in Guangzhou", "BOHOL vending machine production workshop", "BOHOL engineering and assembly process"][index] || "BOHOL manufacturing facility"} width={1000} height={700} sizes="(max-width:900px) 100vw, 36vw" /><span>View full image <ArrowUpRight size={15} /></span></a>)}</div>
    </section>
    {!!product.applications?.length && <section className="product-applications"><h2>Application scenarios</h2><div>{product.applications.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>}
    {!!product.productAttributes?.length && <section className="product-data-section"><h2>Product attributes</h2><div>{product.productAttributes.map((item) => <article key={item.name}><span>{item.name}</span><b>{item.value}</b></article>)}</div></section>}
    {!!product.specifications?.length && <section className="product-data-section"><h2>Specifications</h2><div>{product.specifications.map((item) => <article key={item.key}><span>{item.key}</span><b>{item.value}</b></article>)}</div></section>}
    <section className="product-rich-shell">
      <div><FileText size={20} /><h2>Detail page content</h2><p>Add long-form sales copy, installation notes, images, tables and code-style snippets from the backend editor.</p></div>
      {richContent ? <article className="editorial product-rich-content">{richContent}</article> : <article className="product-empty-content"><h3>No extended content yet.</h3><p>Add content in the CMS field “Product detail page content”.</p></article>}
    </section>
    {!!product.faq?.length && <section className="product-faq-section"><h2>Product FAQ</h2><div>{product.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>}
    {!!product.downloads?.length && <section className="product-downloads"><h2>Downloads and links</h2><div>{product.downloads.map((item) => item.url && <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"><Download size={18} /><span>{item.label}</span><ArrowUpRight size={16} /></a>)}</div></section>}
    <EnquirySection productName={product.name} />
  </SiteShell>;
}
