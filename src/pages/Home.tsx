import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../lib/cms';
import { render } from '../lib/seed';
import { Calculator } from '../components/Calculator';
import { ProductCard } from '../components/ProductCard';
import { Recolor } from '../components/Recolor';
import { AnimatedNumber, ArrowCircle, Button, EASE, Eyebrow, NotchLabel, Reveal, RevealImage, RotatingBadge, SplitText, Tag } from '../components/ui';

const SLIDES = [
  { n: 17, word: 'Contemporary' },
  { n: 8, word: 'Timeless' },
  { n: 21, word: 'Functional' },
  { n: 13, word: 'Personal' },
];
const SLIDE_MS = 6000;

function Hero() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const radius = useTransform(scrollYProgress, [0, 1], [32, 56]);
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), SLIDE_MS);
    SLIDES.forEach((s) => {
      const im = new Image();
      im.src = render(s.n, 'lg');
    });
    return () => clearInterval(t);
  }, []);
  const next = SLIDES[(i + 1) % SLIDES.length];

  return (
    <section ref={ref} className="px-2 pt-[100px] sm:px-4">
      <motion.div style={{ scale, borderRadius: radius }} className="relative h-[calc(100svh-112px)] min-h-[560px] overflow-hidden bg-sand">
        <AnimatePresence initial={false}>
          <motion.img
            key={i}
            src={render(SLIDES[i].n, 'lg')}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: SLIDE_MS / 1000 + 1.2, ease: 'linear' } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />

        <motion.div style={{ y: wordY }} className="pointer-events-none absolute inset-x-0 top-[14%] text-center">
          <AnimatePresence mode="wait">
            <motion.h1 key={SLIDES[i].word} className="text-[15vw] font-semibold leading-none tracking-[-0.06em] text-white [text-shadow:0_8px_40px_rgba(0,0,0,0.25)] md:text-[12.5vw]" aria-label={SLIDES[i].word}>
              {SLIDES[i].word.split('').map((ch, k) => (
                <span key={k} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: k * 0.03 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: EASE }}
          className="absolute bottom-4 left-4 right-4 flex max-w-[460px] items-stretch gap-3 rounded-[24px] border border-white/25 bg-white/15 p-3 text-white backdrop-blur-xl sm:bottom-6 sm:left-6"
        >
          <div className="flex flex-1 flex-col justify-between gap-4 p-2">
            <p className="text-[13px] leading-relaxed text-white/90">
              Modern, premium interiors designed around your budget, lifestyle and space, then built and installed by one team.
            </p>
            <Link to="/projects" className="group flex w-fit items-center gap-2 rounded-full bg-white py-1 pl-4 pr-1 text-xs font-medium text-ink">
              Explore projects
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
          <button onClick={() => setI((v) => (v + 1) % SLIDES.length)} className="relative hidden w-36 shrink-0 cursor-pointer overflow-hidden rounded-[16px] sm:block" aria-label="Next image">
            <AnimatePresence initial={false}>
              <motion.img key={next.n} src={render(next.n)} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </AnimatePresence>
            <span className="absolute inset-x-2 bottom-2 h-[2px] overflow-hidden rounded bg-white/30">
              <motion.span key={i} className="block h-full origin-left bg-white" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }} />
            </span>
          </button>
        </motion.div>

        <div className="absolute bottom-6 right-6 hidden text-white md:block">
          <RotatingBadge text="Modern • Minimal • Premium • " size={132} />
        </div>
      </motion.div>
    </section>
  );
}

