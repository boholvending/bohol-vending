import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { BreadcrumbJson, SiteShell } from "@/components/site-shell";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Vending | Custom Vending Machines and Smart Vending Solutions",
  description:
    "BOHOL builds custom vending machines, smart vending systems and OEM vending solutions for drinks, beauty, vape, cards, fragile goods and global retail projects.",
  keywords: [
    "vending",
    "vending machine",
    "custom vending",
    "smart vending",
    "vending solutions",
    "vending machine manufacturer",
    "OEM vending machine",
    "vending machine factory",
  ],
  alternates: { canonical: "/vending" },
  openGraph: {
    title: "Vending | BOHOL Custom Vending Machines",
    description:
      "Custom vending machines and smart vending solutions manufactured by BOHOL for global retail deployment.",
    images: ["/og.webp"],
  },
};

const vendingJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Vending",
  url: `${siteUrl}/vending`,
  description:
    "BOHOL custom vending machines, smart vending systems and OEM vending solutions for global retail projects.",
  about: [
    "vending",
    "vending machine",
    "custom vending",
    "smart vending",
    "vending machine manufacturer",
  ],
  isPartOf: { "@id": `${siteUrl}/#website` },
  publisher: { "@id": `${siteUrl}/#organization` },
};

const vendingTypes = [
  ["Cold drink vending", "Refrigerated vending machines for drinks, snacks and commercial indoor locations."],
  ["Vape vending", "Age-verification-ready vending for regulated retail and specialty products."],
  ["Card vending", "Compact vending systems for trading cards, blind boxes and collectible products."],
  ["Beauty vending", "Premium vending cabinets for eyelashes, cosmetics and compact beauty retail."],
  ["Elevator vending", "Gentle vending delivery for fragile, premium or irregular products."],
  ["Custom vending", "OEM and ODM vending machines built around product size, payment and brand requirements."],
];

const buyerSignals = [
  "Factory-direct vending machine engineering",
  "Custom cabinet, channel and touchscreen configuration",
  "Cashless payment and remote vending operation support",
  "Global voltage, language and deployment preparation",
  "Prototype, production and quality inspection workflow",
  "Vending machine support for distributors, brands and operators",
];

export default function VendingPage() {
  return (
    <SiteShell>
      <JsonLd data={vendingJsonLd} />
      <BreadcrumbJson
        items={[
          { name: "Home", url: siteUrl },
          { name: "Vending", url: `${siteUrl}/vending` },
        ]}
      />
      <main className="inner-page">
        <p className="section-tag">VENDING</p>
        <h1>
          Vending machines
          <br />
          built for business.
        </h1>
        <p className="inner-lead">
          BOHOL manufactures custom vending machines and smart vending solutions
          for global operators, distributors and product brands. From vending
          cabinet design to payment, product channels and rollout support, each
          project is configured around what you sell.
        </p>
        <div className="capability-grid">
          {vendingTypes.map(([title, body]) => (
            <article key={title}>
              <span>VENDING</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <section className="product-data-section">
          <h2>Why buyers choose BOHOL vending</h2>
          <div>
            {buyerSignals.map((signal) => (
              <article key={signal}>
                <span>
                  <CheckCircle2 size={16} /> Vending capability
                </span>
                <b>{signal}</b>
              </article>
            ))}
          </div>
        </section>
        <section className="product-rich-shell">
          <div>
            <h2>Start a vending project</h2>
            <p>
              Share your product category, target country, payment needs and
              estimated quantity. BOHOL will recommend a vending machine format
              and customization path.
            </p>
          </div>
          <article className="product-empty-content">
            <h3>Explore BOHOL vending machines</h3>
            <p>
              Compare standard vending categories or request a custom vending
              machine plan for your brand, distributor network or retail site.
            </p>
            <div className="product-actions">
              <Link className="primary-button" href="/vending-machines">
                View vending machines <ArrowUpRight size={18} />
              </Link>
              <Link className="outline-button" href="/contact">
                Request vending quote
              </Link>
            </div>
          </article>
        </section>
      </main>
    </SiteShell>
  );
}
