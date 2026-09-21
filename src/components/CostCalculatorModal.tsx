import React, { useState, useMemo } from 'react';
import { X, Check, Calculator, Sparkles, Building2, Home as HomeIcon, Download, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContact: (prefillData?: { spaceType: string; sqft: number; estimate: number; grade: string }) => void;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  isOpen,
  onClose,
  onNavigateToContact
}) => {
  const { isDark } = useTheme();
  const [spaceType, setSpaceType] = useState<'residential' | 'commercial'>('residential');
  const [sqft, setSqft] = useState<number>(2200);
  const [finishGrade, setFinishGrade] = useState<'essential' | 'signature' | 'luxury'>('signature');
  const [copied, setCopied] = useState(false);

  // Selected features
  const [rooms, setRooms] = useState({
    livingDining: true,
    masterSuite: true,
    modularKitchen: true,
    guestBedrooms: true,
    coveLightingCeiling: true,
    smartAutomation: false,
    acousticTreatments: false
  });

  const toggleRoom = (key: keyof typeof rooms) => {
    setRooms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Base rate calculation per sq.ft
  const gradeRates = {
    essential: { residential: 1250, commercial: 1100, label: 'Essential Modern', desc: 'Durable BWR plywood, anti-scratch laminates, soft-close hardware, Asian Paints Royale.' },
    signature: { residential: 1850, commercial: 1650, label: 'Signature Architectural', desc: 'Natural teak & oak veneers, Blum soft-close systems, quartz surfaces, indirect LED coves.' },
    luxury: { residential: 2750, commercial: 2400, label: 'Luxury Bespoke', desc: 'American walnut, bookmatched Italian marble, motorized servo-drive cabinetry, circadian automation.' }
  };

  const calculatedEstimate = useMemo(() => {
    const baseRate = gradeRates[finishGrade][spaceType];
    let multiplier = 0;
    if (rooms.livingDining) multiplier += 0.35;
    if (rooms.masterSuite) multiplier += 0.25;
    if (rooms.modularKitchen) multiplier += 0.22;
    if (rooms.guestBedrooms) multiplier += 0.18;
    if (rooms.coveLightingCeiling) multiplier += 0.12;
    if (rooms.smartAutomation) multiplier += 0.08;
    if (rooms.acousticTreatments) multiplier += 0.08;

    const finalMultiplier = Math.max(0.4, multiplier);
    const subtotal = Math.round(sqft * baseRate * (finalMultiplier / 1.12));
    
    const minEstimate = Math.round(subtotal * 0.95);
    const maxEstimate = Math.round(subtotal * 1.08);

    return {
      min: minEstimate,
      max: maxEstimate,
      avg: Math.round((minEstimate + maxEstimate) / 2)
    };
  }, [spaceType, sqft, finishGrade, rooms]);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return '৳ ' + val.toLocaleString('en-IN');
  };

  const handleConsultationLock = () => {
    onClose();
    onNavigateToContact({
      spaceType: spaceType === 'residential' ? 'Residential Interior' : 'Commercial Office Interior',
      sqft,
      estimate: calculatedEstimate.avg,
      grade: gradeRates[finishGrade].label
    });
  };

  const handleCopySummary = () => {
    const text = `Inerim Interior Estimate Summary:
• Space: ${spaceType.toUpperCase()} (${sqft.toLocaleString()} sq.ft)
• Finish Tier: ${gradeRates[finishGrade].label}
• Estimated Range: ${formatCurrency(calculatedEstimate.min)} - ${formatCurrency(calculatedEstimate.max)}
• Handover: 45 Days Guaranteed
• Warranty: 2-Year Comprehensive`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="cost-calculator-modal"
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden my-6 transition-colors ${
          isDark ? 'bg-black text-white border-white/15' : 'bg-white text-black border-black/15'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 flex items-start justify-between border-b ${
          isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
        }`}>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#087973]/15 text-[#087973] text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3" />
              Transparent BOQ Estimator
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Interior Cost Estimation
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Instant itemized estimate tailored to your exact carpet area and material quality tier.
            </p>
          </div>

          <button
            id="close-calculator-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark ? 'border-white/20 text-white/70 hover:text-white hover:bg-white/10' : 'border-black/15 text-black/70 hover:text-black hover:bg-black/5'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Step 1: Space Type */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              1. Select Space Archetype
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSpaceType('residential')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  spaceType === 'residential'
                    ? 'border-[#087973] bg-[#087973]/10 shadow-sm'
                    : isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-black/10 bg-black/[0.01] hover:bg-black/[0.03]'
                }`}
              >
                <div className={`p-2 rounded-lg ${spaceType === 'residential' ? 'bg-[#087973] text-white' : isDark ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70'}`}>
                  <HomeIcon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm">Residential Home</div>
                  <div className={`text-[10px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>Apartment, Duplex, Villa</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSpaceType('commercial')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  spaceType === 'commercial'
                    ? 'border-[#087973] bg-[#087973]/10 shadow-sm'
                    : isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-black/10 bg-black/[0.01] hover:bg-black/[0.03]'
                }`}
              >
                <div className={`p-2 rounded-lg ${spaceType === 'commercial' ? 'bg-[#087973] text-white' : isDark ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm">Commercial Office</div>
                  <div className={`text-[10px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>Corporate HQ, Studio</div>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Carpet Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                2. Approximate Floor Area (sq.ft)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="500"
                  max="25000"
                  step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Math.max(400, Number(e.target.value)))}
                  className={`w-20 px-2 py-1 text-right font-bold rounded-lg text-xs border focus:outline-none ${
                    isDark ? 'bg-black border-white/20 text-white focus:border-[#087973]' : 'bg-white border-black/20 text-black focus:border-[#087973]'
                  }`}
                />
                <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>sq.ft</span>
              </div>
            </div>

            <input
              type="range"
              min="800"
              max="12000"
              step="100"
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#087973] bg-[#087973]/20"
            />

            {/* Quick selector chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1500, 2200, 3500, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSqft(preset)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer border ${
                    sqft === preset
                      ? 'bg-[#087973] text-white border-[#087973]'
                      : isDark
                        ? 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        : 'border-black/10 bg-black/5 text-black/70 hover:bg-black/10'
                  }`}
                >
                  {preset.toLocaleString()} sq.ft
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Material & Finish Grade */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              3. Specification & Material Grade
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['essential', 'signature', 'luxury'] as const).map((grade) => {
                const info = gradeRates[grade];
                const isSelected = finishGrade === grade;
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setFinishGrade(grade)}
                    className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-[#087973] bg-[#087973]/10 shadow-sm'
                        : isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-black/10 bg-black/[0.01] hover:bg-black/[0.03]'
                    }`}
                  >
                    {grade === 'signature' && (
                      <span className="absolute -top-2 right-2 bg-[#087973] text-white text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs">{info.label}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#087973] bg-[#087973] text-white' : 'border-current opacity-40'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <p className={`text-[10px] leading-relaxed line-clamp-2 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{info.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Room Modules & Scope */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              4. Scope Inclusions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { key: 'livingDining', label: 'Living & Dining Lounge' },
                { key: 'masterSuite', label: 'Master Bedroom & Wardrobes' },
                { key: 'modularKitchen', label: 'Modular Kitchen' },
                { key: 'guestBedrooms', label: 'Guest / Child Bed Modules' },
                { key: 'coveLightingCeiling', label: 'Gypsum Ceiling & Coves' },
                { key: 'smartAutomation', label: 'Smart Automation' }
              ].map((item) => {
                const isChecked = rooms[item.key as keyof typeof rooms];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleRoom(item.key as keyof typeof rooms)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer text-xs ${
                      isChecked
                        ? 'border-[#087973] bg-[#087973]/10 font-medium'
                        : isDark ? 'border-white/10 bg-white/[0.02] text-white/70' : 'border-black/10 bg-black/[0.01] text-black/70'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-[#087973] border-[#087973] text-white' : 'border-current opacity-40'}`}>
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="truncate text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Calculation Card */}
          <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${
            isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
              isDark ? 'border-white/10' : 'border-black/10'
            }`}>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#087973] font-bold">
                  Estimated Investment
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-serif mt-0.5">
                  {formatCurrency(calculatedEstimate.min)} – {formatCurrency(calculatedEstimate.max)}
                </div>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                  *Includes 3D renders, materials, CNC joinery, civil works, and installation.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#087973]" />
                  <span className="text-[11px]"><strong>45 Days</strong> Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#087973]" />
                  <span className="text-[11px]"><strong>Flat 2-Years</strong> Warranty</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleCopySummary}
                className={`w-full sm:w-auto px-3.5 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  isDark ? 'border-white/15 hover:bg-white/10 text-white' : 'border-black/15 hover:bg-black/5 text-black'
                }`}
              >
                <Download className="w-3 h-3" />
                <span>{copied ? 'Summary Copied!' : 'Copy Breakdown'}</span>
              </button>

              <button
                id="lock-estimate-consultation-btn"
                type="button"
                onClick={handleConsultationLock}
                className="w-full sm:w-auto px-4.5 py-2 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
              >
                <span>Lock Estimate & Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
