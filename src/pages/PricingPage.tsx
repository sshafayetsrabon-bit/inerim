import React from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { Check, ShieldCheck, Clock, Calculator, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface PricingPageProps {
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  setCurrentPage,
  onOpenCalculator,
}) => {
  const { isDark } = useTheme();

  const packages = [
    {
      name: 'Essential Living',
      tagline: 'Clean Modern Functionality for Rental & First Homes',
      rate: '৳1,350',
      unit: '/ sq.ft',
      popular: false,
      features: [
        'Action TESA moisture-resistant HDHMR board',
        'Machine-pressed 1mm PVC edge-banding',
        'Soft-close hydraulic concealed hinges',
        'Berger Luxury Silk interior wall emulsion',
        'Standard architectural false ceiling with LED profiles',
        '45-day guaranteed handover SLA',
        '1-Year Comprehensive Warranty',
      ],
      idealFor: '1,200 – 1,800 sq.ft apartments & modern rentals',
    },
    {
      name: 'Signature Architectural',
      tagline: 'Our Most Popular Turnkey Architectural Standard',
      rate: '৳1,950',
      unit: '/ sq.ft',
      popular: true,
      features: [
        'Natural open-grain American Walnut & Oak veneer accents',
        'Austrian Senosan 2mm high-gloss or super-matte acrylics',
        '100% German Blum soft-close runners & hinges',
        'Concealed 3000K warm circadian LED cove lighting',
        'Marine-ply grade 710 modular kitchen carcasses',
        'Acoustic felt wall paneling in master bedroom/study',
        'Contractually locked 45-day key handover (৳5,000/day SLA penalty)',
        '2-Year Full-Replacement Warranty & 48h emergency response',
      ],
      idealFor: '1,800 – 3,500 sq.ft luxury apartments & duplexes',
    },
    {
      name: 'Bespoke Ultra-Luxury',
      tagline: 'Museum-Grade Artistry for Penthouses & Villas',
      rate: '৳2,850',
      unit: '/ sq.ft',
      popular: false,
      features: [
        'Italian Statuario & Botticino honed marble bookmatched surfaces',
        'PVD titanium champagne brass trims and metal mesh screens',
        'Custom radius curved timber joinery & fluted architectural walls',
        'Smart home wireless lighting, motorized drapery & scene automation',
        'Fully integrated European appliances & undermount quartz sink',
        'Bespoke walk-in wardrobe with tinted glass & integrated sensor LEDs',
        'Dedicated senior architect & site engineer on-site daily',
        '5-Year Premium White-Glove Warranty',
      ],
      idealFor: '3,000+ sq.ft penthouses, diplomatic residences & villas',
    },
  ];

  return (
    <div className="py-8 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title="Transparent Interior Design Pricing & Packages in Bangladesh"
        description="Explore transparent interior design packages starting from ৳1,350/sq.ft in Dhaka. Itemized BOQ, zero surprise overruns, and legally binding 45-day key handover."
        canonicalUrl="/pricing"
        ogImage="/designs/d17.jpg"
        ogType="website"
        keywords="interior design cost Bangladesh, interior package price Dhaka, interior per sqft rate Dhaka, flat interior cost Bangladesh, 45 day handover"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'INERIM Architectural Interior Packages',
          description: 'Transparent interior design and turnkey execution packages in Bangladesh',
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'BDT',
            lowPrice: '1350',
            highPrice: '2850',
            offerCount: '3',
          },
        }}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Square-Foot Economics
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
          Clear, Locked Pricing. Zero Surprise Surcharges.
        </h1>
        <p className={`text-base sm:text-lg ${isDark ? 'text-white/70' : 'text-black/70'}`}>
          Unlike traditional contractors whose bills expand mid-way, every Inerim project begins with an itemized, locked Bill of Quantities (BOQ). The price you sign is the price you pay.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all ${
              pkg.popular
                ? 'border-[#087973] shadow-xl ring-2 ring-[#087973]/50 scale-[1.02]'
                : isDark
                ? 'bg-white/[0.02] border-white/10'
                : 'bg-white border-black/10 shadow-sm'
            } ${isDark ? 'bg-black' : 'bg-white'}`}
          >
            {pkg.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#087973] text-white text-xs font-bold tracking-wide uppercase shadow">
                Most Selected
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-serif">{pkg.name}</h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{pkg.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#087973] font-serif">
                  {pkg.rate}
                </span>
                <span className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>{pkg.unit}</span>
              </div>

              <p className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10 text-white/80' : 'bg-black/5 border-black/10 text-black/80'
              }`}>
                Best for: {pkg.idealFor}
              </p>

              <div className="border-t border-dashed border-white/10 my-4" />

              <ul className="space-y-3">
                {pkg.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-[#087973] shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-white/80' : 'text-black/80'}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={onOpenCalculator}
                className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  pkg.popular
                    ? 'bg-[#087973] hover:bg-[#06635e] text-white shadow-lg'
                    : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-black hover:bg-neutral-800 text-white'
                }`}
              >
                <Calculator className="w-4 h-4" />
                Calculate Instant Estimate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark ? 'bg-white/[0.03] border-white/10' : 'bg-neutral-50 border-black/10'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#087973]/10 border border-[#087973]/30 flex items-center justify-center text-[#087973] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg font-serif">Legally Binding 45-Day Handover Guarantee</h4>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Every project comes with our contractual SLA: if we exceed 45 working days, we pay you ৳5,000/day as a direct credit on your final invoice.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentPage?.('contact')}
          className="px-6 py-3 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white text-xs sm:text-sm font-semibold shrink-0 cursor-pointer"
        >
          Book Discovery Session
        </button>
      </div>
    </div>
  );
};

export default PricingPage;
