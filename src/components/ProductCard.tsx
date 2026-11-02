import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Heart, Plus } from 'lucide-react';
import type { Product } from '../lib/types';
import { useStore } from '../lib/store';
import { EASE, MaterialStack, priceLabel, swatchStyle } from './ui';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { toggleWish, wishlist, addToQuote } = useStore();
  const saved = wishlist.includes(product.id);
  const [a, b] = product.images;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: EASE, delay: Math.min(index, 8) * 0.04 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-sand">
        <Link to={`/shop/${product.slug}`} data-cursor="View" className="absolute inset-0">
          {a ? (
            <>
              <img src={a} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              {b && <img src={b} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
            </>
          ) : (
            <MaterialStack finishes={product.finishes} />
          )}
        </Link>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium backdrop-blur">{product.category}</span>
          <button
            onClick={() => toggleWish(product.id)}
            aria-label={saved ? 'Remove from saved' : 'Save'}
            className="pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
          >
            <motion.span animate={saved ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.4 }}>
              <Heart className={`h-4 w-4 ${saved ? 'fill-teal text-teal' : ''}`} />
            </motion.span>
          </button>
        </div>
        <button
          onClick={() =>
            addToQuote({ productId: product.id, slug: product.slug, name: product.name, finish: product.finishes[0]?.name, image: a, unit: product.unit, price: product.price })
          }
          className="absolute bottom-3 right-3 flex translate-y-3 cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-xs font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
        >
          <Plus className="h-3.5 w-3.5" /> Add to quote
        </button>
      </div>
      <Link to={`/shop/${product.slug}`} className="mt-4 block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-medium leading-snug tracking-tight">{product.name}</h3>
          {product.finishes.length > 0 && (
            <div className="mt-1 flex shrink-0 -space-x-1.5">
              {product.finishes.slice(0, 4).map((f) => (
                <span key={f.name} className="h-4 w-4 rounded-full ring-2 ring-paper" style={swatchStyle(f)} />
              ))}
              {product.finishes.length > 4 && <span className="pl-2.5 text-[11px] text-muted">+{product.finishes.length - 4}</span>}
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{priceLabel(product.price, product.unit)}</p>
      </Link>
    </motion.article>
  );
}
