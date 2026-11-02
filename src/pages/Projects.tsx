import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { useContent } from '../lib/cms';
import { Button, EASE, Eyebrow, PageHeader, Reveal, RevealImage, lenis } from '../components/ui';
import NotFound from './NotFound';

export function ProjectsPage() {
  const { content } = useContent();
  const [cat, setCat] = useState('All');
  const cats = ['All', ...new Set(content.projects.map((p) => p.category))];
  const list = content.projects.filter((p) => cat === 'All' || p.category === cat);
  return (
    <>
      <PageHeader eyebrow="Projects" title="Spaces we’ve designed" intro="Homes and workplaces planned around budget, lifestyle and space, then built and installed by our own team.">
        {cats.length > 2 && (
          <LayoutGroup id="proj">
            <div className="mt-10 flex gap-1">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className="relative cursor-pointer rounded-full px-4 py-2 text-sm">
                  {cat === c && <motion.span layoutId="proj-pill" className="absolute inset-0 rounded-full bg-ink" />}
                  <span className={`relative ${cat === c ? 'text-white' : 'text-muted'}`}>{c}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        )}
      </PageHeader>
      <section className="mx-auto max-w-[1440px] space-y-24 px-4 pb-32 sm:px-8">
        {list.map((p) => (
          <div key={p.id}>
            <Link to={`/projects/${p.slug}`} className="group block" data-cursor="Open">
              <RevealImage src={p.cover} alt={p.title} className="h-[60vh] min-h-[380px] rounded-[32px]" parallax={6} />
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-sm text-muted">{[p.category, p.location, p.area, p.year].filter(Boolean).join(' · ')}</p>
                  <h2 className="mt-2 text-3xl font-medium tracking-tight transition-colors group-hover:text-teal md:text-5xl">{p.title}</h2>
                  <p className="mt-3 max-w-2xl text-muted">{p.summary}</p>
                </div>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
            {p.rooms.length > 0 && (
              <div className="no-scrollbar mt-8 flex gap-3 overflow-x-auto">
                {p.rooms.map((r, i) => (
                  <Reveal key={r.name} delay={i * 0.05} className="shrink-0">
                    <Link to={`/projects/${p.slug}#room-${i}`} className="group block w-60">
                      <div className="h-40 overflow-hidden rounded-2xl">
                        <img src={r.images[0]} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <p className="mt-2 text-sm font-medium">{r.name}</p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        ))}
        {!list.length && <p className="text-muted">No projects in this category yet.</p>}
      </section>
    </>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const { content } = useContent();
  const project = content.projects.find((p) => p.slug === slug);
  const [box, setBox] = useState<{ images: string[]; i: number; title: string } | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '25%']);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const l = lenis();
      if (l) l.scrollTo(el, { offset: -90 });
      else el.scrollIntoView();
    }, 900);
    return () => clearTimeout(t);
  }, [slug]);

  if (!project) return <NotFound />;
  const meta = [
    ['Type', project.category],
    ['Location', project.location],
    ['Area', project.area],
    ['Year', project.year],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="px-2 pt-[100px] sm:px-4">
        <div className="relative h-[80svh] min-h-[480px] overflow-hidden rounded-[32px]">
          <motion.img style={{ y: heroY }} src={project.cover} alt={project.title} className="h-[120%] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-12">
            <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
            <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.3 }} className="max-w-4xl text-4xl font-medium leading-[1] md:text-7xl">
              {project.title}
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.4fr]">
        <dl className="grid grid-cols-2 gap-6 self-start">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="mt-1 text-lg font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div>
          <Reveal>
            <p className="text-2xl leading-snug tracking-tight md:text-3xl">{project.summary}</p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.highlights.map((h) => (
              <span key={h} className="rounded-full bg-white px-4 py-2 text-sm">
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {project.rooms.map((r, ri) => (
        <section id={`room-${ri}`} key={r.name} className="mx-auto grid max-w-[1440px] gap-8 px-4 pb-24 sm:px-8 lg:grid-cols-[320px_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-3">{String(ri + 1).padStart(2, '0')}</Eyebrow>
            <h2 className="text-4xl font-medium md:text-5xl">{r.name}</h2>
            <p className="mt-3 text-muted">{r.note}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {r.images.map((src, i) => (
              <Reveal key={src} delay={(i % 2) * 0.08} className={i % 3 === 0 ? 'col-span-2' : ''}>
                <button onClick={() => setBox({ images: r.images, i, title: r.name })} className="group block w-full cursor-pointer overflow-hidden rounded-[24px]" data-cursor="View">
                  <img src={src} alt={r.name} loading="lazy" className={`w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105 ${i % 3 === 0 ? 'aspect-[16/10]' : 'aspect-square'}`} />
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-[1440px] px-4 pb-32 text-center sm:px-8">
        <p className="text-3xl font-medium tracking-tight md:text-5xl">Want something like this?</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/pricing">Estimate my price</Button>
          <Button to="/contact" variant="outline">
            Book a consultation
          </Button>
        </div>
      </section>

      <Lightbox box={box} setBox={setBox} />
    </>
  );
}

function Lightbox({ box, setBox }: { box: { images: string[]; i: number; title: string } | null; setBox: (b: { images: string[]; i: number; title: string } | null) => void }) {
  useEffect(() => {
    if (!box) return;
    lenis()?.stop();
    const n = box.images.length;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBox(null);
      if (e.key === 'ArrowRight') setBox({ ...box, i: (box.i + 1) % n });
      if (e.key === 'ArrowLeft') setBox({ ...box, i: (box.i - 1 + n) % n });
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      lenis()?.start();
    };
  }, [box]);
  return (
    <AnimatePresence>
      {box && (
        <motion.div className="fixed inset-0 z-[80] flex flex-col bg-paper/95 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-lg font-medium">
              {box.title} <span className="text-muted">· {box.i + 1}/{box.images.length}</span>
            </p>
            <button onClick={() => setBox(null)} aria-label="Close" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-20">
            <AnimatePresence mode="wait">
              <motion.img
                key={box.images[box.i]}
                src={box.images[box.i]}
                alt=""
                className="max-h-[80vh] max-w-full rounded-[20px] object-contain"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </AnimatePresence>
            <button onClick={() => setBox({ ...box, i: (box.i - 1 + box.images.length) % box.images.length })} aria-label="Previous" className="absolute left-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow sm:left-6">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setBox({ ...box, i: (box.i + 1) % box.images.length })} aria-label="Next" className="absolute right-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow sm:right-6">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
