import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowUpRight, Check, Info, Minus, Plus } from 'lucide-react';
import { useSettings } from '../lib/cms';
import { AnimatedNumber, Button, EASE, formatBDT, whatsappLink } from './ui';

export interface Estimate {
  sft: number;
  packageName: string;
  rate: number;
  total: number;
  rooms?: string;
}

export const ROOM_PRESETS = [
  { id: 'living', label: 'Living room', sft: 220 },
  { id: 'dining', label: 'Dining', sft: 140 },
  { id: 'master', label: 'Master bedroom', sft: 190 },
  { id: 'bed', label: 'Bedroom', sft: 150 },
  { id: 'kids', label: "Kids' room", sft: 130 },
  { id: 'kitchen', label: 'Kitchen', sft: 90 },
  { id: 'foyer', label: 'Foyer', sft: 50 },
];
const FLAT_PRESETS = [
  { label: '2 Bed', sft: 1050 },
  { label: '3 Bed', sft: 1450 },
  { label: '4 Bed', sft: 2100 },
  { label: 'Duplex', sft: 3200 },
];
export const EXCLUDED_BY_DEFAULT = ['Electrical work', 'Plumbing', 'Civil work', 'Countertops', 'Appliances'];

const MIN = 300;
const MAX = 5000;
const lakh = (n: number) => (n >= 1e7 ? `≈ ${(n / 1e7).toFixed(2)} crore taka` : `≈ ${(n / 1e5).toFixed(1)} lakh taka`);

