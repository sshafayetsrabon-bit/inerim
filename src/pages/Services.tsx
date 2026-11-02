import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { render } from '../lib/seed';
import { Button, Eyebrow, PageHeader, Reveal, SplitText } from '../components/ui';
import { PageSEO } from '../components/PageSEO';
import { breadcrumbs } from '../lib/schema';
import { SERVICE_GROUPS as GROUPS, SIGNATURE_ELEMENTS as ELEMENTS, PAGE_META } from '../lib/copy';



function StackCard({ g, i, total }: { g: (typeof GROUPS)[number]; i: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - i) * 0.03]);
  const dark = g.bg === '#171614';
  return (
    <div ref={ref} className="sticky h-[85vh] min-h-[560px]" style={{ top: `${96 + i * 18}px` }}>
      <motion.div style={{ scale, background: g.bg }} className={`grid h-[calc(85vh-40px)] min-h-[520px] origin-top overflow-hidden rounded-[32px] md:grid-cols-2 ${dark ? 'text-white' : ''}`}>
        <div className="flex flex-col justify-between p-8 md:p-12">
          <div>
            <span className={`text-sm ${dark ? 'text-white/50' : 'text-muted'}`}>{g.no}</span>
            <h2 className="mt-4 text-6xl font-medium md:text-8xl">{g.title}</h2>
            <p className={`mt-4 max-w-sm text-lg ${dark ? 'text-white/70' : 'text-muted'}`}>{g.lead}</p>
          </div>
          <ul className="mt-8 space-y-3">
            {g.items.map((it) => (
              <li key={it} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-teal' : 'bg-ink'} text-white`}>
                  <Check className="h-3 w-3" />
                </span>
                {it}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden md:block">
          <img src={g.image} alt={g.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  return (
    <>
      <PageSEO {...PAGE_META.services} path="/services" ld={() => [breadcrumbs([['Home', '/'], ['Services', '/services']])]} />
      <PageHeader
        eyebrow="Services"
        title="From the first sketch to the last hinge"
        intro="Interior design, product supply, custom cabinets and project-based execution. Choose one service, or hand us the whole project."
      />
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
        {GROUPS.map((g, i) => (
          <StackCard key={g.no} g={g} i={i} total={GROUPS.length} />
        ))}
      </section>

      <section className="overflow-hidden py-24">
        <div className="marquee" style={{ ['--marquee-speed' as string]: '45s' }}>
          {[...ELEMENTS, ...ELEMENTS].map((e, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-5xl font-medium tracking-tight md:text-7xl">
              <span className={i % 2 ? 'font-serif italic text-teal' : ''}>{e}</span>
              <span className="h-3 w-3 rounded-full bg-ink/20" />
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-24 sm:px-8 md:grid-cols-2">
        {[
          { t: 'Residential', tag: 'Primary focus', img: render(8, 'lg'), items: ['Apartments & flats', 'Newly purchased homes', 'Homes for newly married couples', 'Living, bedroom & dining', 'Foyers', 'Modular kitchens & wardrobes'] },
          { t: 'Commercial', tag: 'Also in scope', img: render(22, 'lg'), items: ['Corporate offices', 'Showrooms & retail outlets', 'Restaurants & cafés', 'Reception areas', 'Workstations', 'Conference rooms'] },
        ].map((s, i) => (
          <Reveal key={s.t} delay={i * 0.1}>
            <div className="group relative h-full min-h-[440px] overflow-hidden rounded-[32px] p-8 text-white md:p-12">
              <img src={s.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">{s.tag}</span>
                <div>
                  <h3 className="text-5xl font-medium md:text-6xl">{s.t}</h3>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {s.items.map((x) => (
                      <span key={x} className="rounded-full border border-white/30 px-3 py-1.5 text-sm backdrop-blur">
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
        <div className="rounded-[32px] bg-white p-8 md:p-14">
          <Eyebrow className="mb-6">Next step</Eyebrow>
          <SplitText as="h2" text="Not sure where to start? Get a price first." className="max-w-3xl text-4xl font-medium leading-[1] md:text-6xl" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/pricing">
              Price calculator <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button to="/contact" variant="outline">
              Book a consultation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
