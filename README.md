# BOHOL Vending website

An international B2B factory website starter built with Next.js 16, TypeScript, Tailwind CSS and App Router. It is static-first, uses a small client component only for the Hero carousel, and is structured for Sanity CMS.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` before deployment.

## Content and image replacement

- Homepage copy and navigation: `app/page.tsx`
- Product fallback data: `lib/content.ts`
- Hero carousel: `components/hero-carousel.tsx` (current implementation)
- Hero images: `public/images/hero/`
- Shared fonts, colors, spacing and responsive design: `app/globals.css`
- Site URL: set `NEXT_PUBLIC_SITE_URL` in `.env.local`

Hero assets are WebP and rendered with `next/image`. For replacements, use portrait product cutouts around 1024×1536, preferably WebP or AVIF, with the whole machine visible. Keep the same filenames for instant replacement, or update `components/hero-slider.tsx`. Non-critical images should omit `priority` so Next.js lazy-loads them.

## Current editing and preview notes

Section content: `lib/section-details.ts`; bilingual articles and application concepts: `lib/stories.ts`. Navigation: `components/main-navigation.tsx`. Current slides are transparent PNG assets referenced in `components/hero-carousel.tsx`; original-cutout experiments are not approved replacements.

Development uses `.next-preview`, production uses `.next`, preventing build conflicts. Restart preview after configuration changes. Old tabs may require a hard refresh to discard previous long-lived cache headers.

Set `NEXT_PUBLIC_CONTACT_EMAIL` before building to enable email drafts. Visitors must send the draft themselves. Without it, the form only downloads a local project brief: nothing is transmitted. CRM/server email delivery is not connected.

Case pages are application concepts, not verified customer deliveries. Sanity is scaffolding, not a connected publishing backend.

## Sanity CMS connection

The project runs without Sanity. The prepared client is in `lib/sanity.ts`; schemas for products, Hero slides and articles/cases are in `sanity/schemaTypes/`.

1. Create a Sanity project and dataset.
2. Add the schema files to a Sanity Studio (a separate `/studio` workspace is recommended).
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
4. Query the prepared document types with `sanity.fetch()` in server components. Use `next: { revalidate: 3600 }` for cached updates or a Sanity webhook with `revalidateTag` for immediate publishing.
5. Keep the fallback objects in `lib/content.ts` during migration, then replace them after content is populated.

Suggested additional document types: `siteSettings`, `solution`, `factorySection`, `faq`, `author`. Article documents support both `insight` and `case` types.

## SEO and GEO

- Global and dynamic metadata, canonical URLs, Open Graph and X metadata
- `robots.ts` and generated `sitemap.ts`
- Organization, Product and Breadcrumb JSON-LD
- Entity-oriented URLs and internal links between manufacturer, solutions, machines and cases
- Product metadata and social images generated per product

Before launch, replace the placeholder domain `www.boholvending.com` everywhere or use the intended production value, add verified address/contact/social profiles to Organization JSON-LD, and add factual certifications only after verification. For GEO, publish detailed case studies, machine specification tables, author-reviewed technical articles and concise FAQs with direct answers.

## Performance approach

The design targets a very fast perceived first load, but no fixed 0.3–1 second result can be guaranteed across devices and networks. The implementation is static-first, ships minimal browser JavaScript, preloads only the first Hero image, uses responsive images and optimized fonts, and defines long-lived immutable caching for versioned assets.

Measure production Core Web Vitals after real content is installed. Keep the homepage Hero WebP under roughly 250 KB when practical, avoid third-party chat widgets above the fold, and delay analytics until consent/idle time.

## Ubuntu 22.04 + Nginx + Cloudflare

Install Node.js 22 LTS, clone/upload the project, then:

```bash
npm ci
npm run build
PORT=3000 npm run start
```

Run the process with systemd or PM2. In Nginx, reverse proxy the domain to `http://127.0.0.1:3000`, enable HTTP/2 or HTTP/3 at the CDN edge, forward `Host` and `X-Forwarded-Proto`, and set a reasonable proxy timeout. Use Certbot in Full (strict) mode or a Cloudflare Origin Certificate.

Cloudflare recommendations:

- SSL/TLS: Full (strict)
- Brotli: on; HTTP/2 and HTTP/3: on
- Respect Next.js caching for hashed `/_next/static/*`. Images use one-hour revalidation; do not force year-long caching on unversioned images or local preview.
- Do not cache POST requests or future Sanity webhook/API routes
- Enable Early Hints after production testing
- Avoid HTML “Cache Everything” until on-demand revalidation rules are defined

## Launch checklist

- Replace demo copy, business metrics and generated product renders with approved facts/assets
- Add legal pages and privacy/cookie consent appropriate to target markets
- Connect the quote form to the chosen CRM or email service
- Configure Sanity CORS for the production and preview domains
- Verify sitemap and structured data in Google Search Console
- Run Lighthouse/WebPageTest from primary target markets
