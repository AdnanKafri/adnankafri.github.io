# Focused portfolio polish report

Completed 12 October 2026. This is a presentation refinement of the existing static portfolio, not a rebuild. The existing palette, fonts, portrait, links, features, English `/`, Arabic `/ar/`, SEO and deployment structure are preserved. `js/content.js` is byte-for-byte unchanged from the pre-polish backup. No projects, clients, metrics or CV facts were added.

## What I offer: before and after

**Before:** an unterminated CSS comment swallowed the offer styles and several adjacent rules. The services appeared as default bullets under a cramped heading, with an uncontained coverage paragraph.

**After:** the block has its own vertical spacing and divider, the existing availability text as a mono label, a clear h3 title and existing introduction. Five equal-height cards contain consistent accent SVG icons, decorative sequence numbers, h4 titles drawn from the existing service wording, and the complete original service sentences. The list remains semantic `ul/li`. It uses three columns above 1100px, two on tablets and one at 680px and below. Mouse-follow spotlights match the bento cards. The coverage strip retains the exact sentence as visible text and adds city/remote chips; decorative repeated chips are hidden from assistive technology. Arabic mirrors the grid, icons and alignment with Cairo line spacing. Both themes use the existing design tokens.

Examples: [English desktop](qa/polish-screens/en-dark-1440x1000-offer.png), [Arabic mobile](qa/polish-screens/ar-light-390x844-offer.png).

## Other inconsistencies fixed

| Area | Fix |
|---|---|
| Stylesheet | Repaired the malformed comment; restored swallowed project title, eyebrow and text-button styling. |
| Global type/layout | Reset h4 margins, allowed grid children to shrink, and wrapped long headings, emails, DOI and bidi text safely. |
| Navbar/menu | Minimum 44px actionable targets; bounded, scrollable mobile menu; focus stays within header controls while open; main/footer become inert; Escape restores menu-button focus; resize clears stale menu state. |
| Hero/API console | Deliberate tablet stacking, fluid name sizes, Arabic spacing, wrapped availability metadata and compact mobile console spacing. |
| Bento | Full-width mobile location/language cards, corrected current-work glyph alignment, constrained portrait width and stable mobile 4:5 geometry. Removed tablet image sizing that caused overflow. |
| Portrait caption | A dark scrim and caption panel preserve contrast over the photograph in both themes, including narrow multiline Arabic. |
| Experience | Replaced browser-default responsibility bullets with consistent accent markers while keeping list semantics; improved mobile copy size. |
| Projects/diagrams | Restored title hierarchy; flexible summary columns; one-column mobile copy; vertical diagrams through 1024px with readable labels and mirrored flow. |
| Publication | Improved mobile padding, wrapping DOI, full-width citation actions, readable button text and a high-contrast focus outline on the paper surface. |
| Education/foundations | Flexible fact columns, wrapping values, consistent mobile heading, fact and body sizes. |
| Contact | Fixed the email arrow being forced onto its own block; wrapped long email text; improved social/action spacing, 44px targets, 16px labels and mobile buttons. |
| Footer | Consistent link target sizes and spacing. |
| Mobile/landscape | Body copy at least 16px, simplified touch effects, cursor disabled on touch, landscape header no longer consumes sticky reading space. |
| 404 | Mobile body copy increased to 16px; existing independent bilingual error behavior retained. |
| Font loading | Preload English Inter alongside Syne on HTTP(S); retain conditional loading for local-file compatibility and Arabic Cairo preload. |
| QA methodology | Corrected Lighthouse desktop configuration: prior desktop-labelled runs actually used mobile settings. Historical report now explicitly withdraws those desktop scores. |

## Responsive browser matrix

Chrome 155.0.8059.39, automated through Playwright. Each cell means **PASS / 0px horizontal overflow**, for both the homepage and 404 page. The homepage checks include every section with all project panels expanded. Measured `document.documentElement.scrollWidth <= innerWidth` in every case.

| Width / condition | EN dark | EN light | AR dark | AR light |
|---|---|---|---|---|
| 320 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 360 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 390 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 430 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 600 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 768 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 820 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 1024 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 1280 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 1440 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 1920 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| 2560 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| Landscape 844 x 390 | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |
| Actual browser zoom 200% | PASS / 0 | PASS / 0 | PASS / 0 | PASS / 0 |

104 regular layout cases plus 8 zoom cases passed. Zoom uses Chrome's browser zoom preference, not pinch scaling: 1440px outer window, 711 CSS-pixel inner width, DPR 2, visual viewport scale 1. The full matrix preceded the final below-fold caption treatment; a separate 48-case check on the final package verified caption bounds and document overflow at all twelve widths in all language/theme combinations.