function Bento() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-24 sm:px-8 md:pt-32">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Reveal>
          <Link to="/projects/residence-01" className="group relative block h-[440px] overflow-hidden rounded-[28px] md:h-[560px]" data-cursor="Open">
            <img src={render(8, 'lg')} alt="Master bedroom" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <NotchLabel>
              <Tag className="mb-3 bg-white">INERIM Interior</Tag>
              <p className="text-4xl font-medium leading-[1] md:text-6xl">
                Modern
                <br />
                Minimalist
              </p>
            </NotchLabel>
          </Link>
        </Reveal>
        <div className="grid gap-4">
          <Reveal delay={0.1}>
            <Link to="/shop" className="group flex h-full min-h-[240px] flex-col justify-between rounded-[28px] bg-sand p-7">
              <div className="flex items-start justify-between">
                <Tag>Shop</Tag>
                <ArrowCircle />
              </div>
              <div>
                <p className="mb-3 max-w-[220px] text-xs text-muted">Furniture, sheets, panels and hardware, chosen and supplied by our team.</p>
                <p className="text-3xl font-medium leading-[1.05] tracking-tight">
                  Into a gallery
                  <br />
                  of elegance
                </p>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.2}>
            <Link to="/colour-studio" className="group relative block h-[300px] overflow-hidden rounded-[28px]" data-cursor="Try">
              <img src={render(1)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
              <div className="absolute left-5 top-5 text-white">
                <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] backdrop-blur">Colour Studio</span>
                <p className="mt-3 max-w-[180px] text-sm">Try your own colours on a real INERIM room</p>
              </div>
              <span className="absolute bottom-0 right-0 rounded-tl-[24px] bg-paper p-2.5">
                <ArrowCircle dark />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: 4, suffix: '', label: 'Packages to choose from' },
    { v: 12, suffix: '+', label: 'Design, build & supply services' },
    { v: 1350, prefix: '৳', suffix: '', label: 'Starting rate per sft' },
    { v: 1, suffix: '', label: 'Team from design to handover' },
  ];
  return (
    <section className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-10 px-4 py-20 sm:px-8 md:grid-cols-4 md:py-28">
      {items.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="text-center">
          <p className="text-5xl font-medium tracking-tight md:text-6xl">
            {s.prefix}
            <AnimatedNumber value={s.v} />
            {s.suffix}
          </p>
          <p className="mt-2 text-[13px] text-muted">{s.label}</p>
        </Reveal>
      ))}
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
      <RevealImage src={render(20, 'lg')} alt="Living room" className="h-[420px] rounded-[28px] md:h-[600px]" />
      <div>
        <Eyebrow className="mb-6">Elegance · Timeless</Eyebrow>
        <SplitText as="h2" text="Modern Style, Timeless Charm" className="text-5xl font-medium leading-[0.98] md:text-7xl" />
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-md leading-relaxed text-muted">
            Our design philosophy is modern minimalism with a warm heart: functional space planning, premium-looking material
            combinations and practical solutions for everyday living. Walnut textures, fluted panels, brass strips, arches and
            glass-and-wood come together in homes that work as well as they look.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/about">
              About us <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button to="/services" variant="outline">
              Our services
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Spaces() {
  const { content } = useContent();
  const project = content.projects.find((p) => p.featured) ?? content.projects[0];
  if (!project) return null;
  const r = project.rooms;
  const card = (idx: number, h: string, delay: number) =>
    r[idx] && (
      <Reveal delay={delay}>
        <Link to={`/projects/${project.slug}`} className={`group relative block overflow-hidden rounded-[24px] ${h}`} data-cursor="Open">
          <img src={r[idx].images[0]} alt={r[idx].name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white">
            <span className="text-xl font-medium tracking-tight md:text-2xl">{r[idx].name}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </Reveal>
    );
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8 md:pt-44">
      <div className="mb-12 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <SplitText as="h2" text="Explore our proudly designed spaces" className="max-w-2xl text-5xl font-medium leading-[0.98] md:text-7xl" />
        <div className="md:justify-self-end md:text-right">
          <Button to="/projects" size="sm">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <p className="mt-4 max-w-sm text-sm text-muted">Every room of a recent INERIM residence, from the arched living room to the U-shaped kitchen.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-4">
          {card(0, 'h-[300px]', 0)}
          {card(1, 'h-[400px]', 0.1)}
        </div>
        <div className="grid gap-4">
          {card(5, 'h-[420px]', 0.05)}
          {card(4, 'h-[280px]', 0.15)}
        </div>
        <div className="grid gap-4">
          {card(2, 'h-[300px]', 0.1)}
          {card(3, 'h-[400px]', 0.2)}
        </div>
      </div>
    </section>
  );
}

