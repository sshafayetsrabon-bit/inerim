import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, Project, Testimonial } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PROJECTS_DATA } from '../data/projectsData';
import { WORKFLOW_STEPS, WHY_CHOOSE_US, COMPARISON_FACTORS, TESTIMONIALS } from '../data/companyData';
import { BLOG_POSTS } from '../data/blogData';
import {
  Calculator,
  ChevronRight,
  ChevronLeft,
  Check,
  X as CloseIcon,
  ShieldCheck,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  Eye,
  Star,
  Quote,
  CheckCircle2,
  Building,
  Home as HomeIcon,
  PhoneCall,
  FileCheck,
  Cpu,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react';

interface PillarData {
  id: string;
  number: string;
  title: string;
  metric: string;
  icon: any;
  traditional: string;
  inerim: string;
  tag: string;
  clause: string;
  techSpec: string;
}

interface ContradictionCardProps {
  pillar: PillarData;
  isDark: boolean;
  filterMode: 'all' | 'inerim' | 'traditional';
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSpaceAudit: () => void;
}

const ContradictionCard: React.FC<ContradictionCardProps> = ({
  pillar: p,
  isDark,
  filterMode,
  isExpanded,
  onToggleExpand,
  onSpaceAudit
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const Icon = p.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
        isExpanded
          ? isDark
            ? 'border-[#087973] ring-1 ring-[#087973]/40 bg-white/[0.04]'
            : 'border-[#087973] ring-1 ring-[#087973]/30 bg-white shadow-lg'
          : isDark
            ? 'bg-white/[0.02] border-white/10 hover:border-[#087973]/70'
            : 'bg-white border-black/10 hover:border-[#087973]/70 hover:shadow-md'
      }`}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-200"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${
              isDark ? 'rgba(8, 121, 115, 0.18)' : 'rgba(8, 121, 115, 0.12)'
            }, transparent 80%)`
          }}
        />
      )}

      <div>
        {/* Header: Icon, Number, Title & Metric */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-10 h-10 rounded-xl bg-[#087973]/10 border border-[#087973]/20 flex items-center justify-center text-[#087973] group-hover:bg-[#087973] group-hover:text-white transition-all shadow-sm"
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                  {p.number}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#087973] tracking-wider">
                  {p.metric}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif tracking-tight">
                {p.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onToggleExpand}
            className={`text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 cursor-pointer ${
              isExpanded
                ? 'bg-[#087973] text-white border-[#087973]'
                : isDark
                  ? 'border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                  : 'border-black/10 hover:border-black/30 text-black/60 hover:text-black'
            }`}
            title="Inspect contractual SLA clause"
          >
            <span>{isExpanded ? 'Clause Details' : 'Verify SLA'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* The Contradiction Box with Interactive Filter States */}
        <div className={`rounded-xl p-3.5 space-y-2.5 border transition-all ${
          isDark ? 'bg-black/60 border-white/5' : 'bg-neutral-50 border-black/5'
        }`}>
          {/* Traditional Flaw */}
          <motion.div
            animate={{
              opacity: filterMode === 'inerim' ? 0.35 : 1,
              scale: filterMode === 'traditional' ? 1.01 : 1
            }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-2.5 text-xs p-1 rounded-lg transition-colors ${
              filterMode === 'traditional' ? (isDark ? 'bg-red-950/30 ring-1 ring-red-500/30' : 'bg-red-50 ring-1 ring-red-300') : ''
            }`}
          >
            <span className="text-red-500 font-bold flex-shrink-0 text-sm leading-none mt-0.5">✕</span>
            <div className="leading-relaxed">
              <span className="font-semibold text-red-500/90 mr-1.5 uppercase text-[10px] tracking-wider">Traditional:</span>
              <span className={isDark ? 'text-white/60' : 'text-black/60'}>{p.traditional}</span>
            </div>
          </motion.div>

          {/* Inerim Standard */}
          <motion.div
            animate={{
              opacity: filterMode === 'traditional' ? 0.45 : 1,
              scale: filterMode === 'inerim' ? 1.01 : 1
            }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-2.5 text-xs pt-2.5 border-t p-1 rounded-lg transition-colors ${
              isDark ? 'border-white/10' : 'border-black/5'
            } ${filterMode === 'inerim' ? (isDark ? 'bg-[#087973]/15 ring-1 ring-[#087973]/40' : 'bg-[#087973]/10 ring-1 ring-[#087973]/30') : ''}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#087973] flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-[#087973] mr-1.5 uppercase text-[10px] tracking-wider">Inerim Standard:</span>
              <span className={`font-medium ${isDark ? 'text-white/90' : 'text-black/90'}`}>{p.inerim}</span>
            </div>
          </motion.div>
        </div>

        {/* Expandable Contract Clause Accordion */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden mt-3"
            >
              <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                isDark ? 'bg-[#087973]/10 border-[#087973]/30 text-white/90' : 'bg-[#087973]/5 border-[#087973]/20 text-black/90'
              }`}>
                <div className="flex items-center gap-1.5 text-[#087973] font-bold uppercase text-[10px] tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Enforceable Legal Clause</span>
                </div>
                <p className="leading-relaxed text-[11px] font-mono">
                  {p.clause}
                </p>
                <div className="pt-1.5 border-t border-[#087973]/20 text-[10px] text-[#087973] flex items-center justify-between font-mono">
                  <span>{p.techSpec}</span>
                  <button
                    onClick={onSpaceAudit}
                    className="underline hover:text-[#06615c] font-sans font-bold cursor-pointer"
                  >
                    Include in Audit →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Bottom Proof Tag */}
      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${
        isDark ? 'border-white/10 text-white/40' : 'border-black/5 text-black/40'
      }`}>
        <span className="flex items-center gap-1.5 font-medium text-[#087973]">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{p.tag}</span>
        </span>
        <button
          onClick={onToggleExpand}
          className="font-mono text-[10px] uppercase hover:text-[#087973] cursor-pointer transition-colors"
        >
          {isExpanded ? 'Hide Protocol' : 'Inspect Protocol'}
        </button>
      </div>
    </motion.div>
  );
};

interface HomePageProps {
  setCurrentPage: (page: PageId) => void;
  onOpenCalculator: () => void;
  onSelectProject: (project: Project) => void;
  onSelectPost: (post: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenCalculator,
  onSelectProject,
  onSelectPost
}) => {
  const { isDark } = useTheme();

  // Carousel indices for Home & Office projects
  const [homeSlide, setHomeSlide] = useState(0);
  const [officeSlide, setOfficeSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  // Interactive modes for Section 4 (Built on Contractual Precision)
  const [filterMode, setFilterMode] = useState<'all' | 'inerim' | 'traditional'>('all');
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>(null);

  const architecturalPillars = [
    {
      id: '45-day-handover',
      number: '01',
      title: '45-Day Handover Guarantee',
      metric: '45 Days • ৳5k/Day SLA',
      icon: Clock,
      traditional: '6 to 12 month unpredictable delays with zero contractor accountability.',
      inerim: 'Contractually locked 45-day key handover or ৳5,000/day penalty paid to you.',
      tag: 'Legally Enforceable SLA',
      clause: 'Clause 4.2 Inerim Master Agreement: Handover date is locked at deposit. If handover exceeds 45 working days, Inerim pays ৳5,000 per delayed day as a direct credit on the final invoice.',
      techSpec: 'Weekly critical-path Gantt tracking with real-time photographic milestone updates.'
    },
    {
      id: 'locked-boq',
      number: '02',
      title: '100% Locked Itemized BOQ',
      metric: '100% Price Lock • Zero Extras',
      icon: FileCheck,
      traditional: 'Vague lump-sum ballpark estimates that inflate by 30–50% midway through execution.',
      inerim: 'Itemized Bill of Quantities locked before commencement. Zero surprise revisions.',
      tag: 'Zero Revision Surcharges',
      clause: 'Clause 2.1 Fixed Commercial BOQ: Every fastener, board thickness, and finishing grade is priced line-by-line. Inerim absorbs all contractor-side cost overruns.',
      techSpec: 'Locked CAD-verified cut-lists and material specs provided with deposit.'
    },
    {
      id: 'german-cnc',
      number: '03',
      title: 'German CNC Off-Site Prefab',
      metric: '±0.2mm Precision Tolerance',
      icon: Cpu,
      traditional: 'Carpenters sawing inside your home; toxic sawdust and chemical glue in AC ducts.',
      inerim: '80% pre-milled in automated German CNC facilities; clean 7-day silent on-site fit.',
      tag: 'Dustless Architectural Fit',
      clause: 'Manufacturing Protocol DIN-68874: All cabinetry pre-milled with Homag edge-banding and PUR hot-melt adhesives before residential site entry.',
      techSpec: '99.2% zero-dust on-site installation with rapid modular cam-lock assembly.'
    },
    {
      id: 'flat-2yr-warranty',
      number: '04',
      title: 'Flat 2-Year Warranty & SLA',
      metric: '2-Year Warranty • 48h Response',
      icon: ShieldCheck,
      traditional: 'Contractors vanish once the final payment clears; zero help for warped doors or hinges.',
      inerim: 'Formal written 2-year warranty certificate covering Blum hardware with 48h rapid response.',
      tag: 'Blum & Hettich Full Coverage',
      clause: 'Institutional Warranty SLA: Direct parts replacement on all Blum hinges, runners, and hydraulic lift mechanisms. Emergency tech dispatched within 48 hours.',
      techSpec: 'Includes biannual architectural tune-up and hardware alignment audits.'
    }
  ];

  const marqueePillars = [
    '45-Day Guaranteed Handover',
    '100% Locked Itemized BOQ',
    '±0.2mm German CNC Off-Site Prefab',
    'Flat 2-Year Comprehensive Warranty',
    '146 White-Glove Inspection Points',
    'Zero Unapproved Cost Surcharges',
    'Blum & Hettich German Hardware',
    'Liquidated Damages Contract SLA'
  ];

  const marqueeResidential = [
    'Bespoke Residential Architecture',
    'Penthouses & Luxury Duplexes',
    'Minimalist Spatial Planning',
    'Gulshan • Banani • Uttara • Dhanmondi',
    'Turnkey Interior Execution',
    'Clean 7-Day On-Site Fitting',
    'Direct Factory Fabrication'
  ];

  const residentialProjects = PROJECTS_DATA.filter(p => p.category === 'residential');
  const commercialProjects = PROJECTS_DATA.filter(p => p.category === 'commercial');

  const heroSlides = [
    {
      title: 'Interior COST ESTIMATION is very easy',
      subtitle: 'Plan your budget in 60 seconds with transparent line-item pricing and 45-day handover guarantee.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
      tag: 'Bespoke Turnkey Architecture'
    },
    {
      title: 'Minimalist Architecture for High-Flow Living',
      subtitle: 'Where Scandinavian light, Japanese precision, and German Blum hardware converge into sanctuary.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      tag: 'Luxury Residential & Duplexes'
    },
    {
      title: 'Workplaces That Inspire Cognitive Performance',
      subtitle: 'Neuroarchitecture and biophilic corporate engineering for leading tech hubs and multinational headquarters.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=85',
      tag: 'Next-Gen Commercial Interiors'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION (Minimal height of 80vh across all slides) */}
      <section className="relative w-full overflow-hidden bg-black min-h-[80vh] flex items-center mb-12 sm:mb-16">
        {/* Background image slider - each slide strictly 80vh minimum */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 min-h-[80vh] transition-opacity duration-1000 ${
              heroSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transition-transform duration-7000`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/30 to-black/80" />
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={() => setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#087973] text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/15 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => setHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#087973] text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/15 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Hero Content Container - aligned and comfortable */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full min-h-[80vh] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline and Call-To-Actions */}
            <div className="lg:col-span-8 text-white space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/20 border border-[#087973]/40 text-[#087973] text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#087973]" />
                <span className="text-white/90">{heroSlides[heroSlide].tag}</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif leading-[1.12]">
                  {heroSlide === 0 ? (
                    <>
                      <span className="text-[#087973]">Interior</span>{' '}
                      <span className="block text-white">COST ESTIMATION</span>
                      <span className="text-xl sm:text-3xl text-white/90 font-light block italic mt-1">
                        is very easy
                      </span>
                    </>
                  ) : (
                    heroSlides[heroSlide].title
                  )}
                </h1>
                <p className="text-sm sm:text-base text-white/80 max-w-2xl font-normal leading-relaxed pt-1">
                  {heroSlides[heroSlide].subtitle}
                </p>
              </div>

              {/* Action Buttons - Refined UX/UI sizing */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="hero-calculate-now-btn"
                  onClick={onOpenCalculator}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-[#087973] hover:bg-[#06615c] active:scale-[0.98] text-white font-medium text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>CALCULATE NOW</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  id="hero-explore-work-btn"
                  onClick={() => setCurrentPage('work')}
                  className="px-4.5 py-2.5 sm:px-5 sm:py-3 rounded-lg bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-medium text-xs sm:text-sm tracking-wider uppercase border border-white/20 backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Guarantee Badges Strip */}
              <div className="pt-5 border-t border-white/15 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#087973]" />
                  <span><strong>45-Day</strong> Delivery Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#087973]" />
                  <span><strong>Flat 2-Years</strong> Full Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#087973]" />
                  <span><strong>146-Point</strong> Quality Audit</span>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Estimator Preview Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-black/60 backdrop-blur-xl border border-white/15 p-6 rounded-2xl shadow-2xl text-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <span className="text-xs uppercase font-bold text-[#087973] tracking-widest flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" /> Instant Estimator
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#087973] text-white font-semibold tracking-wide">
                    FREE TOOL
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-white/60 block text-[11px]">Popular Residential Space</span>
                    <span className="text-sm font-semibold text-white">2,400 sq.ft • 3 Bed + Living</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-white/60 block text-[11px]">Material Grade</span>
                    <span className="text-sm font-semibold text-[#087973]">Signature Architectural</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                    <span className="text-white/60 block text-[10px]">Indicative Turnkey Budget</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white">৳ 38,00,000 - 42,00,000</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">Includes full turnkey joinery & MEP</span>
                  </div>
                </div>

                <button
                  onClick={onOpenCalculator}
                  className="w-full py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <span>Customize Your Estimate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Pagination Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                heroSlide === idx ? 'w-7 bg-[#087973]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. WHAT INTERIORS WE DO (HOME & OFFICE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight">
            What Interiors <span className="text-[#087973]">We Do</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Specialized architectural design and precision manufacturing squads for distinct project archetypes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* HOME Card */}
          <div
            onClick={() => setCurrentPage('work')}
            className={`group relative rounded-xl overflow-hidden shadow-sm border transition-all cursor-pointer hover:shadow-md ${
              isDark
                ? 'bg-white/[0.03] border-white/10 hover:border-[#087973]'
                : 'bg-white border-black/10 hover:border-[#087973]'
            }`}
          >
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                alt="Home Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Bottom action bar */}
            <div className="bg-[#087973] hover:bg-[#06615c] p-4 text-white flex items-center justify-between transition-colors">
              <div>
                <span className="text-base sm:text-lg font-bold font-serif tracking-wider">HOME</span>
                <p className="text-xs text-white/80">Apartments, Duplexes, Penthouses & Private Residences</p>
              </div>
              <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* OFFICE Card */}
          <div
            onClick={() => setCurrentPage('work')}
            className={`group relative rounded-xl overflow-hidden shadow-sm border transition-all cursor-pointer hover:shadow-md ${
              isDark
                ? 'bg-white/[0.03] border-white/10 hover:border-[#087973]'
                : 'bg-white border-black/10 hover:border-[#087973]'
            }`}
          >
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
                alt="Office Interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Bottom action bar */}
            <div className="bg-[#087973] hover:bg-[#06615c] p-4 text-white flex items-center justify-between transition-colors">
              <div>
                <span className="text-base sm:text-lg font-bold font-serif tracking-wider">OFFICE</span>
                <p className="text-xs text-white/80">Tech HQs, Collaborative Hubs & Executive Boardrooms</p>
              </div>
              <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR WORK FLOW (5 Steps) */}
      <section
        className={`pt-10 sm:pt-14 pb-5 sm:pb-7 border-t transition-colors ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-black/[0.02] border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Our <span className="text-[#087973]">Work Flow</span>
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              From our first discovery dialogue to turnkey key handover in 45 days, our calibrated engineering guarantees precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WORKFLOW_STEPS.map((step, idx) => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage('how-we-work')}
                className={`rounded-xl p-4.5 border transition-all flex flex-col justify-between group cursor-pointer ${
                  isDark
                    ? 'bg-black border-white/10 hover:border-[#087973] hover:bg-white/[0.02]'
                    : 'bg-white border-black/10 hover:border-[#087973] hover:shadow-sm'
                }`}
              >
                <div>
                  <div
                    className={`w-full h-24 rounded-lg flex items-center justify-center p-3 mb-3 transition-colors relative ${
                      isDark ? 'bg-white/5 group-hover:bg-[#087973]/15' : 'bg-black/[0.02] group-hover:bg-[#087973]/10'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-9 h-9 mx-auto rounded-lg bg-[#087973] text-white flex items-center justify-center font-bold mb-1 shadow-sm group-hover:scale-110 transition-transform">
                        <span className="font-serif text-sm">{step.stepNumber}</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#087973] block">
                        {step.duration}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm mb-1 group-hover:text-[#087973] transition-colors">{step.title}</h3>
                  <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                    {step.description}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <span className="text-xs font-semibold text-[#087973] group-hover:underline">Explore Step</span>
                  <div className="w-5 h-5 rounded-full bg-[#087973] text-white text-[10px] font-bold flex items-center justify-center group-hover:rotate-45 transition-transform">
                    {step.stepNumber}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentPage('how-we-work')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#087973] hover:underline cursor-pointer group"
            >
              <span>View Full 45-Day Handover Breakdown & Inspection Checkpoints</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 0° Horizontal Marquee Ribbon 1 - Flush with 0 Gap */}
      <div className="w-full bg-[#087973] text-white border-y border-[#087973]/30 overflow-hidden select-none z-10 group cursor-default m-0">
        <div className="py-2.5 sm:py-3 animate-fade-in-marquee">
          <div className="animate-marquee-rtl flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-mono font-bold tracking-widest uppercase">
            {[0, 1, 2].map((copyIdx) => (
              <div key={copyIdx} className="flex items-center gap-6 flex-shrink-0">
                {marqueePillars.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group/item inline-flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 active:scale-95 transition-all duration-200"
                    title={`Inerim Standard: ${item}`}
                  >
                    <span className="text-white/90 group-hover/item:text-white transition-colors">{item}</span>
                    <span className="text-white/40 group-hover/item:text-white group-hover/item:rotate-90 group-hover/item:scale-125 transition-all duration-300">✦</span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. WHY CHOOSE INERIM (Contractual Precision vs Contractor Promises) - Flush with 0 Gap */}
      <section
        id="why-choose-inerim-section"
        className={`py-12 sm:py-16 transition-colors relative overflow-hidden m-0 ${
          isDark ? 'bg-black text-white' : 'bg-[#FAFAFA] text-black'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Perspective Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#087973] border border-[#087973]/30 bg-[#087973]/10 mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Architectural Discipline</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight">
                Built On Contractual Precision, <br className="hidden sm:inline" />
                <span className="text-[#087973]">Not Contractor Promises</span>
              </h2>
              <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                The traditional renovation industry is plagued by vague quotes, endless delays, and toxic sawdust. We engineered a contractual framework that protects your time, capital, and peace of mind.
              </p>
            </div>

            {/* Interactive Perspective Filter Mode Pills */}
            <div className="flex items-center p-1 rounded-xl border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 self-start lg:self-end">
              <button
                onClick={() => setFilterMode('all')}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'text-white font-semibold'
                    : isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                {filterMode === 'all' && (
                  <motion.div
                    layoutId="filterIndicator"
                    className="absolute inset-0 bg-[#087973] rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">All Contrasts</span>
              </button>

              <button
                onClick={() => setFilterMode('inerim')}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterMode === 'inerim'
                    ? 'text-white font-semibold'
                    : isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                {filterMode === 'inerim' && (
                  <motion.div
                    layoutId="filterIndicator"
                    className="absolute inset-0 bg-[#087973] rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-teal-300" />
                  <span>Inerim Standards</span>
                </span>
              </button>

              <button
                onClick={() => setFilterMode('traditional')}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterMode === 'traditional'
                    ? 'text-white font-semibold'
                    : isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
                }`}
              >
                {filterMode === 'traditional' && (
                  <motion.div
                    layoutId="filterIndicator"
                    className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-red-200" />
                  <span>Traditional Flaws</span>
                </span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Contradiction Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {architecturalPillars.map((p) => (
              <ContradictionCard
                key={p.id}
                pillar={p}
                isDark={isDark}
                filterMode={filterMode}
                isExpanded={expandedPillarId === p.id}
                onToggleExpand={() => setExpandedPillarId(expandedPillarId === p.id ? null : p.id)}
                onSpaceAudit={() => setCurrentPage('contact')}
              />
            ))}
          </div>

          {/* Simple, Breathing Quality & Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5 text-left">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-full bg-[#087973]/10 border border-[#087973]/30 flex items-center justify-center text-[#087973] flex-shrink-0"
              >
                <Award className="w-5 h-5" />
              </motion.div>
              <div>
                <div className="text-xs sm:text-sm font-bold font-serif">146-Point Senior Architect Inspection Checkpoints</div>
                <div className={`text-[11px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  Every screw alignment, hinge tolerance, and finish coat verified before key handover.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="why-choose-book-consultation-btn"
                onClick={() => setCurrentPage('contact')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] active:scale-[0.98] text-white font-medium text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <span>Book Free Space Audit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenCalculator}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'border-white/20 hover:border-white text-white hover:bg-white/5'
                    : 'border-black/20 hover:border-black text-black hover:bg-black/5'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-[#087973]" />
                <span>Instant Budget Calc</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 0° Horizontal Marquee Ribbon 2 - Flush with 0 Gap */}
      <div className={`w-full border-y overflow-hidden select-none z-10 group cursor-default m-0 ${
        isDark ? 'bg-neutral-900 text-white border-white/10' : 'bg-black text-white border-black/10'
      }`}>
        <div className="py-2.5 sm:py-3 animate-fade-in-marquee">
          <div className="animate-marquee-rtl flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-mono font-bold tracking-widest uppercase">
            {[0, 1, 2].map((copyIdx) => (
              <div key={copyIdx} className="flex items-center gap-6 flex-shrink-0">
                {marqueeResidential.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group/item inline-flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20 active:scale-95 transition-all duration-200"
                    title={item}
                  >
                    <span className="text-white/90 group-hover/item:text-white transition-colors">{item}</span>
                    <span className="text-[#087973] group-hover/item:text-teal-300 group-hover/item:rotate-90 group-hover/item:scale-125 transition-all duration-300">✦</span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. INERIM HOME INTERIOR PROJECTS (Residential Carousel) - Flush with 0 Gap */}
      <section
        className={`py-12 sm:py-16 transition-colors m-0 ${
          isDark
            ? 'bg-white/[0.02]'
            : 'bg-black/[0.02]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
                Residential Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-1">
                Inerim <span className="text-[#087973]">Home Interior</span> Projects
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHomeSlide(prev => Math.max(0, prev - 1))}
                disabled={homeSlide === 0}
                className={`w-9 h-9 rounded-lg border disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer ${
                  isDark ? 'border-white/20 bg-white/5 hover:bg-[#087973] text-white' : 'border-black/15 bg-white hover:bg-[#087973] hover:text-white text-black'
                }`}
                aria-label="Previous residential projects"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setHomeSlide(prev => Math.min(residentialProjects.length - 3, prev + 1))}
                disabled={homeSlide >= residentialProjects.length - 3}
                className={`w-9 h-9 rounded-lg border disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer ${
                  isDark ? 'border-white/20 bg-white/5 hover:bg-[#087973] text-white' : 'border-black/15 bg-white hover:bg-[#087973] hover:text-white text-black'
                }`}
                aria-label="Next residential projects"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage('work')}
                className="text-xs font-semibold text-[#087973] uppercase hover:underline ml-2"
              >
                View All
              </button>
            </div>
          </div>

          {/* Projects Row - consistent height and alignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {residentialProjects.slice(homeSlide, homeSlide + 3).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col ${
                  isDark
                    ? 'bg-black border-white/10 hover:border-[#087973]'
                    : 'bg-white border-black/10 hover:border-[#087973]'
                }`}
              >
                <div className="relative h-60 sm:h-64 overflow-hidden">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {project.area}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white px-3.5 py-2 rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold truncate">{project.title}</h4>
                      <p className="text-[10px] text-white/70 truncate">{project.subCategory}</p>
                    </div>
                    <Eye className="w-3.5 h-3.5 text-[#087973] flex-shrink-0" />
                  </div>
                </div>

                <div className={`p-3.5 flex items-center justify-between text-xs border-t ${
                  isDark ? 'border-white/10 text-white/70' : 'border-black/10 text-black/70'
                }`}>
                  <span>Handover: <strong className={isDark ? 'text-white' : 'text-black'}>{project.completionTime}</strong></span>
                  <span className="text-[#087973] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DISCOVER THE PRICE BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`border rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-white/[0.03] border-white/10 text-white'
              : 'bg-black/[0.02] border-black/10 text-black'
          }`}
        >
          <div className="relative z-10 max-w-lg mx-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973] block">
              Transparent BOQ Estimations
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
              Discover The Price Of Your Dream Interior
            </h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Calculate an accurate, itemized cost breakdown in under a minute without obligation.
            </p>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                id="discover-price-calculate-now-btn"
                onClick={onOpenCalculator}
                className="px-5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] active:scale-[0.98] text-white font-medium text-xs uppercase tracking-wider shadow transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Now</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 7. INERIM OFFICE INTERIOR PROJECTS (Commercial Carousel) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              High-Performance Workplaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-1">
              Inerim <span className="text-[#087973]">Office Interior</span> Projects
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOfficeSlide(prev => Math.max(0, prev - 1))}
              disabled={officeSlide === 0}
              className={`w-9 h-9 rounded-lg border disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? 'border-white/20 bg-white/5 hover:bg-[#087973] text-white' : 'border-black/15 bg-white hover:bg-[#087973] hover:text-white text-black'
              }`}
              aria-label="Previous office projects"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOfficeSlide(prev => Math.min(commercialProjects.length - 3, prev + 1))}
              disabled={officeSlide >= commercialProjects.length - 3}
              className={`w-9 h-9 rounded-lg border disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? 'border-white/20 bg-white/5 hover:bg-[#087973] text-white' : 'border-black/15 bg-white hover:bg-[#087973] hover:text-white text-black'
              }`}
              aria-label="Next office projects"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('work')}
              className="text-xs font-semibold text-[#087973] uppercase hover:underline ml-2"
            >
              View All
            </button>
          </div>
        </div>

        {/* Office projects row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commercialProjects.slice(officeSlide, officeSlide + 3).map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
              onClick={() => onSelectProject(project)}
              className={`group rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col ${
                isDark
                  ? 'bg-black border-white/10 hover:border-[#087973]'
                  : 'bg-white border-black/10 hover:border-[#087973]'
              }`}
            >
              <div className="relative h-60 sm:h-64 overflow-hidden">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {project.area}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white px-3.5 py-2 rounded-lg border border-white/10 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold truncate">{project.title}</h4>
                    <p className="text-[10px] text-white/70 truncate">{project.subCategory}</p>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-[#087973] flex-shrink-0" />
                </div>
              </div>

              <div className={`p-3.5 flex items-center justify-between text-xs border-t ${
                isDark ? 'border-white/10 text-white/70' : 'border-black/10 text-black/70'
              }`}>
                <span>Handover: <strong className={isDark ? 'text-white' : 'text-black'}>{project.completionTime}</strong></span>
                <span className="text-[#087973] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Explore <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. HOW WE ARE STANDING OUT FROM THE COMPETITION */}
      <section
        className={`py-14 sm:py-18 border-y transition-colors my-12 sm:my-16 ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-black/[0.02] border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
                Proven Distinction
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
                How We Are <br />
                <span className="text-[#087973]">Standing Out</span> From The Competition
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                Traditional contractors rely on ballpark quotes, off-site dust, and endless delays. Inerim delivers precision engineering with locked BOQs, off-site manufacturing, and a 45-day handover guarantee.
              </p>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="talk-to-designers-btn"
                  onClick={() => setCurrentPage('contact')}
                  className="px-5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] active:scale-[0.98] text-white font-medium text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
                >
                  Talk To Our Architects
                </motion.button>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div className={`lg:col-span-7 rounded-xl border overflow-hidden ${
              isDark ? 'bg-black border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className={`grid grid-cols-12 border-b text-[11px] font-bold uppercase tracking-wider p-3.5 ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.03] border-black/10 text-black'
              }`}>
                <div className="col-span-6">Factors</div>
                <div className="col-span-3 text-center text-[#087973]">Inerim</div>
                <div className={`col-span-3 text-center ${isDark ? 'text-white/50' : 'text-black/50'}`}>Traditional</div>
              </div>

              <div className={`divide-y text-xs ${isDark ? 'divide-white/10' : 'divide-black/10'}`}>
                {COMPARISON_FACTORS.map((item, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 p-3.5 items-center transition-colors ${
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <div className="col-span-6 pr-2">
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{item.factor}</div>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                        {item.inerimExperience[0]}
                      </p>
                    </div>

                    <div className="col-span-3 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#087973]/15 text-[#087973] flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                        isDark ? 'bg-white/10 text-white/40' : 'bg-black/5 text-black/40'
                      }`}>
                        <CloseIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. HAPPY CUSTOMERS (Client Reviews) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight">
            Client <span className="text-[#087973]">Perspectives</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Real homeowners and tech founders who entrusted Inerim with their flagship spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
              className={`rounded-xl p-6 flex flex-col justify-between border transition-all ${
                isDark
                  ? 'bg-white/[0.03] border-white/10 text-white'
                  : 'bg-white border-black/10 shadow-sm text-black'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#087973]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#087973]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#087973]/40" />
                </div>

                <blockquote className={`text-xs sm:text-sm leading-relaxed italic mb-5 font-serif ${
                  isDark ? 'text-white/85' : 'text-black/85'
                }`}>
                  "{item.review}"
                </blockquote>
              </div>

              <div className={`flex items-center gap-3 pt-3.5 border-t ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}>
                <img
                  src={item.avatar}
                  alt={item.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-[#087973]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold">{item.clientName}</h4>
                  <p className="text-[11px] text-[#087973] font-medium">{item.role}</p>
                  <p className={`text-[10px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>{item.companyOrProject}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 10. LATEST JOURNAL ARTICLES */}
      <section
        className={`py-14 sm:py-18 border-t transition-colors my-12 sm:my-16 ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-black/[0.02] border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
                Knowledge & Perspectives
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight mt-1">
                Latest From Our <span className="text-[#087973]">Design Journal</span>
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('blog')}
              className="text-xs font-semibold text-[#087973] uppercase hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                onClick={() => onSelectPost(post)}
                className={`rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col group ${
                  isDark
                    ? 'bg-black border-white/10 hover:border-[#087973]'
                    : 'bg-white border-black/10 hover:border-[#087973] hover:shadow-sm'
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm text-white text-[9px] font-semibold uppercase px-2 py-0.5 rounded border border-white/10">
                    {post.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <span className={`text-[10px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      {post.date} • {post.readTime}
                    </span>
                    <h3 className="text-sm font-bold group-hover:text-[#087973] transition-colors line-clamp-2 mt-1 font-serif">
                      {post.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
                      isDark ? 'text-white/60' : 'text-black/60'
                    }`}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1.5 pt-2.5 border-t text-xs font-semibold text-[#087973] ${
                    isDark ? 'border-white/10' : 'border-black/10'
                  }`}>
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`border rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-white/[0.03] border-white/10 text-white'
              : 'bg-black/[0.02] border-black/10 text-black'
          }`}
        >
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
              Ready to Shape <span className="text-[#087973]">Your Space?</span>
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Book your free architectural discovery session or generate an itemized cost estimate today.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="cta-get-started-btn"
                onClick={() => setCurrentPage('contact')}
                className="px-5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] active:scale-[0.98] text-white font-medium text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
              >
                Schedule Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenCalculator}
                className={`px-4.5 py-2.5 rounded-lg border font-medium text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-black/15 bg-white hover:bg-black/5 text-black'
                }`}
              >
                Calculate Cost
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