Additional checks passed: equal offer-card heights, 44px actionable targets, mobile body copy, text clipping checks, menu keyboard trap/Escape, RTL layout, touch cursor suppression and reduced-motion layout. Axe reported no violations in the 12 main screenshot combinations and 20 missing-route cases. Automated accessibility results do not substitute for a manual screen-reader audit.

48 normal-motion cases verified marquee coverage, constant 12px spacing at loop boundaries, resizing and alternating RTL directions. Twelve final normal-motion viewport captures and four desktop offer spotlight interaction checks passed. Reduced-motion screenshots cover all sections. Visual inspection included offer layouts, typography, diagrams, portrait captions and publication assets.

Evidence: [responsive data](qa/polish-responsive-report.json), [motion data](qa/polish-motion-report.json), [final visuals](qa/polish-final-visual-report.json), [final caption checks](qa/polish-photo-report.json), [screenshots](qa/polish-screens/). There are 152 required section/menu images at 390, 768 and 1440 across all four combinations, plus eight zoom images, twelve normal-motion images and four narrow portrait images. An obsolete motion-probe image is not part of the evidence set.

## Functional, content and deployment verification

- Both generated pages and 404 pass HTML validation. Local assets, case-sensitive paths, anchors, JSON-LD parsing and schema types pass. Canonical, hreflang, sitemap and Open Graph URLs consistently use `https://adnankafri.github.io/`.
- Valid `/` and `/ar/` return 200. `/does-not-exist`, `/ar/does-not-exist`, `/a/b/c/d`, `/index.htm` and `/AR/` return 404 on the case-sensitive preview server. Twenty missing-route variants pass assets, theme/language behavior, home navigation and accessibility checks. 404 remains `noindex, nofollow`, without a canonical or homepage animation dependencies.
- Language switching passes under file URLs and two HTTP servers. API console, email/citation copy, contact draft preservation, theme, motion controls and project interactions pass. Contact validation passes whitespace/Unicode and encoded email/WhatsApp draft checks. No messages were sent.
- No unexpected browser console/page errors in the recorded checks. GitHub, LinkedIn, DOI, school and WhatsApp destination requests returned HTTP 200; authenticated/native-app flows were not exercised.
- Generated HTML, source runtime files, `deploy/` and ZIP entries are byte-identical. ZIP CRC passes. The 33-file archive opens directly to `.nojekyll`, `index.html`, `404.html`, `ar/`, `assets/`, `css/`, `js/`, `robots.txt`, `sitemap.xml` and `site.webmanifest`. It excludes QA, tooling, dependencies and old archives.
- `DEPLOY.md` is unchanged because deployment steps did not change. No remote upload or publication was performed.

Evidence: [static checks](qa/prelaunch-static-report.json), [route/switch checks](qa/polish-regression-report.json), [package verification](qa/polish-package-report.json).

## Lighthouse

| Run | Performance | Accessibility | Best practices | SEO |
|---|---:|---:|---:|---:|
| en-mobile | 94 | 100 | 100 | 100 |
| en-desktop | 100 | 100 | 100 | 100 |
| ar-mobile | 96 | 100 | 100 | 100 |
| ar-desktop | 100 | 100 | 100 | 100 |


Scores are local lab measurements, not a production-speed guarantee. Earlier valid pre-launch mobile scores were 97 in both languages; the final mobile measurements are lower, so the requested strict no-regression performance target is **not fully met**. Other Lighthouse categories remain 100. Recent repeated mobile runs varied by one point. Outstanding diagnostics include render-blocking styles/fonts, main-thread work, forced reflow and unminified source. Desktop scores from the older report are not comparable: that script incorrectly labelled mobile-configured runs as desktop. This round explicitly passes the desktop config and asserts the returned form factor (mobile 412x823, desktop 1350x940).

[Interactive HTML Lighthouse reports](qa/polish-lighthouse/) and [score/configuration JSON](qa/polish-lighthouse-summary.json).

## Untested and remaining replacements

Safari, Firefox, physical iOS/Android devices, manual screen-reader navigation and sustained real-device frame rate were not tested. Live GitHub Pages routing, production network behavior, social preview fetching and native email/WhatsApp handoff still require post-deployment checks. The local preview does verify real 404 status codes, but cannot prove the remote host configuration.

No content replacement is required to upload this package. Optional real project screenshots and live/repository links can be added later through the existing empty fields; no fabricated placeholders are shown. All complete source files remain in the workspace, including the generator and editable content. The clean upload artifact is [adnan-kafri-deploy.zip](adnan-kafri-deploy.zip).
