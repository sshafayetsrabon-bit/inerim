import React from 'react';

export interface RecolorLayer {
  mask: string;
  color: string | null; // null = keep original
  baseLum: number; // average luminance (0-1) of the original surface under the mask
}

const lum = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/** Brightness correction so the new colour reads as light/dark as it really is (multiply grey, screen grey). */
function tones(hex: string, base: number) {
  const t = lum(hex);
  return {
    darken: t <= base ? Math.max(0.08, t / base) : 1,
    lighten: t > base ? Math.min(0.92, 1 - (1 - t) / (1 - base)) : 0,
  };
}

const g = (v: number) => {
  const c = Math.round(v * 255);
  return `rgb(${c},${c},${c})`;
};

/**
 * Photo-real recolouring: a "color" blend layer swaps hue/saturation while keeping the
 * render's light and shadow, then a multiply/screen layer matches the target brightness.
 */
export function Recolor({ src, alt, layers, className = '', imgClassName = '' }: { src: string; alt: string; layers: RecolorLayer[]; className?: string; imgClassName?: string }) {
  return (
    <div className={`relative isolate ${className}`}>
      <img src={src} alt={alt} className={`block h-full w-full object-cover ${imgClassName}`} draggable={false} />
      {layers.map((l) => {
        const maskStyle: React.CSSProperties = {
          WebkitMaskImage: `url(${l.mask})`,
          maskImage: `url(${l.mask})`,
          // same framing as the photo's object-cover, so the mask stays aligned at any aspect ratio
          WebkitMaskSize: 'cover',
          maskSize: 'cover',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        };
        const on = !!l.color;
        // darken and lighten layers are both always present so brightness changes fade instead of popping
        const { darken, lighten } = l.color ? tones(l.color, l.baseLum) : { darken: 1, lighten: 0 };
        const layer = 'pointer-events-none absolute inset-0 transition-[background-color,opacity] duration-700 ease-out';
        return (
          <React.Fragment key={l.mask}>
            <div className={layer} style={{ ...maskStyle, backgroundColor: l.color || 'transparent', mixBlendMode: 'color', opacity: on ? 1 : 0 }} />
            <div className={layer} style={{ ...maskStyle, backgroundColor: g(darken), mixBlendMode: 'multiply', opacity: on ? 1 : 0 }} />
            <div className={layer} style={{ ...maskStyle, backgroundColor: g(lighten), mixBlendMode: 'screen', opacity: on ? 1 : 0 }} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

/** Renders the same result into a PNG data URL for download. */
export async function exportRecolor(src: string, layers: RecolorLayer[], caption?: string): Promise<string> {
  const base = await loadImg(src);
  const w = base.naturalWidth;
  const h = base.naturalHeight;
  const footer = caption ? Math.round(h * 0.07) : 0;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h + footer;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(base, 0, 0);
  for (const l of layers) {
    if (!l.color) continue;
    const mask = await loadImg(l.mask);
    const tone = tones(l.color, l.baseLum);
    for (const [fill, op] of [
      [l.color, 'color'],
      [g(tone.darken), 'multiply'],
      [g(tone.lighten), 'screen'],
    ] as const) {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const o = off.getContext('2d')!;
      o.fillStyle = fill;
      o.fillRect(0, 0, w, h);
      o.globalCompositeOperation = 'destination-in';
      o.drawImage(mask, 0, 0, w, h);
      ctx.globalCompositeOperation = op as GlobalCompositeOperation;
      ctx.drawImage(off, 0, 0);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  if (caption) {
    ctx.fillStyle = '#171614';
    ctx.fillRect(0, h, w, footer);
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 ${Math.round(footer * 0.38)}px "Inter Tight", sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText('INERIM', footer * 0.5, h + footer / 2);
    ctx.font = `400 ${Math.round(footer * 0.28)}px "Inter Tight", sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(caption, w - footer * 0.5, h + footer / 2);
  }
  return c.toDataURL('image/jpeg', 0.9);
}
