# Deploy Adnan Kafri's portfolio

Repository: **https://github.com/AdnanKafri/adnankafri.github.io**

Live address after publishing: **https://adnankafri.github.io/**

**Required edits before uploading: none.** Optional project images/live/repository links may remain empty. No CNAME or verification token has been created. No remote push or deployment was performed during preparation.

## 1. Choose the upload files

Use the contents of `deploy/`, or extract `adnan-kafri-deploy.zip`. The ZIP opens directly to these files, without a parent directory:

```text
index.html
ar/
assets/
css/
js/
404.html
robots.txt
sitemap.xml
site.webmanifest
.nojekyll
```

Upload these contents to the repository root. Do not upload the enclosing `deploy` folder, ZIP, `.git`, `node_modules`, `qa`, npm package files, maintenance tools or internal reports. Keep the maintenance workspace separately for future editing and generation. Font licenses remain with their assets.

## 2A. GitHub web upload

1. Sign in and open [AdnanKafri/adnankafri.github.io](https://github.com/AdnanKafri/adnankafri.github.io), on the `main` branch.
2. Select **Add file → Upload files**. Drag the **contents** of `deploy/`, including all four subfolders, into the upload area. `index.html` and `404.html` must appear at the root.
3. Include `.nojekyll`. Enable hidden-file display in your file manager if needed. If upload omits it, use **Add file → Create new file**, name it `.nojekyll`, and commit a blank line.
4. Review and commit to `main`. Confirm `ar/index.html` exists and filenames match case exactly. Do not rename `404.html`.
5. If a previous release left development folders or backup ZIPs in the remote repository, remove those obsolete files separately after reviewing them. Preserve any real verification files and any CNAME added later.

## 2B. Git upload instead

Use a separate clone, or your existing clean checkout:

```sh
git clone https://github.com/AdnanKafri/adnankafri.github.io.git
cd adnankafri.github.io
git switch main
git pull --ff-only origin main
```

From that checkout, copy only the clean deployment contents. In PowerShell:

```powershell
Get-ChildItem -LiteralPath 'C:\Users\Asus\Desktop\Adnan-Profile\deploy' -Force |
  Copy-Item -Destination . -Recurse -Force
```

This copies hidden files without deleting unrelated or verification files. Review obsolete files before removing them. Then:

```sh
git status --short
git add -A
git commit -m "Apply portfolio pre-launch fixes"
git push origin main
```

## 3. Enable Pages

Open **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)** and Save. Check the Pages deployment in Actions until it succeeds. See [GitHub's branch publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Visit `https://adnankafri.github.io/` and `https://adnankafri.github.io/ar/`. Both should return HTTP 200. Hard refresh if the previous version is cached. Visitor language links use explicit HTML filenames for compatibility; the SEO URLs deliberately remain `/` and `/ar/`.

## 4. Post-launch checks

- Switch English ↔ Arabic. Check mobile navigation, both themes and saved preferences.
- Check the continuous Skills rows, per-row/global pause and the browser's reduced-motion setting.
- Test email and WhatsApp draft creation. Confirm the destination is your email or `https://wa.me/963952749458`; sending remains a separate action in the visitor's app.
- Check the portrait, logo, real school website, publication DOI and social links.
- Open **https://adnankafri.github.io/this-page-does-not-exist** and **https://adnankafri.github.io/ar/this-page-does-not-exist**. Confirm the custom bilingual error page appears, emphasizing the appropriate language. Hard refresh if cached. In DevTools → Network, inspect the document request and confirm HTTP **404**; seeing an error message alone is not sufficient.
- Also test `/a/b/c/d`, `/index.htm` and `/AR/`. Confirm the error page's fonts, logo and home buttons work. GitHub documents the [root custom 404 file](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site). **Actual GitHub Pages handling can only be confirmed after deployment.**
- Open `/sitemap.xml` and `/robots.txt`. The error page must not be in the sitemap; assets must remain crawlable. Verify canonical/hreflang use the intended HTTPS domain.
- Test the public URLs in [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/). Refresh their cached image after changes to `assets/og-image.png`.

## 5. Search Console and Bing

In [Google Search Console](https://search.google.com/search-console), add the URL-prefix property `https://adnankafri.github.io/`. Verify with the real HTML verification file Google supplies, uploaded unchanged at the repository root. Alternatively, add its actual meta tag to `tools/template.html`, regenerate and deploy. Never use a guessed token.

Submit **https://adnankafri.github.io/sitemap.xml** under Sitemaps. Inspect `/` and `/ar/`, test the live URLs and request indexing. Monitor the Page indexing report; see [Google's URL Inspection instructions](https://support.google.com/webmasters/answer/12482179).

In [Bing Webmaster Tools](https://www.bing.com/webmasters/), import the verified Google property or verify independently. Submit the same sitemap and inspect both pages, following [Bing's sitemap instructions](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed).

Test the deployed structured data with [Schema.org Validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results). Valid markup and a sitemap do not guarantee indexing, ranking or a rich result. The error page is `noindex, nofollow` and excluded from the sitemap.

## 6. Update content later

Work in this maintenance folder, not the generated deployment folder:

1. Edit `js/content.js` in both languages. Optional project fields are `image`, `liveUrl` and `repoUrl`; leave them empty without real values. Keep CV facts accurate.
2. With Node.js 22+, run `npm ci` once or after dependency changes, then `npm run build`.
3. Run `python tools/package.py` to update `deploy/` and `adnan-kafri-deploy.zip`.
4. Preview with `npm run serve`, then copy/upload the refreshed deployment contents, commit and push. Upload both generated HTML pages with copy changes so search engines see the current text without JavaScript.
5. Preserve verification files and any CNAME in the publishing checkout.

The main-page generator uses `tools/template.html`; the error document comes from `tools/error.html`. GitHub Pages and visitors need neither Node nor Python.

## 7. Attach a purchased domain later

1. Verify the purchased domain in your GitHub account's Pages settings if available. Set it in this repository's **Settings → Pages → Custom domain**. Branch publishing creates a CNAME commit; pull it into the checkout and retain it on later uploads.
2. At the DNS provider, create four apex (`@`) A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Set `www` CNAME to `adnankafri.github.io`, without protocol/path. Remove conflicting records for these names. Follow [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
3. Wait for DNS/certificate provisioning, then enable **Enforce HTTPS**. Check apex/www redirects and both language pages.
4. In the maintenance workspace, substitute the actual purchased origin:

```sh
node tools/set-domain.mjs https://YOUR-PURCHASED-DOMAIN
python tools/package.py
```

5. Upload the refreshed files and preserve CNAME. `SITE_URL` in `site.config.json` regenerates canonical, hreflang, Open Graph, JSON-LD, sitemap and robots together. The script does not configure DNS or purchase a domain.
6. Repeat the missing-page tests on the new domain. The error page's `/css/`, `/js/`, `/assets/`, `/` and `/ar/` paths automatically resolve on that domain; they need no hostname replacement.
7. Verify the new property in Google/Bing, submit its sitemap, inspect both languages and refresh social previews.
