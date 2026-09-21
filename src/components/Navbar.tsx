import React, { useState } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Calculator, ChevronRight, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenCalculator
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'work', label: 'Portfolio' },
    { id: 'how-we-work', label: 'How We Work' },
    { id: 'blog', label: 'Journal' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-md ${
        isDark
          ? 'bg-black/90 border-b border-white/10 text-white'
          : 'bg-white/90 border-b border-black/10 text-black'
      }`}
    >
      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#087973] flex items-center justify-center shadow-sm text-white font-bold text-lg sm:text-xl group-hover:scale-105 transition-transform">
              <span className="font-serif tracking-tighter">IN</span>
            </div>
            <span className={`text-xl sm:text-2xl font-bold tracking-tight font-serif ${isDark ? 'text-white' : 'text-black'}`}>
              INERIM
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 text-xs lg:text-sm font-medium rounded-md transition-all relative cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'text-[#087973] bg-white/5 font-semibold'
                        : 'text-[#087973] bg-black/[0.03] font-semibold'
                      : isDark
                      ? 'text-white/75 hover:text-white hover:bg-white/5'
                      : 'text-black/70 hover:text-black hover:bg-black/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#087973] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Cost Calculator Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Black & White Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'White' : 'Black'} mode`}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                  : 'border-black/15 bg-black/[0.03] hover:bg-black/[0.08] text-black'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-white" />
                  <span className="hidden lg:inline text-[11px] font-medium tracking-wide">White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-black" />
                  <span className="hidden lg:inline text-[11px] font-medium tracking-wide">Black Mode</span>
                </>
              )}
            </button>

            {/* Compact, comfortable Cost Estimator CTA Button */}
            <button
              id="header-calculate-cost-btn"
              onClick={onOpenCalculator}
              className="px-4 py-2 sm:px-4.5 sm:py-2 rounded-lg bg-[#087973] hover:bg-[#06615c] active:scale-[0.98] text-white font-medium text-xs tracking-wider uppercase shadow-sm hover:shadow transition-all flex items-center gap-1.5 group cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
              <span>CALCULATE</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/5 text-white'
                  : 'border-black/15 bg-black/[0.03] text-black'
              }`}
              aria-label="Toggle black and white mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
            </button>

            {/* Mobile Calculator CTA */}
            <button
              onClick={onOpenCalculator}
              className="px-2.5 py-1.5 rounded-lg bg-[#087973] text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              aria-label="Calculate cost"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="text-[11px] tracking-wider uppercase font-semibold">Cost</span>
            </button>

            {/* Hamburger Menu */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDark
              ? 'bg-black border-white/10 text-white'
              : 'bg-white border-black/10 text-black'
          }`}
        >
          {/* Quick estimation banner */}
          <div
            className={`p-2.5 rounded-lg border mb-3 flex items-center justify-between ${
              isDark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-black/[0.02] border-black/10 text-black'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-[#087973]" />
              <span className="text-xs font-medium">Quick Estimate in 60s</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCalculator();
              }}
              className="text-xs font-semibold text-[#087973] hover:underline cursor-pointer"
            >
              Open Tool
            </button>
          </div>

          {/* Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-white/10 text-[#087973] font-semibold border-l-3 border-[#087973]'
                        : 'bg-black/5 text-[#087973] font-semibold border-l-3 border-[#087973]'
                      : isDark
                      ? 'text-white/80 hover:bg-white/5 hover:text-white'
                      : 'text-black/80 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              );
            })}
          </div>

          <div className={`pt-3 mt-3 border-t space-y-2.5 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCalculator();
              }}
              className="w-full py-2.5 rounded-lg bg-[#087973] hover:bg-[#06615c] text-white font-semibold text-xs tracking-wider uppercase text-center shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>CALCULATE NOW</span>
            </button>
            <div className={`flex items-center justify-center gap-4 text-xs pt-1 ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              <a href="tel:+8801768080101" className="hover:underline">Call: +88 01768 080101</a>
              <span>•</span>
              <a href="mailto:hello@inerim.com" className="hover:underline">hello@inerim.com</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
