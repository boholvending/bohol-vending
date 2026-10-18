<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## BOHOL image publishing

Use WebP for raster content images. CMS saves convert uploaded raster images automatically; run `npm run images:webp` after file-based imports (also enforced by `prebuild`). Keep original files for existing URLs. Do not alter product structure, logos or features. SVG and browser icon assets are exempt. Verify image references and decoding before publishing.

Every newly imported website raster must also use a descriptive English lowercase-hyphenated filename based on the page's primary product/entity keyword and the image's truthful role. Never publish working names such as `ChatGPT image`, `untitled`, dates, UUIDs or Chinese source filenames. Preserve files in the user's source archive and rename only the website copy. Keep names concise, avoid keyword stuffing and unsupported geographic/feature claims, synchronize natural alt text and CMS references, and retain old published files when changing an existing URL would otherwise create a 404. Follow the local `bohol-image-seo` skill.
