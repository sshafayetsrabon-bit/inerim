/**
 * Build-time prerender for SEO.
 *
 * Search engines, SEO checkers and social previews often read the raw HTML without running JavaScript. This script
 * writes one HTML file per route into dist/ (dist/shop.html, dist/shop/hpl-sheet.html, ...) containing that page's
 * title, description, canonical URL, Open Graph tags, Schema.org JSON-LD and readable page content. Apache serves
 * these files directly (see public/.htaccess); the React app then takes over in the browser.
 *
 * Content comes from the live CMS (CMS_URL, default https://inerimbd.com) so products and articles added in /admin
 * are included; if the CMS can't be reached the starter content in src/lib/seed.ts is used.
 * Also writes sitemap.xml with the same list of URLs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { SEED } from '../src/lib/seed';
import type { Content } from '../src/lib/types';
import { FAQS, PAGE_META, PAIN, PARTNER_TYPES, PROCESS, QC, SERVICE_GROUPS, SIGNATURE_ELEMENTS } from '../src/lib/copy';
import { SCENES } from '../src/lib/scenes.generated';
import { SITE, articleLd, breadcrumbs, business, faqPage, graph, packagesCatalog, pageTitle, productLd, projectLd } from '../src/lib/schema';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const CMS_URL = process.env.CMS_URL ?? 'https://inerimbd.com';

/* ------------------------------------------------------------------ helpers */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (u: string) => (u.startsWith('http') ? u : `${SITE}${u.startsWith('/') ? u : `/${u}`}`);
const clip = (s: string, n = 155) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n - 1))}…`);
const taka = (n: number) => `৳${n.toLocaleString('en-IN')}`;
const md = (s: string) => marked.parse(s || '', { async: false }) as string;
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;
const list = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const img = (src: string, alt: string) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" width="800" height="600" />`;

async function loadContent(): Promise<{ content: Content; source: string }> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(`${CMS_URL}/api/index.php?r=content`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error(String(res.status));
    const d = (await res.json()) as Partial<Record<keyof Content, unknown>>;
    return {
      content: {
        settings: { ...SEED.settings, ...((d.settings as object) || {}) },
        products: (d.products as Content['products']) ?? SEED.products,
        posts: (d.posts as Content['posts']) ?? SEED.posts,
        projects: (d.projects as Content['projects']) ?? SEED.projects,
        colours: (d.colours as Content['colours']) ?? SEED.colours,
      },
      source: `${CMS_URL} (live CMS)`,
    };
  } catch (e) {
    return { content: SEED, source: `starter content (CMS not reachable: ${(e as Error).message})` };
  }
}

interface Page {
  path: string;
  title: string;
  description: string;
  body: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  ld?: object[];
  noindex?: boolean;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

/* ------------------------------------------------------------------ pages */

function nav() {
  return `<nav aria-label="Primary">${list([
    link('/', 'Home'),
    link('/projects', 'Projects'),
    link('/services', 'Services'),
    link('/shop', 'Shop'),
    link('/colour-studio', 'Colour Studio'),
    link('/pricing', 'Pricing'),
    link('/partnership', 'Partnership'),
    link('/journal', 'Journal'),
    link('/about', 'About'),
    link('/contact', 'Book a consultation'),
  ])}</nav>`;
}

function footer(c: Content) {
  const s = c.settings;
  return `<footer><h2>Contact INERIM Interior</h2><p>${esc(s.address)}. Phone and WhatsApp: ${link(`tel:+${s.whatsapp}`, s.phone)}. Email: ${link(`mailto:${s.email}`, s.email)}. ${esc(s.hours)}.</p><p>${link('/contact', 'Book a consultation')} · ${link('/pricing', 'Calculate your price')} · ${link('/shop', 'Visit the shop')}</p></footer>`;
}

const faqHtml = (items: string[][]) => `<section><h2>Frequently asked questions</h2>${items.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`;

function packagesHtml(c: Content) {
  return `<section><h2>Interior packages</h2>${list(
    c.settings.packages.map((p) => `<strong>${esc(p.name)}: ${taka(p.rate)} per sq ft.</strong> ${esc(p.tone)}. ${esc(p.bestFor)}`),
  )}<p>Final prices depend on dimensions, design complexity, materials, hardware, finishing and installation, and are confirmed in a written quotation after site measurement. Electrical work, plumbing, civil work, countertops and appliances are listed as included or excluded in every quotation.</p></section>`;
}

const servicesHtml = () =>
  `<section><h2>Our services</h2>${SERVICE_GROUPS.map((g) => `<h3>${esc(g.title)}</h3><p>${esc(g.lead)}</p>${list(g.items.map(esc))}`).join('')}</section>`;

const processHtml = () => `<section><h2>How we work</h2><ol>${PROCESS.map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${esc(d)}</li>`).join('')}</ol></section>`;

function buildPages(c: Content): Page[] {
  const products = c.products;
  const posts = c.posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const projects = c.projects;
  const cats = [...new Set(products.map((p) => p.category))];
  const pages: Page[] = [];

  pages.push({
    path: '/',
    ...PAGE_META.home,
    priority: '1.0',
    changefreq: 'weekly',
    ld: [{ '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'INERIM Interior', url: SITE }, packagesCatalog(c.settings), faqPage(FAQS)],
    body: `<h1>INERIM Interior: interior design, furniture and materials in Bangladesh</h1>
