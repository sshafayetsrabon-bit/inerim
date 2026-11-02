import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, ImagePlus, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { admin } from '../lib/cms';
import { mdToHtml } from '../lib/markdown';
import { swatchStyle } from '../components/ui';
import type { Texture } from '../lib/types';

/* ------------------------------------------------------------------ schema */

export type FieldDef =
  | { key: string; label: string; type: 'text' | 'textarea' | 'markdown' | 'date' | 'slug'; help?: string; from?: string }
  | { key: string; label: string; type: 'number'; help?: string; nullable?: boolean; nullLabel?: string }
  | { key: string; label: string; type: 'select'; options: string[]; help?: string; allowCustom?: boolean }
  | { key: string; label: string; type: 'checkbox'; help?: string }
  | { key: string; label: string; type: 'image' | 'images' | 'tags'; help?: string }
  | { key: string; label: string; type: 'list'; item: FieldDef[]; help?: string; itemLabel: (v: Record<string, unknown>) => string; blank: () => Record<string, unknown> }
  | { key: string; label: string; type: 'colour'; help?: string };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

const box = 'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal';

/* ------------------------------------------------------------------ image library */

const BUILT_IN = [
  ...Array.from({ length: 28 }, (_, i) => `/designs/d${String(i + 1).padStart(2, '0')}.jpg`),
  ...['arch-wall', 'dining-chair', 'dining-set', 'gloss-wardrobe', 'u-kitchen', 'floating-bed', 'kids-bed', 'tv-unit', 'crockery', 'vanity', 'louvre-wardrobe', 'moon-panel', 'sofa', 'kids-study', 'window-seat', 'master-wardrobe'].map(
    (n) => `/products/${n}.jpg`,
  ),
];
const thumb = (src: string) => src.replace(/^\/designs\/d/, '/designs/sm/d');

function ImagePicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [uploads, setUploads] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    admin.uploads().then(setUploads).catch(() => {});
  }, []);
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setErr('');
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push((await admin.upload(f)).url);
      setUploads((u) => [...urls, ...u]);
      if (urls.length === 1) onPick(urls[0]);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="font-medium">Choose an image</p>
          <div className="flex items-center gap-2">
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => upload(e.target.files)} />
            <button onClick={() => input.current?.click()} className="flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-white">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Upload
            </button>
            <button onClick={onClose} aria-label="Close" className="cursor-pointer rounded-full p-2 hover:bg-paper">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {err && <p className="bg-red-50 px-6 py-2 text-sm text-red-700">{err}</p>}
        <div className="overflow-y-auto p-6">
          {uploads.length > 0 && (
            <>
              <p className="mb-3 text-xs text-muted">Your uploads</p>
              <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {uploads.map((u) => (
                  <button key={u} onClick={() => onPick(u)} className="aspect-square cursor-pointer overflow-hidden rounded-xl ring-teal hover:ring-2">
                    <img src={u} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="mb-3 text-xs text-muted">Built-in INERIM images</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {BUILT_IN.map((u) => (
              <button key={u} onClick={() => onPick(u)} className="aspect-square cursor-pointer overflow-hidden rounded-xl ring-teal hover:ring-2">
                <img src={thumb(u)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => setOpen(true)} className="relative h-24 w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-dashed border-line bg-paper">
        {value ? <img src={thumb(value)} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="mx-auto h-5 w-5 text-muted" />}
      </button>
      <div className="min-w-0 flex-1 space-y-2">
        <input className={box} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(true)} className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs hover:border-ink/30">
            Choose / upload
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="cursor-pointer rounded-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
              Remove
            </button>
          )}
        </div>
      </div>
      {open && (
        <ImagePicker
          onClose={() => setOpen(false)}
          onPick={(u) => {
            onChange(u);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ImagesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const move = (i: number, d: number) => {
    const n = [...value];
    const [x] = n.splice(i, 1);
    n.splice(i + d, 0, x);
    onChange(n);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((src, i) => (
          <div key={src + i} className="group relative h-24 w-28 overflow-hidden rounded-xl">
            <img src={thumb(src)} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-white px-2 py-0.5 text-[10px]">Main</span>}
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="cursor-pointer rounded-full bg-white p-1 disabled:opacity-30" aria-label="Move left">
                <ArrowUp className="h-3 w-3 -rotate-90" />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="cursor-pointer rounded-full bg-white p-1 text-red-600" aria-label="Remove">
                <Trash2 className="h-3 w-3" />
              </button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="cursor-pointer rounded-full bg-white p-1 disabled:opacity-30" aria-label="Move right">
                <ArrowUp className="h-3 w-3 rotate-90" />
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setOpen(true)} className="flex h-24 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-xs text-muted hover:border-teal hover:text-teal">
          <Plus className="h-4 w-4" /> Add image
        </button>
      </div>
      {open && (
        <ImagePicker
          onClose={() => setOpen(false)}
          onPick={(u) => {
            onChange([...value, u]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MarkdownField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [preview, setPreview] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line bg-paper/60 px-3 py-1.5 text-xs text-muted">
        <span>Markdown: ## Heading · **bold** · *italic* · - list · [link](https://…)</span>
        <button type="button" onClick={() => setPreview((p) => !p)} className="flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 hover:bg-white">
          {preview ? <Pencil className="h-3 w-3" /> : <Eye className="h-3 w-3" />} {preview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {preview ? (
        <div className="prose-inerim max-h-[480px] overflow-y-auto p-5 !text-[15px]" dangerouslySetInnerHTML={{ __html: mdToHtml(value) }} />
      ) : (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={14} className="w-full resize-y p-4 font-mono text-[13px] leading-relaxed outline-none" />
      )}
    </div>
  );
}

const TEXTURES: Texture[] = ['solid', 'gloss', 'wood', 'marble', 'metal', 'fabric'];

/* ------------------------------------------------------------------ renderer */

export function FieldInput({ def, value, onChange, record }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void; record: Record<string, unknown> }) {
  switch (def.type) {
    case 'text':
    case 'date':
      return <input type={def.type === 'date' ? 'date' : 'text'} className={box} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'slug':
      return (
        <div className="flex gap-2">
          <input className={box} value={(value as string) ?? ''} onChange={(e) => onChange(slugify(e.target.value))} />
          {def.from && (
            <button type="button" onClick={() => onChange(slugify(String(record[def.from!] ?? '')))} className="shrink-0 cursor-pointer rounded-xl border border-line px-3 text-xs hover:border-ink/30">
              From name
            </button>
          )}
        </div>
      );
    case 'textarea':
      return <textarea className={`${box} resize-y`} rows={3} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'markdown':
      return <MarkdownField value={(value as string) ?? ''} onChange={onChange} />;
    case 'number':
      return (
        <div className="flex items-center gap-3">
          <input
            type="number"
            className={`${box} max-w-[220px]`}
            value={value == null ? '' : String(value)}
            disabled={def.nullable && value == null}
            onChange={(e) => onChange(e.target.value === '' ? (def.nullable ? null : 0) : Number(e.target.value))}
          />
          {def.nullable && (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={value == null} onChange={(e) => onChange(e.target.checked ? null : 0)} className="accent-teal" />
              {def.nullLabel ?? 'Not set'}
            </label>
          )}
        </div>
      );
    case 'select':
      return (
        <div className="flex gap-2">
          <select className={box} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
            {[...new Set([...(def.options || []), ...(value ? [value as string] : [])])].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {def.allowCustom && (
            <button
              type="button"
              onClick={() => {
                const v = window.prompt('New value');
                if (v) onChange(v.trim());
              }}
              className="shrink-0 cursor-pointer rounded-xl border border-line px-3 text-xs hover:border-ink/30"
            >
              New…
            </button>
          )}
        </div>
      );
    case 'checkbox':
      return (
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <span className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-teal' : 'bg-stone'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
          </span>
          <input type="checkbox" className="hidden" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          {value ? 'Yes' : 'No'}
        </label>
      );
    case 'image':
      return <ImageField value={(value as string) ?? ''} onChange={onChange} />;
    case 'images':
      return <ImagesField value={(value as string[]) ?? []} onChange={onChange} />;
    case 'tags':
      return (
        <input
          className={box}
          value={((value as string[]) ?? []).join(', ')}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((t) => t.trimStart())
                .filter((t, i, a) => t || i === a.length - 1),
            )
          }
          onBlur={(e) => onChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
          placeholder="comma, separated, tags"
        />
      );
    case 'colour':
      return (
        <div className="flex items-center gap-2">
          <input type="color" value={(value as string) || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-white p-1" />
          <input className={`${box} max-w-[140px] font-mono`} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'list': {
      const items = (value as Record<string, unknown>[]) ?? [];
      const set = (i: number, v: Record<string, unknown>) => onChange(items.map((x, k) => (k === i ? v : x)));
      const move = (i: number, d: number) => {
        const n = [...items];
        const [x] = n.splice(i, 1);
        n.splice(i + d, 0, x);
        onChange(n);
      };
      return (
        <div className="space-y-2">
          {items.map((it, i) => (
            <ListItem key={i} label={def.itemLabel(it)} swatch={'hex' in it ? swatchStyle({ name: '', hex: String(it.hex || '#ccc'), texture: it.texture as Texture }) : undefined}>
              <div className="grid gap-3 sm:grid-cols-2">
                {def.item.map((sub) => (
                  <div key={sub.key} className={sub.type === 'images' || sub.type === 'textarea' || sub.type === 'image' ? 'sm:col-span-2' : ''}>
                    <p className="mb-1 text-xs text-muted">{sub.label}</p>
                    <FieldInput def={sub} value={it[sub.key]} record={it} onChange={(v) => set(i, { ...it, [sub.key]: v })} />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-1">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="cursor-pointer rounded-full p-1.5 hover:bg-paper disabled:opacity-30" aria-label="Move up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="cursor-pointer rounded-full p-1.5 hover:bg-paper disabled:opacity-30" aria-label="Move down">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="ml-auto flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </ListItem>
          ))}
          <button type="button" onClick={() => onChange([...items, def.blank()])} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-line px-4 py-2 text-xs text-muted hover:border-teal hover:text-teal">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      );
    }
  }
}

function ListItem({ label, children, swatch }: { label: string; children: React.ReactNode; swatch?: React.CSSProperties }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-line bg-white">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left text-sm">
        {swatch && <span className="h-5 w-5 shrink-0 rounded-full ring-1 ring-ink/10" style={swatch} />}
        <span className="flex-1 truncate">{label || 'Untitled'}</span>
        <span className="text-xs text-muted">{open ? 'Close' : 'Edit'}</span>
      </button>
      {open && <div className="border-t border-line p-3.5">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ schemas */

const finishItem: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'hex', label: 'Colour', type: 'colour' },
  { key: 'texture', label: 'Texture', type: 'select', options: TEXTURES },
];

export const PRODUCT_FIELDS = (categories: string[]): FieldDef[] => [
  { key: 'name', label: 'Product name', type: 'text' },
  { key: 'slug', label: 'URL slug', type: 'slug', from: 'name', help: 'Shown in the address: /shop/your-slug' },
  { key: 'category', label: 'Category', type: 'select', options: categories, allowCustom: true },
  { key: 'summary', label: 'Short summary', type: 'textarea', help: 'One or two sentences shown on cards and at the top of the page.' },
  { key: 'description', label: 'Full description', type: 'markdown' },
  { key: 'price', label: 'Price (৳)', type: 'number', nullable: true, nullLabel: 'Price on request' },
  { key: 'unit', label: 'Price unit', type: 'select', options: ['piece', 'set', 'sheet', 'board', 'sft', 'rft', 'project'], allowCustom: true },
  { key: 'images', label: 'Photos', type: 'images', help: 'The first photo is the main one. Hovering a card shows the second.' },
  {
    key: 'finishes',
    label: 'Finishes & colours',
    type: 'list',
    item: finishItem,
    itemLabel: (v) => String(v.name || ''),
    blank: () => ({ name: 'New finish', hex: '#cccccc', texture: 'solid' }),
  },
  {
    key: 'specs',
    label: 'Specifications',
    type: 'list',
    item: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
    ],
    itemLabel: (v) => `${v.label || ''}: ${v.value || ''}`,
    blank: () => ({ label: '', value: '' }),
  },
  { key: 'tags', label: 'Search tags', type: 'tags' },
  { key: 'featured', label: 'Feature on home page', type: 'checkbox' },
  { key: 'inStock', label: 'Available to order', type: 'checkbox' },
];

export const POST_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'slug', label: 'URL slug', type: 'slug', from: 'title' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'cover', label: 'Cover image', type: 'image' },
  { key: 'category', label: 'Category', type: 'select', options: ['Guides', 'Materials', 'Space Planning', 'Projects', 'News'], allowCustom: true },
  { key: 'author', label: 'Author', type: 'text' },
  { key: 'date', label: 'Publish date', type: 'date' },
  { key: 'readMinutes', label: 'Reading time (minutes)', type: 'number' },
  { key: 'body', label: 'Article', type: 'markdown' },
  { key: 'published', label: 'Published', type: 'checkbox', help: 'Unpublished articles are hidden from the site.' },
];

export const PROJECT_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Project title', type: 'text' },
  { key: 'slug', label: 'URL slug', type: 'slug', from: 'title' },
  { key: 'category', label: 'Type', type: 'select', options: ['Residential', 'Commercial'], allowCustom: true },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'area', label: 'Area (e.g. 1,450 sft)', type: 'text' },
  { key: 'year', label: 'Year', type: 'text' },
  { key: 'cover', label: 'Cover image', type: 'image' },
  { key: 'summary', label: 'Summary', type: 'textarea' },
  { key: 'highlights', label: 'Highlights', type: 'tags' },
  {
    key: 'rooms',
    label: 'Rooms / spaces',
    type: 'list',
    item: [
      { key: 'name', label: 'Room name', type: 'text' },
      { key: 'note', label: 'Short note', type: 'textarea' },
      { key: 'images', label: 'Photos', type: 'images' },
    ],
    itemLabel: (v) => String(v.name || ''),
    blank: () => ({ name: 'New room', note: '', images: [] }),
  },
  { key: 'featured', label: 'Feature on home page', type: 'checkbox' },
];

export const COLOUR_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Colour name', type: 'text' },
  { key: 'hex', label: 'Colour', type: 'colour' },
  { key: 'family', label: 'Family', type: 'select', options: ['Neutrals', 'Earth & Blush', 'Greens', 'Blues', 'Warm'], allowCustom: true },
];

export const SETTINGS_FIELDS: FieldDef[] = [
  { key: 'phone', label: 'Phone (as displayed)', type: 'text' },
  { key: 'whatsapp', label: 'WhatsApp number', type: 'text', help: 'Digits only with country code, e.g. 8801603000411' },
  { key: 'email', label: 'Email', type: 'text', help: 'New enquiries are also emailed here (if your hosting allows PHP mail).' },
  { key: 'address', label: 'Address / area', type: 'text' },
  { key: 'hours', label: 'Opening hours', type: 'text' },
  { key: 'facebook', label: 'Facebook URL', type: 'text' },
  { key: 'instagram', label: 'Instagram URL', type: 'text' },
  { key: 'youtube', label: 'YouTube URL', type: 'text' },
  { key: 'announcement', label: 'Top announcement bar', type: 'text', help: 'Leave empty to hide it.' },
  {
    key: 'packages',
    label: 'Packages (used by the price calculator)',
    type: 'list',
    item: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'rate', label: 'Rate per sft (৳)', type: 'number' },
      { key: 'tone', label: 'Tagline', type: 'text' },
      { key: 'bestFor', label: 'Best for', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    itemLabel: (v) => `${v.name || ''} · ৳${v.rate ?? ''}/sft`,
    blank: () => ({ id: `pkg-${Date.now()}`, name: 'New package', rate: 0, tone: '', bestFor: '', image: '' }),
  },
];
