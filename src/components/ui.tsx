import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { Finish } from '../lib/types';

export const EASE = [0.16, 1, 0.3, 1] as const;

export const formatBDT = (n: number) => '৳' + Math.round(n).toLocaleString('en-IN');
export const priceLabel = (price: number | null, unit: string) => (price == null ? 'Price on request' : `${formatBDT(price)} / ${unit}`);
export const whatsappLink = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

type Lenisish = { scrollTo: (t: Element | number, o?: object) => void; stop: () => void; start: () => void };
export const lenis = () => (window as unknown as { lenis?: Lenisish }).lenis;
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const l = lenis();
  if (l) l.scrollTo(el, { offset: -90, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
};

/** Words rise from behind a mask, one after another. */
export function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.05,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const words = text.split(' ');
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Reveal({ children, delay = 0, y = 36, className = '' }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Image that unveils with a clip-path wipe and drifts with scroll. */
export function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  parallax = 8,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: 1 + parallax / 50 }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </motion.div>
  );
}

export function Magnetic({ children, strength = 0.3, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toLocaleString('en-IN'),
  className = '',
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(prev.current, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    prev.current = value;
    return () => c.stop();
  }, [value, inView]);
  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}

export function Tag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border border-ink/15 px-3 py-1 text-[11px] font-medium text-ink/70 ${className}`}>{children}</span>;
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-medium text-muted ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-teal" />
      {children}
    </div>
  );
}

/** Pill button / link with a fill wipe on hover. */
export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'dark',
  size = 'md',
  className = '',
  type = 'button',
  disabled,
}: {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'dark' | 'light' | 'teal' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const sizes = { sm: 'px-4 py-2 text-xs', md: 'px-6 py-3.5 text-sm', lg: 'px-8 py-4 text-base' }[size];
  const styles = {
    dark: 'bg-ink text-white',
    light: 'bg-white text-ink',
    teal: 'bg-teal text-white',
    outline: 'border border-ink/20 text-ink hover:text-white',
  }[variant];
  const fill = variant === 'light' ? 'bg-teal' : variant === 'teal' ? 'bg-ink' : variant === 'outline' ? 'bg-ink' : 'bg-teal';
  const cls = `group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-50 ${sizes} ${styles} ${variant === 'light' ? 'hover:text-white' : ''} ${className}`;
  const inner = (
    <>
      <span className={`absolute inset-0 translate-y-[101%] rounded-full ${fill} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0`} />
      <span className="relative flex items-center gap-2">{children}</span>
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

export function ArrowCircle({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${
        dark ? 'bg-ink text-white' : 'bg-white text-ink'
      } ${className}`}
    >
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );
}

/** Circular rotating text badge, like a stamp. */
export function RotatingBadge({ text = 'Modern • Minimal • Premium • ', className = '', size = 128 }: { text?: string; className?: string; size?: number }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="circle-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="9.5" letterSpacing="2.4" fill="currentColor" fontFamily="Inter Tight, sans-serif" fontWeight={500}>
          <textPath href="#circle-path">{text.repeat(2)}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[34%] rounded-full border border-current opacity-60" />
    </div>
  );
}

/** Label tab cut into the bottom-left corner of an image card (Poliform style). */
export function NotchLabel({ children, bg = '#f4f1ec', className = '' }: { children: React.ReactNode; bg?: string; className?: string }) {
  const corner = (
    <svg width="28" height="28" viewBox="0 0 28 28" className="absolute" aria-hidden>
      <path d="M0 0 V28 H28 A28 28 0 0 1 0 0 Z" fill={bg} />
    </svg>
  );
  return (
    <div className={`absolute bottom-0 left-0 rounded-tr-[28px] pr-6 pt-5 ${className}`} style={{ background: bg }}>
      <span className="absolute -top-7 left-0">{corner}</span>
      <span className="absolute -right-7 bottom-0">{corner}</span>
      {children}
    </div>
  );
}

