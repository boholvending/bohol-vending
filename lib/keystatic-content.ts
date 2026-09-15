import { createReader } from "@keystatic/core/reader";
import config from "@/keystatic.config";
import { products as fallbackProducts } from "@/lib/content";

const reader = createReader(process.cwd(), config);

export type ProductRecord = (typeof fallbackProducts)[number] & {
  specifications?: readonly { readonly key: string; readonly value: string }[];
};

export async function getProducts(): Promise<ProductRecord[]> {
  const records = await reader.collections.products.all();
  if (!records.length) return fallbackProducts;
  return records.map(({ slug, entry }) => ({
    slug,
    name: entry.name,
    category: entry.category,
    summary: entry.summary,
    image: entry.coverImage || "/images/hero/vape-machine.webp",
    specifications: entry.specifications,
    features: entry.specifications.map((item) => `${item.key}: ${item.value}`),
  }));
}

export async function getProduct(slug: string): Promise<ProductRecord | null> {
  const entry = await reader.collections.products.read(slug);
  if (!entry) return fallbackProducts.find((product) => product.slug === slug) || null;
  return {
    slug,
    name: entry.name,
    category: entry.category,
    summary: entry.summary,
    image: entry.coverImage || "/images/hero/vape-machine.webp",
    specifications: entry.specifications,
    features: entry.specifications.map((item) => `${item.key}: ${item.value}`),
  };
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