<p><strong>Your Dream Space. Our Responsibility.</strong> INERIM Interior is a modern, premium and customer-focused interior design and execution brand in Bangladesh. We design, supply and build interiors for homes and businesses, from space planning and 3D visualisation to modular kitchens, wardrobes, custom furniture and installation.</p>
<p>Our design philosophy is modern minimalism with practical, functional space planning and premium-looking material combinations: ${esc(SIGNATURE_ELEMENTS.join(', ').toLowerCase())}.</p>
${img('/designs/d17.jpg', 'INERIM living room with arch wall, stone cladding and sofa set')}
${servicesHtml()}
${packagesHtml(c)}
<section><h2>Shop the pieces behind our rooms</h2>${list(products.filter((p) => p.featured).slice(0, 8).map((p) => `${link(`/shop/${p.slug}`, p.name)}: ${esc(p.summary)}`))}</section>
<section><h2>Colour Studio</h2><p>Try wall paint, upholstery and fabric colours on real INERIM room renders and see how each colour feels in real light. ${link('/colour-studio', 'Open the Colour Studio')}.</p></section>
${processHtml()}
<section><h2>From the journal</h2>${list(posts.slice(0, 4).map((p) => `${link(`/journal/${p.slug}`, p.title)}: ${esc(p.excerpt)}`))}</section>
${faqHtml(FAQS)}`,
  });

  pages.push({
    path: '/shop',
    ...PAGE_META.shop,
    priority: '0.9',
    changefreq: 'weekly',
    ld: [
      { '@type': 'ItemList', name: 'INERIM shop', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/shop/${p.slug}`, name: p.name })) },
      breadcrumbs([['Home', '/'], ['Shop', '/shop']]),
    ],
    body: `<h1>Materials, furniture &amp; finishes</h1><p>Everything we use in our own projects, from acrylic and HPL sheets to wardrobes, panels and hardware. Add items to a quote list and we will send you a price.</p>
${cats.map((cat) => `<section><h2>${esc(cat)}</h2>${list(products.filter((p) => p.category === cat).map((p) => `${link(`/shop/${p.slug}`, p.name)}: ${esc(p.summary)}${p.price != null ? ` ${taka(p.price)} per ${esc(p.unit)}.` : ''}`))}</section>`).join('\n')}`,
  });

  for (const p of products) {
    const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
    pages.push({
      path: `/shop/${p.slug}`,
      title: p.name,
      description: clip(p.summary),
      image: p.images[0],
      type: 'product',
      priority: '0.7',
      changefreq: 'weekly',
      ld: [productLd(p), breadcrumbs([['Home', '/'], ['Shop', '/shop'], [p.name, `/shop/${p.slug}`]])],
      body: `<p>${link('/shop', 'Shop')} › ${link(`/shop?category=${encodeURIComponent(p.category)}`, p.category)}</p>
<h1>${esc(p.name)}</h1>
<p><strong>${p.price != null ? `${taka(p.price)} per ${esc(p.unit)}` : 'Price on request'}</strong></p>
<p>${esc(p.summary)}</p>
${p.images.map((src, i) => img(src, `${p.name}${i ? ` (view ${i + 1})` : ''}`)).join('')}
${p.description ? `<section><h2>About this product</h2>${md(p.description)}</section>` : ''}
${p.finishes.length ? `<section><h2>Finishes and colours</h2>${list(p.finishes.map((f) => esc(f.name)))}</section>` : ''}
${p.specs.length ? `<section><h2>Specifications</h2><dl>${p.specs.map((s) => `<dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd>`).join('')}</dl></section>` : ''}
<section><h2>Delivery and fitting</h2><p>Custom pieces are made to your approved measurements and drawings. Delivery, installation and lead time are confirmed in your written quotation.</p></section>
${related.length ? `<section><h2>More in ${esc(p.category)}</h2>${list(related.map((r) => link(`/shop/${r.slug}`, r.name)))}</section>` : ''}`,
    });
  }

  pages.push({
    path: '/pricing',
    ...PAGE_META.pricing,
    priority: '0.9',
    changefreq: 'monthly',
    ld: [packagesCatalog(c.settings), faqPage(FAQS.slice(0, 3)), breadcrumbs([['Home', '/'], ['Pricing', '/pricing']])],
    body: `<h1>Interior design pricing and packages</h1><p>Set your space size, pick a finish level and see your estimated cost instantly with our online calculator. Packages are priced per square foot.</p>
${packagesHtml(c)}
<section><h2>How a quotation comes together</h2><ol>${['Share your requirements and approximate budget', 'We assess dimensions and scope', 'The design concept and materials are finalised', 'You receive a package-based or customised quotation', 'Scope and commercial terms are confirmed after your approval'].map((s) => `<li>${esc(s)}</li>`).join('')}</ol></section>
${faqHtml(FAQS.slice(0, 3))}`,
  });

  pages.push({
    path: '/projects',
    ...PAGE_META.projects,
    priority: '0.9',
    changefreq: 'weekly',
    ld: [breadcrumbs([['Home', '/'], ['Projects', '/projects']])],
    body: `<h1>Spaces we’ve designed</h1><p>Homes and workplaces planned around budget, lifestyle and space, then built and installed by our own team.</p>
${projects.map((p) => `<section><h2>${link(`/projects/${p.slug}`, p.title)}</h2>${img(p.cover, p.title)}<p>${esc(p.summary)}</p>${list(p.rooms.map((r) => `${esc(r.name)}: ${esc(r.note)}`))}</section>`).join('\n')}`,
  });

  for (const p of projects) {
    pages.push({
      path: `/projects/${p.slug}`,
      title: p.title,
      description: clip(p.summary),
      image: p.cover,
      priority: '0.8',
      changefreq: 'monthly',
      ld: [projectLd(p), breadcrumbs([['Home', '/'], ['Projects', '/projects'], [p.title, `/projects/${p.slug}`]])],
      body: `<p>${link('/projects', 'All projects')}</p><h1>${esc(p.title)}</h1>
<p>${[p.category, p.location, p.area, p.year].filter(Boolean).map(esc).join(' · ')}</p>
<p>${esc(p.summary)}</p>${list(p.highlights.map(esc))}
${p.rooms.map((r) => `<section><h2>${esc(r.name)}</h2><p>${esc(r.note)}</p>${r.images.slice(0, 3).map((src, i) => img(src, `${r.name} by INERIM Interior, view ${i + 1}`)).join('')}</section>`).join('\n')}`,
    });
  }

  pages.push({
    path: '/services',
    ...PAGE_META.services,
    priority: '0.9',
    changefreq: 'monthly',
    ld: [breadcrumbs([['Home', '/'], ['Services', '/services']])],
    body: `<h1>Interior design, furniture and material supply services</h1><p>Interior design, product supply, custom cabinets and project-based execution. Choose one service, or hand us the whole project.</p>
${servicesHtml()}
<section><h2>Who we work for</h2><h3>Residential (primary focus)</h3>${list(['Apartments and flats', 'Newly purchased homes', 'Homes for newly married couples', 'Living, bedroom and dining areas', 'Foyers', 'Modular kitchens and wardrobes'])}<h3>Commercial</h3>${list(['Corporate offices', 'Showrooms and retail outlets', 'Restaurants and cafés', 'Reception areas', 'Workstations', 'Conference rooms'])}</section>
<section><h2>Signature design elements</h2>${list(SIGNATURE_ELEMENTS.map(esc))}</section>`,
  });

  pages.push({
    path: '/about',
    ...PAGE_META.about,
    priority: '0.7',
    changefreq: 'monthly',
    ld: [faqPage(FAQS), breadcrumbs([['Home', '/'], ['About', '/about']])],
    body: `<h1>Your dream space. Our responsibility.</h1><p>INERIM Interior is a modern, premium and customer-focused interior design and execution brand in Bangladesh. Brand promise: <strong>Quality You Can Trust.</strong></p>
<section><h2>Our philosophy</h2><p>Modern minimalism, functional space planning, premium-looking materials and practical solutions for everyday living. We start by understanding your budget, lifestyle, space and design preferences, then propose a practical, visually cohesive solution.</p></section>
<section><h2>Problems we solve</h2>${list(PAIN.map(([q, a]) => `<strong>${esc(q)}</strong> ${esc(a)}`))}</section>
${processHtml()}
<section><h2>Quality checks at every stage</h2><ol>${QC.map((q) => `<li>${esc(q)}</li>`).join('')}</ol></section>
${faqHtml(FAQS)}`,
  });

  pages.push({
    path: '/contact',
    ...PAGE_META.contact,
    priority: '0.8',
    changefreq: 'monthly',
    ld: [{ '@type': 'ContactPage', name: 'Contact INERIM Interior', url: `${SITE}/contact` }, breadcrumbs([['Home', '/'], ['Contact', '/contact']])],
    body: `<h1>Book a consultation</h1><p>Tell us about your space and choose how you’d like to meet: a studio meeting, a site visit, a video call or a phone call. We’ll confirm a time and recommend the right next step. Any visit or measurement fee is confirmed with you before the visit.</p>
<section><h2>What to prepare</h2><p>${esc(FAQS[5][1])}</p></section>`,
  });

  pages.push({
    path: '/partnership',
    ...PAGE_META.partnership,
    priority: '0.7',
    changefreq: 'monthly',
    ld: [breadcrumbs([['Home', '/'], ['Partnership', '/partnership']])],
    body: `<h1>Build more, together: the INERIM partnership program</h1><p>INERIM works with architects, developers, dealers and contractors as a supply, pasting and execution partner.</p>
${PARTNER_TYPES.map((t) => `<section><h2>${esc(t.title)}</h2><p>${esc(t.pitch)}</p>${list(t.offers.map(esc))}</section>`).join('\n')}
<section><h2>How to become a partner</h2><ol><li>Apply online</li><li>Intro meeting</li><li>First order or project</li><li>Ongoing partnership</li></ol></section>`,
  });

  pages.push({
    path: '/colour-studio',
    ...PAGE_META.colourStudio,
    priority: '0.8',
    changefreq: 'monthly',
    ld: [breadcrumbs([['Home', '/'], ['Colour Studio', '/colour-studio']])],
    body: `<h1>Try colours on a real INERIM room</h1><p>Tap any surface in the photo, then pick a colour. The render keeps its real light and shadow, so you see how the colour will actually feel. Download your look or send it to our designers.</p>
${SCENES.map((s) => `<section><h2>${esc(s.name)}</h2>${img(s.image, `${s.name} render by INERIM Interior`)}<p>Surfaces you can recolour: ${s.zones.map((z) => esc(z.label.toLowerCase())).join(', ')}.</p></section>`).join('\n')}`,
  });

  pages.push({
    path: '/journal',
    ...PAGE_META.journal,
    priority: '0.8',
    changefreq: 'weekly',
    ld: [{ '@type': 'Blog', name: 'INERIM Journal', url: `${SITE}/journal` }, breadcrumbs([['Home', '/'], ['Journal', '/journal']])],
    body: `<h1>Ideas, guides &amp; materials</h1><p>Practical advice on planning, materials and pricing from the INERIM studio.</p>
${posts.map((p) => `<article><h2>${link(`/journal/${p.slug}`, p.title)}</h2><p>${esc(p.category)} · ${esc(p.date)} · ${p.readMinutes} min read</p><p>${esc(p.excerpt)}</p></article>`).join('\n')}`,
  });

  for (const p of posts) {
    pages.push({
      path: `/journal/${p.slug}`,
      title: p.title,
      description: clip(p.excerpt),
      image: p.cover,
      type: 'article',
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: p.date,
      ld: [articleLd(p), breadcrumbs([['Home', '/'], ['Journal', '/journal'], [p.title, `/journal/${p.slug}`]])],
      body: `<p>${link('/journal', 'Journal')} › ${esc(p.category)}</p><article><h1>${esc(p.title)}</h1><p>By ${esc(p.author)} · ${esc(p.date)} · ${p.readMinutes} min read</p>${img(p.cover, p.title)}<p><em>${esc(p.excerpt)}</em></p>${md(p.body)}</article>`,
    });
  }

  pages.push({ path: '/quote', title: 'Your quote list', description: PAGE_META.shop.description, body: '<h1>Your quotation request</h1>', noindex: true, priority: '0', changefreq: 'yearly' });
  return pages;
}

