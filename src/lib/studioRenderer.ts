/**
 * WebGL recolouring for the Colour Studio.
 *
 * Every pixel of a surface is treated as  pixel = albedo × light.  The light (shading, shadows, reflections) is
 * recovered from the photo as  luminance / mean luminance of the original surface,  then multiplied by the new
 * colour. That keeps the render's real lighting and texture, and makes a navy wall genuinely dark and a white wall
 * genuinely white. Highlights that would overflow roll off towards white so gloss surfaces still shine.
 *
 * Up to 8 surface masks are packed into the RGBA channels of two textures.
 */
import { hexToLinear } from './studio';
import type { StudioScene } from './studio';

const MAX_ZONES = 8;

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2((a_pos.x + 1.0) * 0.5, 1.0 - (a_pos.y + 1.0) * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_base;
uniform sampler2D u_maskA;
uniform sampler2D u_maskB;
uniform vec3 u_target[${MAX_ZONES}];
uniform float u_amount[${MAX_ZONES}];
uniform float u_baseY[${MAX_ZONES}];
uniform float u_glow[${MAX_ZONES}];
uniform float u_split;

vec3 toLin(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 toSrgb(vec3 c) { c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }

vec3 relight(vec3 target, float shade) {
  vec3 c = target * shade;
  float m = max(c.r, max(c.g, c.b));
  if (m > 1.0) c = mix(c / m, vec3(1.0), 1.0 - 1.0 / m);   // roll highlights off to white
  return c;
}

void main() {
  vec3 lin = toLin(texture2D(u_base, v_uv).rgb);
  float Y = dot(lin, vec3(0.2126, 0.7152, 0.0722));
  vec4 ma = texture2D(u_maskA, v_uv);
  vec4 mb = texture2D(u_maskB, v_uv);
  float masks[${MAX_ZONES}];
  masks[0] = ma.r; masks[1] = ma.g; masks[2] = ma.b; masks[3] = ma.a;
  masks[4] = mb.r; masks[5] = mb.g; masks[6] = mb.b; masks[7] = mb.a;

  vec3 col = lin;
  float glow = 0.0;
  for (int i = 0; i < ${MAX_ZONES}; i++) {
    float m = masks[i];
    if (m > 0.001) {
      float shade = Y / max(u_baseY[i], 0.004);
      col = mix(col, relight(u_target[i], shade), m * u_amount[i]);
      glow = max(glow, m * u_glow[i]);
    }
  }
  // soft teal sheen on the hovered / selected surface
  col = mix(col, col * 0.82 + vec3(0.02, 0.12, 0.11), glow * 0.38);
  if (v_uv.x < u_split) col = lin;
  gl_FragColor = vec4(toSrgb(col), 1.0);
}`;

interface ZoneState {
  target: number[];
  goalTarget: number[];
  amount: number;
  goalAmount: number;
  glow: number;
  goalGlow: number;
}

export class StudioRenderer {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private tex: { base?: WebGLTexture; a?: WebGLTexture; b?: WebGLTexture } = {};
  private zones: ZoneState[] = [];
  private baseY: number[] = [];
  private split = 0;
  private raf = 0;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  /** per-zone alpha at reduced resolution, for picking surfaces under the pointer */
  hit: { w: number; h: number; data: Uint8Array[] } | null = null;
  scene: StudioScene | null = null;

  static supported() {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false, antialias: false }) as WebGLRenderingContext | null;
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader error');
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link error');
    this.prog = p;
    gl.useProgram(p);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, 'a_pos');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['u_base', 'u_maskA', 'u_maskB', 'u_target', 'u_amount', 'u_baseY', 'u_glow', 'u_split']) this.loc[n] = gl.getUniformLocation(p, n);
    gl.uniform1i(this.loc.u_base, 0);
    gl.uniform1i(this.loc.u_maskA, 1);
    gl.uniform1i(this.loc.u_maskB, 2);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  }

  private texture(unit: number, src: TexImageSource | ImageData, old?: WebGLTexture) {
    const gl = this.gl;
    if (old) gl.deleteTexture(old);
    const t = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src as TexImageSource);
    return t;
  }

  /** Loads a scene (image + masks). Resolves when it is ready to draw. */
  async load(scene: StudioScene, images: { base: HTMLImageElement; masks: HTMLImageElement[] }) {
    const { width: w, height: h } = scene;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);

    // pack zone masks into two RGBA images and keep a small copy of each for hit testing
    const work = document.createElement('canvas');
    work.width = w;
    work.height = h;
    const ctx = work.getContext('2d', { willReadFrequently: true })!;
    const packs = [new ImageData(w, h), new ImageData(w, h)];
    const hw = Math.round(w / 4);
    const hh = Math.round(h / 4);
    const hit: Uint8Array[] = [];
    images.masks.slice(0, MAX_ZONES).forEach((img, i) => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const src = ctx.getImageData(0, 0, w, h).data;
      const dst = packs[i >> 2].data;
      const ch = i & 3;
      for (let p = 0, q = ch; p < src.length; p += 4, q += 4) dst[q] = src[p + 3];
      const small = new Uint8Array(hw * hh);
      for (let y = 0; y < hh; y++) for (let x = 0; x < hw; x++) small[y * hw + x] = src[((y * 4) * w + x * 4) * 4 + 3];
      hit.push(small);
    });
    this.hit = { w: hw, h: hh, data: hit };

    this.tex.base = this.texture(0, images.base, this.tex.base);
    this.tex.a = this.texture(1, packs[0], this.tex.a);
    this.tex.b = this.texture(2, packs[1], this.tex.b);

    this.scene = scene;
    this.baseY = Array.from({ length: MAX_ZONES }, (_, i) => scene.zones[i]?.baseY ?? 0.2);
    this.zones = Array.from({ length: MAX_ZONES }, () => ({ target: [1, 1, 1], goalTarget: [1, 1, 1], amount: 0, goalAmount: 0, glow: 0, goalGlow: 0 }));
    this.draw();
  }

  /** Smoothly moves each surface towards its new colour (null = back to the original). */
  setColours(colours: (string | null)[], instant = false) {
    colours.slice(0, MAX_ZONES).forEach((hex, i) => {
      const z = this.zones[i];
      if (!z) return;
      if (hex) {
        const lin = hexToLinear(hex);
        if (z.amount < 0.02) z.target = [...lin]; // appearing: no colour sweep, just fade in
        z.goalTarget = lin;
        z.goalAmount = 1;
      } else z.goalAmount = 0;
      if (instant) {
        z.target = [...z.goalTarget];
        z.amount = z.goalAmount;
      }
    });
    this.kick();
  }

  setGlow(index: number | null) {
    this.zones.forEach((z, i) => (z.goalGlow = i === index ? 1 : 0));
    this.kick();
  }

  setSplit(fraction: number) {
    this.split = fraction;
    this.kick();
  }

  /** Index of the surface under a point (0-1 coords), or null. */
  pick(u: number, v: number): number | null {
    if (!this.hit) return null;
    const x = Math.min(this.hit.w - 1, Math.max(0, Math.floor(u * this.hit.w)));
    const y = Math.min(this.hit.h - 1, Math.max(0, Math.floor(v * this.hit.h)));
    let best: number | null = null;
    let bestA = 110;
    this.hit.data.forEach((d, i) => {
      const a = d[y * this.hit!.w + x];
      if (a > bestA) {
        bestA = a;
        best = i;
      }
    });
    return best;
  }

  private kick() {
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  }

  private tick = () => {
    this.raf = 0;
    let moving = false;
    const k = 0.16;
    for (const z of this.zones) {
      for (let c = 0; c < 3; c++) {
        const d = z.goalTarget[c] - z.target[c];
        if (Math.abs(d) > 0.0008) {
          z.target[c] += d * k;
          moving = true;
        } else z.target[c] = z.goalTarget[c];
      }
      for (const [cur, goal, speed] of [
        ['amount', 'goalAmount', 0.14],
        ['glow', 'goalGlow', 0.2],
      ] as const) {
        const d = z[goal] - z[cur];
        if (Math.abs(d) > 0.002) {
          z[cur] += d * speed;
          moving = true;
        } else z[cur] = z[goal];
      }
    }
    this.draw();
    if (moving) this.kick();
  };

  private draw() {
    const gl = this.gl;
    if (!this.tex.base) return;
    gl.uniform3fv(this.loc.u_target, new Float32Array(this.zones.flatMap((z) => z.target)));
    gl.uniform1fv(this.loc.u_amount, new Float32Array(this.zones.map((z) => z.amount)));
    gl.uniform1fv(this.loc.u_glow, new Float32Array(this.zones.map((z) => z.glow)));
    gl.uniform1fv(this.loc.u_baseY, new Float32Array(this.baseY));
    gl.uniform1f(this.loc.u_split, this.split);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex.base);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.tex.a!);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.tex.b!);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /** Final image (no glow, no compare split) with a branded caption bar, as a JPEG data URL. */
  snapshot(caption: string) {
    const saved = this.zones.map((z) => [z.glow, z.goalGlow, ...z.target, z.amount]);
    const split = this.split;
    this.zones.forEach((z) => {
      z.glow = z.goalGlow = 0;
      z.target = [...z.goalTarget];
      z.amount = z.goalAmount;
    });
    this.split = 0;
    this.draw();
    const { width: w, height: h } = this.canvas;
    const bar = Math.round(h * 0.075);
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h + bar;
    const c = out.getContext('2d')!;
    c.drawImage(this.canvas, 0, 0);
    c.fillStyle = '#171614';
    c.fillRect(0, h, w, bar);
    c.fillStyle = '#fff';
    c.textBaseline = 'middle';
    c.font = `600 ${Math.round(bar * 0.4)}px "Inter Tight", sans-serif`;
    c.fillText('INERIM', bar * 0.5, h + bar / 2);
    c.font = `400 ${Math.round(bar * 0.26)}px "Inter Tight", sans-serif`;
    c.textAlign = 'right';
    c.fillText(caption.length > 120 ? caption.slice(0, 117) + '…' : caption, w - bar * 0.5, h + bar / 2);
    this.zones.forEach((z, i) => {
      const s = saved[i];
      z.glow = s[0];
      z.goalGlow = s[1];
      z.target = [s[2], s[3], s[4]];
      z.amount = s[5];
    });
    this.split = split;
    this.draw();
    return out.toDataURL('image/jpeg', 0.92);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    const gl = this.gl;
    Object.values(this.tex).forEach((t) => t && gl.deleteTexture(t));
    gl.deleteProgram(this.prog);
    // no forced loseContext(): React can remount on the same canvas (StrictMode) and needs a live context
  }

  get lost() {
    return this.gl.isContextLost();
  }
}

/* ---------------- image loading with a cache, so switching rooms is instant after the first visit ---------------- */

const cache = new Map<string, Promise<HTMLImageElement>>();
export const loadImage = (src: string) => {
  if (!cache.has(src))
    cache.set(
      src,
      new Promise((res, rej) => {
        const i = new Image();
        i.decoding = 'async';
        i.onload = () => res(i);
        i.onerror = () => {
          cache.delete(src);
          rej(new Error(`Could not load ${src}`));
        };
        i.src = src;
      }),
    );
  return cache.get(src)!;
};

export const loadScene = async (scene: StudioScene) => ({
  base: await loadImage(scene.image),
  masks: await Promise.all(scene.zones.map((z) => loadImage(z.mask))),
});
