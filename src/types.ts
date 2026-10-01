export type PageId = 'home' | 'about' | 'work' | 'how-we-work' | 'contact' | 'blog';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'residential' | 'commercial';
  subCategory: string; // e.g., 'Luxury Apartment', 'Tech Office', 'Penthouse', 'Boutique Store'
  location: string;
  area: string; // e.g. '3,400 sq.ft'
  completionTime: string; // e.g. '42 Days'
  year: string;
  heroImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  materials: string[];
  style: string;
  testimonialQuote?: string;
  featured?: boolean;
}

export interface WorkflowStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export interface ComparisonFactor {
  factor: string;
  inerimExperience: string[];
  typicalExperience: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  companyOrProject: string;
  avatar: string;
  rating: number;
  review: string;
  projectType: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: 'Design Trends' | 'Space Planning' | 'Materials' | 'Commercial Insights' | 'Case Studies';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string;
}

export interface CostEstimateItem {
  id: string;
  name: string;
  defaultQty: number;
  unit: string;
  baseCostPerUnit: number;
  selected: boolean;
}
