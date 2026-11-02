import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useContent } from '../lib/cms';
import { mdToHtml } from '../lib/markdown';
import { useStore } from '../lib/store';
import { ProductCard } from '../components/ProductCard';
import { Recolor } from '../components/Recolor';
import { Button, EASE, Reveal, Swatch, priceLabel, swatchStyle, whatsappLink } from '../components/ui';
import NotFound from './NotFound';
import { PageSEO } from '../components/PageSEO';
import { breadcrumbs, productLd } from '../lib/schema';

export default function ProductPage() {
  const { slug } = useParams();
  const { content } = useContent();
  const { addToQuote, toggleWish, wishlist } = useStore();
  const product = content.products.find((p) => p.slug === slug);
  const [img, setImg] = useState(0);
  const [finish, setFinish] = useState(-1);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'about' | 'specs' | 'delivery'>('about');

  useEffect(() => {
    setImg(0);
    setQty(1);
    setFinish(product?.mask ? -1 : product?.finishes.length ? 0 : -1);
  }, [product?.id]);

  if (!product) return <NotFound />;
  const f = finish >= 0 ? product.finishes[finish] : undefined;
  const saved = wishlist.includes(product.id);
  const related = content.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const live = !!product.mask && img === 0;
  const waText = `Hi INERIM, I'm interested in: ${product.name}${f ? ` (${f.name})` : ''}, quantity ${qty} ${product.unit}. Could you share the price and availability?`;

  return (
    <>
      <PageSEO title={product.name} description={product.summary} path={`/shop/${product.slug}`} image={product.images[0]} type="product" ld={() => [productLd(product), breadcrumbs([['Home', '/'], ['Shop', '/shop'], [product.name, `/shop/${product.slug}`]])]} />
      <section className="mx-auto max-w-[1440px] px-4 pb-24 pt-28 sm:px-8 md:pt-36">
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div layoutId={`p-${product.id}`} className="relative aspect-[4/4.2] overflow-hidden rounded-[28px] bg-sand">
              <AnimatePresence mode="wait">
                {product.images.length ? (
                  <motion.div key={img} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="absolute inset-0">
                    {live ? (
                      <Recolor
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full"
                        layers={[{ mask: product.mask!, color: f?.hex ?? null, baseLum: product.maskLum ?? 0.45 }]}
                      />
                    ) : (
                      <img src={product.images[img]} alt={product.name} className="h-full w-full object-cover" />
                    )}
                  </motion.div>
                ) : (
                  <motion.div key={f?.name ?? 'none'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center p-10">
                    <motion.div
                      initial={{ rotate: -8, y: 30 }}
                      animate={{ rotate: -4, y: 0 }}
                      transition={{ duration: 0.8, ease: EASE }}
                      className="aspect-[3/4] w-[58%] rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]"
                      style={f ? swatchStyle(f) : {}}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {live && (
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs backdrop-blur">
                  {f ? `Previewing ${f.name}` : 'Live colour preview: pick a fabric'}
                </span>
              )}
              {!product.images.length && f && <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs">{f.name}</span>}
            </motion.div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((src, i) => (
                  <button key={src} onClick={() => setImg(i)} className={`h-20 w-24 cursor-pointer overflow-hidden rounded-xl transition-opacity ${i === img ? 'ring-2 ring-teal' : 'opacity-60 hover:opacity-100'}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* details */}
          <div>
            <Reveal>
              <p className="text-sm text-muted">{product.category}</p>
              <h1 className="mt-2 text-4xl font-medium leading-[1.02] md:text-6xl">{product.name}</h1>
              <p className="mt-4 text-xl">{priceLabel(product.price, product.unit)}</p>
              <p className="mt-5 max-w-lg leading-relaxed text-muted">{product.summary}</p>
            </Reveal>

            {product.finishes.length > 0 && (
              <Reveal delay={0.1} className="mt-10">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium">Finish</span>
                  <span className="text-muted">{f ? f.name : 'As shown'}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.mask && (
                    <button
                      onClick={() => setFinish(-1)}
                      className={`h-10 cursor-pointer rounded-full px-3 text-xs ${finish === -1 ? 'bg-ink text-white' : 'bg-white ring-1 ring-ink/10'}`}
                    >
                      As shown
                    </button>
                  )}
                  {product.finishes.map((x, i) => (
                    <Swatch
                      key={x.name}
                      finish={x}
                      active={i === finish}
                      onClick={() => {
                        setFinish(i);
                        setImg(0);
                      }}
                    />
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full bg-white p-1">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-paper">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[4.5rem] text-center text-sm">
                  {qty} {product.unit}
                </span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-paper">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={() =>
                  addToQuote({ productId: product.id, slug: product.slug, name: product.name, finish: f?.name, image: product.images[0], unit: product.unit, price: product.price, qty })
                }
                size="lg"
              >
                <ShoppingBag className="h-4 w-4" /> Add to quote
              </Button>
              <button
                onClick={() => toggleWish(product.id)}
                aria-label={saved ? 'Remove from saved' : 'Save'}
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white transition-transform hover:scale-105"
              >
                <Heart className={`h-5 w-5 ${saved ? 'fill-teal text-teal' : ''}`} />
              </button>
            </Reveal>
            <a href={whatsappLink(content.settings.whatsapp, waText)} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-teal underline underline-offset-4">
              Ask about this on WhatsApp
            </a>

            <div className="mt-12 rounded-[24px] bg-white p-6">
              <div className="flex gap-1 border-b border-line pb-3">
                {(
                  [
                    ['about', 'About'],
                    ['specs', 'Specifications'],
                    ['delivery', 'Delivery & fitting'],
                  ] as const
                ).map(([k, l]) => (
                  <button key={k} onClick={() => setTab(k)} className={`relative cursor-pointer px-3 py-1.5 text-sm ${tab === k ? 'text-ink' : 'text-muted'}`}>
                    {l}
                    {tab === k && <motion.span layoutId="ptab" className="absolute inset-x-2 -bottom-[13px] h-0.5 bg-teal" />}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-5 text-sm leading-relaxed text-muted">
                  {tab === 'about' && <div className="prose-inerim !text-[15px]" dangerouslySetInnerHTML={{ __html: mdToHtml(product.description || product.summary) }} />}
                  {tab === 'specs' && (
                    <dl className="divide-y divide-line">
                      {product.specs.map((s) => (
                        <div key={s.label} className="flex justify-between gap-6 py-2.5">
                          <dt>{s.label}</dt>
                          <dd className="text-right text-ink">{s.value}</dd>
                        </div>
                      ))}
                      <div className="flex justify-between gap-6 py-2.5">
                        <dt>Availability</dt>
                        <dd className="text-ink">{product.inStock ? 'Available to order' : 'Currently unavailable'}</dd>
                      </div>
                    </dl>
                  )}
                  {tab === 'delivery' && (
                    <p>
                      Custom pieces are made to your approved measurements and drawings. Delivery, installation and lead time are confirmed
                      in your written quotation. Material supply orders can be collected or delivered by arrangement.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
          <h2 className="mb-8 text-3xl font-medium md:text-4xl">More in {product.category}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