function ShopTeaser() {
  const { content } = useContent();
  const items = content.products.filter((p) => p.featured).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8 md:pt-44">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow className="mb-5">Interior supplier</Eyebrow>
          <SplitText as="h2" text="Shop the pieces behind our rooms" className="max-w-2xl text-5xl font-medium leading-[0.98] md:text-6xl" />
        </div>
        <Button to="/shop" variant="outline">
          Visit the shop <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function StudioTeaser() {
  const { content } = useContent();
  const palette = content.colours.length ? content.colours : [];
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!palette.length) return;
    const t = setInterval(() => setK((v) => (v + 1) % palette.length), 2200);
    return () => clearInterval(t);
  }, [palette.length]);
  const c = palette[k];
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8 md:pt-44">
      <div className="grid overflow-hidden rounded-[32px] bg-white lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-between p-8 md:p-14">
          <div>
            <Eyebrow className="mb-6">Colour Studio</Eyebrow>
            <SplitText as="h2" text="See your colours before we build" className="text-4xl font-medium leading-[1] md:text-6xl" />
            <p className="mt-6 max-w-md leading-relaxed text-muted">
              Pick wall paint, upholstery and fabric colours and watch them appear on real INERIM renders. Then download your look
              or send it to our designers.
            </p>
          </div>
          <div className="mt-10">
            <div className="mb-6 flex items-center gap-3">
              {palette.slice(0, 10).map((p, idx) => (
                <motion.span key={p.id} className="h-6 w-6 rounded-full ring-1 ring-ink/10" style={{ background: p.hex }} animate={{ scale: idx === k % 10 ? 1.3 : 1 }} />
              ))}
            </div>
            <Button to="/colour-studio" variant="teal">
              Open the Colour Studio <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Recolor
            src="/visualizer/master.jpg"
            alt="Master bedroom with recoloured walls"
            className="h-full min-h-[360px]"
            layers={[{ mask: '/visualizer/master-walls.png', color: c?.hex ?? null, baseLum: 0.54 }]}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={c?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur"
            >
              <span className="h-6 w-6 rounded-full" style={{ background: c?.hex }} /> Walls in {c?.name}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function PriceTeaser() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8 md:pt-44">
      <div className="mb-12 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <Eyebrow className="mb-5">Instant estimate</Eyebrow>
          <SplitText as="h2" text="Know your price in ten seconds" className="text-5xl font-medium leading-[0.98] md:text-7xl" />
        </div>
        <p className="max-w-sm text-sm text-muted md:justify-self-end">Drag to your flat size and pick a finish level. There are no forms and no waiting for a quote.</p>
      </div>
      <Calculator compact />
    </section>
  );
}

function ProcessStrip() {
  const steps = ['Requirement analysis', 'Site visit & measurement', 'Design & materials', 'Quotation & approval', 'Execution & handover'];
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8 md:pt-44">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <SplitText as="h2" text="How we work" className="text-5xl font-medium md:text-7xl" />
        <Button to="/about" variant="outline" size="sm">
          See the full process
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
            className="group relative flex h-56 flex-col justify-between overflow-hidden rounded-[24px] bg-white p-6"
          >
            <span className="absolute inset-0 translate-y-full bg-teal transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            <span className="relative text-sm text-muted transition-colors group-hover:text-white/70">0{i + 1}</span>
            <span className="relative text-2xl font-medium leading-tight tracking-tight transition-colors group-hover:text-white">{s}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function JournalTeaser() {
  const { content } = useContent();
  const posts = content.posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-32 sm:px-8 md:py-44">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <SplitText as="h2" text="From the journal" className="text-5xl font-medium md:text-7xl" />
        <Button to="/journal" variant="outline" size="sm">
          All articles
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <Link to={`/journal/${p.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-[24px]">
                <img src={p.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                <Tag>{p.category}</Tag>
                {p.readMinutes} min read
              </div>
              <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight transition-colors group-hover:text-teal">{p.title}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-24">
        <Link to="/partnership" className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-[32px] bg-teal p-8 text-white md:flex-row md:items-center md:p-14">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl transition-transform duration-1000 group-hover:scale-150" />
          <div className="relative">
            <p className="text-sm text-white/70">For architects, developers, dealers & contractors</p>
            <p className="mt-3 max-w-2xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">Partner with INERIM for supply, pasting and execution.</p>
          </div>
          <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Bento />
      <Stats />
      <Story />
      <Spaces />
      <ShopTeaser />
      <StudioTeaser />
      <PriceTeaser />
      <ProcessStrip />
      <JournalTeaser />
    </>
  );
}
