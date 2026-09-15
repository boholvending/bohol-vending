import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

export const sanity = sanityConfigured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-01-01",
      useCdn: true,
      perspective: "published",
    })
  : null;

const builder = sanity ? imageUrlBuilder(sanity) : null;

export function sanityImage(source: unknown, width = 1200) {
  if (!builder || !source) return null;
  return builder.image(source).width(width).auto("format").fit("max").url();
}
