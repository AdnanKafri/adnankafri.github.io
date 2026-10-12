# Pre-launch completion report

> Historical snapshot. The current package and verification results are documented in [polish-report.md](polish-report.md).

Completed **11 October 2026** against the clean `deploy/` folder. The site is prepared for **https://adnankafri.github.io/**; it has not been pushed or deployed. **No file or value must be edited before upload.**

## Changes by requested section

1. **Language switching:** English links to `ar/index.html`; Arabic links to `../index.html`. Real EN → AR → EN navigation passed when opening files directly, through `serve` 14.2.4, and through the case-sensitive preview server. Logo and section links keep their current page context. Animated switching, remembered preference and contact-draft retention remain; there is no preference-based automatic redirect. Canonical, hreflang, Open Graph and sitemap URLs remain `/` and `/ar/`. Font preloads run on HTTP hosting; direct disk opening uses the stylesheet fonts without preload CORS errors.

2. **Skills:** Each row measures its original list after fonts load and on resize. It creates enough hidden copies for more than twice the viewport plus a cycle, then translates precisely one measured cycle width. Internal and cycle-boundary gaps remain 12px. The four rows alternate directions and mirror in Arabic. Chips share their size and typography; core technologies use accent, border and weight. Original lists remain semantic, copies are `aria-hidden`, pause controls remain, and reduced motion removes copies and wraps the originals.

3. **Removed shortcut UI:** Removed the command dialog, navbar hint, shortcut handling, related markup/styles/functions and 18 EN/AR strings used only by that feature. No dead references remain. The navbar keeps its language/theme/mobile controls. Email, GitHub, LinkedIn and WhatsApp are accessible from contact and footer; email is isolated as one left-to-right address in Arabic. Outdated feature claims were removed from the current documentation.

4. **Reserved:** No changes requested.

5. **Error page:** Root `404.html` has bilingual messages, one h1, saved theme applied before styles, and Arabic emphasis for `/ar/` paths. It uses independent small JavaScript and root-absolute document resources/home links. Font URLs resolve from the root-hosted stylesheet. It has `noindex, nofollow`, no canonical, and no sitemap entry. The case-sensitive preview server supplies the actual HTTP 404 status.

6. **Final audit:** Validated HTML, anchors, case-sensitive local paths, static text, SEO metadata, JSON-LD, content consistency, consoles, accessibility and browser behavior. Retained the supplied portrait, current logo-derived colors, real contacts, projects, diagrams, timeline and citation. A complete comparison of `content.js` with the pre-launch backup found only the 18 authorized UI-string removals; all other values are unchanged. No invented facts or placeholders were added.

7. **Upload package:** Created `deploy/` and `adnan-kafri-deploy.zip` with 33 runtime files. ZIP paths start directly at the repository root. Source/deployment/ZIP bytes match, archive CRC verification passes, and all package paths are lowercase and case-correct. Development dependencies, QA, tools, package files, old ZIPs and internal reports are excluded. The unused original logo source remains in the maintenance workspace. [DEPLOY.md](DEPLOY.md) covers this exact repository, web/Git upload, Pages settings, post-launch checks, Google/Bing, updates and a future domain.

## Browser and functional verification

Used **Google Chrome 155.0.8059.39**, headless through Playwright on Windows. Mobile results are browser emulation, not physical-phone tests.

- **12 combinations:** EN/AR × dark/light × 390, 1440 and 1920px viewport widths. No horizontal overflow, JavaScript errors, console errors or failed HTTP resources on the main pages; zero axe violations in each combination.
- **Three navigation environments:** `file://`, the `serve` package on port 8081, and the case-sensitive server serving `deploy/` on port 8082. Actual switching passed in both directions. Direct-file EN/AR consoles were clean.
- **Marquee geometry:** All 32 original skills remain in groups of 12/8/4/8. Measured loop phases at 0%, 13%, 50%, just before 100%, and 100%; gaps stayed at 12px within subpixel tolerance, with no exposed empty track. Chip heights/font sizes were uniform within each row, copies were hidden from accessibility, and directions matched EN/AR. Resize checks also passed at 320, 768 and 2560px. Pause and reduced-motion fallback passed.
- **Interactions:** Real profile JSON, email/citation clipboard copying, language-switch draft retention, theme persistence, global motion pause/resume, project expansion and mobile-menu Escape behavior passed. EN/AR email validation and encoded drafts passed, including whitespace and Unicode. WhatsApp validation and encoded multiline navigation passed without sending a message.
- **Visual review:** Reviewed screenshots of the main-page layouts, continuous rows, Arabic footer, and bilingual error page in desktop/mobile and dark/light contexts. Screenshots are in `qa/prelaunch-screens/` in the maintenance workspace.
- **External destinations:** GitHub, LinkedIn, the publication DOI, Al-Adham's site and WhatsApp all returned HTTP 200 after redirects. This verifies destination reachability, not authenticated account behavior.
- **Static checks:** Both homepages and `404.html` passed HTML validation. Local anchors/assets passed case checks. Person, WebSite, ProfilePage and ScholarlyArticle JSON-LD parsed correctly. Canonical/hreflang/Open Graph/sitemap/robots agree with the intended domain; the error page is excluded from indexing metadata. Main text/accent/button token contrast checks ranged from 4.98:1 upward. The domain-update script was also tested with a temporary origin and restored.

