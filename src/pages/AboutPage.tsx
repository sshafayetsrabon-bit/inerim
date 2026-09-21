import React from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { TEAM_MEMBERS } from '../data/companyData';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Factory,
  Layers,
  HeartHandshake,
  Clock
} from 'lucide-react';

interface AboutPageProps {
  setCurrentPage: (page: PageId) => void;
  onOpenCalculator: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage, onOpenCalculator }) => {
  const { isDark } = useTheme();

  const milestones = [
    { year: '2016', title: 'Studio Founded in Dhaka', desc: 'Started with 3 architects focused on Scandinavian minimalism and natural materials.' },
    { year: '2019', title: 'Proprietary CNC Factory Setup', desc: 'Invested in high-precision German CNC edge-banding machinery to eliminate on-site carpentry delays.' },
    { year: '2022', title: '45-Day Handover Guarantee', desc: 'Pioneered the industry’s first legally binding 45-day residential and commercial delivery model.' },
    { year: '2025', title: '250+ Landmark Spaces Delivered', desc: 'Trusted by visionary founders, CEOs, and families across Bangladesh and international regions.' }
  ];

  const qualityStandards = [
    { title: 'Zero On-Site Dust Prefabrication', desc: 'Over 75% of cabinetry and wall modules are precision-milled in our controlled industrial facility.' },
    { title: '146-Point Inspection Checklist', desc: 'Every millimeter of drawer alignment, hinge torque, paint sheen, and electrical junction is audited before handover.' },
    { title: 'Certified Non-Toxic Finishes', desc: 'We only use water-based, ultra-low VOC European lacquers and formaldehyde-free E1/E0 core boards.' },
    { title: 'Lifetime Blum Hardware Partnership', desc: 'Direct sourcing of German hinges and drawer runner systems with 200,000 cycle durability testing.' }
  ];

  return (
    <div className="space-y-14 sm:space-y-20 py-8 sm:py-12">
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-[11px] font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Heritage & Architectural Philosophy
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-[1.15]">
            Crafting Spaces That Breathe, Inspire, and Endure.
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Inerim was founded to dismantle the chaotic, opaque reality of traditional interior contracting. We unite pure Scandinavian and Japanese architectural sensibilities with uncompromising precision manufacturing.
          </p>
        </div>

        {/* Hero Visual Collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-10">
          <div className={`md:col-span-8 rounded-2xl overflow-hidden border h-72 sm:h-[420px] relative ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}>
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
              alt="Inerim Architectural Studio Space"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] uppercase tracking-widest text-[#087973] font-semibold block">Studio Philosophy</span>
              <h3 className="text-lg sm:text-2xl font-bold font-serif mt-0.5">Light, Proportion & Tactile Restraint</h3>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-5">
            <div className={`rounded-2xl overflow-hidden border h-44 sm:h-[196px] relative ${
              isDark ? 'border-white/10' : 'border-black/10'
            }`}>
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Architectural Material Details"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={`p-5 rounded-2xl border flex-1 flex flex-col justify-between ${
              isDark ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-black'
            }`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#087973]">Key Record</span>
                <div className="text-3xl font-bold font-serif mt-1">250+</div>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  Bespoke projects delivered across residential and corporate sectors.
                </p>
              </div>
              <div className={`pt-3 border-t flex items-center justify-between text-xs text-[#087973] font-medium ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}>
                <span>99.4% On-Time Handover</span>
                <span>• 2-Yr Full Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Principles */}
      <section
        className={`py-14 sm:py-18 border-y transition-colors ${
          isDark
            ? 'bg-white/[0.02] border-white/10'
            : 'bg-black/[0.02] border-black/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight">
              Our Guiding <span className="text-[#087973]">Principles</span>
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Every curve, shadow gap, and drawer slide is dictated by three unwavering standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border transition-all ${
              isDark ? 'bg-black border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className="w-11 h-11 rounded-lg bg-[#087973]/10 text-[#087973] flex items-center justify-center font-bold mb-3.5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif mb-1.5">Warm Japandi Sensibility</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/65' : 'text-black/65'}`}>
                We eschew sterile coldness in favor of authentic tactile warmth: open-pore timber, slatted acoustic fluting, woven linens, and indirect ambient illumination.
              </p>
            </div>

            <div className={`p-6 rounded-xl border transition-all ${
              isDark ? 'bg-black border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className="w-11 h-11 rounded-lg bg-[#087973]/10 text-[#087973] flex items-center justify-center font-bold mb-3.5">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif mb-1.5">Industrial Modular Precision</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/65' : 'text-black/65'}`}>
                Traditional joiners hammer nails in messy rooms. We prefabricate in a climate-controlled CNC facility with 0.1mm tolerance for pristine edge-banding.
              </p>
            </div>

            <div className={`p-6 rounded-xl border transition-all ${
              isDark ? 'bg-black border-white/10' : 'bg-white border-black/10 shadow-sm'
            }`}>
              <div className="w-11 h-11 rounded-lg bg-[#087973]/10 text-[#087973] flex items-center justify-center font-bold mb-3.5">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif mb-1.5">Absolute Transparency</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-white/65' : 'text-black/65'}`}>
                No mysterious markups. Every screw, hinge, sheet of BWR ply, and lighting driver is documented in your itemized BOQ before works begin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Squad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
            Architects & Engineers
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight mt-1">
            Meet The Minds Behind <span className="text-[#087973]">Inerim</span>
          </h2>
          <p className={`text-xs sm:text-sm mt-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            A multidisciplinary collective of architects, structural planners, and master craftsmen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className={`rounded-xl border overflow-hidden transition-all flex flex-col group ${
                isDark ? 'bg-black border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-[10px] font-medium bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                  {member.credentials}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-1.5">
                <div>
                  <h3 className="font-bold text-sm">{member.name}</h3>
                  <p className="text-xs text-[#087973] font-medium">{member.role}</p>
                  <p className={`text-xs leading-relaxed mt-2 line-clamp-3 ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}>
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Quality Audit Protocol */}
      <section className={`py-14 border-y transition-colors ${
        isDark ? 'bg-black border-white/10' : 'bg-black text-white border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
                Engineering Rigor
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white leading-tight">
                Our 146-Step Quality Verification Protocol
              </h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Before key handover, two independent quality auditors run our proprietary audit. Nothing is deemed complete until every point passes with zero snags.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('how-we-work')}
                  className="px-4.5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>See How We Work</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {qualityStandards.map((std, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-[#087973] font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#087973]" />
                    <span className="text-white">{std.title}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Milestones */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            Our Evolutionary Journey
          </h2>
        </div>

        <div className={`relative border-l-2 ml-4 sm:ml-28 space-y-7 pl-6 ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}>
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#087973] border-3 border-black shadow-sm" />
              <span className="sm:absolute sm:-left-28 sm:text-right sm:w-20 top-0.5 text-xs font-bold text-[#087973] block sm:inline">
                {m.year}
              </span>
              <h3 className="font-bold text-sm sm:text-base font-serif">{m.title}</h3>
              <p className={`text-xs mt-1 max-w-lg leading-relaxed ${
                isDark ? 'text-white/60' : 'text-black/60'
              }`}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className={`border rounded-2xl p-6 sm:p-10 text-center ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
        }`}>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            Experience The Inerim Difference
          </h3>
          <p className={`text-xs sm:text-sm mt-2 max-w-md mx-auto ${isDark ? 'text-white/70' : 'text-black/70'}`}>
            Book an intimate design consultation at our studio or schedule a complimentary space measurement.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => setCurrentPage('contact')}
              className="px-5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Book Studio Consultation
            </button>
            <button
              onClick={onOpenCalculator}
              className={`px-4.5 py-2.5 rounded-lg border font-medium text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-black/15 bg-white hover:bg-black/5 text-black'
              }`}
            >
              Calculate Your Estimate
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
