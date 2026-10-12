# Adnan Kafri portfolio

This is the maintenance workspace. **Upload only the contents of `deploy/` or `adnan-kafri-deploy.zip`.** See [DEPLOY.md](DEPLOY.md) for the exact GitHub web/Git upload steps, Pages settings, live checks, indexing and custom-domain procedure. Nothing must be edited before uploading.

## Edit and regenerate

Use Node.js 22+ and Python 3 in this working folder:

```sh
npm ci
npm run build
python tools/package.py
npm run serve
```

Open `http://127.0.0.1:8080/` or `/ar/`. This preview server enforces case-sensitive paths and returns the custom error document with HTTP 404 for missing routes. Opening `index.html` or `ar/index.html` directly also supports language switching through explicit filenames. The error page requires HTTP hosting because its assets deliberately use root-absolute paths.

Edit `js/content.js` for English/Arabic copy, skills, experience, shared contacts and projects. Edit `tools/template.html` for the shared page structure. Regenerate after edits and upload both HTML pages so served text and runtime content agree. Keep this maintenance folder: the clean upload ZIP intentionally excludes tools and development dependencies.

Optional project fields are `image`, `liveUrl` and `repoUrl`. Set them only when you have a real asset or URL. Empty fields produce no links, labels or frames; authentic architecture diagrams remain. Image paths are relative to this folder, with localized alt text under each language's project data.

## Behavior and assets

The single Skills section measures each original list and repeats it to fill more than twice the visible width. It recalculates after resizing and font loading, and translates one exact cycle width. Copies are aria-hidden. All chips have consistent height, padding and font size; core technologies use accent, border and weight. Hover/focus, row controls and global pause remain available. Reduced motion shows the original wrapped lists without visible copies.

Language links explicitly target `ar/index.html` and `../index.html`. Canonical, hreflang, Open Graph and sitemap URLs remain clean `/` and `/ar/`. The switch animates and stores a preference but never automatically redirects a requested page. A contact draft is carried across the switch using sessionStorage.

The independent error page comes from `tools/error.html`, `js/error-page.js` and `css/error.css`. It loads no homepage JS. Paths beginning `/ar/` emphasize Arabic; a saved theme is applied before styles paint. All loaded assets and home links are rooted at `/`, so deep missing paths and a future custom domain work with the same document.

The email and WhatsApp controls validate input and prepare an encoded draft for the visitor to review and send. No message is sent by the site. The supplied portrait, real links, CV facts, logo-derived palette, timeline, citation, diagrams and other retained interactions are unchanged.

Fonts are self-hosted with licenses and font-display swap. GSAP/ScrollTrigger 3.14.2 and Lenis 1.3.26 use pinned URLs, SHA-384 integrity and defer. If changing CDN versions, run `node tools/update-cdn-integrity.mjs`, then rebuild. Design tokens remain at the top of `css/styles.css`.

`SITE_URL` in `site.config.json` supplies generated SEO URLs. Use `node tools/set-domain.mjs <HTTPS-origin>` for a purchased domain, then `python tools/package.py` and upload the refreshed files. This does not configure DNS. The deployment guide covers the remaining steps.

Current verification is recorded in `polish-report.md`. The earlier pre-launch report is a historical snapshot. QA and dependencies are working files and are excluded from the upload package.
