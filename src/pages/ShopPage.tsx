import React, { useState, useMemo } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { PRODUCTS_DATA, Product } from '../data/shopData';
import { ShoppingBag, Search, Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface ShopPageProps {
  setCurrentPage?: (page: PageId) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  setCurrentPage,
  onSelectProduct,
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Bedroom Joinery', 'Dining & Seating', 'Wardrobes & Storage', 'Modular Kitchens', 'Kids & Youth'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="py-8 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title="Bespoke Architectural Furniture & Modular Kitchens | Shop Dhaka"
        description="Shop custom cantilevered floating beds, modular acrylic kitchens, ergonomic dining sets, and slatted louvre wardrobes manufactured with German CNC precision in Dhaka, Bangladesh."
        canonicalUrl="/shop"
        ogImage="/products/floating-bed.jpg"
        ogType="website"
        keywords="custom furniture Dhaka, modular kitchen shop Bangladesh, floating bed Bangladesh, louvre wardrobe Dhaka, modern dining table Bangladesh"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'INERIM Interior Furniture & Modular Products',
          description: 'Catalog of bespoke architectural furniture and modular joinery in Bangladesh',
          url: 'https://inerimbd.com/shop',
        }}
      />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          Direct Factory Joinery
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
          Bespoke Architectural Furniture & Modular Systems
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-white/70' : 'text-black/70'}`}>
          Direct from our German CNC automated production plant to your home. Built with moisture-resistant HDHMR, authentic wood veneers, and Blum lifetime hardware.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#087973] text-white shadow'
                  : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                  : 'bg-black/5 hover:bg-black/10 text-black/70 border border-black/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search furniture, materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-[#087973] ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-black/10 text-black'
            }`}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group ${
              isDark ? 'bg-white/[0.02] border-white/10 hover:border-[#087973]/60' : 'bg-white border-black/10 hover:shadow-lg'
            }`}
          >
            <div>
              <div className="relative h-64 overflow-hidden bg-neutral-900">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#087973] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
                  {product.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-bold text-lg font-serif">{product.name}</h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-serif text-[#087973]">
                    ৳ {product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs line-through text-muted-foreground">
                      ৳ {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p className={`text-xs line-clamp-2 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {product.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.materials.slice(0, 2).map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-black/5 border-black/10 text-black/60'
                      }`}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <a
                href={`/shop/${product.slug}`}
                onClick={(e) => {
                  if (onSelectProduct) {
                    e.preventDefault();
                    onSelectProduct(product);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#087973] hover:text-white border border-white/15 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                View Specifications
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
