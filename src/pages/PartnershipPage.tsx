import React from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { Handshake, Building, Factory, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface PartnershipPageProps {
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator?: () => void;
}

export const PartnershipPage: React.FC<PartnershipPageProps> = ({ setCurrentPage }) => {
  const { isDark } = useTheme();

  const partnerTypes = [
    {
      title: 'Architects & Independent Designers',
      desc: 'Focus on pure design while Inerim manages 100% off-site CNC milling, procurement, civil execution, and snag-free handover under your name.',
      icon: Building,
      perks: [
        'Dedicated CNC cut-list engineering support',
        'Dust-free 7-day on-site assembly',
        'Transparent wholesale trade discounts',
        'Client confidentiality protection',
      ],
    },
    {
      title: 'Real Estate Developers',
      desc: 'Deliver fully fitted-out residential apartments, show units, and corporate lobbies on time with our legally binding 45-day SLA guarantee.',
      icon: Factory,
      perks: [
        'Scalable manufacturing capacity',
        'Standardized unit economics from ৳1,350/sq.ft',
        'On-site QA/QC team assigned per tower',
        'Turnkey display flat styling',
      ],
    },
    {
      title: 'Corporate Enterprises & Facility Heads',
      desc: 'Modern turnkey fit-outs designed around neuroarchitecture, acoustic isolation pods, and agile collaboration hubs for tech companies.',
      icon: ShieldCheck,
      perks: [
        'Minimal business disruption scheduling',
        'Fire-retardant commercial materials',
        '2-Year SLA with 48h emergency response',
        'Itemized commercial BOQ with GST compliance',
      ],
    },
  ];

  return (
    <div className="py-8 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title="B2B Partnerships for Architects & Real Estate Developers | Bangladesh"
        description="Partner with Inerim Interior for German CNC prefabrication, turnkey project execution, and rapid 45-day handovers across Dhaka, Bangladesh."
        canonicalUrl="/partnership"
        ogImage="/designs/d16.jpg"
        ogType="website"
        keywords="interior partnership Bangladesh, B2B interior contractor Dhaka, architectural prefabrication Bangladesh, developer interior contractor, corporate office interior Bangladesh"
      />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
          <Handshake className="w-3.5 h-3.5" />
          Industry Collaboration
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
          Partner With Bangladesh’s Most Reliable Interior Execution Engine
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-white/70' : 'text-black/70'}`}>
          We combine our high-precision German CNC manufacturing facility with disciplined project management to help developers, architects, and institutions deliver benchmark spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {partnerTypes.map((partner, idx) => {
          const Icon = partner.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-6 sm:p-8 border flex flex-col justify-between ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#087973]/10 border border-[#087973]/30 flex items-center justify-center text-[#087973]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif">{partner.title}</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>{partner.desc}</p>
                <div className="border-t border-dashed border-white/10 my-4" />
                <ul className="space-y-2.5">
                  {partner.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#087973] shrink-0" />
                      <span className={isDark ? 'text-white/80' : 'text-black/80'}>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setCurrentPage?.('contact')}
                  className="w-full py-3 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow"
                >
                  Inquire as Partner
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnershipPage;
