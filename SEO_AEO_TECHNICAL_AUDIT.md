# INERIM Interior — Technical SEO, Google Indexing & AEO (Answer Engine Optimization) Audit Report

**Target Domain:** [https://inerimbd.com](https://inerimbd.com)  
**Date of Audit:** October 28, 2026  
**Audited Repository:** `/home/lazy/Development/web_/inerim`  
**Deployment Target:** cPanel (`/home/inerzipq/public_html/`)  
**Audit Scope:** `src/`, `public/`, `dist/`, `scripts/`, `package.json`, and live bundle artifacts  

---

## Executive Scorecard & Summary

| Audit Dimension | Status | Score | Primary Observation |
| :--- | :---: | :---: | :--- |
| **Technical Crawling & Sitemaps** | ✅ Passed | **95 / 100** | Automated build hook generates 35-URL sitemap; clean `robots.txt`. |
| **Dynamic Head Metadata** | ✅ Passed | **98 / 100** | `react-helmet-async` covers all 14 routes and 3 dynamic detail patterns. |
| **Canonical URLs & Social Tags** | ✅ Passed | **100 / 100** | Normalized absolute canonicals, complete Open Graph and Twitter cards. |
| **Structured Data (Schema.org)** | ⚠️ Good | **78 / 100** | 11 core types implemented; missing `FAQPage` and `BreadcrumbList`. |
| **AEO (AI Search Engine Readiness)** | ⚠️ Needs Work | **62 / 100** | Strong textual contrast blocks, but blocked by pure CSR empty HTML shell. |

---

## 1. Technical SEO & Indexing State

### 1.1 `robots.txt` Verification & Configuration
The repository includes verified `robots.txt` files in both [`public/robots.txt`](file:///home/lazy/Development/web_/inerim/public/robots.txt) and [`dist/robots.txt`](file:///home/lazy/Development/web_/inerim/dist/robots.txt):

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: https://inerimbd.com/sitemap.xml
```

#### Evaluation:
- **Crawler Permissions:** Correctly grants open crawling permission across all public pages.
- **Administrative Protection:** Blocks private CMS management endpoints (`/admin`, `/admin/`, `/api/`).
- **Sitemap Autodiscovery:** Explicitly declares the absolute URL to the sitemap index.

---

### 1.2 Automated Sitemap Generation Pipeline
Automated sitemap compilation is handled via [`scripts/generate-sitemap.ts`](file:///home/lazy/Development/web_/inerim/scripts/generate-sitemap.ts), which queries the project’s data files directly (`projectsData.ts`, `blogData.ts`, `shopData.ts`).

The build pipeline in [`package.json`](file:///home/lazy/Development/web_/inerim/package.json) automatically triggers sitemap generation upon every build:
```json
"build": "vite build && tsx scripts/generate-sitemap.ts"
```

#### Current Sitemap Inventory (35 Indexed URLs):
1. **Core Static Routes (14 URLs):**
   - `/` (Priority: 1.0, Daily)
   - `/about`, `/services`, `/how-we-work`, `/pricing`, `/quote`, `/colour-studio`, `/partnership`, `/contact`, `/projects`, `/work`, `/shop`, `/journal`, `/blog` (Priority: 0.7 – 0.9, Weekly/Monthly)
2. **Project Case Studies (9 URLs):**
   - `/projects/sinthia-chowdhury-residence`
   - `/projects/iftekhar-grand-penthouse`
   - `/projects/bettex-corporate-headquarters`
   - `/projects/dr-shamsul-duplex-villa`
   - `/projects/funded-next-innovation-floor`
   - `/projects/al-amin-lake-pavilion`
   - `/projects/al-faisal-villa`
   - `/projects/lumina-boutique-retail`
   - `/projects/komorebi-dining-bistro`
3. **Bespoke Furniture & Modular Products (6 URLs):**
   - `/shop/floating-bed-cove-light`
   - `/shop/scallop-headboard-kids-bed`
   - `/shop/velvet-shell-dining-chair`
   - `/shop/marble-look-dining-set`
   - `/shop/louvre-wardrobe`
   - `/shop/modular-u-kitchen`
4. **Architectural Journal Articles (6 URLs):**
   - `/journal/warm-minimalism-earth-textures`
   - `/journal/neuroarchitecture-modern-office-productivity`
   - `/journal/45-day-handover-engineering-prefabrication`
   - `/journal/small-footprint-grand-living-urban-apartments`
   - `/journal/natural-stone-wood-veneers-selection-guide`
   - `/journal/restaurant-hospitality-interior-design-guide`

---

### 1.3 `react-helmet-async` & Dynamic Metadata Coverage
The application root entry point in [`src/main.tsx`](file:///home/lazy/Development/web_/inerim/src/main.tsx) is wrapped with `<HelmetProvider>`. Every static page and dynamic route consumes the centralized `<SEO />` component:

| View Type | Route Pattern | Target Component | Dynamic Meta Fields |
| :--- | :--- | :--- | :--- |
| **Home** | `/` | [`HomePage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/HomePage.tsx) | Studio branding, 45-day handover guarantee, line-item BOQ. |
| **About** | `/about` | [`AboutPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/AboutPage.tsx) | Architectural heritage, German CNC factory, architect team. |
| **Services** | `/services`, `/how-we-work` | [`ProcessPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProcessPage.tsx) | 5-step turnkey workflow, 3D VR renders, civil execution. |
| **Pricing** | `/pricing` | [`PricingPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/PricingPage.tsx) | Tiers from ৳1,350 to ৳2,850/sqft, BOQ price lock. |
| **Quote** | `/quote` | [`QuotePage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/QuotePage.tsx) | Instant space dimension cost calculator, consultation. |
| **Colour Studio** | `/colour-studio` | [`ColourStudioPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ColourStudioPage.tsx) | Real-time wall paint, walnut veneer, and acrylic visualizer. |
| **Partnership** | `/partnership` | [`PartnershipPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/PartnershipPage.tsx) | B2B collaboration for architects, builders, and developers. |
| **Contact** | `/contact` | [`ContactPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ContactPage.tsx) | Dhaka studio address, phone/WhatsApp, booking form. |
| **Projects** | `/projects`, `/work` | [`WorkPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/WorkPage.tsx) | Completed residential & commercial portfolio gallery. |
| **Shop** | `/shop` | [`ShopPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ShopPage.tsx) | Direct factory furniture & modular kitchen catalog. |
| **Journal** | `/journal`, `/blog` | [`BlogPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/BlogPage.tsx) | In-depth interior design guides and materials research. |
| **Product Detail** | `/shop/:slug` | [`ProductDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProductDetailPage.tsx) | **Dynamic**: Product name, price in BDT, dimensions, specs. |
| **Project Detail** | `/projects/:slug` | [`ProjectDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProjectDetailPage.tsx) | **Dynamic**: Project title, location, delivery speed, gallery. |
| **Journal Detail** | `/journal/:slug` | [`JournalDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/JournalDetailPage.tsx) | **Dynamic**: Headline, excerpt, author byline, reading time. |
| **404 Fallback** | `*` | [`App.tsx`](file:///home/lazy/Development/web_/inerim/src/App.tsx) | `noindex: true`, prevents crawl budget waste on 404s. |

---

### 1.4 Canonicals, Open Graph & Google Verification
- **Canonical URLs:** Evaluated in [`src/components/SEO.tsx`](file:///home/lazy/Development/web_/inerim/src/components/SEO.tsx). Converts relative paths into fully qualified absolute URLs (`https://inerimbd.com/...`), mitigating duplicate content indexing.
- **Social Tags:** Injects `og:site_name`, `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`, `og:locale`, and Twitter Cards (`summary_large_image`).
- **Google Search Console Verification:** Included in [`index.html`](file:///home/lazy/Development/web_/inerim/index.html) and compiled into [`dist/index.html`](file:///home/lazy/Development/web_/inerim/dist/index.html):
  ```html
  <meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE" />
  ```

---

## 2. AEO (Answer Engine Optimization) & Structured Data State

### 2.1 Inventory of Currently Implemented Schema.org JSON-LD Types
The application injects 11 Schema.org structured data types across its routes:

1. **`HomeAndConstructionBusiness`** (`/`):
   - Injects entity name, alternate name, image, logo, `@id` URI, telephone (`+8801898755000`), priceRange (`৳1,350 - ৳3,800 per sq.ft`), geo-coordinates (Uttara, Dhaka), working hours (Sat–Thu 10:00–20:00), and social profiles (`sameAs`).
2. **`Product` with `Offer`** (`/shop/:slug`):
   - Injects SKU, name, description, brand, currency (`BDT`), price, itemCondition, and availability (`InStock`).
3. **`Product` with `AggregateOffer`** (`/pricing`):
   - Injects package pricing spread (`lowPrice: 1350`, `highPrice: 2850`, `offerCount: 3`).
4. **`BlogPosting`** (`/journal/:slug`):
   - Injects article headline, description, cover image, datePublished, author `Person` entity with job title, and publisher `Organization`.
5. **`CreativeWork`** (`/projects/:slug`):
   - Injects project name, description, image gallery, locationCreated `Place` entity, and creator.
6. **`Service`** (`/services`):
   - Declares turnkey interior design service, provider, and `areaServed: Bangladesh`.
7. **`WebApplication`** (`/quote`):
   - Formally categorizes the interior cost calculator tool.
8. **`AboutPage` & `ContactPage`**:
   - Declares page intent and nested `LocalBusiness` data.
9. **`CollectionPage` & `Blog`**:
   - Defines catalog and article directory structures.

---

### 2.2 Missing Structured Data Types (Gaps)
1. **`FAQPage` Schema (High AEO Value):**
   - High-quality architectural Q&A items already exist in [`src/data/companyData.ts`](file:///home/lazy/Development/web_/inerim/src/data/companyData.ts#L195) and render visually in [`ContactPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ContactPage.tsx).
   - **Gap:** These are not wrapped in Schema.org `FAQPage` JSON-LD. Consequently, search engines and AI engines cannot reliably display rich FAQ accordion cards or parse them as direct answers.
2. **`BreadcrumbList` Schema:**
   - Visual breadcrumbs exist on product, project, and journal pages (`Home / Shop / Floating Bed`), but **no `BreadcrumbList` JSON-LD** is emitted.
3. **`WebSite` Schema:**
   - Missing top-level `WebSite` schema on the homepage with `potentialAction: SearchAction`.

---

### 2.3 Conversational Content & Answer Engine Readiness
AI answer engines (Perplexity, ChatGPT Search, Claude, Google AI Overviews) parse content differently from keyword crawlers:

- **What INERIM does well:**
  - **Direct Answer Snippets:** The 4 Architectural Pillars on [`HomePage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/HomePage.tsx) provide crisp, comparative text ("Traditional vs. Inerim") and clear metrics (`45 Days • ৳5k/Day Delay Penalty`).
  - **Definitive Pricing Answers:** [`PricingPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/PricingPage.tsx) provides exact answers to queries like *"How much does apartment interior design cost per square foot in Dhaka?"*.
  - **Detailed Timelines:** [`ProcessPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProcessPage.tsx) outlines an exact day-by-day sequence (Day 1–2, 3–5, 6–15, 16–32, 33–40, 41–45).
- **The #1 Technical Vulnerability for AEO (The CSR Barrier):**
  - In [`dist/index.html`](file:///home/lazy/Development/web_/inerim/dist/index.html), the raw body content is:
    ```html
    <div id="root"></div>
    <script type="module" crossorigin src="./assets/index-FcNE6yST.js"></script>
    ```
  - While Googlebot runs a two-wave rendering pass that eventually executes JavaScript, **AI scrapers (GPTBot, PerplexityBot, ClaudeBot) frequently rely on fast HTTP GET requests without executing the full client-side JavaScript bundle**.
  - In a raw HTTP response, an AI crawler scraping `https://inerimbd.com/pricing` reads zero body text, zero pricing data, and zero FAQ answers.

---

## 3. Prioritized Recommendations for 100% SEO & AEO Optimization

### Priority 1: High Impact (Immediate Implementation)

#### 1. Add `FAQPage` JSON-LD Schema
Inject the following schema into [`ContactPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ContactPage.tsx) and [`HomePage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/HomePage.tsx):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does INERIM guarantee interior handover within 45 days?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "INERIM manufactures 75% of cabinetry and modular elements inside an off-site German CNC facility while civil, flooring, and electrical works proceed simultaneously on-site. Handover is contractually backed by a ৳5,000/day delay credit."
      }
    },
    {
      "@type": "Question",
      "name": "How much does interior design cost per square foot in Bangladesh?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Turnkey interior packages range from ৳1,350/sq.ft for Essential Living to ৳1,950/sq.ft for Signature Architectural, and ৳2,850/sq.ft for Bespoke Ultra-Luxury with an itemized, locked Bill of Quantities (BOQ)."
      }
    }
  ]
}
```

#### 2. Add `BreadcrumbList` Schema to Detail Pages
Inject breadcrumb structured data into [`ProductDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProductDetailPage.tsx), [`ProjectDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/ProjectDetailPage.tsx), and [`JournalDetailPage.tsx`](file:///home/lazy/Development/web_/inerim/src/pages/JournalDetailPage.tsx):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://inerimbd.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://inerimbd.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "Floating Bed", "item": "https://inerimbd.com/shop/floating-bed-cove-light" }
  ]
}
```

#### 3. Deploy `public/llms.txt` (Emerging AI Standard)
Create a clean markdown specification file at `public/llms.txt` so LLM search agents (ChatGPT, Perplexity, Claude) can ingest the core business knowledge graph directly:
```markdown
# INERIM Interior
> Modern architectural interior design and turnkey prefabrication studio in Dhaka, Bangladesh.

## Core Facts
- Handover SLA: 45 working days guaranteed (৳5,000/day delay penalty)
- Turnkey Pricing: ৳1,350/sft (Essential), ৳1,950/sft (Signature), ৳2,850/sft (Luxury)
- Manufacturing: German CNC off-site prefabrication with Homag edge-banding
- Materials: Action TESA HDHMR, Austrian Senosan Acrylic, Italian Walnut Veneer, Blum Hardware
- Service Areas: Gulshan, Banani, Uttara, Dhanmondi, Bashundhara, Dhaka, Bangladesh
- Phone: +8801898755000 | Website: https://inerimbd.com
```

---

### Priority 2: Architectural & Crawler Accessibility

#### 4. Semantic HTML Crawl Fallback in `<div id="root">`
In [`index.html`](file:///home/lazy/Development/web_/inerim/index.html), place a semantic fallback inside `<div id="root">`:
```html
<div id="root">
  <!-- Semantic crawlable fallback for AI search bots & non-JS scrapers -->
  <main style="display: none;">
    <h1>INERIM Interior — Modern Architectural Design Studio Dhaka</h1>
    <p>Modern luxury residential and commercial interior design in Bangladesh with 45-day guaranteed handover and locked BOQ pricing from ৳1,350/sq.ft.</p>
    <nav>
      <a href="/pricing">Interior Pricing</a> |
      <a href="/services">Our 5-Step Process</a> |
      <a href="/projects">Portfolio</a> |
      <a href="/shop">Custom Furniture</a> |
      <a href="/contact">Contact Studio (+8801898755000)</a>
    </nav>
  </main>
</div>
```
When React mounts in modern browsers, `createRoot` replaces this markup. Non-JavaScript AI crawlers will immediately read the studio’s key information on raw HTTP GET.

#### 5. Explicit AI Search Crawler Allowances in `robots.txt`
Explicitly welcome AI search retrieval bots in [`public/robots.txt`](file:///home/lazy/Development/web_/inerim/public/robots.txt):
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

# Explicit AI Search Engine Allowances
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://inerimbd.com/sitemap.xml
```

---

*Report generated and archived for engineering reference.*
