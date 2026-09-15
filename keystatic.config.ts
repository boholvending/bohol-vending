import { collection, config, fields } from "@keystatic/core";

const productCategoryOptions = [
  { label: "Food & beverage", value: "food-beverage" },
  { label: "Age-restricted retail", value: "age-restricted" },
  { label: "Beauty retail", value: "beauty-retail" },
  { label: "Collectibles retail", value: "collectibles-retail" },
  { label: "Gentle delivery", value: "gentle-delivery" },
  { label: "Custom OEM / ODM", value: "custom-oem-odm" },
] as const;

const marketOptions = [
  { label: "Global", value: "global" },
  { label: "United States", value: "us" },
  { label: "Canada", value: "canada" },
  { label: "Europe", value: "europe" },
  { label: "United Kingdom", value: "uk" },
  { label: "Australia", value: "australia" },
  { label: "UAE / Middle East", value: "uae-middle-east" },
  { label: "Singapore / Southeast Asia", value: "singapore-sea" },
] as const;

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "AUD", value: "AUD" },
  { label: "CNY", value: "CNY" },
] as const;

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
        status: fields.select({
          label: "Publish status",
          defaultValue: "draft",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
        }),
        category: fields.select({
          label: "Category",
          defaultValue: "food-beverage",
          options: productCategoryOptions,
        }),
        marketRegions: fields.multiselect({
          label: "GEO target markets",
          defaultValue: ["global"],
          options: marketOptions,
          description: "Used for GEO/market targeting, landing-page copy and structured product context.",
        }),
        buyerTypes: fields.multiselect({
          label: "Best for",
          defaultValue: ["operator"],
          options: [
            { label: "Brand owners", value: "brand" },
            { label: "Operators", value: "operator" },
            { label: "Distributors", value: "distributor" },
            { label: "Premium products", value: "premium" },
            { label: "Compact retail", value: "compact" },
            { label: "OEM / ODM projects", value: "oem-odm" },
          ],
        }),
        coverImage: fields.image({
          label: "Cover image",
          directory: "public/uploads/products",
          publicPath: "/uploads/products/",
        }),
        gallery: fields.array(
          fields.image({
            label: "Gallery image",
            directory: "public/uploads/products/gallery",
            publicPath: "/uploads/products/gallery/",
          }),
          {
            label: "Product gallery",
            itemLabel: () => "Gallery image",
          },
        ),
        summary: fields.text({ label: "Short description", multiline: true, validation: { isRequired: true } }),
        priceMode: fields.select({
          label: "Price display",
          defaultValue: "quote",
          options: [
            { label: "Request quote", value: "quote" },
            { label: "Show starting price", value: "starting" },
            { label: "Show fixed price", value: "fixed" },
          ],
        }),
        currency: fields.select({ label: "Currency", defaultValue: "USD", options: currencyOptions }),
        price: fields.number({
          label: "Price",
          step: 0.01,
          description: "Leave empty if pricing is quote-based.",
        }),
        minimumOrderQuantity: fields.integer({
          label: "Minimum order quantity",
          defaultValue: 1,
          validation: { min: 1 },
        }),
        leadTime: fields.text({ label: "Lead time", description: "Example: 25–45 days after deposit" }),
        paymentOptions: fields.multiselect({
          label: "Payment options",
          defaultValue: ["card", "mobile"],
          options: [
            { label: "Card payment", value: "card" },
            { label: "Mobile wallet", value: "mobile" },
            { label: "Cash", value: "cash" },
            { label: "QR payment", value: "qr" },
            { label: "Custom integration", value: "custom" },
          ],
        }),
        productAttributes: fields.array(
          fields.object({
            name: fields.text({ label: "Attribute", validation: { isRequired: true } }),
            value: fields.text({ label: "Value", validation: { isRequired: true } }),
          }),
          {
            label: "Product attributes",
            itemLabel: (props) => props.fields.name.value || "Attribute",
          },
        ),
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
        seoTitle: fields.text({
          label: "SEO title",
          description: "Recommended under 60 characters. If empty, product name is used.",
        }),
        seoDescription: fields.text({
          label: "SEO description",
          multiline: true,
          description: "Recommended 140–160 characters. If empty, short description is used.",
        }),
        seoKeywords: fields.array(fields.text({ label: "Keyword" }), {
          label: "SEO keywords",
          itemLabel: (props) => props.value || "Keyword",
        }),
        canonicalUrl: fields.url({
          label: "Canonical URL",
          description: "Optional. Leave empty to use the normal product page URL.",
        }),
        ogImage: fields.image({
          label: "Social share image",
          directory: "public/uploads/products/seo",
          publicPath: "/uploads/products/seo/",
        }),
        details: fields.document({
          label: "Product detail page content",
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
