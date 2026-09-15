import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Homepage hero slides",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "kicker", title: "Small line", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "product", title: "Related product", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "image", title: "Slide image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string" }] }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
    defineField({ name: "ctaUrl", title: "Button URL", type: "string" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "title", subtitle: "kicker", media: "image" },
  },
});
