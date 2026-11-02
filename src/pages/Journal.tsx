import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Link2 } from 'lucide-react';
import { useContent } from '../lib/cms';
import { mdToHtml } from '../lib/markdown';
import { Button, EASE, PageHeader, Reveal, Tag, whatsappLink } from '../components/ui';
import NotFound from './NotFound';
import { PageSEO } from '../components/PageSEO';
import { articleLd, breadcrumbs } from '../lib/schema';

const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function JournalPage() {
  const { content } = useContent();
  const posts = content.posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const cats = ['All', ...new Set(posts.map((p) => p.category))];
  const [cat, setCat] = useState('All');
  const list = posts.filter((p) => cat === 'All' || p.category === cat);
  const [lead, ...rest] = list;

  return (
    <>
      <PageSEO title="Journal: interior ideas, guides & materials" description="Practical advice on planning, materials and pricing from the INERIM studio." path="/journal" ld={() => [{ '@type': 'Blog', name: 'INERIM Journal', url: 'https://inerimbd.com/journal' }, breadcrumbs([['Home', '/'], ['Journal', '/journal']])]} />
      <PageHeader eyebrow="Journal" title="Ideas, guides & materials" intro="Practical advice on planning, materials and pricing from the INERIM studio.">
        <LayoutGroup id="journal">
          <div className="no-scrollbar mt-10 flex gap-1 overflow-x-auto">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className="relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm">
                {cat === c && <motion.span layoutId="j-pill" className="absolute inset-0 rounded-full bg-ink" />}
                <span className={`relative ${cat === c ? 'text-white' : 'text-muted'}`}>{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </PageHeader>
      <section className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            {lead && (
              <Link to={`/journal/${lead.slug}`} className="group mb-16 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                <div className="aspect-[16/10] overflow-hidden rounded-[28px]">
                  <img src={lead.cover} alt="" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                </div>
                <div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <Tag>{lead.category}</Tag> {fmtDate(lead.date)}
                  </div>
                  <h2 className="mt-5 text-4xl font-medium leading-[1.05] transition-colors group-hover:text-teal md:text-5xl">{lead.title}</h2>
                  <p className="mt-4 text-muted">{lead.excerpt}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                    Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                  </span>
                </div>
              </Link>
            )}
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <Link to={`/journal/${p.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-[24px]">
                      <img src={p.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                      <Tag>{p.category}</Tag> {p.readMinutes} min read
                    </div>
                    <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight group-hover:text-teal">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
            {!list.length && <p className="text-muted">No articles yet.</p>}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}

export function PostPage() {
  const { slug } = useParams();
  const { content } = useContent();
  const post = content.posts.find((p) => p.slug === slug && p.published);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [copied, setCopied] = useState(false);
  if (!post) return <NotFound />;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const more = content.posts.filter((p) => p.published && p.id !== post.id).slice(0, 2);

  return (
    <article>
      <PageSEO title={post.title} description={post.excerpt} path={`/journal/${post.slug}`} image={post.cover} type="article" ld={() => [articleLd(post), breadcrumbs([['Home', '/'], ['Journal', '/journal'], [post.title, `/journal/${post.slug}`]])]} />
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[61] h-[3px] origin-left bg-teal" />
      <header className="mx-auto max-w-[900px] px-4 pt-36 text-center sm:px-8 md:pt-44">
        <Link to="/journal" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Journal
        </Link>
        <div className="flex items-center justify-center gap-3 text-sm text-muted">
          <Tag>{post.category}</Tag> {fmtDate(post.date)} · {post.readMinutes} min read
        </div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }} className="mt-6 text-4xl font-medium leading-[1.02] md:text-7xl">
          {post.title}
        </motion.h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{post.excerpt}</p>
      </header>
      <motion.div initial={{ clipPath: 'inset(20% 10% 0% 10% round 32px)' }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 32px)' }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }} className="mx-auto mt-14 max-w-[1200px] px-4 sm:px-8">
        <img src={post.cover} alt="" className="aspect-[16/8] w-full rounded-[32px] object-cover" />
      </motion.div>
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-20 sm:px-8 md:grid-cols-[180px_1fr]">
        <aside className="space-y-3 text-sm md:sticky md:top-28 md:self-start">
          <p className="text-muted">By {post.author}</p>
          <p className="pt-4 text-muted">Share</p>
          <div className="flex gap-2 md:flex-col md:items-start">
            <a href={whatsappLink('', `${post.title} ${url}`)} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 hover:bg-sand">
              WhatsApp
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 hover:bg-sand">
              Facebook
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(url).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                });
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 hover:bg-sand"
            >
              <Link2 className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </aside>
        <div className="prose-inerim" dangerouslySetInnerHTML={{ __html: mdToHtml(post.body) }} />
      </div>
      <section className="mx-auto max-w-[1100px] px-4 pb-32 sm:px-8">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-teal p-8 text-white md:flex-row md:items-center md:p-10">
          <p className="text-2xl font-medium tracking-tight md:text-3xl">Ready to plan your space?</p>
          <div className="flex gap-2">
            <Button to="/pricing" variant="light">
              Estimate my price
            </Button>
            <Button to="/contact" variant="outline" className="border-white/40 !text-white">
              Book a consultation
            </Button>
          </div>
        </div>
        {more.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {more.map((p) => (
              <Link key={p.id} to={`/journal/${p.slug}`} className="group flex gap-4 rounded-[24px] bg-white p-3">
                <img src={p.cover} alt="" loading="lazy" className="h-28 w-36 shrink-0 rounded-2xl object-cover" />
                <div className="py-2">
                  <p className="text-xs text-muted">{p.category}</p>
                  <p className="mt-1 font-medium leading-snug group-hover:text-teal">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
