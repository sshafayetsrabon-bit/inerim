import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowUpRight, Heart, Search, X } from 'lucide-react';
import { useContent } from '../lib/cms';
import { CATEGORIES } from '../lib/seed';
import { useStore } from '../lib/store';
import { ProductCard } from '../components/ProductCard';
import { PageHeader, Reveal } from '../components/ui';
import { PageSEO } from '../components/PageSEO';
import { PAGE_META } from '../lib/copy';
import { breadcrumbs } from '../lib/schema';

const SORTS = { featured: 'Featured', az: 'Name A–Z', priceAsc: 'Price: low to high', priceDesc: 'Price: high to low' } as const;

export default function Shop() {
  const { content } = useContent();
  const { wishlist } = useStore();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<keyof typeof SORTS>('featured');
  const cat = params.get('category') || 'All';
  const savedOnly = params.get('view') === 'saved';

  const cats = ['All', ...CATEGORIES.filter((c) => content.products.some((p) => p.category === c)), ...[...new Set(content.products.map((p) => p.category))].filter((c) => !CATEGORIES.includes(c))];

  const list = useMemo(() => {
    let l = content.products.filter((p) => (cat === 'All' || p.category === cat) && (!savedOnly || wishlist.includes(p.id)));
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((p) => [p.name, p.summary, p.category, ...p.tags, ...p.finishes.map((f) => f.name)].join(' ').toLowerCase().includes(s));
    }
    const price = (p: { price: number | null }) => p.price ?? Number.POSITIVE_INFINITY;
    if (sort === 'az') l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'priceAsc') l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === 'priceDesc') l = [...l].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === 'featured') l = [...l].sort((a, b) => Number(b.featured) - Number(a.featured));
    return l;
  }, [content.products, cat, q, sort, savedOnly, wishlist]);

  const setCat = (c: string) => {
    const p = new URLSearchParams(params);
    if (c === 'All') p.delete('category');
    else p.set('category', c);
    setParams(p, { replace: true, preventScrollReset: true });
  };
  const toggleSaved = () => {
    const p = new URLSearchParams(params);
    if (savedOnly) p.delete('view');
    else p.set('view', 'saved');
    setParams(p, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <PageSEO {...PAGE_META.shop} path="/shop" ld={(c) => [{ '@type': 'ItemList', name: 'INERIM shop', itemListElement: c.products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://inerimbd.com/shop/${p.slug}`, name: p.name })) }, breadcrumbs([['Home', '/'], ['Shop', '/shop']])]} />
      <PageHeader
        eyebrow="Shop · Interior supplier"
        title="Materials, furniture & finishes"
        intro="Everything we use in our own projects, from acrylic and HPL sheets to wardrobes, panels and hardware. Add items to a quote list and we will send you a price."
      />

      <section className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
        <div className="sticky top-[68px] z-30 -mx-4 mb-10 bg-paper/85 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <LayoutGroup id="shop-cats">
              <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
                {cats.map((c) => (
                  <button key={c} onClick={() => setCat(c)} className="relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px]">
                    {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                    <span className={`relative transition-colors ${cat === c ? 'text-white' : 'text-ink/65 hover:text-ink'}`}>{c}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
              <label className="flex w-full flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm sm:w-auto lg:w-64 lg:flex-none">
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, finishes…" className="w-full bg-transparent outline-none placeholder:text-muted" />
                {q && (
                  <button onClick={() => setQ('')} aria-label="Clear search" className="cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>
              <div className="flex w-full flex-1 items-center justify-between gap-2 sm:w-auto sm:flex-none sm:justify-start">
                <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="flex-1 cursor-pointer rounded-full bg-white px-4 py-2.5 text-sm outline-none sm:flex-none" aria-label="Sort">
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleSaved}
                  aria-pressed={savedOnly}
                  className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors ${savedOnly ? 'bg-teal text-white' : 'bg-white'}`}
                >
                  <Heart className={`h-4 w-4 ${savedOnly ? 'fill-white' : ''}`} /> Saved {wishlist.length > 0 && `(${wishlist.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm text-muted">
          {list.length} {list.length === 1 ? 'item' : 'items'}
          {cat !== 'All' && ` in ${cat}`}
        </p>

        {list.length ? (
          <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-[28px] bg-white px-6 py-20 text-center">
            <p className="text-2xl font-medium">{savedOnly ? 'Nothing saved yet' : 'No products match'}</p>
            <p className="mt-2 text-sm text-muted">{savedOnly ? 'Tap the heart on any product to save it here.' : 'Try another category or search term.'}</p>
          </div>
        )}

        <Reveal className="mt-24 grid gap-4 md:grid-cols-2">
          <Link to="/partnership" className="group flex items-center justify-between gap-6 rounded-[28px] bg-ink p-8 text-white md:p-10">
            <div>
              <p className="text-sm text-white/60">Buying in volume?</p>
              <p className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">Trade & partnership pricing</p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
          <Link to="/colour-studio" className="group flex items-center justify-between gap-6 rounded-[28px] bg-mint p-8 md:p-10">
            <div>
              <p className="text-sm text-teal-deep/70">Not sure about a colour?</p>
              <p className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">Try it in the Colour Studio</p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
