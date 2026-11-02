import React from 'react';
import { Helmet } from 'react-helmet-async';
import { pageTitle } from '../lib/schema';

export interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  keywords?: string;
  noindex?: boolean;
}

const SITE_DOMAIN = 'https://inerimbd.com';
const DEFAULT_SITE_NAME = 'INERIM Interior';
const DEFAULT_DESCRIPTION =
  'INERIM Interior is a modern, premium interior design and execution studio in Bangladesh: interior design, modular kitchens, wardrobes, custom furniture, HPL/acrylic sheet supply and board pasting. Packages from ৳1,350/sft.';
const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/designs/d17.jpg`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
  keywords,
  noindex = false,
}) => {
  // Format title with site brand suffix if not already present
  const fullTitle = pageTitle(title);

  // Compute absolute canonical URL
  const absoluteCanonical = canonicalUrl
    ? canonicalUrl.startsWith('http')
      ? canonicalUrl
      : `${SITE_DOMAIN}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`
    : typeof window !== 'undefined'
      ? `${SITE_DOMAIN}${window.location.pathname}`
      : SITE_DOMAIN;

  // Compute absolute image URL
  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_DOMAIN}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={absoluteCanonical} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={absoluteCanonical} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Structured Data (Schema.org JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
