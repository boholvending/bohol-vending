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
      label: "产品管理",
      slugField: "name",
      path: "content/products/*",
      format: { contentField: "details" },
      schema: {
        name: fields.slug({ name: { label: "产品名称（网站显示英文）", validation: { isRequired: true } } }),
        status: fields.select({
          label: "发布状态",
          defaultValue: "draft",
          options: [
            { label: "草稿", value: "draft" },
            { label: "已发布", value: "published" },
          ],
        }),
        category: fields.select({
          label: "产品分类",
          defaultValue: "food-beverage",
          options: productCategoryOptions,
        }),
        marketRegions: fields.multiselect({
          label: "GEO 目标市场",
          defaultValue: ["global"],
          options: marketOptions,
          description: "Used for GEO/market targeting, landing-page copy and structured product context.",
        }),
        buyerTypes: fields.multiselect({
          label: "适用客户类型",
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
          label: "封面图片",
          directory: "public/uploads/products",
          publicPath: "/uploads/products/",
        }),
        gallery: fields.array(
          fields.image({
            label: "图库图片",
            directory: "public/uploads/products/gallery",
            publicPath: "/uploads/products/gallery/",
          }),
          {
          label: "产品图库",
            itemLabel: () => "Gallery image",
          },
        ),
        summary: fields.text({ label: "简短描述（网站显示英文）", multiline: true, validation: { isRequired: true } }),
        priceMode: fields.select({
          label: "价格显示方式",
          defaultValue: "quote",
          options: [
            { label: "询价", value: "quote" },
            { label: "显示起始价格", value: "starting" },
            { label: "显示固定价格", value: "fixed" },
          ],
        }),
        currency: fields.select({ label: "货币", defaultValue: "USD", options: currencyOptions }),
        price: fields.number({
          label: "价格",
          step: 0.01,
          description: "Leave empty if pricing is quote-based.",
        }),
        minimumOrderQuantity: fields.integer({
          label: "最小起订量",
          defaultValue: 1,
          validation: { min: 1 },
        }),
        leadTime: fields.text({ label: "交货周期", description: "示例：定金后 25–45 天" }),
        paymentOptions: fields.multiselect({
          label: "支付方式",
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
            name: fields.text({ label: "属性名称", validation: { isRequired: true } }),
            value: fields.text({ label: "属性值", validation: { isRequired: true } }),
          }),
          {
            label: "产品属性",
            itemLabel: (props) => props.fields.name.value || "Attribute",
          },
        ),
        highlights: fields.array(
          fields.object({
            title: fields.text({ label: "卖点标题（英文）", validation: { isRequired: true } }),
            description: fields.text({ label: "卖点说明（英文）", multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: "产品核心卖点",
            itemLabel: (props) => props.fields.title.value || "Highlight",
          },
        ),
        applications: fields.array(
          fields.object({
            title: fields.text({ label: "应用场景标题（英文）", validation: { isRequired: true } }),
            description: fields.text({ label: "场景说明（英文）", multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: "应用场景",
            itemLabel: (props) => props.fields.title.value || "Application",
          },
        ),
        specifications: fields.array(
          fields.object({
            key: fields.text({ label: "规格名称", validation: { isRequired: true } }),
            value: fields.text({ label: "规格值", validation: { isRequired: true } }),
          }),
          {
            label: "技术规格",
            itemLabel: (props) => props.fields.key.value || "Specification",
          },
        ),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: "常见问题（英文）", validation: { isRequired: true } }),
            answer: fields.text({ label: "问题答案（英文）", multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: "产品常见问题 FAQ",
            itemLabel: (props) => props.fields.question.value || "FAQ",
          },
        ),
        downloads: fields.array(
          fields.object({
            label: fields.text({ label: "Download label", validation: { isRequired: true } }),
            url: fields.url({ label: "File or page URL", validation: { isRequired: true } }),
          }),
          {
            label: "Downloads / external links",
            itemLabel: (props) => props.fields.label.value || "Download",
          },
        ),
        seoTitle: fields.text({
          label: "SEO 标题（英文）",
          description: "Recommended under 60 characters. If empty, product name is used.",
        }),
        seoDescription: fields.text({
          label: "SEO 描述（英文）",
          multiline: true,
          description: "Recommended 140–160 characters. If empty, short description is used.",
        }),
        seoKeywords: fields.array(fields.text({ label: "Keyword" }), {
          label: "SEO 关键词（英文）",
          itemLabel: (props) => props.value || "Keyword",
        }),
        canonicalUrl: fields.url({
          label: "规范链接 Canonical",
          description: "Optional. Leave empty to use the normal product page URL.",
        }),
        ogImage: fields.image({
          label: "社交分享图片",
          directory: "public/uploads/products/seo",
          publicPath: "/uploads/products/seo/",
        }),
        details: fields.document({
          label: "产品详情页内容（英文，可插入图片/代码）",
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
