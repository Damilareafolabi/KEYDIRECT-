import React from 'react';
import { KeyRound, ShieldAlert, Check, ArrowRight, Zap, Users } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface PromoBannerProps {
  currentLanguage: SupportedLanguage;
  onFilterDirectOwners: () => void;
  onOpenAntiScam: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  currentLanguage,
  onFilterDirectOwners,
  onOpenAntiScam,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-stone-900 via-stone-850 to-stone-950 border border-stone-800 shadow-2xl text-white">
        
        {/* Ambient lighting */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 md:p-12 relative z-10">
          
          {/* Left copy & highlights */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Connection Guarantee</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Get Property Directly <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-green-400">
                from the Owner
              </span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {t.directOwnerPromoSub}
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>0% Commission</strong> (Save 10%–20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>Zero Inspection Fees</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>NIN & BVN ID Verified</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>Government Title Checked</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onFilterDirectOwners}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Filter Direct Owners (0% Fee)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAntiScam}
                className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Anti-Scam Protocol</span>
              </button>
            </div>

          </div>

          {/* Right visual card - hand holding keys / modern residence */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-700/60 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="Direct Property Owner Key Handover"
                className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              {/* Floating verified badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md rounded-xl p-3.5 border border-stone-700/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Direct Handover</div>
                      <div className="text-[11px] text-stone-400">Straight from Landlord to Tenant</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-md">
                    Verified C of O
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
