import React, { useState } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { WORKFLOW_STEPS } from '../data/companyData';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Hammer,
  Compass,
  KeyRound,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ProcessPageProps {
  setCurrentPage: (page: PageId) => void;
  onOpenCalculator: () => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ setCurrentPage, onOpenCalculator }) => {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState<number>(0);

  const detailedTimeline = [
    {
      days: 'Day 1 – 2',
      stage: 'Discovery & Spatial Audit',
      action: 'Initial studio meeting or on-site consultation. 3D laser scan of floor plan, zoning layout, lifestyle audit, and preliminary budget framework.'
    },
    {
      days: 'Day 3 – 5',
      stage: 'Price Locking & Binding BOQ',
      action: 'Itemized Bill of Quantities prepared with 100% price guarantee. Contract sign-off and dedicated project manager deployment.'
    },
    {
      days: 'Day 6 – 15',
      stage: '3D Renders & Materials Lab Sign-Off',
      action: 'Photorealistic 3D VR renders, lighting lumen calculations, MEP schematics, and tactile material selection (walnut, marble, laminates, fabrics).'
    },
    {
      days: 'Day 16 – 32',
      stage: 'Off-Site CNC Milling & On-Site Civil Prep',
      action: 'Parallel workflow: German CNC automated cutting & edge-banding in our dustless Gazipur factory while on-site teams run electrical conduits and ceiling frames.'
    },
    {
      days: 'Day 33 – 40',
      stage: 'Modular Assembly & Lighting Integration',
      action: 'Modular cabinetry arrives pre-drilled. Fast, silent screw assembly with Blum hinges, acoustic panels, countertop installation, and cove lighting fixtures.'
    },
    {
      days: 'Day 41 – 45',
      stage: '146-Point Audit, Deep Clean & Handover',
      action: 'Rigorous 146-step quality inspection by two independent architects, hospital-grade deep cleaning, key handover, and 2-Year Warranty activation.'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">
      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-[11px] font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Engineering Methodology
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
            How They Work
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            We transformed interior contracting from an unpredictable gamble into a disciplined, 45-day architectural science. Here is how your project moves seamlessly from concept to turnkey living.
          </p>
        </div>
      </section>

      {/* 2. Interactive 5-Step Process Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl border p-5 sm:p-8 transition-colors ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/10 shadow-sm'
        }`}>
          {/* Step Selector Tabs */}
          <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2.5 border-b pb-5 mb-6 ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}>
            {WORKFLOW_STEPS.map((step, idx) => (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg text-left transition-all cursor-pointer border ${
                  activeStep === idx
                    ? 'border-[#087973] bg-[#087973]/10'
                    : isDark
                      ? 'border-transparent hover:bg-white/5'
                      : 'border-transparent hover:bg-black/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#087973]">
                    Step {step.stepNumber}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-black/40'}`}>{step.duration}</span>
                </div>
                <div className={`font-bold text-xs sm:text-sm mt-1 truncate ${isDark ? 'text-white' : 'text-black'}`}>
                  {step.title}
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Detailed View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973] text-white text-xs font-semibold uppercase tracking-wider">
                <span>Phase {WORKFLOW_STEPS[activeStep].stepNumber}</span>
                <span className="text-white/80">• {WORKFLOW_STEPS[activeStep].duration}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif">
                {WORKFLOW_STEPS[activeStep].title}: <span className="text-[#087973]">{WORKFLOW_STEPS[activeStep].subtitle}</span>
              </h2>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                {WORKFLOW_STEPS[activeStep].description}
              </p>

              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                  Guaranteed Deliverables for this Phase:
                </h4>
                <div className="space-y-1.5">
                  {WORKFLOW_STEPS[activeStep].deliverables.map((del, dIdx) => (
                    <div
                      key={dIdx}
                      className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg border ${
                        isDark ? 'bg-white/5 border-white/10 text-white/90' : 'bg-black/[0.02] border-black/10 text-black/90'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#087973] flex-shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`lg:col-span-5 p-5 sm:p-6 rounded-xl border space-y-3 ${
              isDark ? 'bg-black border-white/10 text-white' : 'bg-black/[0.03] border-black/10 text-black'
            }`}>
              <span className="text-[10px] uppercase tracking-widest text-[#087973] font-bold block">
                Inerim Assurance
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold">
                Why This Phase Is Fail-Safe
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                Every milestone is signed off in our digital client portal with photo logs and video walkthroughs. You never wonder whether materials arrived or if work is progressing on schedule.
              </p>

              <div className={`pt-3 border-t space-y-1.5 text-xs ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-white/70' : 'text-black/70'}>Weekly Milestone Digest:</span>
                  <span className="text-[#087973] font-semibold">Every Friday 5 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-white/70' : 'text-black/70'}>Quality Auditor:</span>
                  <span className="text-[#087973] font-semibold">Senior Architect Assigned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 45-Day Handover Timeline Calendar Breakdown */}
      <section
        className={`py-14 sm:py-18 border-y transition-colors ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-black/[0.02] border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              Precision Schedule
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight mt-1">
              The 45-Day Delivery Clock
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Our written commitment: if we miss the 45-day deadline for reasons within our control, we pay liquidated damages directly to you for every day delayed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {detailedTimeline.map((item, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all space-y-2 ${
                  isDark ? 'bg-black border-white/10' : 'bg-white border-black/10 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#087973]/15 text-[#087973] text-[11px] font-bold">
                    {item.days}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-black/40'}`}>#0{idx + 1}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base pt-0.5 font-serif">{item.stage}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  {item.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Factory Prefabrication vs Traditional Joinery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              The Manufacturing Secret
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Factory Prefabrication Eliminates On-Site Chaos
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Traditional contractors bring logs of raw wood into your new apartment, creating clouds of toxic dust that settle inside your AC ducts and paintwork for years.
            </p>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Inerim cuts, edge-bands, and pre-drills 80% of all cabinets inside our automated CNC factory in Gazipur. When our installation squad arrives on Day 33, components fit together cleanly like Swiss watches, with zero dust and zero noise complaints from building neighbors.
            </p>

            <div className="pt-1 flex flex-wrap gap-2 text-xs font-medium">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087973]" />
                <span>0.1mm Precision Tolerances</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087973]" />
                <span>Zero On-Site Sawdust</span>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl overflow-hidden border h-72 sm:h-80 relative ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}>
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
              alt="Inerim CNC Factory Precision Joinery"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 text-white text-xs">
              <span className="font-bold text-[#087973] block text-[11px] uppercase tracking-wider">Industrial Plant Facility</span>
              Automated edge-banding and CNC precision drilling ensures zero peeling laminates.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Flat 2-Years Warranty Certificate Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-6 sm:p-10 border ${
          isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#087973]/15 text-[#087973] text-[11px] font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> Comprehensive Protection
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif">
                Flat 2-Years Warranty on Every Completed Project
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                Our commitment does not end at key handover. For 24 full months, your furniture hinges, drawer channels, anti-sag shelves, and lighting electronics are covered by our prompt replacement warranty.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5">
              <button
                onClick={onOpenCalculator}
                className="w-full py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider text-center cursor-pointer shadow"
              >
                Estimate With Warranty
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className={`w-full py-2.5 rounded-lg border font-medium text-xs uppercase tracking-wider text-center cursor-pointer transition-colors ${
                  isDark
                    ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                    : 'border-black/15 bg-white hover:bg-black/5 text-black'
                }`}
              >
                Inquire For Your Project
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
