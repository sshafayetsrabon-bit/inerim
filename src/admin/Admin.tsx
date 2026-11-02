import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Download,
  ExternalLink,
  FolderOpen,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Palette,
  Phone,
  Plus,
  Search,
  Settings as SettingsIcon,
  Trash2,
} from 'lucide-react';
import { admin, useContent } from '../lib/cms';
import { CATEGORIES, SEED_SETTINGS } from '../lib/seed';
import type { CollectionKey, Content, Inquiry } from '../lib/types';
import { swatchStyle, whatsappLink } from '../components/ui';
import { COLOUR_FIELDS, FieldDef, FieldInput, POST_FIELDS, PRODUCT_FIELDS, PROJECT_FIELDS, SETTINGS_FIELDS, slugify } from './fields';

type View = 'dashboard' | 'inquiries' | 'products' | 'posts' | 'projects' | 'colours' | 'settings' | 'account';
type ListKey = Exclude<CollectionKey, 'settings'>;
type Rec = Record<string, unknown> & { id: string };

const input = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-teal';

/* ================================================================= auth */

export default function Admin() {
  const [phase, setPhase] = useState<'loading' | 'setup' | 'login' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const check = () =>
    admin
      .status()
      .then((s) => setPhase(s.setup ? 'setup' : s.authed ? 'ready' : 'login'))
      .catch((e) => {
        setError((e as Error).message);
        setPhase('error');
      });
  useEffect(() => {
    document.title = 'INERIM CMS';
    check();
  }, []);

  if (phase === 'loading')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-teal" />
      </div>
    );
  if (phase === 'error')
    return (
      <AuthShell title="CMS unavailable">
        <p className="text-sm text-muted">{error}</p>
        <p className="mt-4 text-sm text-muted">
          Make sure <code className="rounded bg-paper px-1">/api/index.php</code> is deployed and PHP can write to the data folder.
        </p>
      </AuthShell>
    );
  if (phase === 'setup' || phase === 'login') return <Login setup={phase === 'setup'} onDone={() => setPhase('ready')} />;
  return (
    <Dashboard
      onLogout={() => {
        admin.logout();
        setPhase('login');
      }}
    />
  );
}

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[28px] bg-white p-8 sm:p-10">
        <p className="text-2xl font-semibold tracking-[-0.06em]">
          INERIM<span className="text-teal">.</span> <span className="text-sm font-normal tracking-normal text-muted">CMS</span>
        </p>
        <h1 className="mb-6 mt-8 text-2xl font-medium">{title}</h1>
        {children}
      </motion.div>
    </div>
  );
}

function Login({ setup, onDone }: { setup: boolean; onDone: () => void }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (setup && pw !== pw2) return setErr('The passwords don’t match.');
    setBusy(true);
    try {
      await (setup ? admin.setup(pw) : admin.login(pw));
      onDone();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthShell title={setup ? 'Create your admin password' : 'Sign in'}>
      {setup && <p className="-mt-3 mb-5 text-sm text-muted">This is the first time the CMS has been opened. Choose a strong password (10+ characters). Only you will know it.</p>}
      <form onSubmit={submit} className="space-y-3">
        <input type="password" autoFocus required placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} autoComplete={setup ? 'new-password' : 'current-password'} />
        {setup && <input type="password" required placeholder="Repeat password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={input} autoComplete="new-password" />}
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-white disabled:opacity-50">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} {setup ? 'Create password & open CMS' : 'Sign in'}
        </button>
      </form>
      <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to website
      </Link>
    </AuthShell>
  );
}

/* ================================================================= shell */

