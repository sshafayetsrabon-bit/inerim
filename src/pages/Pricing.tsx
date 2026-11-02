import { useSettings } from '../lib/cms';
import { Calculator } from '../components/Calculator';
import { Eyebrow, PageHeader, Reveal, SplitText, formatBDT } from '../components/ui';
import { Faq, FAQS } from './About';

export default function Pricing() {
  const s = useSettings();
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Know your price before you call"
        intro="Set your space size, pick a finish level and see your estimated cost instantly. No forms and no waiting."
      />
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Calculator />
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8">
        <Eyebrow className="mb-5">Packages</Eyebrow>
        <SplitText as="h2" text="Four levels of finish" className="mb-12 text-4xl font-medium md:text-6xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {s.packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <div className={`group relative flex h-[460px] flex-col justify-between overflow-hidden rounded-[28px] p-7 ${i === 3 ? 'text-white' : ''}`}>
                <img src={p.image} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110 ${i === 3 ? '' : 'opacity-0 group-hover:opacity-25'}`} />
                <div className={`absolute inset-0 ${i === 3 ? 'bg-gradient-to-t from-black/85 to-black/30' : 'bg-white/90'}`} />
                <div className="relative">
                  <p className={`text-sm ${i === 3 ? 'text-white/70' : 'text-muted'}`}>{p.tone}</p>
                  <p className="mt-2 text-4xl font-medium">{p.name}</p>
                </div>
                <div className="relative">
                  <p className="text-5xl font-medium tracking-tight">{formatBDT(p.rate)}</p>
                  <p className={`text-sm ${i === 3 ? 'text-white/70' : 'text-muted'}`}>per sft</p>
                  <p className={`mt-6 text-sm leading-relaxed ${i === 3 ? 'text-white/80' : 'text-muted'}`}>{p.bestFor}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">Exact materials, hardware and finishes for each package are confirmed in your written quotation.</p>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-32 sm:px-8">
        <SplitText as="h2" text="How a quotation comes together" className="mb-12 max-w-3xl text-4xl font-medium md:text-6xl" />
        <div className="grid gap-3 md:grid-cols-5">
          {['Share requirements & approximate budget', 'We assess dimensions & scope', 'Design concept & materials finalised', 'Package or custom quotation prepared', 'Scope & terms confirmed after approval'].map((t, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="h-full rounded-[24px] bg-white p-6">
                <p className="text-4xl font-medium text-teal">{i + 1}</p>
                <p className="mt-8 text-lg font-medium leading-snug tracking-tight">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-32 sm:px-8">
        <SplitText as="h2" text="Pricing questions" className="mb-10 text-4xl font-medium md:text-6xl" />
        <Faq items={FAQS.slice(0, 3)} />
      </section>
    </>
  );
}
