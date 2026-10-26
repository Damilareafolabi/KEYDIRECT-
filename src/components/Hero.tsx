import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { HeroHighlightCards } from './HeroHighlightCards';

interface HeroProps {
  currentLanguage: SupportedLanguage;
  onSelectRole: (role: 'Owners' | 'Agents' | 'Developers') => void;
  onOpenListProperty: () => void;
  activeRole: string;
  onOpenVirtualLookDemo: () => void;
  onFilterDirectOwners: () => void;
  onFilterFreeInspection: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLanguage,
  onSelectRole,
  onOpenListProperty,
  activeRole,
  onOpenVirtualLookDemo,
  onFilterDirectOwners,
  onFilterFreeInspection,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <section className="relative bg-stone-950 overflow-hidden pt-12 sm:pt-16 pb-14 sm:pb-20">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="Modern Architectural Real Estate"
          className="w-full h-full object-cover object-center opacity-45 mix-blend-luminosity scale-105 transform motion-safe:transition-transform motion-safe:duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/90 via-stone-950/70 to-stone-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Core Trust Badges Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/95 text-white text-xs font-black shadow-lg shadow-red-950/50 border border-red-400/40">
            <span>⚡ ₦0 Inspection Fees</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-emerald-400 text-xs font-bold shadow-lg border border-stone-800">
            <span>📹 100% Free Virtual Inspection</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-stone-200 text-xs font-bold shadow-lg border border-stone-800">
            <span>🛡️ Direct Owner Connections — Say Goodbye to Rental Scams!</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-amber-300 text-xs font-bold shadow-lg border border-stone-800">
            <span>📍 Interactive Online & Offline Map Search</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-cyan-300 text-xs font-bold shadow-lg border border-stone-800">
            <span>🌐 Global Multi-Currency ($ USD, ₦ NGN, € EUR, £ GBP) & Multi-Language Support</span>
          </div>
        </div>

        {/* Prominent Zero Inspection Fee Global Banner */}
        <div className="mb-6 inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-2xl bg-linear-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-red-950/40 border border-white/20 uppercase text-center">
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping shrink-0" />
          <span>GET HOUSE OR UR PROPERTY — WHETHER FOR SHORTLET, BUY IT, RENT IT, OR WHATEVER — VIEW IT ON THE EARTH OR WORLD WITHOUT PAYING INSPECTION FEES LIKE AGENTS WILL DO!</span>
        </div>

        {/* Main Headline (Matching Reference Image) */}
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-[1.1] mb-5">
          {t.heroHeadline}
        </h1>

        {/* Subheadline (Matching Reference Image) */}
        <p className="max-w-3xl mx-auto text-sm sm:text-lg text-stone-300 font-normal leading-relaxed mb-8 sm:mb-10">
          {t.heroSubheadline}
        </p>

        {/* Target Role Selectors (Matching Reference Image Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-2">
          
          {/* Owners -> */}
          <button
            onClick={() => onSelectRole('Owners')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeRole === 'Owners'
                ? 'bg-white text-stone-900 shadow-lg shadow-white/10 ring-2 ring-red-500'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-stone-500'
            }`}
          >
            <span>{t.owners}</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </button>

          {/* Agents -> */}
          <button
            onClick={() => onSelectRole('Agents')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeRole === 'Agents'
                ? 'bg-white text-stone-900 shadow-lg ring-2 ring-red-500'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-stone-500'
            }`}
          >
            <span>{t.agents}</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </button>

          {/* Developers -> */}
          <button
            onClick={() => onSelectRole('Developers')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeRole === 'Developers'
                ? 'bg-white text-stone-900 shadow-lg ring-2 ring-red-500'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 hover:border-stone-500'
            }`}
          >
            <span>{t.developers}</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-500" />
          </button>

          {/* List your property */}
          <button
            onClick={onOpenListProperty}
            className="px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-stone-200 bg-stone-900/80 hover:bg-red-600 hover:text-white border border-stone-700/80 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{t.listYourProperty}</span>
          </button>

        </div>

      </div>

      {/* 3 Horizontal Hero Highlight Cards & Red Capsule Banner matching reference image */}
      <HeroHighlightCards
        onOpenVirtualLookDemo={onOpenVirtualLookDemo}
        onFilterDirectOwners={onFilterDirectOwners}
        onFilterFreeInspection={onFilterFreeInspection}
      />
    </section>
  );
};
