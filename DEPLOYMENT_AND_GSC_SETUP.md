# INERIM Interior — Production Deployment, Domain Configuration & Google Search Console Guide

**Target Domain:** [https://inerimbd.com](https://inerimbd.com)  
**Target Server Path:** `/home/inerzipq/public_html/`  
**Hosting Environment:** cPanel / Apache on Linux  
**Repository Working Directory:** `/home/lazy/Development/web_/inerim`  
**Date:** October 31, 2026  

---

## 1. Deployment Architecture & Pipeline

### 1.1 Deployment Mechanism
* **Platform:** **cPanel Git™ Version Control Deployment**.
* **Configuration File:** [`.cpanel.yml`](file:///home/lazy/Development/web_/inerim/.cpanel.yml) located in the repository root.
* **Continuous Integration / External CI:** There are no GitHub Actions workflows (`.github/`), Dockerfiles, Vercel, or Netlify configuration files present. Deployment is driven entirely by cPanel's built-in Git runner.
* **Git Tracking Strategy:** In [`.gitignore`](file:///home/lazy/Development/web_/inerim/.gitignore), the production build folder `dist/` is deliberately un-ignored:
  ```gitignore
  # dist/ is commented out so built files can be pushed to GitHub & deployed to public_html via cPanel Git Version Control
  # dist/
  ```
  This allows fully compiled JavaScript, CSS bundles, media assets, and SEO artifacts (`robots.txt`, `sitemap.xml`, `llms.txt`) to be tracked in Git and immediately transferred to the web server root without requiring Node.js build tools on the cPanel server.

---

### 1.2 Target Directory & Deployment Tasks
Inside [`.cpanel.yml`](file:///home/lazy/Development/web_/inerim/.cpanel.yml), the deployment tasks are defined as:

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/inerzipq/public_html/
    - /bin/rsync -av --delete dist/ $DEPLOYPATH
```

#### What happens during deployment:
1. `DEPLOYPATH` is set to the document root of the cPanel hosting account: `/home/inerzipq/public_html/`.
2. `/bin/rsync -av --delete dist/ $DEPLOYPATH` mirrors the compiled contents of `dist/` directly into `public_html/`.
3. The `--delete` flag automatically cleans up obsolete asset chunks on the server that are no longer part of the latest build.

---

### 1.3 Exact Build & Clean Commands
Configured in [`package.json`](file:///home/lazy/Development/web_/inerim/package.json):

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **`npm run build`** | `vite build && tsx scripts/generate-sitemap.ts` | Compiles React SPA bundles with Vite, compiles Tailwind CSS, copies `public/` assets, and executes the TypeScript sitemap script to index all 35 static & dynamic URLs into `dist/sitemap.xml`. |
| **`npm run lint`** | `tsc --noEmit` | Validates TypeScript types across the entire codebase without generating output files. |
| **`npm run dev`** | `vite --port=3000 --host=0.0.0.0` | Starts the local development server. |
| **`npm run preview`** | `vite preview` | Locally serves and previews the production build from `dist/`. |

---

## 2. Google Search Console (GSC) Verification Status

### 2.1 Current Code State
* **Status:** ⚠️ **Placeholder Present (Action Required Before Verification)**
* Both the root source template [`index.html`](file:///home/lazy/Development/web_/inerim/index.html#L10) and the compiled distribution file [`dist/index.html`](file:///home/lazy/Development/web_/inerim/dist/index.html#L10) contain:
  ```html
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE" />
  ```
* An actual alphanumeric verification token has **not** yet been inserted.

---

### 2.2 How to Update the Verification Code
1. Open [Google Search Console](https://search.google.com/search-console).
2. Choose **URL prefix** property:
   ```text
   https://inerimbd.com/
   ```
3. Under **Verification method**, select **HTML tag**.
4. Google will provide a meta tag similar to:
   ```html
   <meta name="google-site-verification" content="AbCdEf1234567890XyZ..." />
   ```
5. Copy the code value inside `content="..."` and replace `YOUR_GSC_VERIFICATION_CODE` in:
   - [`index.html`](file:///home/lazy/Development/web_/inerim/index.html)
6. Re-run `npm run build` so Vite automatically injects the new token into `dist/index.html`.

---

## 3. Live Domain Configuration

The canonical production domain is configured as **`https://inerimbd.com`** across all application configurations, SEO components, structured data schemas, and build scripts:

### 3.1 Mapping of Domain References

| Component / Layer | Source File | How Domain Is Used |
| :--- | :--- | :--- |
| **Sitemap Generator** | [`scripts/generate-sitemap.ts`](file:///home/lazy/Development/web_/inerim/scripts/generate-sitemap.ts#L12) | `const BASE_URL = 'https://inerimbd.com';`<br>Prefixes all 35 static routes, projects, products, and journal articles. |
| **Dynamic SEO Engine** | [`src/components/SEO.tsx`](file:///home/lazy/Development/web_/inerim/src/components/SEO.tsx#L15) | `const SITE_DOMAIN = 'https://inerimbd.com';`<br>Computes absolute canonical URLs and absolute Open Graph / Twitter image URLs. |
| **Robots Rules** | [`public/robots.txt`](file:///home/lazy/Development/web_/inerim/public/robots.txt)<br>[`dist/robots.txt`](file:///home/lazy/Development/web_/inerim/dist/robots.txt) | `Sitemap: https://inerimbd.com/sitemap.xml`<br>`# LLM Knowledge Graph: https://inerimbd.com/llms.txt` |
| **AEO Knowledge Graph** | [`public/llms.txt`](file:///home/lazy/Development/web_/inerim/public/llms.txt)<br>[`dist/llms.txt`](file:///home/lazy/Development/web_/inerim/dist/llms.txt) | Declares official domain, sitemap index URL, and interactive quote tool URL for AI scrapers (ChatGPT, Perplexity, Claude). |
| **Fallback HTML Head** | [`index.html`](file:///home/lazy/Development/web_/inerim/index.html)<br>[`dist/index.html`](file:///home/lazy/Development/web_/inerim/dist/index.html) | Hardcoded initial fallbacks: `og:url` (`https://inerimbd.com/`) and canonical link. |
| **Structured Data (JSON-LD)** | [`HomePage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/HomePage.tsx)<br>[`ContactPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ContactPage.tsx)<br>[`ProductDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProductDetailPage.tsx)<br>[`ProjectDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProjectDetailPage.tsx)<br>[`JournalDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/JournalDetailPage.tsx) | All `@id`, `url`, `publisher`, and `BreadcrumbList` item entities are explicitly bound to `https://inerimbd.com`. |
| **Vite Asset Base** | [`vite.config.ts`](file:///home/lazy/Development/web_/inerim/vite.config.ts#L8) | `base: './'`<br>Ensures asset URLs (JS, CSS, images) resolve relatively, preventing 404 path issues on Apache subfolders or custom root configurations. |

---

## 4. Pre-Deployment & Launch Checklist

Follow these steps in order to complete your live release and index the website on Google:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Go-Live Execution Order                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Insert real GSC token in index.html                                 │
│ 2. Run npm run build (compiles dist/ and generates sitemap.xml)        │
│ 3. Git commit & push main to GitHub                                    │
│ 4. In cPanel > Git Version Control: Click "Deploy Head Commit"          │
│ 5. In GSC: Click "Verify"                                              │
│ 6. In GSC > Sitemaps: Submit https://inerimbd.com/sitemap.xml          │
└────────────────────────────────────────────────────────────────────────┘
```

### Detailed Steps:

1. **Update GSC Token:**
   Open [`index.html`](file:///home/lazy/Development/web_/inerim/index.html) and replace:
   ```html
   <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE" />
   ```
   with your actual verification tag from Google Search Console.

2. **Execute Full Build:**
   ```bash
   npm run build
   ```
   Verify that the output shows:
   - Client bundle generated in `dist/assets/`.
   - `[Sitemap Generator] Successfully generated sitemap with 35 URLs: Output: ... and dist/sitemap.xml`.
   - `dist/llms.txt`, `dist/robots.txt`, and `dist/index.html` are refreshed.

3. **Commit & Push:**
   ```bash
   git add -A
   git commit -m "chore(release): configure GSC verification and compile production build"
   git push origin main
   ```

4. **Deploy in cPanel:**
   - Log in to your cPanel dashboard at `inerimbd.com:2083`.
   - Navigate to **Files** > **Git™ Version Control**.
   - Select the repository linked to `inerim`.
   - Click **Update from Remote** (Pull), then click **Deploy Head Commit**.
   - Check that files in `/home/inerzipq/public_html/` are updated.

5. **Verify Ownership in GSC:**
   - Return to Google Search Console and click **Verify**.
   - Google will immediately confirm ownership by detecting the `<meta name="google-site-verification" ...>` tag.

6. **Submit XML Sitemap:**
   - In Google Search Console, go to **Index** > **Sitemaps**.
   - Enter `sitemap.xml` under *Add a new sitemap*.
   - Click **Submit**. Google will queue all 35 URLs for crawling and indexing.
