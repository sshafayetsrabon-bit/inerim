import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useIsTouch } from './ui';

/** Ring that trails the pointer; grows over links and shows a label over [data-cursor] elements. */
export function Cursor() {
  const touch = useIsTouch();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<'default' | 'link' | 'label'>('default');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (touch) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      const lab = t.closest<HTMLElement>('[data-cursor]');
      if (lab) {
        setMode('label');
        setLabel(lab.dataset.cursor || '');
      } else if (t.closest('a,button,input,label,[role=button]')) setMode('link');
      else setMode('default');
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [touch]);

  if (touch) return null;
  const size = mode === 'label' ? 96 : mode === 'link' ? 56 : 14;
  return (
    <>
      <motion.div
        className={`pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border-solid border-white ${
          mode === 'label' ? '' : 'mix-blend-difference'
        }`}
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          backgroundColor: mode === 'default' ? 'rgba(255,255,255,1)' : mode === 'label' ? 'rgba(11,120,117,1)' : 'rgba(255,255,255,0)',
          borderWidth: mode === 'link' ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {mode === 'label' && <span className="text-[11px] font-bold uppercase tracking-widest text-white">{label}</span>}
      </motion.div>
      <style>{`@media (pointer: fine){ *{cursor:none !important} }`}</style>
    </>
  );
}
