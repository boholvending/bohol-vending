"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

type Feature = { title: string; description: string; image: string };
type Proof = { title: string; description: string; image: string; fit?: "contain" | "cover"; action?: boolean };

export function ProductFeatureShowcase({ features, productName }: { features: Feature[]; productName: string }) {
  const [active, setActive] = useState(0);
  const current = features[active] || features[0];
  if (!current) return null;

  return <div className="product-feature-showcase">
    <div className="product-feature-tabs" role="tablist" aria-label={`${productName} highlights`}>
      {features.map((feature, index) => <button key={feature.title} type="button" role="tab" aria-selected={index === active} className={index === active ? "is-active" : ""} onClick={() => setActive(index)}><b>{feature.title}</b><span>{feature.description}</span></button>)}
    </div>
    <div className="product-feature-visual" role="tabpanel">
      <Image src={current.image} alt={`${productName}: ${current.title}`} width={1600} height={1000} sizes="(max-width:900px) 100vw, 86vw" />
    </div>
  </div>;
}

export function CompanyProofShowcase({ productImage }: { productImage: string }) {
  const items: Proof[] = [
    { title: "Factory", description: "20,000 m² manufacturing base in Guangzhou.", image: "/images/bohol-guangzhou-factory.webp", fit: "cover" },
    { title: "Workshop", description: "Assembly, configuration and quality checks under one roof.", image: "/images/partnerships/bohol-production.webp", fit: "cover" },
    { title: "Certificates", description: "Review BOHOL company qualifications and available product documents.", image: "/images/bohol-certification-banner.webp", fit: "contain" },
    { title: "Request a quote", description: "Send product size, market, payment and quantity for a project review.", image: productImage, fit: "contain", action: true },
  ];
  const [active, setActive] = useState(0);
  const current = items[active];

  return <div className="company-proof-showcase">
    <div className="company-proof-tabs" role="tablist" aria-label="BOHOL company proof and quotation">
      {items.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={index === active} className={index === active ? "is-active" : ""} onClick={() => setActive(index)}><b>{item.title}</b><span>{item.description}</span></button>)}
    </div>
    <div className={`company-proof-visual fit-${current.fit || "cover"}`} role="tabpanel">
      <Image src={current.image} alt={`BOHOL ${current.title}`} width={1800} height={1000} sizes="(max-width:900px) 100vw, 86vw" />
      <div><b>{current.title}</b><span>{current.description}</span>{current.action && <Link href="#enquiry">Request project review <ArrowUpRight size={17} /></Link>}</div>
    </div>
  </div>;
}
