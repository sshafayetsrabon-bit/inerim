import { useState } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSettings } from '../lib/cms';
import type { Estimate } from '../components/Calculator';
import { Chips, Field, Honeypot, SentPanel, useInquiry } from '../components/Form';
import { Button, PageHeader, Reveal, formatBDT, whatsappLink } from '../components/ui';
import { PageSEO } from '../components/PageSEO';
import { breadcrumbs } from '../lib/schema';

const MEETING = ['Studio meeting', 'Site visit', 'Video call', 'Phone call'] as const;
const WINDOWS = ['Morning', 'Afternoon', 'Evening'] as const;
const SERVICES = ['Full interior', 'Modular kitchen', 'Wardrobes & cabinets', 'Custom furniture', 'Material supply', 'Board pasting', 'Commercial project'] as const;
const TIMELINES = ['As soon as possible', 'Within 1–3 months', '3–6 months', 'Just exploring'] as const;

export default function Contact() {
  const s = useSettings();
  const estimate = (useLocation().state as { estimate?: Estimate } | null)?.estimate;
  const { state, send, reset } = useInquiry('booking');
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    size: estimate ? String(estimate.sft) : '',
    budget: estimate ? `${estimate.packageName} package, approx. ${formatBDT(estimate.total)}` : '',
    date: '',
    notes: estimate?.rooms ? `Rooms: ${estimate.rooms}` : '',
  });
  const [meeting, setMeeting] = useState<(typeof MEETING)[number]>('Studio meeting');
  const [slot, setSlot] = useState<(typeof WINDOWS)[number]>('Afternoon');
  const [services, setServices] = useState<string[]>(['Full interior']);
  const [timeline, setTimeline] = useState<(typeof TIMELINES)[number]>('Within 1–3 months');
  const [hp, setHp] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const waText =
    `Hi INERIM, I'd like to book a consultation.\n\nName: ${f.name}\nPhone: ${f.phone}\nLocation: ${f.location}\nProperty size: ${f.size} sft\n` +
    `Services: ${services.join(', ')}\nBudget: ${f.budget || 'Not sure yet'}\nTimeline: ${timeline}\nMeeting: ${meeting}${f.date ? ` on ${f.date}` : ''} (${slot})` +
    (f.notes ? `\nNotes: ${f.notes}` : '');

  const contacts = [
    { icon: Phone, label: 'Call', value: s.phone, href: `tel:+${s.whatsapp}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: whatsappLink(s.whatsapp, 'Hi INERIM!') },
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: 'Studio', value: s.address },
    { icon: Clock, label: 'Hours', value: s.hours },
  ];

  return (
    <>
      <PageSEO title="Book a consultation" description="Book a studio meeting, site visit or video call with INERIM Interior. Call, WhatsApp or send your project details online." path="/contact" ld={() => [{ '@type': 'ContactPage', name: 'Contact INERIM Interior', url: 'https://inerimbd.com/contact' }, breadcrumbs([['Home', '/'], ['Contact', '/contact']])]} />
      <PageHeader eyebrow="Contact" title="Book a consultation" intro="Tell us about your space and choose how you’d like to meet. We’ll confirm a time and recommend the right next step." />
      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-32 sm:px-8 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          {contacts.map((c, i) => {
            const inner = (
              <>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper transition-colors group-hover:bg-teal group-hover:text-white">
                  <c.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted">{c.label}</span>
                  <span className="block font-medium">{c.value}</span>
                </span>
              </>
            );
            return (
              <Reveal key={c.label} delay={i * 0.05}>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-[24px] bg-white p-4">
                    {inner}
                  </a>
                ) : (
                  <div className="group flex items-center gap-4 rounded-[24px] bg-white p-4">{inner}</div>
                )}
              </Reveal>
            );
          })}
          <p className="px-2 pt-2 text-xs leading-relaxed text-muted">
            Any visit or measurement fee is confirmed with you before the visit. “Swagatom INERIM Interior-e, jekhane protiti space pay ekta notun
            porichoy.”
          </p>
        </div>

        {state === 'sent' || state === 'offline' ? (
          <SentPanel state={state} waText={waText} title="Your consultation request is in." onReset={reset} />
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative space-y-3 rounded-[28px] bg-white p-6 sm:p-10"
            onSubmit={(e) => {
              e.preventDefault();
              send({
                name: f.name,
                phone: f.phone,
                email: f.email,
                message: f.notes,
                website: hp,
                data: { location: f.location, sizeSft: f.size, budget: f.budget, services, timeline, meeting, preferredDate: f.date, timeWindow: slot, estimate },
              });
            }}
          >
            {estimate && (
              <div className="mb-4 rounded-2xl bg-mint px-5 py-4 text-sm text-teal-deep">
                Your estimate: <b>{formatBDT(estimate.total)}</b> · {estimate.packageName} · {estimate.sft.toLocaleString('en-IN')} sft
              </div>
            )}
            <Honeypot value={hp} onChange={setHp} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Your name" required value={f.name} onChange={set('name')} />
              <Field label="Phone" type="tel" required value={f.phone} onChange={set('phone')} />
              <Field label="Email" type="email" value={f.email} onChange={set('email')} />
              <Field label="Project location" value={f.location} onChange={set('location')} />
              <Field label="Property size (sft)" inputMode="numeric" value={f.size} onChange={set('size')} />
              <Field label="Approx. budget" value={f.budget} onChange={set('budget')} />
            </div>
            <Group title="What do you need?">
              <Chips options={SERVICES} value={services as (typeof SERVICES)[number][]} onChange={(v) => setServices(v as string[])} multi />
            </Group>
            <Group title="When do you want to start?">
              <Chips options={TIMELINES} value={timeline} onChange={(v) => setTimeline(v as (typeof TIMELINES)[number])} />
            </Group>
            <Group title="How would you like to meet?">
              <Chips options={MEETING} value={meeting} onChange={(v) => setMeeting(v as (typeof MEETING)[number])} />
            </Group>
            <div className="grid gap-3 pt-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <Field label="Preferred date" type="date" min={today} value={f.date} onChange={set('date')} className="[&_input]:placeholder:text-muted" />
              <Chips options={WINDOWS} value={slot} onChange={(v) => setSlot(v as (typeof WINDOWS)[number])} />
            </div>
            <Field label="Anything else? Design references, floor plan, ideas…" textarea value={f.notes} onChange={set('notes')} />
            <Button type="submit" size="lg" className="w-full" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Request my consultation'}
            </Button>
          </motion.form>
        )}
      </section>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4">
      <p className="mb-2 text-xs text-muted">{title}</p>
      {children}
    </div>
  );
}
