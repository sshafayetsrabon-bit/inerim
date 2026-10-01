import React, { useState } from 'react';
import { Project } from '../types';
import { X, Check, MapPin, Calendar, Clock, Maximize2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onBookSimilar: (projectTitle: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onBookSimilar
}) => {
  const { isDark } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!project) return null;

  const images = project.galleryImages && project.galleryImages.length > 0 
    ? project.galleryImages 
    : [project.heroImage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="project-detail-modal"
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl border overflow-hidden my-6 transition-colors ${
          isDark ? 'bg-black text-white border-white/15' : 'bg-white text-black border-black/15'
        }`}
      >
        {/* Modal Close Button */}
        <button
          id="close-project-modal-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
          aria-label="Close project modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Gallery Carousel / Main Image */}
        <div className="relative w-full h-64 sm:h-80 bg-black overflow-hidden">
          <img
            src={images[selectedImageIndex] || project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Badge over photo */}
          <div className="absolute top-3.5 left-3.5 z-10 flex gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#087973] text-white shadow">
              {project.category}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-black/60 backdrop-blur-md text-white border border-white/20">
              {project.subCategory}
            </span>
          </div>

          {/* Project Title overlay */}
          <div className="absolute bottom-3.5 left-5 right-5 z-10 text-white">
            <h3 className="text-xl sm:text-2xl font-bold font-serif">{project.title}</h3>
            <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#087973]" />
              {project.location}
            </p>
          </div>
        </div>

        {/* Thumbnail selector */}
        {images.length > 1 && (
          <div className={`px-5 py-2.5 flex gap-2 overflow-x-auto border-b ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
          }`}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0 border transition-all cursor-pointer ${
                  selectedImageIndex === idx ? 'border-[#087973] scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}

        {/* Project Details Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[55vh] overflow-y-auto">
          {/* Quick Metrics Ribbon */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl border ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.01] border-black/10'
          }`}>
            <div className="border-r border-current/10 pr-2">
              <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                <Maximize2 className="w-3 h-3 text-[#087973]" /> Floor Area
              </span>
              <p className="text-xs sm:text-sm font-bold mt-0.5">{project.area}</p>
            </div>
            <div className="border-r border-current/10 pr-2">
              <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                <Clock className="w-3 h-3 text-[#087973]" /> Handover Speed
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#087973] mt-0.5">{project.completionTime}</p>
            </div>
            <div className="border-r border-current/10 pr-2">
              <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                <Calendar className="w-3 h-3 text-[#087973]" /> Year
              </span>
              <p className="text-xs sm:text-sm font-bold mt-0.5">{project.year}</p>
            </div>
            <div>
              <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                <ShieldCheck className="w-3 h-3 text-[#087973]" /> Warranty
              </span>
              <p className="text-xs sm:text-sm font-bold mt-0.5">2-Year Flat</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-serif">
              Architectural Concept & Scope
            </h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              {project.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-serif">
              Engineering & Design Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.highlights.map((highlight, index) => (
                <div key={index} className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.01] border-black/10'
                }`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#087973]/20 text-[#087973] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className={isDark ? 'text-white/80' : 'text-black/80'}>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Materials Palette */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 font-serif">
              Specified Materials & Hardware
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.materials.map((mat, index) => (
                <span key={index} className={`px-2.5 py-1 rounded text-xs font-medium border ${
                  isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-black/5 border-black/10 text-black/80'
                }`}>
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial quote if present */}
          {project.testimonialQuote && (
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
            }`}>
              <div className="text-[10px] uppercase tracking-wider text-[#087973] font-bold mb-1">
                Client Verdict • {project.client}
              </div>
              <blockquote className={`text-xs italic leading-relaxed font-serif ${isDark ? 'text-white/90' : 'text-black/90'}`}>
                "{project.testimonialQuote}"
              </blockquote>
            </div>
          )}

          {/* Footer actions */}
          <div className={`pt-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}>
            <span className={`text-xs ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              Inspired by this project? Inquire for a custom proposal.
            </span>
            <button
              onClick={() => {
                onClose();
                onBookSimilar(project.title);
              }}
              className="w-full sm:w-auto px-4.5 py-2 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
            >
              <span>Inquire For Similar Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
