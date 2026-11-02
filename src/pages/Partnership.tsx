import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Building2, Check, Compass, Hammer, Store } from 'lucide-react';
import { render } from '../lib/seed';
import { Chips, Field, Honeypot, SentPanel, useInquiry } from '../components/Form';
import { Button, EASE, Eyebrow, PageHeader, Reveal, RevealImage, SplitText } from '../components/ui';
import { PageSEO } from '../components/PageSEO';
import { breadcrumbs } from '../lib/schema';

const TYPES = [
  {
    id: 'Architect / Designer',
    icon: Compass,
    title: 'Architects & interior designers',
    pitch: 'You design it, and we make and install it the way you drew it.',
    offers: ['Custom cabinets, wardrobes & furniture made to your drawings', 'HPL, acrylic & laminate supply with finish samples', 'Site measurement and installation by our team', 'One point of contact for production updates'],
    image: render(19),
  },
  {
    id: 'Developer / Real estate',
    icon: Building2,
    title: 'Developers & real estate',
    pitch: 'Interior packages for show flats and handovers that help units sell.',
    offers: ['Package-based interiors for repeat unit types', 'Show-flat design, 3D visualisation and execution', 'Consistent specifications across buildings', 'Coordinated scheduling with your site team'],
    image: render(22),
  },
  {
    id: 'Dealer / Retailer',
    icon: Store,
    title: 'Material dealers & retailers',
    pitch: 'Add finishing materials and pasting services to your own range.',
    offers: ['HPL, acrylic & laminate sheet supply', 'HPL / acrylic board pasting service', 'Decorative panels & louvers', 'Aluminium profile handles & glass profile frames'],
    image: render(27),
  },
  {
    id: 'Contractor / Carpenter',
    icon: Hammer,
    title: 'Contractors & carpenters',
    pitch: 'Ready-pasted boards, profiles and hardware so your team builds faster.',
    offers: ['Board pasting with a clean, inspected finish', 'Profile handles, glass frames and brass strips', 'Help choosing finishes for your clients', 'Material sourcing for project-based work'],
    image: render(9),
  },
];

const VOLUMES = ['Just starting', 'A few projects a year', 'Monthly orders', 'Large / ongoing volume'] as const;

export default function Partnership() {
  const [active, setActive] = useState(0);
  const t = TYPES[active];
  return (
    <>
      <PageSEO title="Partnership program for architects, developers & dealers" description="Partner with INERIM for HPL/acrylic supply, board pasting, custom cabinets and interior execution." path="/partnership" ld={() => [breadcrumbs([['Home', '/'], ['Partnership', '/partnership']])]} />
      <PageHeader
        eyebrow="Partnership program"
        title="Build more, together"
        intro="INERIM works with architects, developers, dealers and contractors as a supply, pasting and execution partner. Here is how we can work with you."
      />

      <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-2">
            {TYPES.map((x, i) => (
              <button
                key={x.id}
                onClick={() => setActive(i)}
                className={`group flex w-full cursor-pointer items-center gap-4 rounded-[24px] p-5 text-left transition-colors duration-500 ${i === active ? 'bg-ink text-white' : 'bg-white hover:bg-sand'}`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${i === active ? 'bg-teal' : 'bg-paper'}`}>
                  <x.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-lg font-medium tracking-tight">{x.title}</span>
                  <span className={`block text-sm ${i === active ? 'text-white/60' : 'text-muted'}`}>{x.pitch}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-[28px]">
            <AnimatePresence mode="wait">
              <motion.div key={t.id} className="absolute inset-0" initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }}>
                <img src={t.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
                  <p className="text-sm text-white/70">What we offer</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {t.offers.map((o, i) => (
                      <motion.li key={o} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }} className="flex gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7fd6cf]" /> {o}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 pt-32 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow className="mb-6">Why partner with INERIM</Eyebrow>
          <SplitText as="h2" text="Design, supply and execution under one roof" className="text-4xl font-medium leading-[1] md:text-6xl" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              ['One source', 'Sheets, pasting, panels, profiles and custom furniture from one team.'],
              ['Design support', 'Space planning and 3D visualisation when your client needs to see it first.'],
              ['Quality checks', 'Material, pasting, edging and hardware are checked before anything leaves.'],
              ['Clear quotations', 'Scope, inclusions and exclusions are written down before work starts.'],
            ].map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.08} className="rounded-[24px] bg-white p-6">
                <p className="text-lg font-medium">{h}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <RevealImage src={render(15, 'lg')} alt="Wardrobe with display niche" className="h-[520px] rounded-[28px]" />
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8">
        <div className="grid gap-3 md:grid-cols-4">
          {['Apply below', 'Intro meeting', 'First order or project', 'Ongoing partnership'].map((s, i) => (
            <Reveal key={s} delay={i * 0.08}>
              <div className="flex h-40 flex-col justify-between rounded-[24px] border border-line p-6">
                <span className="text-sm text-teal">Step {i + 1}</span>
                <span className="text-2xl font-medium tracking-tight">{s}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PartnerForm defaultType={t.id} />
    </>
  );
}

function PartnerForm({ defaultType }: { defaultType: string }) {
  const { state, send, reset } = useInquiry('partnership');
  const [f, setF] = useState({ company: '', name: '', phone: '', email: '', city: '', message: '' });
  const [type, setType] = useState(defaultType);
  const [volume, setVolume] = useState<(typeof VOLUMES)[number]>(VOLUMES[1]);
  const [hp, setHp] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const waText = `Hi INERIM, I'd like to become a partner.\n\nCompany: ${f.company}\nName: ${f.name}\nType: ${type}\nCity: ${f.city}\nVolume: ${volume}\n${f.message}`;

  return (
    <section id="apply" className="mx-auto max-w-[1100px] px-4 py-32 sm:px-8">
      <div className="mb-10 text-center">
        <Eyebrow className="mb-5 justify-center">Apply</Eyebrow>
        <SplitText as="h2" text="Become an INERIM partner" className="text-4xl font-medium md:text-6xl" />
      </div>
      {state === 'sent' || state === 'offline' ? (
        <SentPanel state={state} waText={waText} title="Application received." onReset={reset} />
      ) : (
        <form
          className="relative space-y-3 rounded-[28px] bg-white p-6 sm:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            send({ name: f.name, phone: f.phone, email: f.email, message: f.message, website: hp, data: { company: f.company, partnerType: type, city: f.city, volume } });
          }}
        >
          <Honeypot value={hp} onChange={setHp} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Company / business name" required value={f.company} onChange={set('company')} />
            <Field label="Your name" required value={f.name} onChange={set('name')} />
            <Field label="Phone" type="tel" required value={f.phone} onChange={set('phone')} />
            <Field label="Email" type="email" value={f.email} onChange={set('email')} />
            <Field label="City" value={f.city} onChange={set('city')} className="sm:col-span-2" />
          </div>
          <div className="py-3">
            <p className="mb-2 text-xs text-muted">You are a…</p>
            <Chips options={TYPES.map((x) => x.id)} value={type} onChange={(v) => setType(v as string)} />
          </div>
          <div className="pb-3">
            <p className="mb-2 text-xs text-muted">Expected volume</p>
            <Chips options={VOLUMES} value={volume} onChange={(v) => setVolume(v as (typeof VOLUMES)[number])} />
          </div>
          <Field label="Tell us about your business and what you need" textarea rows={4} value={f.message} onChange={set('message')} />
          <Button type="submit" size="lg" className="w-full" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Submit application'}
          </Button>
        </form>
      )}
    </section>
  );
}
