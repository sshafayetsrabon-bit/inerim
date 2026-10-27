import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { PRODUCTS_DATA, Product } from '../data/shopData';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  Ruler,
  Layers,
  Sparkles,
  PhoneCall,
  Clock,
  Heart
} from 'lucide-react';

interface ProductDetailPageProps {
  product?: Product;
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: propProduct,
  setCurrentPage,
  onOpenCalculator,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();

  // Find product by slug or prop
  const product =
    propProduct ||
    PRODUCTS_DATA.find((p) => p.slug === slug || p.id === slug) ||
    PRODUCTS_DATA[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <SEO title="Product Not Found | INERIM Shop" noindex={true} />
        <h2 className="text-2xl font-bold font-serif">Product Not Found</h2>
        <Link to="/shop" className="text-[#087973] hover:underline mt-4 inline-block">
          Return to Furniture Catalog
        </Link>
      </div>
    );
  }

  const primaryImage = product.images[activeImageIndex] || product.images[0];
  const absoluteImageUrl = primaryImage.startsWith('http')
    ? primaryImage
    : `https://inerimbd.com${primaryImage}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) =>
      img.startsWith('http') ? img : `https://inerimbd.com${img}`
    ),
    description: product.shortDescription || product.description,
    sku: product.id,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'INERIM Interior',
    },
    offers: {
      '@type': 'Offer',
      url: `https://inerimbd.com/shop/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Dynamic SEO Head Management */}
      <SEO
        title={`${product.name} — Custom Architectural Furniture Dhaka`}
        description={`${product.shortDescription} Manufactured with German CNC precision and premium moisture-proof Action TESA HDHMR in Dhaka, Bangladesh.`}
        canonicalUrl={`/shop/${product.slug}`}
        ogImage={absoluteImageUrl}
        ogType="product"
        keywords={`${product.name}, ${product.category} Bangladesh, custom furniture Dhaka, ${product.materials.join(', ')}`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-[#087973] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#087973] transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#087973] font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 sm:h-[480px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#087973] text-white text-xs font-bold uppercase tracking-wider shadow">
                {product.badge}
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#087973] scale-105 shadow'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Specs & Purchasing Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#087973]">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-[#087973]">
              ৳ {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-base line-through text-muted-foreground">
                ৳ {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-2">(Includes fabrication & fitting)</span>
          </div>

          <p className={`text-sm leading-relaxed ${isDark ? 'text-white/80' : 'text-black/80'}`}>
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <Ruler className="w-4 h-4 text-[#087973]" />
              <span><strong>Dimensions:</strong> {product.dimensions}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#087973]" />
              <span><strong>Delivery:</strong> {product.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#087973]" />
              <span><strong>Warranty:</strong> {product.warranty}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#087973]" />
              <span><strong>Installation:</strong> Free in Dhaka</span>
            </div>
          </div>

          {/* Materials List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#087973]">Materials & Construction</h3>
            <div className="flex flex-wrap gap-2">
              {product.materials.map((m, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-lg border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#087973]">Architectural Features</h3>
            <ul className="space-y-1.5">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 text-[#087973] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a
              href="https://wa.me/8801898755000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              Order via WhatsApp (+8801898755000)
            </a>
            <button
              onClick={onOpenCalculator}
              className={`px-6 py-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-black/15 bg-black/5 hover:bg-black/10 text-black'
              }`}
            >
              Customize Size & Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
