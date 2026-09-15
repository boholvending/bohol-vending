import { collection, config, fields } from "@keystatic/core";

export default config({
  storage: { kind: "local" },
  ui: { brand: { name: "BOHOL Content" } },
  collections: {
    products: collection({
      label: "Products",
      slugField: "name",
      path: "content/products/*",
      format: { contentField: "details" },
      schema: {
        name: fields.slug({ name: { label: "Product name", validation: { isRequired: true } } }),
        category: fields.text({ label: "Category", validation: { isRequired: true } }),
        coverImage: fields.image({
          label: "Cover image",
          directory: "public/uploads/products",
          publicPath: "/uploads/products/",
        }),
        summary: fields.text({ label: "Short description", multiline: true, validation: { isRequired: true } }),
        specifications: fields.array(
          fields.object({
            key: fields.text({ label: "Specification", validation: { isRequired: true } }),
            value: fields.text({ label: "Value", validation: { isRequired: true } }),
          }),
          {
            label: "Specifications",
            itemLabel: (props) => props.fields.key.value || "Specification",
          },
        ),
        details: fields.document({
          label: "Detailed content",
          images: {
            directory: "public/uploads/products/details",
            publicPath: "/uploads/products/details/",
          },
        }),
      },
    }),
    news: collection({
      label: "News & Blog",
      slugField: "title",
      path: "content/news/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Article title", validation: { isRequired: true } } }),
        publishedAt: fields.date({ label: "Publication date", validation: { isRequired: true } }),
        coverImage: fields.image({
          label: "Cover image",
          directory: "public/uploads/news",
          publicPath: "/uploads/news/",
        }),
        excerpt: fields.text({ label: "Summary", multiline: true, validation: { isRequired: true } }),
        content: fields.document({
          label: "Article content",
          images: { directory: "public/uploads/news/content", publicPath: "/uploads/news/content/" },
        }),
      },
    }),
  },
});