export function Calculator({ compact = false }: { compact?: boolean }) {
  const settings = useSettings();
  const pkgs = settings.packages;
  const navigate = useNavigate();
  const [mode, setMode] = useState<'flat' | 'rooms'>('flat');
  const [flatSft, setFlatSft] = useState(1450);
  const [rooms, setRooms] = useState<Record<string, number>>({ living: 1, dining: 1, master: 1, bed: 1, kitchen: 1 });
  const [pkgId, setPkgId] = useState(pkgs[1]?.id ?? pkgs[0]?.id);

  const roomSft = useMemo(() => ROOM_PRESETS.reduce((s, r) => s + r.sft * (rooms[r.id] || 0), 0), [rooms]);
  const sft = mode === 'flat' ? flatSft : roomSft;
  const pkg = pkgs.find((p) => p.id === pkgId) ?? pkgs[0];
  const total = sft * pkg.rate;
  const maxRate = Math.max(...pkgs.map((p) => p.rate));
  const roomsLabel = ROOM_PRESETS.filter((r) => rooms[r.id]).map((r) => `${rooms[r.id]}× ${r.label}`).join(', ');
  const estimate: Estimate = { sft, packageName: pkg.name, rate: pkg.rate, total, rooms: mode === 'rooms' ? roomsLabel : undefined };
  const waText =
    `Hi INERIM! I used the price calculator on your website.\n\n` +
    `Area: ${sft.toLocaleString('en-IN')} sft${mode === 'rooms' ? ` (${roomsLabel})` : ''}\n` +
    `Package: ${pkg.name} (${formatBDT(pkg.rate)}/sft)\nEstimate: ${formatBDT(total)}\n\nI'd like to book a consultation.`;
  const fill = ((flatSft - MIN) / (MAX - MIN)) * 100;
  const bump = (id: string, d: number) => setRooms((r) => ({ ...r, [id]: Math.max(0, Math.min(6, (r[id] || 0) + d)) }));

  const slider = (
    <>
      <div className="flex items-end gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={flatSft}
          onChange={(e) => setFlatSft(Math.max(0, Math.min(20000, Number(e.target.value) || 0)))}
          style={{ width: `${Math.max(3, String(flatSft).length) * 0.6 + 0.1}em` }}
          className="bg-transparent text-6xl font-medium leading-none tracking-tight outline-none [appearance:textfield] md:text-7xl [&::-webkit-inner-spin-button]:appearance-none"
          aria-label="Area in square feet"
        />
        <span className="pb-2 text-muted">sft</span>
      </div>
      <input
        type="range"
        className="range mt-6"
        min={MIN}
        max={MAX}
        step={10}
        value={Math.min(MAX, Math.max(MIN, flatSft))}
        onChange={(e) => setFlatSft(Number(e.target.value))}
        style={{ ['--fill' as string]: `${Math.min(100, Math.max(0, fill))}%` }}
        aria-label="Area slider"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        {FLAT_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setFlatSft(p.sft)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${flatSft === p.sft ? 'border-teal bg-mint text-teal-deep' : 'border-line bg-white hover:border-ink/30'}`}
          >
            {p.label} <span className="text-muted">~{p.sft.toLocaleString()}</span>
          </button>
        ))}
      </div>
    </>
  );

  const packagePicker = (
    <div className={`grid gap-2.5 ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 xl:grid-cols-4'}`}>
      {pkgs.map((p) => {
        const on = p.id === pkg.id;
        return (
          <button
            key={p.id}
            onClick={() => setPkgId(p.id)}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition-all duration-500 ${on ? 'border-teal bg-white shadow-[0_18px_40px_-20px_rgba(11,120,117,0.6)]' : 'border-line bg-white/60 hover:bg-white'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] text-muted">{p.tone}</span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${on ? 'border-teal bg-teal text-white' : 'border-line'}`}>
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </div>
            <div className="mt-5 text-lg font-medium tracking-tight">{p.name}</div>
            <div className="text-[13px] text-muted">{formatBDT(p.rate)}/sft</div>
          </button>
        );
      })}
    </div>
  );

  if (compact)
    return (
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[28px] bg-white p-6 sm:p-8">
          <p className="mb-4 text-sm text-muted">How big is your space?</p>
          {slider}
          <p className="mb-3 mt-8 text-sm text-muted">Choose a finish level</p>
          {packagePicker}
        </div>
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-teal p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-sm text-white/70">Estimated total · {pkg.name}</p>
            <p className="mt-4 text-5xl font-medium tracking-tight sm:text-6xl">
              <AnimatedNumber value={total} format={formatBDT} />
            </p>
            <p className="mt-2 text-sm text-white/70">{lakh(total)}</p>
          </div>
          <div className="relative mt-10 flex flex-wrap gap-2">
            <Button to="/pricing" variant="light">
              Full calculator <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button href={whatsappLink(settings.whatsapp, waText)} variant="outline" className="border-white/40 !text-white">
              Send on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      <div className="rounded-[28px] bg-white p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-3 font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white">1</span>
            Your space
          </h3>
          <LayoutGroup id="calc-mode">
            <div className="flex rounded-full bg-paper p-1 text-[13px]">
              {(['flat', 'rooms'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className="relative cursor-pointer rounded-full px-4 py-2 font-medium">
                  {mode === m && <motion.span layoutId="calc-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className={`relative transition-colors ${mode === m ? 'text-white' : 'text-muted'}`}>{m === 'flat' ? 'Whole flat' : 'Room by room'}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'flat' ? (
            <motion.div key="flat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
              {slider}
            </motion.div>
          ) : (
            <motion.div key="rooms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ROOM_PRESETS.map((r) => {
                  const c = rooms[r.id] || 0;
                  return (
                    <div key={r.id} className={`rounded-2xl border p-4 transition-colors ${c ? 'border-teal/40 bg-mint/60' : 'border-line'}`}>
                      <div className="text-sm font-medium">{r.label}</div>
                      <div className="text-xs text-muted">~{r.sft} sft each</div>
                      <div className="mt-4 flex items-center justify-between">
                        <button onClick={() => bump(r.id, -1)} aria-label={`Remove ${r.label}`} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-white hover:border-ink/30">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <motion.span key={c} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-medium">
                          {c}
                        </motion.span>
                        <button onClick={() => bump(r.id, 1)} aria-label={`Add ${r.label}`} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-ink text-white hover:bg-teal">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted">
                Approx. area: <span className="font-medium text-ink">{roomSft.toLocaleString('en-IN')} sft</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="my-10 h-px bg-line" />
        <h3 className="mb-5 flex items-center gap-3 font-medium">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white">2</span>
          Finish level
        </h3>
        {packagePicker}
        <AnimatePresence mode="wait">
          <motion.p key={pkg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 text-sm leading-relaxed text-muted">
            <span className="font-medium text-teal">{pkg.name}:</span> {pkg.bestFor}
          </motion.p>
        </AnimatePresence>

        <div className="sticky bottom-4 z-10 mt-8 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-teal px-5 py-3 text-white shadow-2xl">
            <div>
              <div className="text-[11px] text-white/70">
                {pkg.name} · {sft.toLocaleString('en-IN')} sft
              </div>
              <div className="text-2xl font-medium">
                <AnimatedNumber value={total} format={formatBDT} />
              </div>
            </div>
            <a href={whatsappLink(settings.whatsapp, waText)} target="_blank" rel="noreferrer" aria-label="Send estimate on WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink">
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal/50 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Estimated total</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{pkg.name}</span>
            </div>
            <div className="mt-6 text-[13vw] font-medium leading-none tracking-tight sm:text-6xl xl:text-7xl">
              <AnimatedNumber value={total} format={formatBDT} />
            </div>
            <div className="mt-3 text-sm text-white/60">
              {lakh(total)} · {sft.toLocaleString('en-IN')} sft × {formatBDT(pkg.rate)}
            </div>
            <div className="mt-10 space-y-3">
              <p className="text-xs text-white/50">Compare packages for {sft.toLocaleString('en-IN')} sft</p>
              {pkgs.map((p) => {
                const t = sft * p.rate;
                const on = p.id === pkg.id;
                return (
                  <button key={p.id} onClick={() => setPkgId(p.id)} className="group block w-full cursor-pointer text-left">
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className={on ? 'font-medium' : 'text-white/60 group-hover:text-white'}>{p.name}</span>
                      <span className={on ? 'font-medium' : 'text-white/60'}>{formatBDT(t)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div className={`h-full rounded-full ${on ? 'bg-[#7fd6cf]' : 'bg-white/30'}`} animate={{ width: `${(p.rate / maxRate) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 grid gap-2 sm:grid-cols-2">
              <Button href={whatsappLink(settings.whatsapp, waText)} variant="light">
                Send on WhatsApp <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => navigate('/contact', { state: { estimate } })} variant="teal">
                Book consultation
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[28px] bg-white p-6 text-sm sm:p-8">
          <p className="flex items-center gap-2 font-medium">
            <Info className="h-4 w-4 text-teal" /> Usually quoted separately
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXCLUDED_BY_DEFAULT.map((x) => (
              <span key={x} className="rounded-full bg-paper px-3 py-1.5 text-xs text-muted">
                {x}
              </span>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            This is an indicative estimate based on INERIM’s package rates. Your final price depends on dimensions, design complexity,
            materials, hardware, finishing and installation, and is confirmed in a written quotation after the site measurement.
          </p>
        </div>
      </div>
    </div>
  );
}
