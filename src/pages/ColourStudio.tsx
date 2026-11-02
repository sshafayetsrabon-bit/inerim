import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowUpRight, Check, Download, Eye, Link2, MousePointerClick, Redo2, RotateCcw, Search, Send, SplitSquareHorizontal, Undo2, X } from 'lucide-react';
import { useContent } from '../lib/cms';
import { SCENES } from '../lib/scenes.generated';
import { LOOKS, Picks, StudioScene, WOOD_TONES, applyLook, colourDistance, decodePicks, encodePicks, normHex, onColour } from '../lib/studio';
import { StudioRenderer, loadImage, loadScene } from '../lib/studioRenderer';
import { Recolor, exportRecolor } from '../components/Recolor';
import { Field, Honeypot, SentPanel, useInquiry } from '../components/Form';
import { Button, EASE, PageHeader } from '../components/ui';
import { PageSEO } from '../components/PageSEO';
import { PAGE_META } from '../lib/copy';
import { breadcrumbs } from '../lib/schema';

type Looks = Record<string, Picks>;
const STORE_KEY = 'inerim-studio-v2';
const RECENT_KEY = 'inerim-studio-recent';
const readJSON = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
};
const writeJSON = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
};
const toSrgbLum = (y: number) => (y <= 0.0031308 ? y * 12.92 : 1.055 * y ** (1 / 2.4) - 0.055);

/* ===================================================================== page */

