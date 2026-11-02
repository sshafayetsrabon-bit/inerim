import { useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { Chips, Field, Honeypot, SentPanel, useInquiry } from '../components/Form';
import { Button, EASE, PageHeader, formatBDT } from '../components/ui';

const NEEDS = ['Supply only', 'Supply & installation', 'Not sure yet'] as const;

export default function Quote() {
  const { quote, setQty, removeFromQuote, clearQuote } = useStore();
  const { state, send, reset } = useInquiry('quote');
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', notes: '' });
  const [need, setNeed] = useState<(typeof NEEDS)[number]>('Supply & installation');
  const [hp, setHp] = useState('');
  const allPriced = quote.length > 0 && quote.every((q) => q.price != null);
  const subtotal = quote.reduce((s, q) => s + (q.price ?? 0) * q.qty, 0);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const itemsText = quote.map((q) => `• ${q.name}${q.finish ? ` (${q.finish})` : ''}: ${q.qty} ${q.unit}`).join('\n');
  const waText = `Hi INERIM, please send me a quotation.\n\n${itemsText}\n\nName: ${form.name}\nPhone: ${form.phone}\nLocation: ${form.location}\nNeed: ${need}${form.notes ? `\nNotes: ${form.notes}` : ''}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await send({
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.notes,
      website: hp,
      data: { location: form.location, need, items: quote.map(({ name, finish, qty, unit, slug }) => ({ name, finish, qty, unit, slug })) },
    });
    if (ok) clearQuote();
  };

  return (
    <>
      <PageHeader eyebrow="Quote list" title="Your quotation request" intro="Add products from the shop, adjust quantities and send the list. We reply with prices, availability and lead times." />
      <section className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
        {state === 'sent' || state === 'offline' ? (
          <SentPanel state={state} waText={waText} title="Your quote request is in." onReset={reset} />
        ) : quote.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-24 text-center">
            <motion.div initial={{ y: 10 }} animate={{ y: [10, -6, 10] }} transition={{ repeat: Infinity, duration: 3 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-paper">
              <ShoppingBag className="h-6 w-6" />
            </motion.div>
            <p className="mt-6 text-2xl font-medium">Your quote list is empty</p>
            <p className="mt-2 text-sm text-muted">Browse the shop and tap “Add to quote” on anything you like.</p>
            <Button to="/shop" className="mt-8">
              Go to the shop
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[28px] bg-white p-4 sm:p-6">
              <AnimatePresence initial={false}>
                {quote.map((q) => (
                  <motion.div
                    key={q.key}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, x: -40 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-4 border-b border-line py-4 last:border-0">
                      <Link to={`/shop/${q.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand">
                        {q.image && <img src={q.image} alt="" className="h-full w-full object-cover" />}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/shop/${q.slug}`} className="block truncate font-medium hover:text-teal">
                          {q.name}
                        </Link>
                        <p className="text-sm text-muted">{q.finish ? `Finish: ${q.finish}` : 'Finish to confirm'}</p>
                        <p className="text-sm text-muted">{q.price != null ? `${formatBDT(q.price)} / ${q.unit}` : 'Price on request'}</p>
                      </div>
                      <div className="flex items-center rounded-full bg-paper p-1">
                        <button onClick={() => setQty(q.key, q.qty - 1)} aria-label="Decrease" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm">{q.qty}</span>
                        <button onClick={() => setQty(q.key, q.qty + 1)} aria-label="Increase" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-white">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button onClick={() => removeFromQuote(q.key)} aria-label="Remove" className="cursor-pointer p-2 text-muted hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex items-center justify-between px-2 pt-4 text-sm">
                <span className="text-muted">{quote.reduce((n, q) => n + q.qty, 0)} items</span>
                <span className="font-medium">{allPriced ? `Subtotal ${formatBDT(subtotal)}` : 'Prices confirmed in your quotation'}</span>
              </div>
            </div>

            <form onSubmit={submit} className="relative space-y-3 rounded-[28px] bg-white p-6 sm:p-8 lg:sticky lg:top-24 lg:self-start">
              <h2 className="mb-2 text-2xl font-medium">Your details</h2>
              <Honeypot value={hp} onChange={setHp} />
              <Field label="Your name" required value={form.name} onChange={set('name')} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone" type="tel" required value={form.phone} onChange={set('phone')} />
                <Field label="Email" type="email" value={form.email} onChange={set('email')} />
              </div>
              <Field label="Project location" value={form.location} onChange={set('location')} />
              <div className="py-2">
                <p className="mb-2 text-xs text-muted">What do you need?</p>
                <Chips options={NEEDS} value={need} onChange={(v) => setNeed(v as (typeof NEEDS)[number])} />
              </div>
              <Field label="Notes (sizes, colours, deadlines…)" textarea value={form.notes} onChange={set('notes')} />
              <Button type="submit" size="lg" className="w-full" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Request quotation'}
              </Button>
              <p className="text-center text-xs text-muted">No payment needed. We confirm prices and availability first.</p>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
