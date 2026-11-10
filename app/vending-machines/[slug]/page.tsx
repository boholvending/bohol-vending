import { EnquirySection } from "@/components/enquiry-section";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Globe2, Settings2, ShieldCheck } from "lucide-react";
import { getProduct, getProducts, type ProductRecord } from "@/lib/keystatic-content";
import { BreadcrumbJson, SiteShell } from "@/components/site-shell";
import { faqJsonLd, siteUrl } from "@/lib/seo";
import { ProductGallery } from "@/components/product-gallery";
import { CompanyProofShowcase, ProductFeatureShowcase } from "@/components/product-feature-showcase";
import { getProductFaq } from "@/lib/product-template";

const productImageAltByPath: Record<string, string> = {
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-b2b-overview-concept.webp": "BOHOL vape vending machine B2B product overview concept",
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-spiral-channels-concept.webp": "Vape vending machine spiral-channel merchandising concept",
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-keypad-payment-concept.webp": "Vape vending machine keypad and payment hardware concept",
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-pickup-cabinet-concept.webp": "Vape vending machine cabinet and pickup-bay concept",
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-oem-options-concept.webp": "OEM vape vending machine cabinet and interface options concept",
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-assembly-qc-concept.webp": "Illustrative vape vending machine assembly and quality-check workflow",
  "/uploads/products/vape-vending-machine-20261020/vape-vending-machine-adult-retail-concept.webp": "Vape vending machine concept for legally permitted controlled retail",
  "/uploads/products/vape-vending-machine-20261111/vape-vending-machine-oem-branding-concept.webp": "Vape vending machine OEM branding and interface options shown as a concept",
  "/uploads/products/vape-vending-machine-20261111/vape-vending-machine-adult-retail-concept.webp": "Concept rendering of a vape vending machine for legally permitted adult-only retail",
};

function productImageAlt(src: string, fallback: string) {
  return productImageAltByPath[src] || fallback;
}

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
    title: { absolute: title },
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
  const faq = getProductFaq(product.faq);
  const gallery = [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))].map((src, index) => ({ src, alt: productImageAlt(src, index === 0 ? product.name : `${product.name} product detail ${index + 1}`) }));
  const highlights = product.highlights?.length ? product.highlights : product.features.slice(0, 3).map((feature) => ({ title: feature.split(":")[0], description: feature.includes(":") ? feature.split(":").slice(1).join(":").trim() : "Configured by BOHOL engineering for production-ready vending projects." }));
  const featuredHighlights = highlights.slice(0, 4).map((item, index) => ({ ...item, image: gallery[(index + 1) % gallery.length].src }));
  const keyDetails = [
    ["Price", formatPrice(product)],
    ["MOQ", product.minimumOrderQuantity ? `${product.minimumOrderQuantity} unit${product.minimumOrderQuantity > 1 ? "s" : ""}` : "Project based"],
    ["Lead time", product.leadTime || "Confirm after requirements"],
    ["Target markets", labelList(product.marketRegions) || "Global"],
    ["Payment", labelList(product.paymentOptions) || "Custom options"],
  ];
  const planningResources = slug === "compact-snack-drink-vending-machine" ? [
    {
      href: "/insights/compact-vending-machine-site-planning-checklist",
      title: "Compact vending machine site checklist",
      description: "Check access, service clearance, power, connectivity and product samples before quotation.",
    },
    {
      href: "/insights/vending-machine-dimensions-doorway-site-planning",
      title: "Doorway and delivery-route planning",
      description: "Record the narrowest doorway, lift, turning point and final machine position before shipment.",
    },
    {
      href: "/insights/vending-machine-payment-system-integration-guide",
      title: "Payment integration guide",
      description: "Confirm the target market, currency, acquirer, refunds, offline behavior and responsibility boundaries.",
    },
  ] : [];
  return <SiteShell>
    {!!faq.length && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd(faq.map(item=>({q:item.question,a:item.answer})))).replace(/</g,"\\u003c")}} />}
    <BreadcrumbJson items={[{ name: "Home", url: siteUrl }, { name: "Vending Machines", url: `${siteUrl}/vending-machines` }, { name: product.name, url: `${siteUrl}/vending-machines/${slug}` }]} />
    <main className="product-detail product-detail-redesign">
      <div className="product-media-panel">
        <Link className="back-link" href="/vending-machines"><ArrowLeft size={14} /> All vending machines</Link>
        <ProductGallery images={gallery} productName={product.name} />
      </div>
      <div className="product-copy product-buy-panel">
        <div className="product-supplier-line"><span>BOHOL Vending Machine Factory</span><b>Guangzhou, China</b><Link href="/about">View company <ArrowUpRight size={14} /></Link></div>
        <h1>{product.name}</h1>
        <p className="inner-lead">{product.summary}</p>
        <dl className="product-meta-grid">{keyDetails.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className="product-key-attributes"><h2>Key attributes</h2><div>{product.features.slice(0, 6).map((feature) => <span key={feature}><Check size={15} />{feature}</span>)}</div></div>
        <div className="product-assurance"><span><Settings2 size={18} /><b>Configurable</b><small>Built around your product</small></span><span><ShieldCheck size={18} /><b>Factory tested</b><small>Quality controlled</small></span><span><Globe2 size={18} /><b>Export ready</b><small>{labelList(product.marketRegions) || "Global markets"}</small></span></div>
        <div className="product-actions"><Link className="primary-button" href="#enquiry">Request specifications <ArrowUpRight size={18} /></Link><Link className="outline-button" href="/oem-odm">Explore customization</Link></div>
      </div>
    </main>
    <nav className="product-detail-tabs" aria-label="Product detail sections"><a href="#product-details">Product details</a><a href="#company-proof">Company profile</a><a href="#quick-details">Specifications &amp; FAQ</a><a href="#enquiry">Request a quote</a></nav>
    <section className="product-story-section" id="product-details">
      <div>
        <h2>See how the machine works for your retail format.</h2>
        <p>Each configuration combines the cabinet, interface, payment layout and delivery system around the products you plan to sell.</p>
      </div>
    <ProductFeatureShowcase features={featuredHighlights} productName={product.name} />
    </section>
    {!!product.detailGallery?.length && <section className="product-detail-gallery" aria-label="Product detail images"><h2>Product details</h2><div>{product.detailGallery.map((src, index) => <Image key={src} src={src} alt={productImageAlt(src, `${product.name} detail ${index + 1}`)} width={1800} height={1200} />)}</div></section>}
    <section className="product-factory-section" id="company-proof">
      <div className="product-factory-heading"><h2>{product.companyStrengthTitle || "Factory proof, production and quotation in one view."}</h2><p>{product.companyStrengthDescription || "Review BOHOL’s manufacturing base, workshop, company documents and the information needed for a project quotation."}</p><Link href="/about">Company profile <ArrowUpRight size={17} /></Link></div>
      <CompanyProofShowcase productImage={product.image} factoryGallery={product.factoryGallery} />
    </section>
    <section className="product-quick-details" id="quick-details">
      <div className="product-faq-panel"><h2>Buyer questions</h2>{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        {!!planningResources.length && <div className="product-planning-resources"><h3>Plan the project before quotation</h3><p>Use these buyer resources to prepare site and payment details for a configuration review.</p><div>{planningResources.map((resource) => <Link key={resource.href} href={resource.href}><span>{resource.title}</span><small>{resource.description}</small><ArrowUpRight size={16} /></Link>)}</div></div>}
      </div>
    </section>
    <EnquirySection productName={product.name} />
  </SiteShell>;
}
