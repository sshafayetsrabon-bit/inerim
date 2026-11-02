// Colour Studio: shared types, colour maths and curated looks.

export type ZoneKind = 'paint' | 'fabric' | 'wood' | 'gloss';

export interface StudioZone {
  id: string;
  label: string;
  kind: ZoneKind;
  mask: string;
  baseY: number; // mean linear luminance of the original surface
  baseRgb: number[];
  coverage: number;
}

export interface StudioScene {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  product?: { slug: string; label: string } | null;
  zones: StudioZone[];
}

/** zoneId -> hex colour (null/absent = original) */
export type Picks = Record<string, string | null>;

export const normHex = (h: string) => {
  let s = h.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(s)) s = s.split('').map((c) => c + c).join('');
  return /^[0-9a-f]{6}$/.test(s) ? `#${s}` : null;
};

export const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
};

export const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const hexToLinear = (hex: string) => hexToRgb(hex).map(srgbToLinear);

const toLab = (hex: string) => {
  const [r, g, b] = hexToLinear(hex);
  const x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};

export const colourDistance = (a: string, b: string) => {
  const p = toLab(a);
  const q = toLab(b);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
};

/** Readable text colour (ink or white) on top of a swatch. */
export const onColour = (hex: string) => {
  const [r, g, b] = hexToLinear(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? '#171614' : '#ffffff';
};

/* ---------- URL state:  ?room=master&c=walls.22324a~bedding.c99a3b ---------- */

export const encodePicks = (p: Picks) =>
  Object.entries(p)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}.${(v as string).slice(1)}`)
    .join('~');

export const decodePicks = (s: string | null, zones: StudioZone[]): Picks => {
  const out: Picks = {};
  if (!s) return out;
  for (const part of s.split('~')) {
    const [k, v] = part.split('.');
    const hex = v ? normHex(v) : null;
    if (hex && zones.some((z) => z.id === k)) out[k] = hex;
  }
  return out;
};

/* ---------- curated looks: one colour per surface kind ---------- */

export interface Look {
  id: string;
  name: string;
  paint: string;
  fabric: string;
  accent: string;
  wood: string;
  gloss: string;
}

export const LOOKS: Look[] = [
  { id: 'soft-neutral', name: 'Soft Neutral', paint: '#efe9df', fabric: '#cdbfae', accent: '#a89a8a', wood: '#a98563', gloss: '#e9e4dc' },
  { id: 'inerim-teal', name: 'INERIM Teal', paint: '#eef0ec', fabric: '#0b7875', accent: '#c99a3b', wood: '#c9a57a', gloss: '#2f4a3a' },
  { id: 'coastal', name: 'Coastal Calm', paint: '#e1e9ee', fabric: '#48607e', accent: '#a9bcd0', wood: '#d2b48c', gloss: '#a9bcd0' },
  { id: 'earthy', name: 'Earth & Clay', paint: '#ead8c6', fabric: '#b5603f', accent: '#6f5546', wood: '#6b4a33', gloss: '#9cab8e' },
  { id: 'forest', name: 'Deep Forest', paint: '#dfe3d8', fabric: '#2f4a3a', accent: '#c99a3b', wood: '#5a3d2b', gloss: '#6e7350' },
  { id: 'blush', name: 'Blush Romance', paint: '#ecd6cf', fabric: '#b97f7c', accent: '#efe9df', wood: '#d8c3a0', gloss: '#f4f2ee' },
  { id: 'midnight', name: 'Midnight Luxe', paint: '#2b3445', fabric: '#c99a3b', accent: '#efe9df', wood: '#3e2a1f', gloss: '#22324a' },
];

export const applyLook = (look: Look, zones: StudioZone[]): Picks => {
  const out: Picks = {};
  let fabricCount = 0;
  for (const z of zones) {
    if (z.kind === 'fabric') out[z.id] = fabricCount++ % 2 === 0 ? look.fabric : look.accent;
    else out[z.id] = look[z.kind];
  }
  return out;
};

/** Wood stains offered alongside paint colours for timber surfaces. */
export const WOOD_TONES = [
  { name: 'Natural Oak', hex: '#c9a57a' },
  { name: 'Honey Teak', hex: '#b07c4a' },
  { name: 'Walnut', hex: '#6b4a33' },
  { name: 'Wenge', hex: '#3e2a1f' },
  { name: 'Smoked Ash', hex: '#8a7a6b' },
  { name: 'Whitewash', hex: '#e2d8ca' },
];
