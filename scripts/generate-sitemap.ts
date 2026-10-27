import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROJECTS_DATA } from '../src/data/projectsData';
import { BLOG_POSTS } from '../src/data/blogData';
import { PRODUCTS_DATA } from '../src/data/shopData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = 'https://inerimbd.com';
const today = new Date().toISOString().split('T')[0];

interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
}

// 1. Core Static Routes
const staticRoutes: SitemapEntry[] = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/how-we-work', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
  { path: '/quote', priority: '0.9', changefreq: 'weekly' },
  { path: '/colour-studio', priority: '0.8', changefreq: 'weekly' },
  { path: '/partnership', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/work', priority: '0.8', changefreq: 'weekly' },
  { path: '/shop', priority: '0.9', changefreq: 'weekly' },
  { path: '/journal', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
];

// 2. Dynamic Project Portfolio Routes (/projects/:slug)
const projectRoutes: SitemapEntry[] = PROJECTS_DATA.map((p) => ({
  path: `/projects/${p.id}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

// 3. Dynamic Shop & Furniture Routes (/shop/:slug)
const shopRoutes: SitemapEntry[] = PRODUCTS_DATA.map((p) => ({
  path: `/shop/${p.slug}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

// 4. Dynamic Journal & Article Routes (/journal/:slug)
const journalRoutes: SitemapEntry[] = BLOG_POSTS.map((p) => ({
  path: `/journal/${p.slug || p.id}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

const allRoutes: SitemapEntry[] = [
  ...staticRoutes,
  ...projectRoutes,
  ...shopRoutes,
  ...journalRoutes,
];

// Generate XML content
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (entry) => `  <url>
    <loc>${BASE_URL}${entry.path}</loc>
    <lastmod>${entry.lastmod || today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

// Write to public/sitemap.xml (so it is copied by Vite)
const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, xml, 'utf8');

// Write directly to dist/sitemap.xml if dist exists
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
}

console.log(
  `[Sitemap Generator] Successfully generated sitemap with ${allRoutes.length} URLs:`
);
console.log(` - Static pages: ${staticRoutes.length}`);
console.log(` - Projects: ${projectRoutes.length}`);
console.log(` - Shop products: ${shopRoutes.length}`);
console.log(` - Journal articles: ${journalRoutes.length}`);
console.log(` Output: ${publicPath} and dist/sitemap.xml`);
