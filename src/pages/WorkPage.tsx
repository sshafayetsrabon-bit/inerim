import React, { useState, useMemo } from 'react';
import { PageId, Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PROJECTS_DATA } from '../data/projectsData';
import {
  Layers,
  Search,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface WorkPageProps {
  setCurrentPage: (page: PageId) => void;
  onOpenCalculator: () => void;
  onSelectProject: (project: Project) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({
  setCurrentPage,
  onOpenCalculator,
  onSelectProject
}) => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'residential' | 'commercial'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'area' | 'speed'>('newest');

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'speed') {
        const speedA = parseInt(a.completionTime) || 45;
        const speedB = parseInt(b.completionTime) || 45;
        return speedA - speedB;
      }
      if (sortBy === 'area') {
        const areaA = parseInt(a.area.replace(/\D/g, '')) || 0;
        const areaB = parseInt(b.area.replace(/\D/g, '')) || 0;
        return areaB - areaA;
      }
      return parseInt(b.year) - parseInt(a.year);
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-[11px] font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Selected Portfolio & Commissioned Works
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
            About Our Work
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Explore our completed residential penthouses, duplex sanctuaries, and high-performance corporate technology hubs. Every project was designed, precision-manufactured, and delivered within 45 days.
          </p>
        </div>

        {/* 2. Interactive Filter & Search Toolbar */}
        <div className={`mt-8 p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
        }`}>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Projects', count: PROJECTS_DATA.length },
              { id: 'residential', label: 'Residential Homes', count: PROJECTS_DATA.filter(p => p.category === 'residential').length },
              { id: 'commercial', label: 'Commercial Offices', count: PROJECTS_DATA.filter(p => p.category === 'commercial').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-[#087973] text-white shadow-sm'
                    : isDark
                      ? 'bg-white/5 text-white/70 hover:bg-white/10'
                      : 'bg-black/5 text-black/70 hover:bg-black/10'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === tab.id ? 'bg-white/20 text-white font-bold' : isDark ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
              <input
                type="text"
                placeholder="Search by name, wood, stone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-black border-white/15 text-white placeholder-white/40 focus:border-[#087973]'
                    : 'bg-white border-black/15 text-black placeholder-black/40 focus:border-[#087973]'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <SlidersHorizontal className={`w-3.5 h-3.5 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-black border-white/15 text-white focus:border-[#087973]'
                    : 'bg-white border-black/15 text-black focus:border-[#087973]'
                }`}
              >
                <option value="newest">Latest Completed</option>
                <option value="area">Floor Area (Largest)</option>
                <option value="speed">Fastest Delivery</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Projects Grid (Gallery) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className={`rounded-xl border p-10 text-center max-w-md mx-auto space-y-3 ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10'
          }`}>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              No projects matched your search query "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-lg bg-[#087973] text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                  isDark
                    ? 'bg-black border-white/10 hover:border-[#087973]'
                    : 'bg-white border-black/10 hover:border-[#087973] hover:shadow-sm'
                }`}
              >
                {/* Image Container with standardized height */}
                <div className="relative h-64 overflow-hidden bg-black">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#087973] text-white shadow-sm">
                      {project.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/15">
                      {project.area}
                    </span>
                  </div>

                  {/* Bottom title banner on card */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                    <h3 className="text-sm sm:text-base font-bold font-serif line-clamp-1">{project.title}</h3>
                    <p className="text-[11px] text-white/75 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#087973]" />
                      {project.location}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{project.subCategory}</span>
                      <span className="text-[#087973] font-medium">{project.completionTime} Handover</span>
                    </div>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Material tags preview */}
                  <div className={`flex flex-wrap gap-1.5 pt-2 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                    {project.materials.slice(0, 3).map((mat, mIdx) => (
                      <span key={mIdx} className={`text-[10px] px-2 py-0.5 rounded ${
                        isDark ? 'bg-white/5 text-white/70' : 'bg-black/5 text-black/70'
                      }`}>
                        {mat}
                      </span>
                    ))}
                    {project.materials.length > 3 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-white/10 text-white/50' : 'bg-black/10 text-black/50'
                      }`}>
                        +{project.materials.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-semibold text-[#087973] group-hover:underline">
                    <span>View Specifications & Gallery</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Bottom Estimate Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border ${
          isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
        }`}>
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#087973]">
              Accurate Pricing Guaranteed
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
              Want a Similar Interior For Your Space?
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Use our live cost estimator to calculate turnkey pricing for your exact square footage and material grade.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenCalculator}
              className="px-5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider shadow transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calculate Your Cost</span>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className={`px-4.5 py-2.5 rounded-lg border font-medium text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-black/15 bg-white hover:bg-black/5 text-black'
              }`}
            >
              Book Studio Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
