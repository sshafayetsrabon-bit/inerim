import { SEO } from './SEO';
import { useContent } from '../lib/cms';
import { business, graph } from '../lib/schema';
import type { Content } from '../lib/types';

/** Per-page meta tags + structured data. The business node is always included; pages add their own nodes. */
export function PageSEO({
  title,
  description,
  path,
  image,
  type,
  noindex,
  ld,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  ld?: (c: Content) => object[];
}) {
  const { content } = useContent();
  return (
    <SEO
      title={title}
      description={description}
      canonicalUrl={path}
      ogImage={image}
      ogType={type}
      noindex={noindex}
      jsonLd={noindex ? undefined : graph(business(content.settings), ...(ld ? ld(content) : []))}
    />
  );
}
