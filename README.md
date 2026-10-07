# Adnan Kafri / The backend, made visible

A complete, buildless personal portfolio. Electric lime, warm clay, and ink; a warm paper palette in light mode. Syne display type, Inter body type, IBM Plex Mono technical details, and Cairo for Arabic.

## Open or deploy

Open `index.html` directly, or run `python -m http.server 8080` in this folder and visit http://localhost:8080. No installation or build is required.

- **GitHub Pages:** Upload `index.html`, `css/`, `js/`, and `assets/` to a repository. In Settings → Pages, select Deploy from a branch, your branch, and `/ (root)`. Save and use the URL GitHub provides.
- **Netlify:** Upload a folder containing those files to manual deploy. For a connected repository, leave the build command empty and use `.` for the publish directory.

The supplied archive contains all required source and assets. The large original `photo.jpg` and the backup archive are not needed for deployment.

## Files

- `index.html` — complete semantic page, English HTML fallback, metadata, Person schema, and native command/copy dialogs.
- `css/styles.css` — the complete design, breakpoints, light/dark palettes, motion, RTL and accessibility styles.
- `js/content.js` — reviewed English and professional Modern Standard Arabic copy, complete CV skills, role responsibilities, project settings, and interface text under `PORTFOLIO.system`.
- `js/main.js` — rendering, profile demonstration, diagrams, command palette, theme/language persistence, motion controls, clipboard handling, shared form validation, and email/WhatsApp drafts.
- `assets/adnan.webp` — your existing optimized photo, preserved.
- `assets/ak-logo.png` — the supplied AK logo, preserved. `logo-16.png`, `logo-32.png`, `logo-180.png`, `logo-192.png`, `logo-384.png`, and `logo-512.png` are generated variants on a dark backing for consistent visibility in both themes.
- `assets/favicon.ico` — 16/32/48-pixel ICO; the 180-pixel PNG is the Apple touch icon.
- `assets/social-preview.png` — 1200×630 social image featuring the new logo. The old mark has been removed from the site and assets.
- `VERIFICATION.md` — real-browser results and remaining verification limits.
- `REFINEMENT.md` — section-by-section changes, Arabic copy examples, and additional UI fixes.

## Interactions

- The hero types `GET /api/adnan` and returns role, stack, location, and availability from the real content data. It is explicitly a local demonstration, not a backend request. Run again replays it.
- Ctrl/Cmd+K opens a searchable command menu. Use arrows and Enter to jump to a section, switch language/theme, copy email, or open GitHub/WhatsApp. Escape closes the native dialog. The navbar button works on mobile.
- Project headings expand/collapse full-width panels with accessible, animated SVG architecture diagrams. The featured project starts open. On mobile, diagrams reflow vertically; Arabic mirrors their coordinates and flow without reversing the text.
- Fine-pointer desktops get a dot/ring cursor, spotlight cards, magnetic buttons, a subtle featured-diagram tilt, and navigation text scramble. Mobile uses native touch behavior and simpler motion.
- The experience rail follows scroll progress. GSAP reveals content and animates the real 3+ and 5-year facts. Lenis smooths desktop wheel scrolling; mobile uses native scrolling.
- Copy citation/email uses the clipboard on supported secure origins. When unavailable, a selectable-text dialog provides a manual copy fallback.
- The motion control pauses the marquee, mesh, cursor, typing, and diagram animations and removes scroll animation/smoothing. Reduced-motion preferences automatically use a static, readable experience. English and dark mode are first-visit defaults; user preferences persist when storage is available.
- The contact form opens a prepared `mailto:` draft. It does not send messages or claim a server submission. A configured email application is needed; the direct email link remains available.
- Send via WhatsApp uses the same inline name/email/message validation, then opens `https://wa.me/963952749458?text=…` in a new tab with `noopener noreferrer`. The draft follows the selected language and preserves encoded line breaks. The visitor reviews and sends it in WhatsApp. Direct WhatsApp links also appear in the contact section and footer.

## Editing and replacements

1. Set each project's `image`, `live`, and `github` in `PORTFOLIO.projects` inside `js/content.js`. Missing values deliberately display labeled placeholders. Diagrams are explanatory schematics, not fabricated screenshots.
2. The photo is already included. Replace `assets/adnan.webp` only if you want another image, and update `portraitAlt` in both languages.
3. Set a public domain after deployment: add a canonical link and `og:url`; make `og:image`, `twitter:image`, and the JSON-LD image absolute URLs. The included logo social preview is ready to use, or replace it with a custom 1200×630 image.
4. Your logo and photo are already integrated. No placeholder logo remains.
5. All runtime copy is in `content.js`. The English content is also in HTML as a no-JavaScript fallback. If you later change facts, update that HTML fallback too. The optional workspace utility `qa/update-static.cjs` can regenerate it using jsdom; it is not a deployment/build requirement. With JavaScript disabled, direct contact links remain available and the scripted form is hidden.

## Dependencies and resilience

Pinned CDN scripts: GSAP 3.14.2, ScrollTrigger 3.14.2, Lenis 1.3.26; Tailwind's browser CDN as requested. Google Fonts supplies the fonts. The full layout is in local CSS and the content/controls are local JavaScript, so blocked animation/font CDNs fall back to the native page and system fonts.

Reference documentation: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Lenis](https://github.com/darkroomengineering/lenis).

The prior versions are preserved separately in the workspace as `Adnan-Kafri-Portfolio-original.zip` and `Adnan-Kafri-Portfolio-before-refinement.zip`. These backups and the `qa/` evidence folder are excluded from the deployment ZIP.
