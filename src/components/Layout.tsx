import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useOutlet } from 'react-router';
import Lenis from 'lenis';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, Heart, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useSettings } from '../lib/cms';
import { useStore } from '../lib/store';
import { render } from '../lib/seed';
import { Cursor } from './Cursor';
import { EASE, Magnetic, lenis, whatsappLink } from './ui';

export const NAV = [
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/shop', label: 'Shop' },
  { to: '/colour-studio', label: 'Colour Studio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/partnership', label: 'Partnership' },
  { to: '/journal', label: 'Journal' },
];

function Announcement() {
  const s = useSettings();
  const [open, setOpen] = useState(true);
  if (!s.announcement || !open) return null;
  return (
    <div className="relative z-50 bg-ink px-10 py-2 text-center text-[12px] text-white/85">
      <Link to="/pricing" className="block truncate hover:text-white">
        {s.announcement} <span className="text-[#7fd6cf]">→</span>
      </Link>
      <button onClick={() => setOpen(false)} aria-label="Dismiss" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/50 hover:text-white">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { quote, wishlist } = useStore();
  const loc = useLocation();
  const count = quote.reduce((n, q) => n + q.qty, 0);

  useEffect(() => setOpen(false), [loc.pathname]);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 300 && !open);
    setSolid(v > 30);
  });

  return (
    <>
      <motion.header className="fixed inset-x-0 top-0 z-50" animate={{ y: hidden ? '-120%' : '0%' }} transition={{ duration: 0.5, ease: EASE }}>
        <Announcement />
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 transition-all duration-500 sm:px-8 ${
            solid ? 'bg-paper/80 backdrop-blur-xl' : ''
          }`}
        >
          <Link to="/" className="text-[22px] font-semibold tracking-[-0.06em]" aria-label="INERIM home">
            INERIM<span className="text-teal">.</span>
          </Link>
          <nav className="hidden items-center gap-1 xl:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `group relative rounded-full px-3.5 py-2 text-[13px] transition-colors ${isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                    <span className="relative">{n.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/shop?view=saved" aria-label="Saved items" className="relative hidden h-10 w-10 items-center justify-center rounded-full bg-white sm:flex">
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 text-[10px] text-white">{wishlist.length}</span>}
            </Link>
            <Link to="/quote" aria-label="Quote list" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <ShoppingBag className="h-4 w-4" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 text-[10px] text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link to="/contact" className="group hidden items-center gap-2 rounded-full bg-ink py-1.5 pl-5 pr-1.5 text-[13px] font-medium text-white md:flex">
              Book a consultation
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full bg-white xl:hidden">
              <motion.span className="block h-[1.5px] w-4 bg-ink" animate={open ? { rotate: 45, y: 3.75 } : { rotate: 0, y: 0 }} />
              <motion.span className="block h-[1.5px] w-4 bg-ink" animate={open ? { rotate: -45, y: -3.75 } : { rotate: 0, y: 0 }} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-paper px-5 pb-8 pt-24 sm:px-8 sm:pt-32"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex flex-col">
              {[{ to: '/', label: 'Home' }, ...NAV, { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }].map((n, i) => (
                <div key={n.to} className="overflow-hidden border-b border-line">
                  <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.04 }}>
                    <Link to={n.to} className="flex items-center justify-between py-2 sm:py-3 text-2xl font-medium tracking-tight sm:text-4xl">
                      {n.label}
                      <ArrowUpRight className="h-5 w-5 text-muted" />
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
            <Link to="/contact" className="mt-8 shrink-0 rounded-full bg-ink py-4 text-center text-sm font-medium text-white">
              Book a consultation
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const s = useSettings();
  const cols = [
    { title: 'Explore', links: [{ to: '/projects', l: 'Projects' }, { to: '/services', l: 'Services' }, { to: '/about', l: 'About' }, { to: '/journal', l: 'Journal' }] },
    { title: 'Buy & Build', links: [{ to: '/shop', l: 'Shop' }, { to: '/colour-studio', l: 'Colour Studio' }, { to: '/pricing', l: 'Price calculator' }, { to: '/quote', l: 'Quote list' }] },
    { title: 'Work with us', links: [{ to: '/partnership', l: 'Partnership' }, { to: '/contact', l: 'Book a consultation' }, { to: '/contact', l: 'Contact' }] },
  ];
  const socials = [
    { l: 'Facebook', h: s.facebook },
    { l: 'Instagram', h: s.instagram },
    { l: 'YouTube', h: s.youtube },
  ].filter((x) => x.h);
  return (
    <footer className="mx-2 mb-2 overflow-hidden rounded-[32px] bg-night text-white sm:mx-4 sm:mb-4">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 pb-16 pt-16 sm:px-10 md:grid-cols-[1.2fr_1fr] md:pt-24">
        <div>
          <h2 className="text-4xl font-medium leading-[1.05] sm:text-5xl md:text-6xl">
            Let’s talk about
            <br />
            your <span className="font-serif italic text-[#7fd6cf]">dream space.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
            Tell us about your space, budget and the way you live. We will recommend the right next step: a consultation, a site
            visit or a quotation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/contact" className="group flex items-center gap-2 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink">
                Book a consultation
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Magnetic>
            <a href={whatsappLink(s.whatsapp, 'Hi INERIM!')} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-[24px] md:block">
          <img src={render(25)} alt="" loading="lazy" className="h-full max-h-[320px] w-full object-cover" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 border-t border-white/10 px-6 py-12 text-sm sm:px-10 md:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-4 font-medium">{c.title}</p>
            <ul className="space-y-2.5 text-white/55">
              {c.links.map((l) => (
                <li key={l.l}>
                  <Link to={l.to} className="transition-colors hover:text-white">
                    {l.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="mb-4 font-medium">Contact</p>
          <ul className="space-y-2.5 text-white/55">
            <li>
              <a href={`tel:+${s.whatsapp}`} className="hover:text-white">
                {s.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="hover:text-white">
                {s.email}
              </a>
            </li>
            <li>{s.address}</li>
            <li>{s.hours}</li>
            {socials.map((x) => (
              <li key={x.l}>
                <a href={x.h} target="_blank" rel="noreferrer" className="hover:text-white">
                  {x.l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative px-4 sm:px-8">
        <motion.p
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="select-none text-center text-[24vw] font-semibold leading-[0.78] tracking-[-0.045em] text-white"
        >
          INERIM
        </motion.p>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 px-6 py-6 text-xs text-white/40 sm:flex-row sm:px-10">
        <span>© {new Date().getFullYear()} INERIM Interior. Quality You Can Trust.</span>
        <span>Your Dream Space. Our Responsibility.</span>
      </div>
    </footer>
  );
}

function Toast() {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-sm text-white shadow-2xl"
        >
          {toast}
          <Link to="/quote" className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-ink">
            View quote
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-teal" />;
}

/** Keeps the page that is animating out from re-rendering as the new route. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

/** Teal curtain that wipes over the screen between pages. */
// The reveal half of the curtain only plays when arriving from another page, not on the first visit
// (the first visit already has the loading splash; a teal flash after it looks like a glitch).
const appStart = typeof performance !== 'undefined' ? performance.now() : 0;

function Curtain() {
  const [reveal] = useState(() => performance.now() - appStart > 1200);
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[90] origin-bottom bg-teal"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[90] flex origin-top items-center justify-center bg-teal"
        initial={{ scaleY: reveal ? 1 : 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
    </>
  );
}

export function SiteLayout() {
  const loc = useLocation();
  const s = useSettings();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    (window as unknown as { lenis: Lenis }).lenis = l;
    let raf = 0;
    const loop = (t: number) => {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Nav />
      <AnimatePresence mode="wait" onExitComplete={() => (lenis() ? lenis()!.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0))}>
        <motion.div key={loc.pathname}>
          <Curtain />
          <main className="min-h-screen">
            <FrozenOutlet />
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
      <Toast />
      <a
        href={whatsappLink(s.whatsapp, 'Hi INERIM! I’d like to know more.')}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