/* ------------------------------------------------------------------ render */

function renderHead(p: Page, c: Content) {
  const title = pageTitle(p.title);
  const url = `${SITE}${p.path === '/' ? '/' : p.path}`;
  const image = abs(p.image || '/designs/d17.jpg');
  const ld = p.noindex ? '' : `\n    <script data-static-seo type="application/ld+json">${JSON.stringify(graph(business(c.settings), ...(p.ld || []))).replace(/</g, '\\u003c')}</script>`;
  return `<title>${esc(title)}</title>
    <meta data-static-seo name="description" content="${esc(p.description)}" />
    <meta data-static-seo name="robots" content="${p.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />
    <link data-static-seo rel="canonical" href="${esc(url)}" />
    <meta data-static-seo property="og:site_name" content="INERIM Interior" />
    <meta data-static-seo property="og:title" content="${esc(title)}" />
    <meta data-static-seo property="og:description" content="${esc(p.description)}" />
    <meta data-static-seo property="og:type" content="${p.type || 'website'}" />
    <meta data-static-seo property="og:url" content="${esc(url)}" />
    <meta data-static-seo property="og:image" content="${esc(image)}" />
    <meta data-static-seo property="og:locale" content="en_US" />
    <meta data-static-seo name="twitter:card" content="summary_large_image" />
    <meta data-static-seo name="twitter:title" content="${esc(title)}" />
    <meta data-static-seo name="twitter:description" content="${esc(p.description)}" />
    <meta data-static-seo name="twitter:image" content="${esc(image)}" />${ld}
    `;
}

async function main() {
  const templatePath = path.join(dist, 'index.html');
  if (!fs.existsSync(templatePath)) throw new Error('Run vite build first (dist/index.html missing).');
  const template = fs.readFileSync(templatePath, 'utf8');
  if (!template.includes('<!--seo:start-->') || !template.includes('<!--content:start-->')) throw new Error('index.html is missing the seo/content markers.');

  const { content, source } = await loadContent();
  const pages = buildPages(content);

  for (const p of pages) {
    const html = template
      .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${renderHead(p, content)}<!--seo:end-->`)
      .replace(/<!--content:start-->[\s\S]*?<!--content:end-->/, `<!--content:start-->\n${nav()}\n<main>\n${p.body}\n</main>\n${footer(content)}\n<!--content:end-->`);
    const file = p.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${p.path.slice(1)}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html, 'utf8');
  }

  const indexable = pages.filter((p) => !p.noindex);
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${p.lastmod || today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap, 'utf8');
  console.log(`[prerender] ${pages.length} pages + sitemap (${indexable.length} URLs) from ${source}`);
}

main().catch((e) => {
  console.error('[prerender] failed:', e);
  process.exit(1);
});
