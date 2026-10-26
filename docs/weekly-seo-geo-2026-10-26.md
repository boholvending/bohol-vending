# BOHOL weekly SEO/GEO review — 2026-10-26

## Measurement window and limits

- Google Search Console: 2026-10-17 to 2026-10-23 versus 2026-10-10 to 2026-10-16.
- Umami: most recent 7 days compared with its immediately preceding period.
- Search Console data is small. No keyword is close enough to support a top-five claim, and the report does not expose statistically useful positions for every listed commercial term.
- Umami's shared report excludes the configured admin/editor paths, but traffic remains small and may still include owner tests or automated visits. No conversion rate is calculated.

## Week-over-week evidence

| Metric | Latest 7 days | Previous 7 days | Change |
| --- | ---: | ---: | ---: |
| Google clicks | 2 | 3 | -1 (-33%) |
| Google impressions | 109 | 63 | +46 (+73%) |
| Google CTR | 1.8% | 4.8% | -3.0 percentage points |
| Google average position | 45.2 | 48.5 | improved 3.3 positions |
| Umami visitors | 29 | 35 | -6 (-17%) |
| Umami visits | 31 | 52 | -21 (-40%) |
| Umami pageviews | 48 | 125 | -77 (-61%) |
| Umami bounce rate | 81% | about 58% | increased about 23 points |
| Umami average duration | 35s | about 3m | down about 2m25s |

Visible Umami paths were `/` (16 visitors), `/about` (7), `/vending-machines` (2), and one visitor each on the railway-station, electrical-specification and refund guides, `/oem-odm`, `/projects`, `/vending`, and the card-vending product page. Visible referrers were Google and Facebook with one visitor each. Countries were US 16, Singapore 4, Hong Kong 2, China 2, Malaysia 2, Spain 1, France 1 and Australia 1. Devices were evenly split between laptop and mobile at 14 each, plus one desktop visitor. The event view showed two `Contact WhatsApp click` events from one unique visitor; it did not show a confirmed quotation-form submission.

## Keyword-to-page map and top-five gap

| Intent cluster | Current landing page | Evidence this week | Position tier / gap |
| --- | --- | --- | --- |
| Condominium/apartment vending | `/insights/apartment-building-vending-machine-buyer-guide` | `vending machine for condominiums`: 11 impressions, 0 clicks, up from 3 | Emerging visibility; average position not exposed per query, so top-five gap cannot be quantified |
| Vending-machine dimensions | `/vending-machines` plus capacity/electrical guides | `vending machine size`: 6; `vending machines dimensions`: 2; 0 clicks | Content/intent mapping needs consolidation; no top-five evidence |
| USA vending procurement | `/insights/vending-machine-for-usa-market-buying-guide` | `vending in usa`: 5 impressions, 0 clicks, up from 1 | Emerging visibility; not near a verified top-five tier |
| Custom vending | `/oem-odm`, `/vending-machines`, RFQ guide | plural 2 + singular 1 impressions, 0 clicks | Low-volume discovery; avoid another synonym article |
| Supplier/manufacturer evaluation | manufacturer-selection guide and supplier-audit guide | one long-tail India supplier query | Relevant coverage exists; regional page is not justified from one impression |
| Core head terms and China supplier terms | `/`, `/vending`, `/vending-machines`, `/manufacturing`, `/oem-odm` | no meaningful visible query rows for most tracked head terms | Outside top visible query set; far from a verifiable top-five result |

The long-term top-five target remains valid, but the current evidence shows discovery-stage visibility rather than page-one competition. The immediate objective is to turn growing impressions into stable clicks and indexed commercial clusters before measuring a top-five gap.

## Implemented locally this week

1. Changed the apartment guide SEO title to `Vending Machines for Condominiums & Apartments` and rewrote its description around the observed condominium query. The canonical URL remains unchanged to preserve the already indexed page.
2. Shortened `/vending` to `Vending Machines for Global Retail | BOHOL` and tightened the description. This separates the hub intent from the homepage manufacturer intent and avoids the former overlong title.
3. Prepared two distinct high-intent articles: supplier audit and production traceability, with approved BOHOL images, official sources, internal links, FAQ and Article/FAQ data. They passed local production build and page checks but are not deployed because GitHub authentication expired.
4. Kept the keyword cluster consolidated: no new pages were created for `vending machine size`, `custom vending machine` synonyms or an India supplier page because the evidence is too small and would risk cannibalization.

## Official technology review

- Google Search Central states that normal SEO fundamentals remain sufficient for AI Overviews and AI Mode; pages must be indexed and snippet-eligible, and visible text, internal links, media and structured data should agree. It also clarifies that `llms.txt` is not needed for Google Search.
- Google removed FAQ rich results in May 2026. BOHOL may keep truthful FAQ content and `FAQPage` semantics for users and machine understanding, but must not report them as an available Google rich-result benefit.
- Schema.org 30.1 added Digital Product Passport and new commerce vocabulary. BOHOL should not add DPP, certification, offer, price or importer fields until supported by verified product and commercial data.
- W3C confirms that mobile accessibility is covered by WCAG rather than a separate mobile standard. The 14 mobile visitors this week reinforce maintaining touch-target, text, form and horizontal-overflow checks at 390px.
- Bing's new AI Performance Topics Portfolio is beta and its classifications are directional. Connect Bing Webmaster Tools only when account access is available; do not treat topic estimates as a ranking ledger.

## Next-week priorities

1. Restore GitHub authentication, push the verified local commits, wait for deployment, and verify production HTML, images, sitemap and canonical output before any indexing request.
2. Inspect the two newly deployed URLs plus the Oct 24–25 queue in Search Console; request indexing only with user-authorized submission and never equate submission with indexing.
3. Build one dimensions/specification hub or improve an existing page after mapping all size-related pages, rather than creating another overlapping article.
4. Improve the `/vending-machines` and apartment-guide snippets if impressions continue growing without clicks for another full reporting window.
5. Add verified company/entity proof and customer cases only after the user supplies real factory credentials, export markets, machine specifications, deployment photographs, customer permission and measurable project outcomes.

## Evidence requested from the user

- Approved factory name, address, founding year, production scale and verifiable certificates.
- Real product model dimensions, capacity ranges, voltage/cooling options and test records.
- Two or more customer deployments with country, application, machine configuration, date, photographs, customer permission and measurable outcome.
- Confirmed payment providers/markets and the exact boundary between BOHOL, acquirer and operator support.
