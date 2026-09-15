import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "News / Insights / Cases",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "type", title: "Content type", type: "string", group: "content", initialValue: "insight", options: { list: [{ title: "Insight / News", value: "insight" }, { title: "Case", value: "case" }] } }),
    defineField({ name: "status", title: "Publish status", type: "string", group: "content", initialValue: "draft", options: { list: [{ title: "Draft", value: "draft" }, { title: "Published", value: "published" }] } }),
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Summary", type: "text", rows: 3, group: "content" }),
    defineField({ name: "coverImage", title: "Cover image", type: "image", group: "content", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string" }] }),
    defineField({ name: "publishedAt", title: "Publication date", type: "datetime", group: "content" }),
    defineField({ name: "body", title: "Article content", type: "array", group: "content", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }, { type: "code" }] }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3, group: "seo" }),
    defineField({ name: "seoKeywords", title: "SEO keywords", type: "array", group: "seo", of: [{ type: "string" }] }),
  ],
  preview: {
    select: { title: "title", subtitle: "type", media: "coverImage" },
  },
});