/* ---------- material swatches ---------- */

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `rgb(${c((n >> 16) & 255)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
};

export function swatchStyle(f: Finish): React.CSSProperties {
  const h = f.hex;
  switch (f.texture) {
    case 'wood':
      return {
        backgroundColor: h,
        backgroundImage: `repeating-linear-gradient(92deg, ${shade(h, 0.05)} 0 3px, transparent 3px 9px, ${shade(h, -0.06)} 9px 11px, transparent 11px 19px), linear-gradient(90deg, ${shade(h, -0.04)}, ${shade(h, 0.04)}, ${shade(h, -0.03)})`,
      };
    case 'marble':
      return {
        backgroundColor: h,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.04' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 -14 6.2'/></filter><rect width='200' height='200' filter='url(%23m)'/></svg>")`,
        backgroundSize: 'cover',
      };
    case 'metal':
      return { backgroundImage: `linear-gradient(115deg, ${shade(h, -0.12)} 0%, ${shade(h, 0.18)} 28%, ${h} 45%, ${shade(h, -0.08)} 62%, ${shade(h, 0.14)} 80%, ${shade(h, -0.1)} 100%)` };
    case 'gloss':
      return { backgroundImage: `linear-gradient(135deg, ${shade(h, 0.16)} 0%, ${h} 38%, ${shade(h, -0.08)} 100%), linear-gradient(${h}, ${h})`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' };
    case 'fabric':
      return {
        backgroundColor: h,
        backgroundImage: `repeating-linear-gradient(45deg, ${shade(h, 0.04)} 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, ${shade(h, -0.04)} 0 1px, transparent 1px 3px)`,
      };
    default:
      return { backgroundColor: h };
  }
}

export function Swatch({ finish, active, onClick, size = 40 }: { finish: Finish; active?: boolean; onClick?: () => void; size?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={finish.name}
      aria-label={finish.name}
      aria-pressed={active}
      className={`relative shrink-0 cursor-pointer rounded-full transition-transform duration-300 hover:scale-110 ${active ? 'ring-2 ring-teal ring-offset-2 ring-offset-white' : 'ring-1 ring-ink/10'}`}
      style={{ width: size, height: size, ...swatchStyle(finish) }}
    />
  );
}

/** Material "sheets" fanned out, used when a product has no photo. */
export function MaterialStack({ finishes, className = '' }: { finishes: Finish[]; className?: string }) {
  const show = finishes.slice(0, 4);
  return (
    <div className={`group/stack relative flex h-full w-full items-center justify-center overflow-hidden bg-sand ${className}`}>
      {show.map((f, i) => {
        const mid = (show.length - 1) / 2;
        return (
          <div
            key={f.name}
            className="absolute aspect-[3/4] w-[42%] rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translateX(var(--x))_rotate(var(--r))] group-hover:[transform:translateX(var(--xh))_rotate(var(--rh))]"
            style={
              {
                ...swatchStyle(f),
                zIndex: i,
                '--x': `${(i - mid) * 14}%`,
                '--r': `${(i - mid) * 6}deg`,
                '--xh': `${(i - mid) * 34}%`,
                '--rh': `${(i - mid) * 9}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export function useIsTouch() {
  const [touch, setTouch] = useState(true);
  useEffect(() => setTouch(!window.matchMedia('(pointer: fine)').matches), []);
  return touch;
}

export function PageHeader({ eyebrow, title, intro, children, className }: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode; className?: string }) {
  return (
    <header className={`mx-auto max-w-[1440px] px-4 pb-12 pt-36 sm:px-8 md:pb-16 md:pt-44 ${className ?? ''}`}>
      <Reveal>
        <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
      </Reveal>
      <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
        <SplitText as="h1" text={title} className="text-4xl font-medium leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl" />
        {intro && (
          <Reveal delay={0.2}>
            <p className="max-w-md text-[15px] leading-relaxed text-muted md:justify-self-end">{intro}</p>
          </Reveal>
        )}
      </div>
      {children}
    </header>
  );
}
