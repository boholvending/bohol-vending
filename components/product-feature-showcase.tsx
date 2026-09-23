import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Feature = { title: string; description: string; image: string };
type Proof = { title: string; description: string; image: string; fit?: "contain" | "cover"; action?: boolean };

export function ProductFeatureShowcase({ features, productName }: { features: Feature[]; productName: string }) {
  if (!features.length) return null;

  return <div className="product-feature-showcase">
    {features.map((feature) => <article className="product-feature-item" key={feature.title}>
      <div className="product-feature-copy"><h3>{feature.title}</h3><p>{feature.description}</p></div>
      <div className="product-feature-visual"><Image src={feature.image} alt={`${productName}: ${feature.title}`} width={1600} height={1000} sizes="(max-width:900px) 100vw, 86vw" /></div>
    </article>)}
  </div>;
}

export function CompanyProofShowcase({ productImage }: { productImage: string }) {
  const items: Proof[] = [
    { title: "Factory", description: "20,000 m² manufacturing base in Guangzhou.", image: "/images/bohol-guangzhou-factory.webp", fit: "cover" },
    { title: "Workshop", description: "Assembly, configuration and quality checks under one roof.", image: "/images/partnerships/bohol-production.webp", fit: "cover" },
    { title: "Certificates", description: "Review BOHOL company qualifications and available product documents.", image: "/images/bohol-certification-banner.webp", fit: "contain" },
    { title: "Request a quote", description: "Send product size, market, payment and quantity for a project review.", image: productImage, fit: "contain", action: true },
  ];
  return <div className="company-proof-showcase">
    {items.map((item) => <article className="company-proof-item" key={item.title}>
      <div className="company-proof-copy"><h3>{item.title}</h3><p>{item.description}</p>{item.action && <Link href="#enquiry">Request project review <ArrowUpRight size={17} /></Link>}</div>
      <div className={`company-proof-visual fit-${item.fit || "cover"}`}><Image src={item.image} alt={`BOHOL ${item.title}`} width={1800} height={1000} sizes="(max-width:900px) 100vw, 86vw" /></div>
    </article>)}
  </div>;
}
