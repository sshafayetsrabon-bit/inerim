import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface QuoteItem {
  key: string; // productId + finish
  productId: string;
  slug: string;
  name: string;
  finish?: string;
  image?: string;
  unit: string;
  qty: number;
  price: number | null;
}

interface Store {
  quote: QuoteItem[];
  addToQuote: (item: Omit<QuoteItem, 'key' | 'qty'> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  removeFromQuote: (key: string) => void;
  clearQuote: () => void;
  wishlist: string[];
  toggleWish: (productId: string) => void;
  toast: string | null;
}

const StoreCtx = createContext<Store | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [quote, setQuote] = useState<QuoteItem[]>(() => load('inerim-quote', []));
  const [wishlist, setWishlist] = useState<string[]>(() => load('inerim-wishlist', []));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => persist('inerim-quote', quote), [quote]);
  useEffect(() => persist('inerim-wishlist', wishlist), [wishlist]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo<Store>(
    () => ({
      quote,
      wishlist,
      toast,
      addToQuote: (item) => {
        const key = `${item.productId}::${item.finish || ''}`;
        setQuote((q) => {
          const found = q.find((x) => x.key === key);
          if (found) return q.map((x) => (x.key === key ? { ...x, qty: x.qty + (item.qty || 1) } : x));
          return [...q, { ...item, key, qty: item.qty || 1 }];
        });
        setToast(`${item.name} added to your quote`);
      },
      setQty: (key, qty) => setQuote((q) => q.map((x) => (x.key === key ? { ...x, qty: Math.max(1, qty) } : x))),
      removeFromQuote: (key) => setQuote((q) => q.filter((x) => x.key !== key)),
      clearQuote: () => setQuote([]),
      toggleWish: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    }),
    [quote, wishlist, toast],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => {
  const s = useContext(StoreCtx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
};
