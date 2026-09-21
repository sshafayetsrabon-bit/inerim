import React from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Phone, Mail, MapPin, ArrowRight, Instagram, Facebook, Linkedin, Youtube, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
  onOpenCalculator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenCalculator }) => {
  const { isDark } = useTheme();

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t transition-colors duration-300 pt-14 pb-10 ${
        isDark
          ? 'bg-black text-white border-white/10'
          : 'bg-white text-black border-black/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-footer Callout Card */}
        <div
          className={`border rounded-2xl p-6 sm:p-8 mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors ${
            isDark
              ? 'bg-white/[0.03] border-white/10 text-white'
              : 'bg-black/[0.02] border-black/10 text-black'
          }`}
        >
          <div className="space-y-1 max-w-xl">
            <span className="text-[#087973] text-[11px] font-semibold uppercase tracking-widest block">
              Architectural Precision & Transparent Pricing
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
              Your Dream Interior Is Just A Click Away
            </h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Standardized 45-day handover guarantee, itemized line-item BOQ, and flat 2-year warranty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onOpenCalculator}
              className="flex-1 sm:flex-initial px-4.5 py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Calculate Estimate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`flex-1 sm:flex-initial px-4.5 py-2.5 rounded-lg border font-medium text-xs tracking-wider uppercase transition-all cursor-pointer text-center ${
                isDark
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-black/15 bg-black/[0.02] hover:bg-black/[0.06] text-black'
              }`}
            >
              Free Consultation
            </button>
          </div>
        </div>

        {/* Brand & Social Row */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#087973] flex items-center justify-center text-white font-bold text-lg font-serif shadow-sm">
              IN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold tracking-tight font-serif ${isDark ? 'text-white' : 'text-black'}`}>
                  INERIM
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                  isDark
                    ? 'bg-white/10 text-white/90 border-white/20'
                    : 'bg-black/5 text-[#087973] border-[#087973]/30'
                }`}>
                  Studio
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                Modern Minimalist Architectural Interiors
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {[
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Youtube, href: '#', label: 'YouTube' }
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                    isDark
                      ? 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-[#087973]'
                      : 'border-black/10 bg-black/[0.02] text-black/70 hover:text-white hover:bg-[#087973]'
                  }`}
                  aria-label={social.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* 4 Columns Links Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-b text-xs ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              About Inerim
            </h4>
            <p className={`leading-relaxed text-xs ${isDark ? 'text-white/70' : 'text-black/70'}`}>
              Inerim is a premier interior architecture practice synthesizing Japanese minimalism, Scandinavian warmth, and precision off-site CNC joinery.
            </p>
            <div className={`space-y-1.5 pt-1 ${isDark ? 'text-white/80' : 'text-black/80'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087973]" />
                <span>146-Point Quality Checkpoints</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087973]" />
                <span>Off-Site Dustless Manufacturing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087973]" />
                <span>Guaranteed Delivery Clock</span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              Our Expertise
            </h4>
            <ul className={`space-y-2 ${isDark ? 'text-white/75' : 'text-black/75'}`}>
              <li>
                <button onClick={() => navigateTo('work')} className="hover:text-[#087973] transition-colors cursor-pointer text-left">
                  Luxury Residences & Penthouses
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('work')} className="hover:text-[#087973] transition-colors cursor-pointer text-left">
                  Corporate & Tech Workplaces
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('work')} className="hover:text-[#087973] transition-colors cursor-pointer text-left">
                  Boutique Retail & Hospitality
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-we-work')} className="hover:text-[#087973] transition-colors cursor-pointer text-left">
                  Photorealistic 3D Blueprints
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-we-work')} className="hover:text-[#087973] transition-colors cursor-pointer text-left">
                  Modular Joinery & Prefabrication
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              Navigation
            </h4>
            <ul className={`space-y-2 ${isDark ? 'text-white/75' : 'text-black/75'}`}>
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-[#087973] transition-colors cursor-pointer">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={onOpenCalculator} className="text-[#087973] font-semibold hover:underline transition-colors cursor-pointer flex items-center gap-1">
                  <span>Interior Cost Calculator</span>
                  <span className="text-[9px] px-1 py-0.5 bg-[#087973]/15 text-[#087973] rounded font-medium">Instant</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#087973] transition-colors cursor-pointer">
                  About the Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('work')} className="hover:text-[#087973] transition-colors cursor-pointer">
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-we-work')} className="hover:text-[#087973] transition-colors cursor-pointer">
                  5-Step Process & Warranty
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('blog')} className="hover:text-[#087973] transition-colors cursor-pointer">
                  Design Journal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#087973]">
              Contact & Studios
            </h4>
            <div className={`space-y-2.5 ${isDark ? 'text-white/75' : 'text-black/75'}`}>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#087973] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">+88 01768 080101</div>
                  <div className={`text-[11px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>+88 01711 333730</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#087973] flex-shrink-0 mt-0.5" />
                <div>
                  <div>hello@inerim.com</div>
                  <div className={`text-[11px] ${isDark ? 'text-white/50' : 'text-black/50'}`}>projects@inerim.com</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#087973] flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <div className="font-medium">Design Studio:</div>
                  <div>House 5, Road 21/A, Nikunja 2 & Gulshan 2, Dhaka</div>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                    Plant: BSCIC Industrial Estate, Gazipur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom micro bar */}
        <div className={`pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
          isDark ? 'text-white/50' : 'text-black/50'
        }`}>
          <div>
            © {new Date().getFullYear()} Inerim Architectural Interiors Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Warranty Certificate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
