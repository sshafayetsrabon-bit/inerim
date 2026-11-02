import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Plus } from 'lucide-react';
import { render } from '../lib/seed';
import { EASE, Eyebrow, PageHeader, Reveal, RevealImage, SplitText } from '../components/ui';
import { PageSEO } from '../components/PageSEO';
import { breadcrumbs, faqPage } from '../lib/schema';

const PAIN = [
  ['Tight budget?', 'Four packages, and every design is worked out around the number you give us.'],
  ['Limited space?', 'Space planning and custom storage that use every corner of a city apartment.'],
  ['Too many contractors?', 'One team coordinates suppliers, production and installation for you.'],
  ['Unsure about quality?', 'Materials are checked before purchase, and the work is inspected at every stage.'],
];

const PROCESS = [
  ['Requirement analysis', 'We get to know your budget, lifestyle, space and design preferences, then agree on the brief and scope.'],
  ['Site visit & measurement', 'We check actual dimensions, wall measurements, utility points, existing conditions and installation needs.'],
  ['Design & materials', 'You see the layout, a 3D concept and the proposed materials before anything is produced.'],
  ['Quotation & approval', 'You get a written quotation with the scope, price, exclusions and timeline, ready for your approval.'],
  ['Confirmation & execution', 'Once terms are agreed, we produce to approved drawings, install, and check quality at each stage.'],
  ['Inspection & handover', 'We test every door, hinge and drawer, walk through the space with you, and hand over care instructions.'],
];

const QC = [
  'Approved quotation & specifications verified',
  'Material type, thickness, finish & quantity checked before purchase',
  'Production follows approved measurements & drawings',
  'Board pasting, edge finishing & hardware fitting inspected',
  'Alignment, finishing & function checked on install',
  'Final inspection before handover',
];

export const FAQS = [
  ['How is the price calculated?', 'Our packages are priced per square foot. Your final price depends on project type, dimensions, design complexity, materials, hardware, finishing and installation needs, and is confirmed after we measure the site.'],
  ['Is the calculator price final?', 'No. It is an indicative estimate to help you plan. Full-apartment quotations are prepared project by project, after requirement analysis and site measurement.'],
  ['What is not included by default?', 'Your written quotation states clearly whether electrical work, plumbing, civil work, countertops and appliances are included or excluded.'],
  ['Can I buy materials only?', 'Yes. We supply HPL, acrylic and laminate sheets, offer board pasting, and provide panels, louvers, profile handles and glass profile frames. See the shop.'],
  ['Do you work on commercial projects?', 'Yes. We mainly serve homes, and also take on offices, showrooms, retail outlets, restaurants, cafés and conference rooms.'],
  ['What should I prepare for the first consultation?', 'Your project location, property size, a floor plan if you have one, the rooms and services you need, design references, an approximate budget and your timeline.'],
];

export function Faq({ items = FAQS }: { items?: string[][] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map(([q, a], i) => (
        <div key={q}>
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left">
            <span className={`text-xl font-medium tracking-tight transition-colors md:text-2xl ${open === i ? 'text-teal' : ''}`}>{q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${open === i ? 'bg-teal text-white' : 'bg-white'}`}>
              <Plus className="h-4 w-4" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
                <span className="block max-w-3xl pb-6 leading-relaxed text-muted">{a}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 left-[19px] top-0 w-px bg-line md:left-1/2">
        <motion.div style={{ height: h }} className="w-full bg-teal" />
      </div>
      {PROCESS.map(([t, d], i) => (
        <div key={t} className={`relative grid gap-4 pb-14 pl-14 md:grid-cols-2 md:pl-0 ${i % 2 ? '' : ''}`}>
          <span className="absolute left-[12px] top-1.5 h-4 w-4 rounded-full border-4 border-paper bg-teal md:left-1/2 md:-translate-x-1/2" />
          <Reveal className={i % 2 ? 'md:col-start-2 md:pl-14' : 'md:pr-14 md:text-right'}>
            <span className="text-sm text-teal">Step {String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-1 text-3xl font-medium tracking-tight">{t}</h3>
            <p className="mt-2 text-muted">{d}</p>
          </Reveal>
        </div>
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      <PageSEO title="About INERIM" description="INERIM Interior designs and builds modern, premium interiors in Bangladesh around each client’s budget, lifestyle and space, with quality checks at every stage." path="/about" ld={() => [faqPage(FAQS), breadcrumbs([['Home', '/'], ['About', '/about']])]} />
      <PageHeader
        eyebrow="About INERIM"
        title="Your dream space. Our responsibility."
        intro="INERIM Interior is a modern, premium and customer-focused interior design and execution brand in Bangladesh."
      />
      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 sm:px-8 md:grid-cols-3">
        <RevealImage src={render(10, 'lg')} alt="" className="h-[420px] rounded-[28px] md:col-span-2 md:h-[560px]" />
        <RevealImage src={render(14, 'lg')} alt="" className="h-[420px] rounded-[28px] md:h-[560px]" delay={0.1} />
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-32 sm:px-8 md:grid-cols-[1fr_1.3fr]">
        <Eyebrow>Our philosophy</Eyebrow>
        <div>
          <Reveal>
            <p className="text-3xl font-medium leading-[1.2] tracking-tight md:text-5xl">
              Modern minimalism, functional space planning, <span className="font-serif italic text-teal">premium-looking materials</span> and practical
              solutions for everyday living.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl leading-relaxed text-muted">
              We start by understanding your budget, lifestyle, space and design preferences, then propose a practical, visually
              cohesive solution. Our signature language: walnut veneer and wood textures, fluted panels and louvers, brass strips,
              marble-pattern surfaces, arches, glass-and-wood combinations, modern modular kitchens, wardrobes and custom furniture.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN.map(([q, a], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-[24px] bg-white p-7"
            >
              <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              <div className="relative">
                <p className="text-sm text-muted transition-colors group-hover:text-white/50">0{i + 1}</p>
                <p className="mt-10 text-2xl font-medium tracking-tight transition-colors group-hover:text-white">{q}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted transition-colors group-hover:text-white/70">{a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-32 sm:px-8">
        <div className="mb-16 text-center">
          <Eyebrow className="mb-5 justify-center">How we work</Eyebrow>
          <SplitText as="h2" text="A clear path from idea to handover" className="text-4xl font-medium md:text-6xl" />
        </div>
        <Timeline />
      </section>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-10 rounded-[32px] bg-ink p-8 text-white md:p-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm text-[#7fd6cf]">Quality You Can Trust</p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.05] md:text-5xl">Checked at every stage, not just at the end.</h2>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {QC.map((q, i) => (
              <motion.li
                key={q}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6, ease: EASE }}
                className="flex gap-4 rounded-2xl bg-white/5 p-5 text-sm text-white/80"
              >
                <span className="text-lg font-medium text-[#7fd6cf]">{i + 1}</span>
                {q}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-32 sm:px-8">
        <SplitText as="h2" text="Good to know" className="mb-10 text-4xl font-medium md:text-6xl" />
        <Faq />
      </section>
    </>
  );
}
