import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, MessageCircle } from 'lucide-react';
import { submitInquiry, useSettings } from '../lib/cms';
import type { InquiryType } from '../lib/types';
import { EASE, whatsappLink } from './ui';

export function Field({
  label,
  className = '',
  textarea,
  ...rest
}: { label: string; className?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls =
    'peer w-full rounded-2xl border border-line bg-white px-4 pb-2.5 pt-6 text-[15px] outline-none transition-colors placeholder:text-transparent focus:border-teal';
  return (
    <label className={`relative block ${className}`}>
      {textarea ? <textarea {...rest} placeholder={label} rows={rest.rows ?? 3} className={`${cls} resize-none`} /> : <input {...rest} placeholder={label} className={cls} />}
      <span className="pointer-events-none absolute left-4 top-2 text-[11px] text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-teal">
        {label}
        {rest.required && ' *'}
      </span>
    </label>
  );
}

export function Chips<T extends string>({ options, value, onChange, multi }: { options: readonly T[]; value: T[] | T; onChange: (v: T[] | T) => void; multi?: boolean }) {
  const has = (o: T) => (Array.isArray(value) ? value.includes(o) : value === o);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => {
            if (!multi) return onChange(o);
            const arr = value as T[];
            onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
          }}
          className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all ${has(o) ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/70 hover:border-ink/30'}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Submits to the CMS inbox; WhatsApp stays available as a backup channel. */
export function useInquiry(type: InquiryType) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'offline'>('idle');
  const send = async (payload: { name: string; phone: string; email?: string; message?: string; data?: Record<string, unknown>; website?: string }) => {
    setState('sending');
    const ok = await submitInquiry({ type, ...payload });
    setState(ok ? 'sent' : 'offline');
    return ok;
  };
  return { state, send, reset: () => setState('idle') };
}

export function SentPanel({ state, waText, title = 'Thank you! We’ve got your request.', onReset }: { state: 'sent' | 'offline'; waText: string; title?: string; onReset?: () => void }) {
  const s = useSettings();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} className="rounded-[28px] bg-white p-8 text-center md:p-12">
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${state === 'sent' ? 'bg-teal' : 'bg-[#25D366]'} text-white`}
      >
        {state === 'sent' ? <Check className="h-8 w-8" /> : <MessageCircle className="h-7 w-7" />}
      </motion.div>
      <h3 className="mt-6 text-3xl font-medium">{state === 'sent' ? title : 'Send it on WhatsApp instead'}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        {state === 'sent'
          ? 'Our team will contact you soon. If you’d like a faster reply, send the same details on WhatsApp.'
          : 'We couldn’t reach our server just now. Your details are ready to send on WhatsApp.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={whatsappLink(s.whatsapp, waText)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-medium text-white">
          <MessageCircle className="h-4 w-4" /> Send on WhatsApp
        </a>
        {onReset && (
          <button onClick={onReset} className="cursor-pointer rounded-full border border-line px-6 py-3.5 text-sm">
            Send another
          </button>
        )}
      </div>
    </motion.div>
  );
}

/** Invisible field bots fill in; real people never see it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
      name="website"
    />
  );
}
