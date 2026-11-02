export type Texture = 'solid' | 'gloss' | 'wood' | 'marble' | 'metal' | 'fabric';

export interface Finish {
  name: string;
  hex: string;
  texture?: Texture;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string; // markdown
  price: number | null; // null = price on request
  unit: string;
  images: string[];
  mask?: string; // optional recolour mask for live finish preview
  maskLum?: number; // average brightness (0-1) of the masked surface
  finishes: Finish[];
  specs: Spec[];
  tags: string[];
  featured: boolean;
  inStock: boolean;
  sample?: boolean;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  body: string; // markdown
  published: boolean;
  sample?: boolean;
}

export interface ProjectRoom {
  name: string;
  note: string;
  images: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  area: string;
  year: string;
  cover: string;
  summary: string;
  highlights: string[];
  rooms: ProjectRoom[];
  featured: boolean;
}

export interface Colour {
  id: string;
  name: string;
  hex: string;
  family: string;
}

export interface PackageRate {
  id: string;
  name: string;
  rate: number;
  tone: string;
  bestFor: string;
  image: string;
}

export interface Settings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  youtube: string;
  announcement: string;
  packages: PackageRate[];
}

export interface Content {
  settings: Settings;
  products: Product[];
  posts: Post[];
  projects: Project[];
  colours: Colour[];
}

export type CollectionKey = keyof Content;

export type InquiryType = 'contact' | 'booking' | 'quote' | 'partnership' | 'estimate' | 'visualizer';

export interface Inquiry {
  id: string;
  type: InquiryType;
  createdAt: string;
  status: 'new' | 'contacted' | 'won' | 'closed';
  name: string;
  phone: string;
  email?: string;
  message?: string;
  data?: Record<string, unknown>;
}
