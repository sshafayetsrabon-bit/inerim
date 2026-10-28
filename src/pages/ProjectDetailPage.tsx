import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageId, Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { PROJECTS_DATA } from '../data/projectsData';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface ProjectDetailPageProps {
  project?: Project;
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator?: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project: propProject,
  setCurrentPage,
  onOpenCalculator,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();

  const project =
    propProject ||
    PROJECTS_DATA.find((p) => p.id === slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) ||
    PROJECTS_DATA[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) {
    return (
      <div className="py-20 text-center">
        <SEO title="Project Not Found | INERIM Portfolio" noindex={true} />
        <h2 className="text-2xl font-bold font-serif">Project Not Found</h2>
        <Link to="/projects" className="text-[#087973] hover:underline mt-4 inline-block">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.heroImage];

  const currentImage = gallery[activeImageIndex] || project.heroImage;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        image: gallery,
        locationCreated: {
          '@type': 'Place',
          name: project.location,
        },
        creator: {
          '@type': 'Organization',
          name: 'INERIM Interior',
          url: 'https://inerimbd.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://inerimbd.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Portfolio',
            item: 'https://inerimbd.com/projects',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `https://inerimbd.com/projects/${project.id}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={`${project.title} — Luxury Interior Case Study Dhaka`}
        description={`${project.description} Delivered in ${project.completionTime} at ${project.location} by INERIM Interior architects.`}
        canonicalUrl={`/projects/${project.id}`}
        ogImage={project.heroImage}
        ogType="article"
        keywords={`${project.title}, ${project.subCategory}, ${project.location} interior, luxury duplex Dhaka, Inerim interior portfolio`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-[#087973] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/projects" className="hover:text-[#087973] transition-colors">Portfolio</Link>
        <span>/</span>
        <span className="text-[#087973] font-semibold">{project.title}</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
            {project.subCategory}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {project.location}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-6 pt-2 text-xs sm:text-sm text-muted-foreground border-y border-white/10 py-3">
          <div><strong className="text-foreground">Area:</strong> {project.area}</div>
          <div><strong className="text-foreground">Handover Speed:</strong> {project.completionTime}</div>
          <div><strong className="text-foreground">Style:</strong> {project.style}</div>
          <div><strong className="text-foreground">Year:</strong> {project.year}</div>
        </div>
      </div>

      {/* Gallery Showcase */}
      <div className="space-y-4">
        <div className="relative h-96 sm:h-[540px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl">
          <img
            src={currentImage}
            alt={`${project.title} view ${activeImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {gallery.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-[#087973] scale-105 shadow'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${project.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Narrative & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-serif mb-3">Architectural Concept & Brief</h2>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-black/80'}`}>
              {project.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif mb-3">Key Design Highlights</h3>
            <ul className="space-y-2.5">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#087973] shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-white/80' : 'text-black/80'}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.testimonialQuote && (
            <div className={`p-6 rounded-2xl border italic text-xs sm:text-sm relative ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
            }`}>
              <span className="text-3xl text-[#087973] absolute -top-3 left-4 font-serif">“</span>
              <p className="mt-2 text-muted-foreground">{project.testimonialQuote}</p>
              <div className="mt-3 font-semibold not-italic text-foreground text-right text-xs">
                — {project.client}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Specifications */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
          }`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#087973]">Materials Specified</h3>
            <div className="flex flex-wrap gap-2">
              {project.materials.map((m, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-lg border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#087973]">Book Similar Project</h4>
              <p className="text-xs text-muted-foreground">
                Love this design? Our senior architects can customize this exact spatial concept for your floor plan in 45 days.
              </p>
              <button
                onClick={() => setCurrentPage?.('contact')}
                className="w-full py-3 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
              >
                Book Discovery Session
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