const NAV: { id: View; label: string; icon: typeof Inbox }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Enquiries', icon: Inbox },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'posts', label: 'Journal', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'colours', label: 'Colour palette', icon: Palette },
  { id: 'settings', label: 'Site settings', icon: SettingsIcon },
  { id: 'account', label: 'Password', icon: KeyRound },
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { content, setContent } = useContent();
  const [view, setView] = useState<View>('dashboard');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [toast, setToast] = useState('');
  const loadInq = () =>
    admin
      .inquiries()
      .then(setInquiries)
      .catch((e) => (String(e.message).includes('sign in') ? onLogout() : null));
  useEffect(() => {
    loadInq();
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const save = async <K extends CollectionKey>(k: K, value: Content[K]) => {
    try {
      await admin.save(k, value);
      setContent({ ...content, [k]: value });
      setToast('Saved. The website is updated.');
      return true;
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes('sign in')) onLogout();
      setToast(`Could not save: ${msg}`);
      return false;
    }
  };
  const newCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-white md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <p className="text-xl font-semibold tracking-[-0.06em]">
            INERIM<span className="text-teal">.</span> <span className="text-xs font-normal tracking-normal text-muted">CMS</span>
          </p>
          <Link to="/" target="_blank" className="text-muted hover:text-ink" aria-label="Open website">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${view === n.id ? 'bg-ink text-white' : 'text-ink/70 hover:bg-paper'}`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
              {n.id === 'inquiries' && newCount > 0 && <span className="ml-auto rounded-full bg-teal px-2 py-0.5 text-[11px] text-white">{newCount}</span>}
            </button>
          ))}
          <button onClick={onLogout} className="flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/70 hover:bg-paper md:mt-4">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>

      <main className="min-w-0 p-4 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {view === 'dashboard' && <Overview content={content} inquiries={inquiries} go={setView} />}
            {view === 'inquiries' && <Inquiries items={inquiries} reload={loadInq} whatsapp={content.settings.whatsapp} />}
            {view === 'products' && (
              <Collection
                title="Products"
                singular="product"
                items={content.products as unknown as Rec[]}
                fields={PRODUCT_FIELDS([...new Set([...CATEGORIES, ...content.products.map((p) => p.category)])])}
                titleKey="name"
                subtitle={(r) => `${r.category} · ${r.price == null ? 'Price on request' : `৳${Number(r.price).toLocaleString('en-IN')} / ${r.unit}`}`}
                image={(r) => (r.images as string[])?.[0]}
                blank={() => ({ id: '', slug: '', name: 'New product', category: CATEGORIES[0], summary: '', description: '', price: null, unit: 'piece', images: [], finishes: [], specs: [], tags: [], featured: false, inStock: true })}
                viewUrl={(r) => `/shop/${r.slug}`}
                onSave={(list) => save('products', list as never)}
              />
            )}
            {view === 'posts' && (
              <Collection
                title="Journal"
                singular="article"
                items={content.posts as unknown as Rec[]}
                fields={POST_FIELDS}
                titleKey="title"
                subtitle={(r) => `${r.published ? 'Published' : 'Draft'} · ${r.date} · ${r.category}`}
                image={(r) => r.cover as string}
                blank={() => ({ id: '', slug: '', title: 'New article', excerpt: '', cover: '', category: 'Guides', author: 'INERIM Studio', date: new Date().toISOString().slice(0, 10), readMinutes: 3, body: '', published: false })}
                viewUrl={(r) => `/journal/${r.slug}`}
                onSave={(list) => save('posts', list as never)}
              />
            )}
            {view === 'projects' && (
              <Collection
                title="Projects"
                singular="project"
                items={content.projects as unknown as Rec[]}
                fields={PROJECT_FIELDS}
                titleKey="title"
                subtitle={(r) => `${r.category} · ${(r.rooms as unknown[])?.length ?? 0} rooms`}
                image={(r) => r.cover as string}
                blank={() => ({ id: '', slug: '', title: 'New project', category: 'Residential', location: '', area: '', year: String(new Date().getFullYear()), cover: '', summary: '', highlights: [], rooms: [], featured: false })}
                viewUrl={(r) => `/projects/${r.slug}`}
                onSave={(list) => save('projects', list as never)}
              />
            )}
            {view === 'colours' && (
              <Collection
                title="Colour palette"
                singular="colour"
                items={content.colours as unknown as Rec[]}
                fields={COLOUR_FIELDS}
                titleKey="name"
                subtitle={(r) => `${r.family} · ${r.hex}`}
                swatch={(r) => String(r.hex)}
                blank={() => ({ id: '', name: 'New colour', hex: '#b97f7c', family: 'Neutrals' })}
                viewUrl={() => '/colour-studio'}
                onSave={(list) => save('colours', list as never)}
                intro="These colours appear in the Colour Studio."
              />
            )}
            {view === 'settings' && <SettingsView value={content.settings as unknown as Record<string, unknown>} onSave={(v) => save('settings', v as never)} />}
            {view === 'account' && <Account onToast={setToast} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/* ================================================================= dashboard */

function Overview({ content, inquiries, go }: { content: Content; inquiries: Inquiry[]; go: (v: View) => void }) {
  const samples = content.products.filter((p) => p.sample).length + content.posts.filter((p) => p.sample).length;
  const stats = [
    { label: 'New enquiries', value: inquiries.filter((i) => i.status === 'new').length, view: 'inquiries' as View },
    { label: 'Products', value: content.products.length, view: 'products' as View },
    { label: 'Journal articles', value: content.posts.length, view: 'posts' as View },
    { label: 'Projects', value: content.projects.length, view: 'projects' as View },
  ];
  const checklist = [
    { done: content.settings.email !== SEED_SETTINGS.email || content.settings.phone !== SEED_SETTINGS.phone, label: 'Confirm your phone, WhatsApp and email in Site settings', view: 'settings' as View },
    { done: samples === 0, label: `Replace sample content (${samples} sample items left)`, view: 'products' as View },
    { done: content.products.some((p) => p.price != null), label: 'Add real prices where you want them shown', view: 'products' as View },
    { done: !!(content.settings.facebook || content.settings.instagram), label: 'Add your social media links', view: 'settings' as View },
  ];
  return (
    <>
      <Header title="Welcome back" intro="Manage your website content and customer enquiries." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <button key={s.label} onClick={() => go(s.view)} className="cursor-pointer rounded-2xl bg-white p-5 text-left transition-shadow hover:shadow-md">
            <p className="text-4xl font-medium">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6">
          <p className="mb-4 font-medium">Latest enquiries</p>
          {inquiries.slice(0, 6).map((i) => (
            <button key={i.id} onClick={() => go('inquiries')} className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line py-3 text-left text-sm last:border-0">
              <span>
                <span className="font-medium">{i.name}</span> <span className="text-muted">· {i.type}</span>
              </span>
              <StatusPill status={i.status} />
            </button>
          ))}
          {!inquiries.length && <p className="text-sm text-muted">No enquiries yet. They’ll appear here when customers use the website forms.</p>}
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="mb-4 font-medium">Launch checklist</p>
          {checklist.map((c) => (
            <button key={c.label} onClick={() => go(c.view)} className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left text-sm">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${c.done ? 'border-teal bg-teal text-white' : 'border-line'}`}>{c.done && '✓'}</span>
              <span className={c.done ? 'text-muted line-through' : ''}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================= collections */

