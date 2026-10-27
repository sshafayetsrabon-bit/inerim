import React, { useState } from 'react';
import { PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/SEO';
import { Palette, Check, Sparkles, Eye, ArrowRight } from 'lucide-react';

interface ColourStudioPageProps {
  setCurrentPage?: (page: PageId) => void;
  onOpenCalculator?: () => void;
}

export const ColourStudioPage: React.FC<ColourStudioPageProps> = ({ setCurrentPage }) => {
  const { isDark } = useTheme();

  const palettes = [
    {
      name: 'Nordic Calm (Japandi Warmth)',
      description: 'Muted natural tones, pale oak, brushed champagne brass, and soft limestone.',
      swatches: [
        { name: 'Warm Cream', hex: '#F4F1EC', type: 'Wall Paint' },
        { name: 'Natural White Oak', hex: '#D6C5B1', type: 'Veneer' },
        { name: 'Deep Sage', hex: '#4A5B52', type: 'Accent Velvet' },
        { name: 'Brushed Brass', hex: '#C5A059', type: 'Hardware' },
      ],
      sampleImage: '/visualizer/dining.jpg',
    },
    {
      name: 'Architectural Charcoal & Walnut',
      description: 'Sophisticated contrast pairing dark acoustic slats with open-grain American walnut.',
      swatches: [
        { name: 'Smoked Charcoal', hex: '#232528', type: 'Acoustic Panel' },
        { name: 'American Walnut', hex: '#6D4C41', type: 'Veneer' },
        { name: 'Warm White 2700K', hex: '#FFF4E0', type: 'Cove Light' },
        { name: 'Matte Black', hex: '#121212', type: 'Profile' },
      ],
      sampleImage: '/visualizer/master.jpg',
    },
    {
      name: 'Contemporary Terracotta & Travertine',
      description: 'Earthy warmth inspired by Mediterranean travertine and warm terracotta bouclé.',
      swatches: [
        { name: 'Terracotta Earth', hex: '#C06C54', type: 'Accent Wall' },
        { name: 'Honed Travertine', hex: '#E6D9C8', type: 'Stone' },
        { name: 'Warm Taupe', hex: '#8D7B68', type: 'Laminate' },
        { name: 'Champagne Gold', hex: '#D4AF37', type: 'Trim' },
      ],
      sampleImage: '/visualizer/kids.jpg',
    },
  ];

  const [activePaletteIndex, setActivePaletteIndex] = useState(0);

  return (
    <div className="py-8 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title="Colour & Material Studio — Interactive Room Visualizer | Bangladesh"
        description="Experiment with luxury wall shades, natural walnut veneers, acrylic finishes, and velvet textures in Inerim's interactive colour studio before you build."
        canonicalUrl="/colour-studio"
        ogImage="/designs/d12.jpg"
        ogType="website"
        keywords="interior colour studio Bangladesh, wall paint visualizer Dhaka, interior materials palette, walnut veneer finishes Bangladesh, apartment color themes"
      />

      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#087973]/10 border border-[#087973]/30 text-[#087973] text-xs font-semibold uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5" />
          Material & Finish Laboratory
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight">
          Curated Architectural Palettes for Modern Dhaka Living
        </h1>
        <p className={`text-sm sm:text-base ${isDark ? 'text-white/70' : 'text-black/70'}`}>
          Touch, feel, and visualize material harmonies before installation. Every palette has been balanced under natural daylight and 3000K warm artificial illumination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {palettes.map((palette, pIdx) => (
          <div
            key={pIdx}
            onClick={() => setActivePaletteIndex(pIdx)}
            className={`rounded-2xl border p-6 space-y-5 cursor-pointer transition-all ${
              activePaletteIndex === pIdx
                ? 'border-[#087973] ring-2 ring-[#087973]/40 shadow-lg'
                : isDark
                ? 'bg-white/[0.02] border-white/10 hover:border-white/20'
                : 'bg-white border-black/10 hover:border-black/20'
            } ${isDark ? 'bg-black' : 'bg-white'}`}
          >
            <div className="relative h-48 rounded-xl overflow-hidden bg-neutral-900">
              <img
                src={palette.sampleImage}
                alt={palette.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] uppercase font-bold text-white tracking-wider">
                Preview Room
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold font-serif">{palette.name}</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-black/60'}`}>{palette.description}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087973]">Material Swatches</span>
              <div className="grid grid-cols-4 gap-2">
                {palette.swatches.map((swatch, sIdx) => (
                  <div key={sIdx} className="space-y-1 text-center">
                    <div
                      className="w-full h-10 rounded-lg border border-black/10 shadow-inner"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="text-[10px] block font-medium truncate">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl p-6 sm:p-8 border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isDark ? 'bg-white/[0.02] border-white/10' : 'bg-neutral-50 border-black/10'
      }`}>
        <div>
          <h4 className="font-bold text-base sm:text-lg font-serif">Want Real Material Swatches in Person?</h4>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
            Visit our Materials Lab in Dhaka to explore full-scale samples of real wood veneers, imported acrylic sheets, and high-performance textiles.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage?.('contact')}
          className="px-6 py-3 rounded-xl bg-[#087973] hover:bg-[#06635e] text-white text-xs sm:text-sm font-semibold shrink-0 cursor-pointer shadow"
        >
          Book Studio Visit
        </button>
      </div>
    </div>
  );
};

export default ColourStudioPage;