export default function ColourStudio() {
  const { content } = useContent();
  const [params, setParams] = useSearchParams();
  const scene = SCENES.find((s) => s.id === params.get('room')) ?? SCENES[0];

  // every room keeps its own look; the URL holds the current room's look so it can be shared.
  // The undo history is the single source of truth: the current state is stack[i].
  const [history, setHistory] = useState<{ stack: Looks[]; i: number }>(() => {
    const saved = readJSON<Looks>(STORE_KEY, {});
    const fromUrl = decodePicks(params.get('c'), scene.zones);
    return { stack: [Object.keys(fromUrl).length ? { ...saved, [scene.id]: fromUrl } : saved], i: 0 };
  });
  const looks = history.stack[history.i];
  const picks = looks[scene.id] ?? {};
  const [zoneId, setZoneId] = useState(scene.zones[0].id);
  const zone = scene.zones.find((z) => z.id === zoneId) ?? scene.zones[0];
  const [recent, setRecent] = useState<string[]>(() => readJSON(RECENT_KEY, []));
  const [toast, setToast] = useState('');
  const [showSend, setShowSend] = useState(false);
  const stageRef = useRef<StageHandle | null>(null);

  useEffect(() => {
    if (!scene.zones.some((z) => z.id === zoneId)) setZoneId(scene.zones[0].id);
  }, [scene.id]);

  // keep URL + storage in sync
  useEffect(() => {
    writeJSON(STORE_KEY, looks);
    const c = encodePicks(picks);
    const next = new URLSearchParams(params);
    next.set('room', scene.id);
    if (c) next.set('c', c);
    else next.delete('c');
    if (next.toString() !== params.toString()) setParams(next, { replace: true, preventScrollReset: true });
  }, [looks, scene.id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = useCallback(
    (nextPicks: Picks) =>
      setHistory((h) => {
        const next = { ...h.stack[h.i], [scene.id]: nextPicks };
        const stack = [...h.stack.slice(0, h.i + 1), next].slice(-80);
        return { stack, i: stack.length - 1 };
      }),
    [scene.id],
  );

  const pickColour = (hex: string | null) => {
    if (hex) {
      setRecent((r) => {
        const n = [hex, ...r.filter((x) => x !== hex)].slice(0, 10);
        writeJSON(RECENT_KEY, n);
        return n;
      });
    }
    if ((picks[zone.id] ?? null) === hex) return;
    commit({ ...picks, [zone.id]: hex });
  };

  const undo = () => setHistory((h) => ({ ...h, i: Math.max(0, h.i - 1) }));
  const redo = () => setHistory((h) => ({ ...h, i: Math.min(h.stack.length - 1, h.i + 1) }));

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  const palette = content.colours;
  const nameOf = useCallback(
    (hex: string | null | undefined) => {
      if (!hex) return 'Original';
      const all = [...palette.map((c) => ({ name: c.name, hex: c.hex })), ...WOOD_TONES];
      const exact = all.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
      if (exact) return exact.name;
      const near = all.map((c) => ({ c, d: colourDistance(c.hex, hex) })).sort((a, b) => a.d - b.d)[0];
      return near && near.d < 4 ? `${near.c.name}` : hex.toUpperCase();
    },
    [palette],
  );
  const summary = scene.zones.map((z) => `${z.label}: ${nameOf(picks[z.id])}`).join(' · ');
  const changed = scene.zones.some((z) => picks[z.id]);

  const switchRoom = (id: string) => {
    const next = new URLSearchParams(params);
    next.set('room', id);
    const c = encodePicks(looks[id] ?? {});
    if (c) next.set('c', c);
    else next.delete('c');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'My INERIM look', url });
      else {
        await navigator.clipboard.writeText(url);
        setToast('Link copied. Anyone with it sees your colours.');
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  return (
    <>
      <PageSEO {...PAGE_META.colourStudio} path="/colour-studio" ld={() => [breadcrumbs([['Home', '/'], ['Colour Studio', '/colour-studio']])]} />
      <PageHeader
        eyebrow="Colour Studio"
        title="Try colours on a real INERIM room"
        intro="Tap any surface in the photo, then pick a colour. The render keeps its real light and shadow, so you see how the colour will actually feel."
      />
      <section className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          {/* ---------------- stage ---------------- */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Stage
              ref={stageRef}
              scene={scene}
              picks={picks}
              selected={zone.id}
              onSelect={setZoneId}
              nameOf={nameOf}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ToolButton label="Undo" onClick={undo} disabled={history.i === 0}>
                <Undo2 className="h-4 w-4" />
              </ToolButton>
              <ToolButton label="Redo" onClick={redo} disabled={history.i >= history.stack.length - 1}>
                <Redo2 className="h-4 w-4" />
              </ToolButton>
              <ToolButton label="Reset this room" onClick={() => commit({})} disabled={!changed}>
                <RotateCcw className="h-4 w-4" />
              </ToolButton>
              <span className="mx-1 h-6 w-px bg-line" />
              <ToolButton label="Compare with original" onClick={() => stageRef.current?.toggleCompare()} disabled={!changed} wide>
                <SplitSquareHorizontal className="h-4 w-4" /> Compare
              </ToolButton>
              <HoldOriginal stage={stageRef} disabled={!changed} />
              <div className="ml-auto flex gap-2">
                <ToolButton label="Copy share link" onClick={share} wide>
                  <Link2 className="h-4 w-4" /> Share
                </ToolButton>
                <ToolButton label="Download image" onClick={() => stageRef.current?.download(summary, `inerim-${scene.id}-look.jpg`)} wide dark>
                  <Download className="h-4 w-4" /> Download
                </ToolButton>
              </div>
            </div>
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
              {SCENES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => switchRoom(s.id)}
                  onMouseEnter={() => loadScene(s).catch(() => {})}
                  className={`group relative h-20 w-32 shrink-0 cursor-pointer overflow-hidden rounded-2xl transition md:h-24 md:w-40 ${
                    s.id === scene.id ? 'ring-2 ring-teal ring-offset-2 ring-offset-paper' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={s.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-left text-[13px] font-medium text-white">{s.name}</span>
                  {Object.values(looks[s.id] ?? {}).some(Boolean) && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-teal ring-2 ring-white" title="You’ve changed this room" />}
                </button>
              ))}
            </div>
          </div>

          {/* ---------------- controls ---------------- */}
          <div className="space-y-4">
            <Panel title="1. Choose a surface" hint={<><MousePointerClick className="h-3.5 w-3.5" /> or tap it in the photo</>}>
              <LayoutGroup id="zones">
                <div className="grid gap-1.5">
                  {scene.zones.map((z) => {
                    const on = z.id === zone.id;
                    const hex = picks[z.id];
                    return (
                      <div key={z.id} className="relative">
                        {on && <motion.span layoutId="zone-active" className="absolute inset-0 rounded-2xl bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                        <button
                          onClick={() => setZoneId(z.id)}
                          onMouseEnter={() => stageRef.current?.glow(z.id)}
                          onMouseLeave={() => stageRef.current?.glow(null)}
                          className={`relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${on ? 'text-white' : 'hover:bg-paper'}`}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-black/10"
                            style={{ background: hex ?? 'conic-gradient(#d9d1c4 0 25%, #fff 0 50%, #d9d1c4 0 75%, #fff 0)' }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{z.label}</span>
                            <span className={`block truncate text-xs ${on ? 'text-white/60' : 'text-muted'}`}>{nameOf(hex)}</span>
                          </span>
                          {hex && (
                            <span
                              role="button"
                              aria-label={`Reset ${z.label}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                commit({ ...picks, [z.id]: null });
                              }}
                              className={`rounded-full p-1.5 ${on ? 'hover:bg-white/15' : 'hover:bg-white'}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </LayoutGroup>
            </Panel>

            <Panel title={`2. Pick a colour for ${zone.label.toLowerCase()}`}>
              <Palette
                zoneKind={zone.kind}
                current={picks[zone.id] ?? null}
                recent={recent}
                onPick={pickColour}
                colours={palette}
              />
            </Panel>

            <Panel title="Or start from a look">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {LOOKS.map((l) => {
                  const applied = applyLook(l, scene.zones);
                  const active = scene.zones.every((z) => (picks[z.id] ?? null) === (applied[z.id] ?? null));
                  return (
                    <button
                      key={l.id}
                      onClick={() => commit(applied)}
                      className={`cursor-pointer rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 ${active ? 'border-teal bg-mint/50' : 'border-line hover:border-ink/25'}`}
                    >
                      <span className="flex -space-x-1.5">
                        {[l.paint, l.fabric, l.accent, l.wood].map((c, i) => (
                          <span key={i} className="h-6 w-6 rounded-full ring-2 ring-white" style={{ background: c }} />
                        ))}
                      </span>
                      <span className="mt-2 block text-[13px] font-medium">{l.name}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Keep your look">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowSend((v) => !v)} variant="teal" disabled={!changed}>
                  <Send className="h-4 w-4" /> Send to a designer
                </Button>
                {scene.product && (
                  <Button to={`/shop/${scene.product.slug}`} variant="outline">
                    Shop the look <ArrowUpRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <AnimatePresence>{showSend && <SendLook scene={scene.name} summary={summary} />}</AnimatePresence>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Colours on screen are a guide. Final paint and fabric shades vary with lighting and material, so we always show physical
                samples before you decide.
              </p>
            </Panel>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===================================================================== stage */

interface StageHandle {
  toggleCompare: () => void;
  holdOriginal: (on: boolean) => void;
  glow: (zoneId: string | null) => void;
  download: (caption: string, filename: string) => void;
}

const Stage = function Stage({
  ref,
  scene,
  picks,
  selected,
  onSelect,
  nameOf,
}: {
  ref: React.RefObject<StageHandle | null>;
  scene: StudioScene;
  picks: Picks;
  selected: string;
  onSelect: (id: string) => void;
  nameOf: (h: string | null | undefined) => string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<StudioRenderer | null>(null);
  const [gl] = useState(() => typeof window !== 'undefined' && StudioRenderer.supported());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const [compare, setCompare] = useState<number | null>(null); // fraction of width showing the original
  const [holding, setHolding] = useState(false);
  const listGlow = useRef<string | null>(null);
  const loadedScene = useRef('');
  const colours = scene.zones.map((z) => picks[z.id] ?? null);
  const colourKey = colours.join('|');

  // create the renderer once; if the GPU drops the context (tab in background on mobile), rebuild it
  const [contextId, setContextId] = useState(0);
  useEffect(() => {
    const el = canvas.current;
    if (!gl || !el) return;
    try {
      renderer.current = new StudioRenderer(el);
    } catch (e) {
      setError((e as Error).message);
    }
    const lost = (e: Event) => {
      e.preventDefault();
      setReady(false);
    };
    const restored = () => setContextId((n) => n + 1);
    el.addEventListener('webglcontextlost', lost);
    el.addEventListener('webglcontextrestored', restored);
    return () => {
      el.removeEventListener('webglcontextlost', lost);
      el.removeEventListener('webglcontextrestored', restored);
      renderer.current?.destroy();
      renderer.current = null;
    };
  }, [gl, contextId]);

  // load the scene
  useEffect(() => {
    let alive = true;
    setReady(false);
    setCompare(null);
    setHover(null);
    loadScene(scene)
      .then(async (imgs) => {
        if (!alive) return;
        if (renderer.current) {
          await renderer.current.load(scene, imgs);
          renderer.current.setColours(colours, true);
          loadedScene.current = scene.id;
        }
        if (alive) setReady(true);
        // warm up the other rooms in the background
        SCENES.filter((s) => s.id !== scene.id).forEach((s) => loadScene(s).catch(() => {}));
      })
      .catch((e) => alive && setError((e as Error).message));
    return () => {
      alive = false;
    };
  }, [scene.id, gl, contextId]);

  // animate to new colours
  useEffect(() => {
    if (ready && loadedScene.current === scene.id) renderer.current?.setColours(colours);
  }, [colourKey, ready]);

  // compare split
  useEffect(() => {
    renderer.current?.setSplit(holding ? 1 : compare ?? 0);
  }, [compare, holding, ready]);

  // glow follows hover, then the list hover
  const applyGlow = (id: string | null) => {
    const idx = id ? scene.zones.findIndex((z) => z.id === id) : -1;
    renderer.current?.setGlow(idx >= 0 ? idx : null);
  };
  useEffect(() => applyGlow(hover?.id ?? listGlow.current), [hover?.id, ready]);

  // brief pulse when the selected surface changes
  useEffect(() => {
    if (!ready) return;
    applyGlow(selected);
    const t = setTimeout(() => applyGlow(hover?.id ?? listGlow.current), 650);
    return () => clearTimeout(t);
  }, [selected]);

  ref.current = {
    toggleCompare: () => setCompare((c) => (c == null ? 0.5 : null)),
    holdOriginal: setHolding,
    glow: (id) => {
      listGlow.current = id;
      applyGlow(id ?? hover?.id ?? null);
    },
    download: async (caption, filename) => {
      let url: string;
      if (renderer.current && ready) url = renderer.current.snapshot(caption);
      else url = await exportRecolor(scene.image, cssLayers(scene, picks), caption);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    },
  };

  const uv = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    return { u: (e.clientX - r.left) / r.width, v: (e.clientY - r.top) / r.height, x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const zoneAt = (u: number, v: number) => {
    const i = renderer.current?.pick(u, v);
    return i == null ? null : scene.zones[i]?.id ?? null;
  };

  return (
    <div
      ref={wrap}
      className="relative w-full touch-pan-y select-none overflow-hidden rounded-[28px] bg-sand"
      style={{ aspectRatio: `${scene.width} / ${scene.height}` }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ready) return;
        const p = uv(e);
        const id = zoneAt(p.u, p.v);
        setHover(id ? { id, x: p.x, y: p.y } : null);
      }}
      onPointerLeave={() => setHover(null)}
      onClick={(e) => {
        if (!ready) return;
        const p = uv(e as unknown as React.PointerEvent);
        const id = zoneAt(p.u, p.v);
        if (id) onSelect(id);
      }}
    >
      {gl && !error ? (
        <canvas ref={canvas} className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'} ${hover ? 'cursor-pointer' : ''}`} />
      ) : (
        <>
          <Recolor src={scene.image} alt={scene.name} layers={cssLayers(scene, picks)} className="absolute inset-0 h-full w-full" />
          {(holding || compare != null) && (
            <img src={scene.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${(1 - (holding ? 1 : compare ?? 0)) * 100}% 0 0)` }} />
          )}
        </>
      )}

      {/* loading state: the plain photo with a shimmer, so switching rooms never flashes empty */}
      <AnimatePresence>
        {gl && !error && !ready && (
          <motion.div key="loading" className="absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <img src={scene.image} alt="" className="h-full w-full object-cover blur-[2px]" onError={() => {}} />
            <div className="absolute inset-0 animate-pulse bg-white/30" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-sm">Preparing room…</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* hover label */}
      <AnimatePresence>
        {hover && compare == null && !holding && (
          <motion.div
            key={hover.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-10 flex items-center gap-2 whitespace-nowrap rounded-full bg-white/95 py-1 pl-1 pr-3 text-xs shadow-lg backdrop-blur"
            style={{ left: Math.min(hover.x + 14, (wrap.current?.clientWidth ?? 600) - 190), top: Math.max(8, hover.y - 38) }}
          >
            <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: picks[hover.id] ?? 'conic-gradient(#d9d1c4 0 25%, #fff 0 50%, #d9d1c4 0 75%, #fff 0)' }} />
            <b className="font-medium">{scene.zones.find((z) => z.id === hover.id)?.label}</b>
            <span className="text-muted">{nameOf(picks[hover.id])}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* compare handle */}
      {compare != null && !holding && <CompareHandle value={compare} onChange={setCompare} wrap={wrap} />}
      {holding && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs">Original</span>}

      {/* current colours legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 hidden flex-wrap gap-1.5 sm:flex">
        {scene.zones
          .filter((z) => picks[z.id])
          .map((z) => (
            <motion.span layout key={z.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 rounded-full bg-white/90 py-1 pl-1 pr-3 text-[11px] backdrop-blur">
              <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: picks[z.id]! }} />
              {z.label}: {nameOf(picks[z.id])}
            </motion.span>
          ))}
      </div>
      {error && <p className="absolute inset-x-4 top-4 rounded-xl bg-white/90 px-4 py-2 text-xs text-muted">Using simplified preview on this device.</p>}
    </div>
  );
};

const cssLayers = (scene: StudioScene, picks: Picks) =>
  scene.zones.map((z) => ({ mask: z.mask, color: picks[z.id] ?? null, baseLum: toSrgbLum(z.baseY) }));

function CompareHandle({ value, onChange, wrap }: { value: number; onChange: (v: number) => void; wrap: React.RefObject<HTMLDivElement | null> }) {
  const move = (clientX: number) => {
    const r = wrap.current!.getBoundingClientRect();
    onChange(Math.max(0.02, Math.min(0.98, (clientX - r.left) / r.width)));
  };
  return (
    <div className="absolute inset-y-0 z-20" style={{ left: `${value * 100}%` }}>
      <div className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-white shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
      <button
        role="slider"
        aria-label="Compare original and new colours"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          e.stopPropagation();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => (e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId) && move(e.clientX)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onChange(Math.max(0.02, value - 0.05));
          if (e.key === 'ArrowRight') onChange(Math.min(0.98, value + 0.05));
        }}
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full bg-white text-sm shadow-xl"
      >
        ⟷
      </button>
      <span className="absolute right-3 top-3 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[11px]">Original</span>
      <span className="absolute left-3 top-3 whitespace-nowrap rounded-full bg-teal px-2.5 py-1 text-[11px] text-white">Yours</span>
    </div>
  );
}

/* ===================================================================== palette */

function Palette({
  zoneKind,
  current,
  recent,
  onPick,
  colours,
}: {
  zoneKind: string;
  current: string | null;
  recent: string[];
  onPick: (hex: string | null) => void;
  colours: { id: string; name: string; hex: string; family: string }[];
}) {
  const [q, setQ] = useState('');
  const [fam, setFam] = useState('All');
  const [hexInput, setHexInput] = useState('');
  const families = useMemo(() => ['All', ...new Set(colours.map((c) => c.family))], [colours]);
  const sets = useMemo(() => {
    const base = colours.map((c) => ({ name: c.name, hex: c.hex, family: c.family }));
    const wood = WOOD_TONES.map((w) => ({ ...w, family: 'Wood tones' }));
    return zoneKind === 'wood' ? [...wood, ...base] : base;
  }, [colours, zoneKind]);
  const famList = zoneKind === 'wood' ? ['All', 'Wood tones', ...families.slice(1)] : families;
  const s = q.trim().toLowerCase();
  const list = sets.filter((c) => (fam === 'All' || c.family === fam) && (!s || c.name.toLowerCase().includes(s) || c.hex.toLowerCase().includes(s.replace('#', ''))));
  const grouped = useMemo(() => {
    const m = new Map<string, typeof list>();
    list.forEach((c) => m.set(c.family, [...(m.get(c.family) || []), c]));
    return [...m.entries()];
  }, [list]);
  const applyHex = () => {
    const h = normHex(hexInput);
    if (h) {
      onPick(h);
      setHexInput('');
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-full border border-line px-4 py-2 text-sm focus-within:border-teal">
          <Search className="h-4 w-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search colours…" className="w-full bg-transparent outline-none placeholder:text-muted" />
        </label>
        <button
          onClick={() => onPick(null)}
          className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] ${current == null ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink/30'}`}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Original
        </button>
      </div>
      <div className="no-scrollbar -mx-1 mt-3 flex gap-1 overflow-x-auto px-1">
        {famList.map((f) => (
          <button key={f} onClick={() => setFam(f)} className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs transition-colors ${fam === f ? 'bg-ink text-white' : 'bg-paper text-ink/70 hover:text-ink'}`}>
            {f}
          </button>
        ))}
      </div>

      {recent.length > 0 && !s && fam === 'All' && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted">Recently used</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((h) => (
              <Dot key={h} hex={h} name={h.toUpperCase()} active={current === h} onClick={() => onPick(h)} small />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 max-h-[340px] space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
        {grouped.map(([f, cs]) => (
          <div key={f}>
            <p className="mb-2 text-xs text-muted">{f}</p>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8">
              {cs.map((c) => (
                <Dot key={c.hex + c.name} hex={c.hex} name={c.name} active={current?.toLowerCase() === c.hex.toLowerCase()} onClick={() => onPick(c.hex)} />
              ))}
            </div>
          </div>
        ))}
        {!grouped.length && <p className="py-6 text-center text-sm text-muted">No colours match “{q}”. Try a hex code below.</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-line py-1 pl-1 pr-4 text-[13px] hover:border-ink/30">
          <input type="color" value={current ?? '#b97f7c'} onChange={(e) => onPick(e.target.value)} className="h-8 w-8 cursor-pointer rounded-full border-0 bg-transparent p-0" aria-label="Custom colour" />
          Custom
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyHex();
          }}
          className="flex items-center rounded-full border border-line pl-4 text-[13px] focus-within:border-teal"
        >
          <span className="text-muted">#</span>
          <input value={hexInput.replace('#', '')} onChange={(e) => setHexInput(e.target.value.slice(0, 7))} placeholder="b97f7c" className="w-20 bg-transparent px-1 py-2 font-mono outline-none" aria-label="Hex colour code" />
          <button disabled={!normHex(hexInput)} className="m-1 cursor-pointer rounded-full bg-ink px-3 py-1 text-xs text-white disabled:opacity-30">
            Apply
          </button>
        </form>
      </div>
    </div>
  );
}

function Dot({ hex, name, active, onClick, small }: { hex: string; name: string; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={name}
      aria-label={name}
      aria-pressed={active}
      className={`group relative aspect-square cursor-pointer rounded-full ${small ? 'w-8' : 'w-full'} ${active ? 'ring-2 ring-teal ring-offset-2' : 'ring-1 ring-black/10'}`}
      style={{ background: hex }}
    >
      {active && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center" style={{ color: onColour(hex) }}>
          <Check className="h-4 w-4" strokeWidth={3} />
        </motion.span>
      )}
      <span className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] text-white group-hover:block">{name}</span>
    </motion.button>
  );
}

/* ===================================================================== bits */

function Panel({ title, hint, children }: { title: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{title}</p>
        {hint && <span className="flex items-center gap-1 text-xs text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ToolButton({ label, onClick, disabled, children, wide, dark }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; wide?: boolean; dark?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${wide ? 'px-4' : 'w-10'} ${
        dark ? 'bg-ink text-white hover:bg-teal' : 'bg-white hover:bg-sand'
      }`}
    >
      {children}
    </button>
  );
}

function HoldOriginal({ stage, disabled }: { stage: React.RefObject<StageHandle | null>; disabled: boolean }) {
  const on = (v: boolean) => stage.current?.holdOriginal(v);
  return (
    <button
      type="button"
      disabled={disabled}
      title="Hold to see the original"
      onPointerDown={() => on(true)}
      onPointerUp={() => on(false)}
      onPointerLeave={() => on(false)}
      onPointerCancel={() => on(false)}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && on(true)}
      onKeyUp={() => on(false)}
      className="flex h-10 cursor-pointer touch-none select-none items-center gap-1.5 rounded-full bg-white px-4 text-[13px] hover:bg-sand disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Eye className="h-4 w-4" /> Hold for original
    </button>
  );
}

function SendLook({ scene, summary }: { scene: string; summary: string }) {
  const { state, send, reset } = useInquiry('visualizer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hp, setHp] = useState('');
  const link = typeof window !== 'undefined' ? window.location.href : '';
  const waText = `Hi INERIM! I created a look in your Colour Studio.\n\nRoom: ${scene}\n${summary.replace(/ · /g, '\n')}\n\nSee it here: ${link}\n\nName: ${name}`;
  if (state === 'sent' || state === 'offline')
    return (
      <div className="mt-4">
        <SentPanel state={state} waText={waText} title="Your look is with our designers." onReset={reset} />
      </div>
    );
  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative overflow-hidden"
      onSubmit={(e) => {
        e.preventDefault();
        send({ name, phone, website: hp, message: summary, data: { scene, summary, link } });
      }}
    >
      <div className="mt-4 space-y-3">
        <Honeypot value={hp} onChange={setHp} />
        <Field label="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="Phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button type="submit" className="w-full" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send my colours'}
        </Button>
      </div>
    </motion.form>
  );
}

// keep the thumbnail images warm for instant room switching
SCENES.forEach((s) => typeof window !== 'undefined' && loadImage(s.image).catch(() => {}));
