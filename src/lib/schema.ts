// Schema.org structured data built from live CMS content, so search engines see exactly what the site says.
// Keep claims factual: no guarantees, warranties or timelines that INERIM has not confirmed in writing.
import type { Post, Product, Project, Settings } from './types';

export const SITE = 'https://inerimbd.com';

/** Brand suffix only when the title still fits search results (~60 characters). */
export const pageTitle = (t: string) => (t.includes('INERIM') || t.length + 18 > 62 ? t : `${t} | INERIM Interior`);
const abs = (u: string) => (u.startsWith('http') ? u : `${SITE}${u.startsWith('/') ? u : `/${u}`}`);

export const business = (s: Settings) => ({
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${SITE}/#business`,
  name: 'INERIM Interior',
  slogan: 'Your Dream Space. Our Responsibility.',
  description:
    'Modern, premium and customer-focused interior design and execution in Bangladesh: interior design and space planning, 3D visualisation, modular kitchens, wardrobes, custom furniture, HPL/acrylic/laminate sheet supply and board pasting.',
  url: SITE,
  logo: `${SITE}/logo.jpg`,
  image: `${SITE}/designs/d17.jpg`,
  telephone: s.phone,
  email: s.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
  areaServed: { '@type': 'Country', name: 'Bangladesh' },
  priceRange: `৳${Math.min(...s.packages.map((p) => p.rate)).toLocaleString('en-IN')}–৳${Math.max(...s.packages.map((p) => p.rate)).toLocaleString('en-IN')} per sq ft`,
  sameAs: [s.facebook, s.instagram, s.youtube].filter(Boolean),
});

export const packagesCatalog = (s: Settings) => ({
  '@type': 'OfferCatalog',
  name: 'INERIM interior packages',
  itemListElement: s.packages.map((p) => ({
    '@type': 'Offer',
    name: `${p.name} package`,
    description: p.bestFor,
    priceSpecification: { '@type': 'UnitPriceSpecification', price: p.rate, priceCurrency: 'BDT', unitText: 'square foot' },
  })),
});

export const faqPage = (items: string[][]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

export const breadcrumbs = (trail: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
});

export const productLd = (p: Product) => ({
  '@type': 'Product',
  name: p.name,
  description: p.summary,
  image: p.images.length ? p.images.map(abs) : undefined,
  category: p.category,
  brand: { '@type': 'Brand', name: 'INERIM Interior' },
  url: `${SITE}/shop/${p.slug}`,
  ...(p.price != null
    ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: 'BDT', availability: `https://schema.org/${p.inStock ? 'InStock' : 'OutOfStock'}`, url: `${SITE}/shop/${p.slug}` } }
    : {}),
});

export const articleLd = (p: Post) => ({
  '@type': 'BlogPosting',
  headline: p.title,
  description: p.excerpt,
  image: abs(p.cover),
  datePublished: p.date,
  author: { '@type': 'Organization', name: p.author },
  publisher: { '@type': 'Organization', name: 'INERIM Interior', logo: { '@type': 'ImageObject', url: `${SITE}/logo.jpg` } },
  mainEntityOfPage: `${SITE}/journal/${p.slug}`,
});

export const projectLd = (p: Project) => ({
  '@type': 'CreativeWork',
  name: p.title,
  description: p.summary,
  image: abs(p.cover),
  creator: { '@id': `${SITE}/#business` },
  url: `${SITE}/projects/${p.slug}`,
});

/** Wraps one or more nodes in a single @graph document. */
export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