## HTTP status and error-page results

| Route | Status | Primary language |
| --- | ---: | --- |
| `/` | 200 | English |
| `/ar/` | 200 | Arabic |
| `/does-not-exist` | 404 | English |
| `/ar/does-not-exist` | 404 | Arabic |
| `/a/b/c/d` | 404 | English |
| `/index.htm` | 404 | English |
| `/AR/` | 404 | English |

Each missing route was checked in **dark/light × desktop/mobile**, totaling 20 tests. Logo/styles/fonts loaded, saved theme and URL-selected language matched, both home destinations returned 200, the primary home button navigated correctly, and there was no overflow or JavaScript error. All 20 axe checks returned zero violations. The expected failed document status is 404; none of the error page's resources returned 404. Eight screenshots cover EN/AR × dark/light × desktop/mobile.

**Real GitHub Pages routing can only be confirmed after deployment.** The two exact live test URLs and DevTools status-check instructions are in [DEPLOY.md](DEPLOY.md).

## Lighthouse on the final package

| Page/mode | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| EN mobile | 97 | 100 | 100 | 100 |
| EN desktop | ? | ? | ? | ? |
| AR mobile | 97 | 100 | 100 | 100 |
| AR desktop | ? | ? | ? | ? |

**Correction, 12 October:** The old script labeled two runs as desktop without applying the desktop configuration. Those rows are withdrawn. The current polish report uses verified Lighthouse desktop settings.

These are local lab runs against the packaged files, not production field measurements. Remaining performance suggestions concern CSS/JS minification, render-blocking resources, image sizing, compression and some main-thread/layout work. Hosting compression and real network behavior will differ. Full HTML/JSON reports are in `qa/prelaunch-lighthouse/`; the score summary is `qa/prelaunch-lighthouse-summary.json`.

## Untested or requiring the live site

- Actual GitHub Pages publishing, redirects, HTTPS and custom 404 handling; future custom-domain DNS/certificate behavior.
- Safari, Firefox, physical iOS/Android devices, screen-reader use and sustained frame rate on real hardware. Automated accessibility scores do not replace these checks.
- Final handoff inside installed email/WhatsApp apps; no email or WhatsApp message was sent.
- Search Console/Bing account verification, indexing, Google rich-result eligibility and live social-preview caching. No deployment or account configuration was performed.

## Exact upload inventory

Upload the **contents**, including `.nojekyll`, to the root of `AdnanKafri/adnankafri.github.io`. Do not upload `deploy/` as a parent folder.

```text
.nojekyll
index.html
404.html
robots.txt
sitemap.xml
site.webmanifest
ar/index.html
assets/adnan.webp
assets/favicon.ico
assets/logo-16.png
assets/logo-32.png
assets/logo-112.webp
assets/logo-180.png
assets/logo-192.png
assets/logo-192.webp
assets/logo-512.png
assets/og-image.png
assets/fonts/cairo-arabic.woff2
assets/fonts/cairo-latin.woff2
assets/fonts/cairo-license.txt
assets/fonts/ibm-plex-mono-latin.woff2
assets/fonts/ibm-plex-mono-latin-500.woff2
assets/fonts/ibmplexmono-license.txt
assets/fonts/inter-latin.woff2
assets/fonts/inter-license.txt
assets/fonts/syne-latin.woff2
assets/fonts/syne-license.txt
css/error.css
css/fonts.css
css/styles.css
js/content.js
js/error-page.js
js/main.js
```

Archive: **486,337 bytes**. SHA-256: `525dedcb71b9ca3671dfba0c22adfba2291506c17998764ec5733e89d5c78ddc`.

**Required replacements: none.** Optional project screenshots, live URLs and repository URLs can be added later when real assets/links are available. Keep the maintenance workspace for future edits and generation; the deployment package needs no build step on the host.