function Collection({
  title,
  singular,
  items,
  fields,
  titleKey,
  subtitle,
  image,
  swatch,
  blank,
  viewUrl,
  onSave,
  intro,
}: {
  title: string;
  singular: string;
  items: Rec[];
  fields: FieldDef[];
  titleKey: string;
  subtitle: (r: Rec) => string;
  image?: (r: Rec) => string | undefined;
  swatch?: (r: Rec) => string;
  blank: () => Rec;
  viewUrl: (r: Rec) => string;
  onSave: (list: Rec[]) => Promise<boolean>;
  intro?: string;
}) {
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Rec | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const list = useMemo(() => items.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [items, q]);
  const samples = items.filter((r) => r.sample).length;

  const commit = async (next: Rec[]) => {
    setBusy(true);
    const ok = await onSave(next);
    setBusy(false);
    return ok;
  };
  const saveItem = async (r: Rec) => {
    const slugKey = 'slug' in r ? 'slug' : null;
    let rec: Rec = { ...r };
    delete rec.sample;
    if (slugKey && !rec.slug) rec.slug = slugify(String(rec[titleKey] || 'item'));
    if (!rec.id) rec.id = (slugKey ? String(rec.slug) : slugify(String(rec[titleKey]))) || `item-${Date.now()}`;
    if (slugKey && items.some((x) => x.slug === rec.slug && x.id !== (isNew ? '__new' : r.id))) return alert('Another item already uses this URL slug. Please change it.');
    if (isNew && items.some((x) => x.id === rec.id)) rec = { ...rec, id: `${rec.id}-${Date.now().toString(36)}` };
    const next = isNew ? [rec, ...items] : items.map((x) => (x.id === r.id ? rec : x));
    if (await commit(next)) setEditing(null);
  };
  const remove = async (r: Rec) => {
    if (!confirm(`Delete “${r[titleKey]}”? This can’t be undone from here.`)) return;
    if (await commit(items.filter((x) => x.id !== r.id))) setEditing(null);
  };
  const duplicate = (r: Rec) => {
    setIsNew(true);
    setEditing({ ...structuredClone(r), id: '', slug: '', [titleKey]: `${r[titleKey]} (copy)` });
  };
  const move = (r: Rec, d: number) => {
    const i = items.findIndex((x) => x.id === r.id);
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    commit(n);
  };

  if (editing)
    return (
      <Editor
        title={isNew ? `New ${singular}` : String(editing[titleKey] || singular)}
        record={editing}
        fields={fields}
        busy={busy}
        onCancel={() => setEditing(null)}
        onSave={saveItem}
        onDelete={isNew ? undefined : () => remove(editing)}
        viewUrl={isNew ? undefined : viewUrl(editing)}
      />
    );

  return (
    <>
      <Header title={title} intro={intro ?? `${items.length} ${items.length === 1 ? singular : `${singular}s`}`}>
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-40 bg-transparent outline-none" />
        </label>
        <button
          onClick={() => {
            setIsNew(true);
            setEditing(blank());
          }}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white"
        >
          <Plus className="h-4 w-4" /> New {singular}
        </button>
      </Header>
      {samples > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mint px-5 py-3 text-sm text-teal-deep">
          <span>{samples} items marked “Sample” are starter content. Edit them with your real details, or delete them.</span>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl bg-white">
        {list.map((r) => (
          <div key={r.id} className="group flex items-center gap-4 border-b border-line px-4 py-3 last:border-0 hover:bg-paper/50">
            <button
              onClick={() => {
                setIsNew(false);
                setEditing(structuredClone(r));
              }}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left"
            >
              {swatch ? (
                <span className="h-11 w-11 shrink-0 rounded-xl ring-1 ring-ink/10" style={{ background: swatch(r) }} />
              ) : (
                <span className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {image?.(r) ? (
                    <img src={String(image(r)).replace(/^\/designs\/d/, '/designs/sm/d')} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    'finishes' in r && Array.isArray(r.finishes) && r.finishes[0] ? <span className="block h-full w-full" style={swatchStyle(r.finishes[0] as never)} /> : null
                  )}
                </span>
              )}
              <span className="min-w-0">
                <span className="flex items-center gap-2 truncate font-medium">
                  {String(r[titleKey])}
                  {Boolean(r.sample) && <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-normal text-teal-deep">Sample</span>}
                </span>
                <span className="block truncate text-xs text-muted">{subtitle(r)}</span>
              </span>
            </button>
            <div className="flex shrink-0 gap-1 opacity-60 transition-opacity group-hover:opacity-100">
              <button onClick={() => move(r, -1)} title="Move up" className="cursor-pointer rounded-lg p-2 hover:bg-white">
                ↑
              </button>
              <button onClick={() => move(r, 1)} title="Move down" className="cursor-pointer rounded-lg p-2 hover:bg-white">
                ↓
              </button>
              <button onClick={() => duplicate(r)} title="Duplicate" className="cursor-pointer rounded-lg p-2 hover:bg-white">
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={() => remove(r)} title="Delete" className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-white">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!list.length && <p className="p-8 text-center text-sm text-muted">Nothing here yet.</p>}
      </div>
    </>
  );
}

function Editor({
  title,
  record,
  fields,
  busy,
  onCancel,
  onSave,
  onDelete,
  viewUrl,
}: {
  title: string;
  record: Rec;
  fields: FieldDef[];
  busy: boolean;
  onCancel: () => void;
  onSave: (r: Rec) => void;
  onDelete?: () => void;
  viewUrl?: string;
}) {
  const [r, setR] = useState<Rec>(record);
  const dirty = JSON.stringify(r) !== JSON.stringify(record);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(r);
      }}
    >
      <div className="sticky top-0 z-10 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 bg-paper/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => (!dirty || confirm('Discard your changes?')) && onCancel()} className="cursor-pointer rounded-full bg-white p-2" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="truncate text-2xl font-medium tracking-tight">{title}</h1>
          {dirty && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800">Unsaved</span>}
        </div>
        <div className="flex gap-2">
          {viewUrl && (
            <a href={viewUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm">
              <ExternalLink className="h-3.5 w-3.5" /> View
            </a>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm text-red-600">
              Delete
            </button>
          )}
          <button disabled={busy} className="flex cursor-pointer items-center gap-2 rounded-full bg-teal px-5 py-2 text-sm font-medium text-white disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save & publish
          </button>
        </div>
      </div>
      <div className="max-w-3xl space-y-5 rounded-2xl bg-white p-5 sm:p-8">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
            <FieldInput def={f} value={r[f.key]} record={r} onChange={(v) => setR((x) => ({ ...x, [f.key]: v }))} />
            {f.help && <p className="mt-1.5 text-xs text-muted">{f.help}</p>}
          </div>
        ))}
      </div>
    </form>
  );
}

function SettingsView({ value, onSave }: { value: Record<string, unknown>; onSave: (v: Record<string, unknown>) => Promise<boolean> }) {
  const [busy, setBusy] = useState(false);
  return (
    <>
      <Header title="Site settings" intro="Contact details, announcement bar and the package rates used by the price calculator." />
      <Editor
        title="Settings"
        record={{ ...value, id: 'settings' }}
        fields={SETTINGS_FIELDS}
        busy={busy}
        onCancel={() => {}}
        onSave={async (r) => {
          setBusy(true);
          const { id: _id, ...rest } = r;
          await onSave(rest);
          setBusy(false);
        }}
      />
    </>
  );
}

function Account({ onToast }: { onToast: (s: string) => void }) {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [err, setErr] = useState('');
  return (
    <>
      <Header title="Change password" intro="Changing the password signs out every other device." />
      <form
        className="max-w-md space-y-3 rounded-2xl bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr('');
          try {
            await admin.password(cur, next);
            await admin.login(next);
            setCur('');
            setNext('');
            onToast('Password changed.');
          } catch (e) {
            setErr((e as Error).message);
          }
        }}
      >
        <input type="password" required placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} className={input} autoComplete="current-password" />
        <input type="password" required placeholder="New password (10+ characters)" value={next} onChange={(e) => setNext(e.target.value)} className={input} autoComplete="new-password" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="cursor-pointer rounded-full bg-ink px-5 py-3 text-sm text-white">Update password</button>
      </form>
    </>
  );
}

