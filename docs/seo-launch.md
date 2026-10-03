# boring qrs SEO implementation and launch

## Implementation

The homepage is a server-rendered Next.js page with the existing generator isolated in a client component. Public content, links, FAQs and structured data are present in the generated HTML. The original gradient, examples, upload controls and PNG workflow are retained. The shared header no longer introduces an extra H1 on every page.

All public pages have distinct titles/descriptions, self-referencing canonical URLs and social metadata. The shared 1200×630 social PNG is a local asset, with its editable SVG source alongside it. Existing Google and Bing verification values are preserved. NEXT_PUBLIC_SITE_URL defaults to https://boring-qrs.vercel.app and drives canonicals, sitemap, robots, schema and llms.txt. Use the stable production origin, not each preview hostname.

Visible FAQ answers match FAQPage schema. The homepage describes the free web application; guides carry Article and breadcrumb data with an explicit editorial date. Creator attribution uses Harsh Jain's portfolio and LinkedIn, matching Daylo and Dosia. No ratings, usage counts, testimonials or search volumes are invented. llms.txt is supplementary discovery text, not an AI-search registration requirement.

The shared footer links to Daylo, Dosia, Fryly and Portify, plus the creator portfolio and LinkedIn. These are useful, ordinary crawlable links; no ranking gain is assumed.

## Search intent map and indexing URLs

These are editorial targets, not measured keyword volumes.

| Path | Intent |
| --- | --- |
| / | Free photo / artistic QR code generator |
| /qr-code-with-image | Blend an existing photo into a QR pattern |
| /portrait-qr-code | Face and portrait QR designs |
| /landscape-qr-code | Scenic and landscape QR designs |
| /qr-code-for-business-cards | Practical business-card layout and proofing |
| /guides | Guide discovery |
| /how-to-make-a-photo-qr-code | Step-by-step creation workflow |
| /why-artistic-qr-codes-do-not-scan | Scan troubleshooting |
| /ai-qr-code-vs-photo-qr-code | Explain photo blending vs generative AI art |
| /qr-print-size-calculator | Working pixels / DPI / print-dimension calculator |
| /about | Product, mechanism and creator |
| /privacy | Local processing and external-photo requests |

Overlapping image / photo / picture keywords are consolidated rather than split into near-identical pages. The app does not generate images from prompts, offer editable QR destinations, host uploaded photos, or report scan analytics. Copy makes those limits clear. High error correction is not a guarantee of scan success.

## Verify locally

Run npm ci, npm run build, npm run type-check, npm run lint and npm run check:seo. The SEO script inspects all generated public HTML for unique metadata, production canonicals, one H1, indexability, JSON-LD validity, crawlable internal links and every related-product footer link. It also checks sitemap, robots and llms.txt. Run npm run start for the production preview; check desktop and narrow layouts, a guide, the calculator, social image, and a missing URL. The calculator uses pixels / DPI = inches, then inches × 2.54 = cm; it does not certify scan size.

Plus Jakarta Sans is bundled in public/fonts with its SIL Open Font License and loaded with next/font/local. The font is preloaded and served locally; builds do not fetch Google Fonts.

## Launch and weekly workflow

1. Deploy the reviewed code through the existing hosting workflow. Verify HTTP 200 for the public pages, correct production canonicals, valid social image and HTTP 404 for unknown paths. Check uploaded-photo generation and PNG download on a real phone. Print and scan a proof before using any artistic code commercially.
2. In the existing Google Search Console URL-prefix property for https://boring-qrs.vercel.app/, verify ownership and submit https://boring-qrs.vercel.app/sitemap.xml. Prioritize manual URL Inspection for /, /qr-code-with-image, /portrait-qr-code and /how-to-make-a-photo-qr-code. Submit the sitemap to Bing Webmaster Tools too. Existing tokens are preserved, but account ownership has not been independently confirmed.
3. Review Page indexing, selected canonicals, impressions, queries, clicks and CTR weekly. With actual query data, improve a relevant existing page before expanding. Record a baseline and each meaningful edit; observe for several weeks rather than assuming immediate ranking improvements.
4. Share a real demo and helpful guide through the creator's existing channels or relevant communities where welcome. No external accounts, posts or messages are created by this code change. Reciprocal links were added only to this project.
5. If a custom domain is selected later, configure hosting and redirects first, then update NEXT_PUBLIC_SITE_URL and verify the new Search Console property. Do not point metadata to an unconfigured domain.

Google AI Overviews and AI Mode use the same crawlability and indexed-content foundations; no separate registration or special AI schema is needed. Structured data must match visible content. FAQ markup, social cards and llms.txt do not guarantee rich results, indexing or AI inclusion. Source: https://developers.google.com/search/docs/appearance/ai-features

Production deployment, Search Console submission, real-phone scanning and deployed performance measurements remain owner launch steps, separate from local code verification.


## Local verification results
Production build and TypeScript passed. SEO output checks passed for all 12 public pages. HTTP checks passed for all pages, robots, sitemap, llms.txt and the social PNG; an unknown URL returned 404. Desktop and 390px mobile homepage layouts were inspected with no horizontal overflow. Browser checks confirmed plain QR generation, local image upload and the image-blended preview. Calculator checks confirmed 900px at 300 DPI = 3.00 inches / 7.62 cm, and zero input produces validation text. PNG download was invoked, but the browser automation did not capture a download event, so saved-file delivery remains unverified. No browser errors were reported. Lint passed with two existing warnings in ImagePreview.tsx and QRCanvas.tsx.

