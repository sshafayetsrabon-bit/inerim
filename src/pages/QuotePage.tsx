import React, { useState } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles, Building2, Home as HomeIcon } from 'lucide-react';

interface QuotePageProps {
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator?: () => void;
}

export const QuotePage: React.FC<QuotePageProps> = ({ setCurrentPage }) => {
  const { isDark } = useTheme();

  const [spaceType, setSpaceType] = useState<'residential' | 'commercial'>('residential');
  const [sqft, setSqft] = useState<number>(2000);
  const [grade, setGrade] = useState<'essential' | 'signature' | 'luxury'>('signature');
  const [submitted, setSubmitted] = useState(false);

  const rates: Record<string, number> = {
    essential: 1350,
    signature: 1950,
    luxury: 2850,
  };

  const estimatedTotal = sqft * rates[grade];

  return (
    <div className="py-8 sm:py-16 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title="Instant Interior Cost Calculator & Free Quote | Bangladesh"
        description="Calculate your home or office interior cost in Dhaka with Inerim's interactive instant estimator. Transparent line-item pricing and 45-day handover guarantee."
        canonicalUrl="/quote"
        ogImage="/designs/d17.jpg"
        ogType="website"
        keywords="interior cost calculator Bangladesh, interior cost estimator Dhaka, flat interior budget calculation, calculate interior cost per sqft, Inerim interior quote"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'INERIM Interior Cost Estimator',
          url: 'https://inerimbd.com/quote',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'All',
        }}
      />

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          Interactive Cost Estimation Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
          Plan Your Interior Budget in 60 Seconds
        </h1>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-black/70'}`}>
          Select your space dimensions and finish grade to see an authentic, transparent estimation based on verified Dhaka market material rates.
        </p>
      </div>

      <div className={`rounded-2xl p-6 sm:p-10 border shadow-lg ${
        isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/10'
      }`}>
        <div className="space-y-8">
          {/* Space Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#087973]">1. Select Property Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSpaceType('residential')}
                className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-semibold text-sm transition-all cursor-pointer ${
                  spaceType === 'residential'
                    ? 'border-[#087973] bg-[#087973]/10 text-[#087973]'
                    : isDark
                    ? 'border-white/10 text-white/70'
                    : 'border-black/10 text-black/70'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                Residential Apartment / Duplex
              </button>
              <button
                type="button"
                onClick={() => setSpaceType('commercial')}
                className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-semibold text-sm transition-all cursor-pointer ${
                  spaceType === 'commercial'
                    ? 'border-[#087973] bg-[#087973]/10 text-[#087973]'
                    : isDark
                    ? 'border-white/10 text-white/70'
                    : 'border-black/10 text-black/70'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Commercial Office / Retail
              </button>
            </div>
          </div>

          {/* Area Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[#087973]">2. Total Carpet Area</label>
              <span className="text-xl font-bold font-mono text-[#087973]">{sqft.toLocaleString('en-IN')} sq.ft</span>
            </div>
            <input
              type="range"
              min="800"
              max="6000"
              step="50"
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="w-full accent-[#087973] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>800 sq.ft (Compact 2BHK)</span>
              <span>2,400 sq.ft (Luxury Flat)</span>
              <span>6,000 sq.ft (Sky Duplex)</span>
            </div>
          </div>

          {/* Quality Tier */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#087973]">3. Material & Execution Grade</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'essential', label: 'Essential Living', rate: '৳1,350/sft', desc: 'Moisture-proof HDHMR & PVC edges' },
                { id: 'signature', label: 'Signature Architectural', rate: '৳1,950/sft', desc: 'Walnut veneers, Blum hardware & acrylic' },
                { id: 'luxury', label: 'Bespoke Ultra-Luxury', rate: '৳2,850/sft', desc: 'Italian marble, PVD brass & smart lighting' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setGrade(tier.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    grade === tier.id
                      ? 'border-[#087973] bg-[#087973]/10 ring-1 ring-[#087973]'
                      : isDark
                      ? 'border-white/10 bg-white/[0.01]'
                      : 'border-black/10 bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{tier.label}</span>
                    <span className="text-xs font-mono font-semibold text-[#087973]">{tier.rate}</span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Estimate Result Box */}
          <div className={`p-6 sm:p-8 rounded-xl border text-center space-y-3 ${
            isDark ? 'bg-[#087973]/10 border-[#087973]/30' : 'bg-[#087973]/5 border-[#087973]/20'
          }`}>
            <span className="text-xs uppercase tracking-widest font-bold text-[#087973]">Estimated Turnkey Cost</span>
            <div className="text-4xl sm:text-6xl font-bold font-serif text-[#087973]">
              ৳ {estimatedTotal.toLocaleString('en-IN')}
            </div>
            <p className={`text-xs ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Estimated for {sqft.toLocaleString('en-IN')} sq.ft @ ৳{rates[grade]}/sq.ft • Includes modular joinery, false ceiling, lighting & 45-day delivery guarantee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => setCurrentPage?.('contact')}
              className="flex-1 py-4 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              Lock This Estimate & Book Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;
