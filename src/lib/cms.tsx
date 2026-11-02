import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED } from './seed';
import type { CollectionKey, Content, Inquiry } from './types';

/**
 * INERIM CMS client.
 * Public pages read `?r=content`; anything the API doesn't have yet falls back to the seed content,
 * so the site always renders, even before the CMS has been set up on the server.
 */
export const API = '/api/index.php';

type Partial<T> = { [K in keyof T]?: T[K] | null };

export async function fetchContent(): Promise<Content> {
  try {
    const res = await fetch(`${API}?r=content`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Partial<Content>;
    return {
      settings: { ...SEED.settings, ...(data.settings || {}) },
      products: data.products ?? SEED.products,
      posts: data.posts ?? SEED.posts,
      projects: data.projects ?? SEED.projects,
      colours: data.colours ?? SEED.colours,
    };
  } catch {
    return SEED;
  }
}

export async function submitInquiry(inq: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> {
  try {
    const res = await fetch(`${API}?r=inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inq),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------------- admin ---------------- */

const TOKEN_KEY = 'inerim-admin-token';
export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};
const setToken = (t: string) => {
  try {
    if (t) sessionStorage.setItem(TOKEN_KEY, t);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
};

async function call<T>(route: string, init: RequestInit = {}, query = ''): Promise<T> {
  const res = await fetch(`${API}?r=${route}${query}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${getToken()}`,
      'X-Admin-Token': getToken(),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error('The CMS API did not return JSON. Is /api/index.php deployed?');
  }
  if (!res.ok) throw new Error((data as { error?: string })?.error || `Request failed (${res.status})`);
  return data as T;
}

export const admin = {
  status: () => call<{ setup: boolean; authed: boolean }>('status'),
  setup: async (password: string) => {
    const r = await call<{ token: string }>('setup', { method: 'POST', body: JSON.stringify({ password }) });
    setToken(r.token);
  },
  login: async (password: string) => {
    const r = await call<{ token: string }>('login', { method: 'POST', body: JSON.stringify({ password }) });
    setToken(r.token);
  },
  logout: () => setToken(''),
  save: <K extends CollectionKey>(c: K, value: Content[K]) => call<{ ok: true }>('save', { method: 'POST', body: JSON.stringify(value) }, `&c=${c}`),
  inquiries: () => call<Inquiry[]>('inquiries'),
  updateInquiry: (id: string, patch: Partial<Inquiry>) => call<{ ok: true }>('inquiry-update', { method: 'POST', body: JSON.stringify({ id, ...patch }) }),
  deleteInquiry: (id: string) => call<{ ok: true }>('inquiry-delete', { method: 'POST', body: JSON.stringify({ id }) }),
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return call<{ url: string }>('upload', { method: 'POST', body: fd });
  },
  uploads: () => call<string[]>('uploads'),
  password: (current: string, next: string) => call<{ ok: true }>('password', { method: 'POST', body: JSON.stringify({ current, next }) }),
};

/* ---------------- content context ---------------- */

interface Ctx {
  content: Content;
  loading: boolean;
  setContent: (c: Content) => void;
  refresh: () => Promise<void>;
}
const ContentCtx = createContext<Ctx>({ content: SEED, loading: true, setContent: () => {}, refresh: async () => {} });

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(SEED);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setContent(await fetchContent());
    setLoading(false);
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const value = useMemo(() => ({ content, loading, setContent, refresh }), [content, loading, refresh]);
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export const useContent = () => useContext(ContentCtx);
export const useSettings = () => useContext(ContentCtx).content.settings;
