import { createReader } from "@keystatic/core/reader";
import config from "@/keystatic.config";
import { products as fallbackProducts } from "@/lib/content";

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
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: readonly string[];
  canonicalUrl?: string | null;
  ogImage?: string | null;
};

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
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    seoKeywords: entry.seoKeywords,
    canonicalUrl: entry.canonicalUrl,
    ogImage: entry.ogImage,
  };
}

export async function getProducts(): Promise<ProductRecord[]> {
  const records = await reader.collections.products.all();
  if (!records.length) return fallbackProducts;
  return records
    .map(({ slug, entry }) => productFromEntry(slug, entry))
    .filter((product): product is ProductRecord => Boolean(product))
    .filter((product) => product.status !== "draft");
}

export async function getProduct(slug: string): Promise<ProductRecord | null> {
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