/* ================================================================= enquiries */

const STATUSES: Inquiry['status'][] = ['new', 'contacted', 'won', 'closed'];
const TYPE_LABEL: Record<string, string> = { contact: 'Contact', booking: 'Consultation', quote: 'Quote request', partnership: 'Partnership', estimate: 'Estimate', visualizer: 'Colour Studio' };

function StatusPill({ status }: { status: Inquiry['status'] }) {
  const c = { new: 'bg-teal text-white', contacted: 'bg-amber-100 text-amber-800', won: 'bg-emerald-100 text-emerald-800', closed: 'bg-paper text-muted' }[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] capitalize ${c}`}>{status}</span>;
}

function DataView({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length));
  return (
    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      {entries.map(([k, v]) => (
        <div key={k} className={Array.isArray(v) || typeof v === 'object' ? 'sm:col-span-2' : ''}>
          <dt className="text-xs capitalize text-muted">{k.replace(/([A-Z])/g, ' $1')}</dt>
          <dd>
            {Array.isArray(v) ? (
              <ul className="mt-1 space-y-1">
                {v.map((x, i) => (
                  <li key={i} className="rounded-lg bg-paper px-3 py-1.5">
                    {typeof x === 'object' && x ? Object.values(x as object).filter(Boolean).join(' · ') : String(x)}
                  </li>
                ))}
              </ul>
            ) : typeof v === 'object' ? (
              Object.entries(v as object)
                .map(([a, b]) => `${a}: ${b}`)
                .join(' · ')
            ) : (
              String(v)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Inquiries({ items, reload, whatsapp }: { items: Inquiry[]; reload: () => void; whatsapp: string }) {
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('open');
  const [open, setOpen] = useState<string | null>(null);
  const list = items.filter((i) => (type === 'all' || i.type === type) && (status === 'all' || (status === 'open' ? i.status === 'new' || i.status === 'contacted' : i.status === status)));
  const types = ['all', ...new Set(items.map((i) => i.type))];

  const exportCsv = () => {
    const rows = [['Date', 'Type', 'Status', 'Name', 'Phone', 'Email', 'Message', 'Details']];
    items.forEach((i) => rows.push([i.createdAt, i.type, i.status, i.name, i.phone, i.email || '', i.message || '', JSON.stringify(i.data || {})]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    a.download = `inerim-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };
  const phoneDigits = (p: string) => {
    const d = p.replace(/\D/g, '');
    return d.startsWith('0') ? `88${d}` : d;
  };

  return (
    <>
      <Header title="Enquiries" intro="Quote requests, consultations, partnership applications and Colour Studio looks from the website.">
        <button onClick={reload} className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm">
          Refresh
        </button>
        <button onClick={exportCsv} className="flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </Header>
      <div className="mb-4 flex flex-wrap gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm outline-none">
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All types' : TYPE_LABEL[t] || t}
            </option>
          ))}
        </select>
        {['open', 'all', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`cursor-pointer rounded-full px-4 py-2 text-sm capitalize ${status === s ? 'bg-ink text-white' : 'bg-white'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((i) => (
          <div key={i.id} className="overflow-hidden rounded-2xl bg-white">
            <button onClick={() => setOpen(open === i.id ? null : i.id)} className="flex w-full cursor-pointer flex-wrap items-center gap-3 px-5 py-4 text-left">
              <StatusPill status={i.status} />
              <span className="font-medium">{i.name}</span>
              <span className="text-sm text-muted">{TYPE_LABEL[i.type] || i.type}</span>
              <span className="ml-auto text-xs text-muted">{new Date(i.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </button>
            {open === i.id && (
              <div className="border-t border-line px-5 py-5">
                <div className="mb-5 flex flex-wrap gap-2">
                  <a href={`tel:${i.phone}`} className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-sm">
                    <Phone className="h-3.5 w-3.5" /> {i.phone}
                  </a>
                  <a href={whatsappLink(phoneDigits(i.phone), `Hi ${i.name}, this is INERIM Interior. Thank you for your enquiry!`)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm text-white">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  {i.email && (
                    <a href={`mailto:${i.email}`} className="flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-sm">
                      <Mail className="h-3.5 w-3.5" /> {i.email}
                    </a>
                  )}
                  <select
                    value={i.status}
                    onChange={async (e) => {
                      await admin.updateInquiry(i.id, { status: e.target.value as Inquiry['status'] });
                      reload();
                    }}
                    className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm capitalize outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this enquiry permanently?')) return;
                      await admin.deleteInquiry(i.id);
                      reload();
                    }}
                    className="ml-auto cursor-pointer rounded-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
                {i.message && <p className="mb-4 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm">{i.message}</p>}
                {i.data && <DataView data={i.data} />}
              </div>
            )}
          </div>
        ))}
        {!list.length && <p className="rounded-2xl bg-white p-10 text-center text-sm text-muted">No enquiries match these filters.</p>}
      </div>
    </>
  );
}
