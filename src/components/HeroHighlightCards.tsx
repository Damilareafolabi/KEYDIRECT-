import React, { useState } from 'react';
import { 
  Tag, 
  Home, 
  Smartphone, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  RotateCw,
  Check
} from 'lucide-react';

interface HeroHighlightCardsProps {
  onOpenVirtualLookDemo: () => void;
  onFilterDirectOwners: () => void;
  onFilterFreeInspection: () => void;
}

export const HeroHighlightCards: React.FC<HeroHighlightCardsProps> = ({
  onOpenVirtualLookDemo,
  onFilterDirectOwners,
  onFilterFreeInspection,
}) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  const cards = [
    {
      id: 'free-inspection',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-white shrink-0 shadow-lg">
          <div className="border border-red-400 px-1 py-0.5 rounded text-[9px] font-black tracking-widest text-red-300">
            FREE
          </div>
        </div>
      ),
      headline: 'STOP PAYING AGENTS INSPECTION FEES FOR PROPERTIES AND SEE IT FOR FREE FROM ANYWHERE U ARE',
      subtitle: 'Rental. All Types',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      action: onFilterFreeInspection,
    },
    {
      id: 'zero-commission',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-white shrink-0 shadow-lg">
          <div className="relative">
            <Home className="w-5 h-5 text-red-300" />
            <Check className="w-2.5 h-2.5 text-white absolute -bottom-0.5 -right-0.5 bg-red-600 rounded-full" />
          </div>
        </div>
      ),
      headline: 'ZERO COMMISSION - SAVE MONEY VERIFIED LISTINGS - 100% TRANSPARENT PRICING',
      subtitle: 'Rental. All Types',
      bgImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      action: onFilterDirectOwners,
    },
    {
      id: 'virtual-tours',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-white shrink-0 shadow-lg">
          <div className="relative">
            <Smartphone className="w-5 h-5 text-red-300" />
            <RotateCw className="w-2.5 h-2.5 text-white absolute -bottom-0.5 -right-0.5 bg-red-600 rounded-full animate-spin-slow" />
          </div>
        </div>
      ),
      headline: 'REAL VIRTUAL TOURS DIRECT RENTAL PROPERTY CARE TARGET',
      subtitle: 'Rental. All Tours',
      bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      action: onOpenVirtualLookDemo,
    },
  ];

  const handlePrev = () => {
    setScrollIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-20 mt-6 sm:mt-8">
      
      {/* 3 Horizontal Hero Cards matching reference image */}
      <div className="relative flex items-center">
        
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer border border-stone-200"
          title="Previous feature"
        >
          <ChevronLeft className="w-5 h-5 text-stone-800" />
        </button>

        {/* Cards Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 overflow-hidden">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              onClick={card.action}
              className="relative overflow-hidden rounded-2xl border border-stone-700/80 hover:border-red-500/80 bg-stone-950 p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-2xl flex flex-col justify-between h-32 sm:h-36"
            >
              {/* Background property preview image */}
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-cover bg-center"
                style={{ backgroundImage: `url(${card.bgImage})` }}
              />
              
              {/* Dark red / burgundy gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-red-950/90 via-stone-950/85 to-red-950/90" />

              <div className="relative z-10 flex items-start gap-3">
                {card.icon}
                <div className="flex-1">
                  <h4 className="font-heading font-black text-xs sm:text-xs tracking-tight text-white uppercase leading-snug line-clamp-3 group-hover:text-red-200 transition-colors">
                    {card.headline}
                  </h4>
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-medium text-stone-300">{card.subtitle}</span>
                <span className="text-[10px] font-bold text-red-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute -right-3 sm:-right-5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-stone-900 shadow-xl flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer border border-stone-200"
          title="Next feature"
        >
          <ChevronRight className="w-5 h-5 text-stone-800" />
        </button>
      </div>

      {/* Floating Highlight Banner Capsule (Matching Reference Image) */}
      <div className="mt-5 sm:mt-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-2xl border border-stone-200/80">
          <div className="bg-linear-to-r from-red-950 via-red-900 to-red-950 text-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shadow-inner">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-800/60 border border-red-500/40 flex items-center justify-center text-red-300 shrink-0">
                <Search className="w-4 h-4 text-red-300" />
              </div>
              <p className="font-heading font-black text-xs sm:text-sm md:text-base tracking-tight text-white uppercase leading-tight">
                GET HOUSE OR UR PROPERTY — WHETHER FOR SHORTLET, BUY IT, RENT IT, OR WHATEVER — VIEW IT ON THE EARTH OR WORLD WITHOUT PAYING INSPECTION FEES LIKE AGENTS WILL DO!
              </p>
            </div>

            <div className="w-7 h-7 rounded-full bg-red-700/80 border border-red-400/50 flex items-center justify-center text-white shrink-0 shadow-md">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
