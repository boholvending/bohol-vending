import { createReader } from "@keystatic/core/reader";
import config from "@/keystatic.config";
import { products as fallbackProducts } from "@/lib/content";
import { sanity, sanityConfigured, sanityImage } from "@/lib/sanity";
import type { PortableTextBlock } from "next-sanity";

const reader = createReader(process.cwd(), config);

export type ProductRecord = (typeof fallbackProducts)[number] & {
  specifications?: readonly { readonly key: string; readonly value: string }[];
  status?: string;
  marketRegions?: readonly string[];
  buyerTypes?: readonly string[];
  gallery?: readonly string[];
  priceMode?: string;
  currency?: string;
  price?: number | null;
  minimumOrderQuantity?: number | null;
  leadTime?: string | null;
  paymentOptions?: readonly string[];
  productAttributes?: readonly { readonly name: string; readonly value: string }[];
  highlights?: readonly { readonly title: string; readonly description: string }[];
  applications?: readonly { readonly title: string; readonly description: string }[];
  faq?: readonly { readonly question: string; readonly answer: string }[];
  downloads?: readonly { readonly label: string; readonly url: string | null }[];
  portableText?: readonly PortableTextBlock[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: readonly string[];
  canonicalUrl?: string | null;
  ogImage?: string | null;
};

type SanityProduct = {
  slug: string;
  name: string;
  category?: string;
  summary?: string;
  image?: unknown;
  gallery?: unknown[];
  features?: string[];
  status?: string;
  marketRegions?: string[];
  buyerTypes?: string[];
  priceMode?: string;
  currency?: string;
  price?: number;
  minimumOrderQuantity?: number;
  leadTime?: string;
  paymentOptions?: string[];
  productAttributes?: { name: string; value: string }[];
  specifications?: { key: string; value: string }[];
  highlights?: { title: string; description: string }[];
  applications?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: unknown;
  portableText?: PortableTextBlock[];
};

const sanityProductProjection = `{
  "slug": slug.current,
  name,
  category,
  summary,
  "image": heroImage,
  gallery,
  features,
  status,
  "marketRegions": geoMarkets,
  buyerTypes,
  priceMode,
  currency,
  price,
  minimumOrderQuantity,
  leadTime,
  paymentOptions,
  "productAttributes": attributes,
  specifications,
  highlights,
  applications,
  faq,
  seoTitle,
  seoDescription,
  seoKeywords,
  canonicalUrl,
  ogImage,
  "portableText": body
}`;

const categoryLabels: Record<string, string> = {
  "food-beverage": "Food & beverage",
  "age-restricted": "Age-restricted retail",
  "beauty-retail": "Beauty retail",
  "collectibles-retail": "Collectibles retail",
  "gentle-delivery": "Gentle delivery",
  "custom-oem-odm": "Custom OEM / ODM",
};

function categoryLabel(category: string) {
  return categoryLabels[category] || category;
}

function productFromEntry(slug: string, entry: Awaited<ReturnType<typeof reader.collections.products.read>>): ProductRecord | null {
  if (!entry) return null;
  const specifications = entry.specifications || [];
  const attributes = entry.productAttributes || [];
  return {
    slug,
    name: entry.name,
    category: categoryLabel(entry.category),
    summary: entry.summary,
    image: entry.coverImage || "/images/hero/vape-machine.webp",
    features: [...attributes.map((item) => `${item.name}: ${item.value}`), ...specifications.map((item) => `${item.key}: ${item.value}`)],
    status: entry.status,
    marketRegions: entry.marketRegions,
    buyerTypes: entry.buyerTypes,
    gallery: (entry.gallery || []).filter((image): image is string => Boolean(image)),
    specifications,
    priceMode: entry.priceMode,
    currency: entry.currency,
    price: entry.price,
    minimumOrderQuantity: entry.minimumOrderQuantity,
    leadTime: entry.leadTime,
    paymentOptions: entry.paymentOptions,
    productAttributes: attributes,
    highlights: entry.highlights,
    applications: entry.applications,
    faq: entry.faq,
    downloads: entry.downloads,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    seoKeywords: entry.seoKeywords,
    canonicalUrl: entry.canonicalUrl,
    ogImage: entry.ogImage,
  };
}

function productFromSanity(entry: SanityProduct): ProductRecord {
  const image = sanityImage(entry.image, 1200) || "/images/hero/vape-machine.webp";
  const gallery = (entry.gallery || []).map((item) => sanityImage(item, 1200)).filter((item): item is string => Boolean(item));
  const attributes = entry.productAttributes || [];
  const specifications = entry.specifications || [];
  return {
    slug: entry.slug,
    name: entry.name,
    category: entry.category || "Custom vending machine",
    summary: entry.summary || "",
    image,
    features: [...(entry.features || []), ...attributes.map((item) => `${item.name}: ${item.value}`), ...specifications.map((item) => `${item.key}: ${item.value}`)],
    status: entry.status,
    marketRegions: entry.marketRegions,
    buyerTypes: entry.buyerTypes,
    gallery,
    specifications,
    priceMode: entry.priceMode,
    currency: entry.currency,
    price: entry.price,
    minimumOrderQuantity: entry.minimumOrderQuantity,
    leadTime: entry.leadTime,
    paymentOptions: entry.paymentOptions,
    productAttributes: attributes,
    highlights: entry.highlights,
    applications: entry.applications,
    faq: entry.faq,
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    seoKeywords: entry.seoKeywords,
    canonicalUrl: entry.canonicalUrl,
    ogImage: sanityImage(entry.ogImage, 1200),
    portableText: entry.portableText,
  };
}

export async function getProducts(): Promise<ProductRecord[]> {
  if (sanityConfigured && sanity) {
    const records = await sanity.fetch<SanityProduct[]>(`*[_type == "product" && status == "published"] | order(name asc) ${sanityProductProjection}`);
    if (records.length) return records.map(productFromSanity);
  }
  const records = await reader.collections.products.all();
  if (!records.length) return fallbackProducts;
  return records
    .map(({ slug, entry }) => productFromEntry(slug, entry))
    .filter((product): product is ProductRecord => Boolean(product))
    .filter((product) => product.status !== "draft");
}

export async function getProduct(slug: string): Promise<ProductRecord | null> {
  if (sanityConfigured && sanity) {
    const entry = await sanity.fetch<SanityProduct | null>(`*[_type == "product" && slug.current == $slug][0] ${sanityProductProjection}`, { slug });
    if (entry) return productFromSanity(entry);
  }
  const entry = await reader.collections.products.read(slug);
  if (!entry) return fallbackProducts.find((product) => product.slug === slug) || null;
  return productFromEntry(slug, entry);
}

export async function getProductDocument(slug: string) {
  const entry = await reader.collections.products.read(slug);
  return entry ? entry.details() : null;
}

export async function getNews() {
  const records = await reader.collections.news.all();
  return records
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getNewsArticle(slug: string) {
  return reader.collections.news.read(slug);
}
