export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://boholvending.com";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "BOHOL",
  url: siteUrl,
  logo: `${siteUrl}/images/brand/bohol-logo.webp`,
  description: "Source-direct intelligent vending machine manufacturer based in Panyu, Guangzhou, Guangdong, China.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Panyu, Guangzhou",
    addressRegion: "Guangdong",
    addressCountry: "CN",
  },
  knowsAbout: ["Intelligent vending machines", "OEM manufacturing", "ODM manufacturing", "Automated retail"],
};

export function productJsonLd(product: { slug: string; name: string; summary: string; image: string; category: string }) {
  const image = product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}/vending-machines/${product.slug}#product`,
    name: product.name,
    description: product.summary,
    image: [image],
    category: product.category,
    url: `${siteUrl}/vending-machines/${product.slug}`,
    brand: { "@type": "Brand", name: "BOHOL" },
    manufacturer: { "@id": `${siteUrl}/#organization` },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
