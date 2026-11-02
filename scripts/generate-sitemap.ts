/**
 * Generates public/sitemap.xml (and dist/sitemap.xml after a build) from the site's routes and starter content.
 * Runs automatically after `npm run build`. Products/posts/projects added later in the CMS appear after the next build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_POSTS, SEED_PRODUCTS, SEED_PROJECTS } from '../src/lib/seed';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://inerimbd.com';
const today = new Date().toISOString().split('T')[0];

interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
}

const staticRoutes: SitemapEntry[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/shop', priority: '0.9', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/colour-studio', priority: '0.8', changefreq: 'monthly' },
  { path: '/partnership', priority: '0.7', changefreq: 'monthly' },
  { path: '/journal', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
];

const allRoutes: SitemapEntry[] = [
  ...staticRoutes,
  ...SEED_PROJECTS.map((p): SitemapEntry => ({ path: `/projects/${p.slug}`, priority: '0.8', changefreq: 'monthly' })),
  ...SEED_PRODUCTS.map((p): SitemapEntry => ({ path: `/shop/${p.slug}`, priority: '0.7', changefreq: 'weekly' })),
  ...SEED_POSTS.filter((p) => p.published).map((p): SitemapEntry => ({ path: `/journal/${p.slug}`, priority: '0.7', changefreq: 'monthly', lastmod: p.date })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (e) => `  <url>
    <loc>${BASE_URL}${e.path}</loc>
    <lastmod>${e.lastmod || today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), xml, 'utf8');
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] ${allRoutes.length} URLs written to public/sitemap.xml${fs.existsSync(distDir) ? ' and dist/sitemap.xml' : ''}`);
