# About company profile
Mode: Persuade. Overseas buyers inspect factory capabilities and enquire.
## Direction contract
THESIS: Company and production photography anchors the company profile.
OWN-WORLD: Preserve BOHOL monochrome/cyan identity and established typefaces.
STORY: Company, workshop, credentials, exhibitions, payments, enquiry in the user-requested order.
FIRST VIEWPORT: Large left-aligned headline with factory photo at right, enquiry CTA, and section navigation.
FORM: User-prescribed sequence implemented in existing design system. Signature behavior: expandable photographic galleries and full-size image links.
FINISH: Build, bounded desktop/mobile visual verification and independent review. Production uses three user-provided collages; the exhibition gallery contains one photo.
## Media provenance
Factory exterior, certificates, office, workshop and exhibition photos reused from existing user-provided site assets. Payment SVGs are text-only platform nameplates, not official logo artwork; support qualified by market and terminal. Add approved photos and brands in lib/company-media.ts.

## Production section update — 2026-09-15
The former workshop gallery/process block is replaced by three alternating image/text rows covering design and production, manufacturing and shipping, and team/customization. Overseas-buyer English copy explains each stage, followed by a project enquiry CTA. Original image proportions are preserved, and each collage links to its full-size file. The established BOHOL design identity is unchanged.

The three collages were supplied by the user as clipboard PNGs on 2026-09-15 and copied to `public/images/partnerships/bohol-design-production.png`, `public/images/partnerships/bohol-manufacturing-shipping.png`, and `public/images/partnerships/bohol-team-customization.png`. Original clipboard filenames were unavailable to this reviewer; this records the implementation owner's provenance, not an independent origin check.

## Independent source review — 2026-09-15
Source disposition: no material production-section issue found. All five requested content sections remain present. Production now contains three collages; the exhibition gallery still contains one photo. Payment artwork remains typographic nameplates rather than official logos.

The implementation inherits the display font, square geometry, cyan accent, restrained motion and visible focus treatment. Production rows use shrinkable grid columns, collapse to one column at 800px, restore image-first ordering on mobile, and stack the enquiry CTA. Static image imports reserve intrinsic dimensions. Exhibition gallery columns collapse for small screens and reduced-motion preferences disable zoom. Images link to their source files, and galleries exceeding six items expose an expansion control. The About layout uses a 1600px outer container (with inset content), a local variation from DESIGN.md's 1480px maximum.

This review inspected source only and makes no visual approval claim or claim of mobile browser testing. The implementation owner reported a passing build and detector, three successfully loaded collage images, no desktop overflow, and a clean first-row desktop screenshot. The numerical company claims also occur in the existing Chinese About route; this establishes reuse, not independent factual verification. The existing partnerships/SOURCES.md only documents older stock WebP assets and does not independently establish the origin of the BOHOL PNGs.
