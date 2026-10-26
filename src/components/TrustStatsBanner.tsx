import React from 'react';
import { ShieldCheck, Percent, FileCheck, Users, Sparkles, Building, Award } from 'lucide-react';

export const TrustStatsBanner: React.FC = () => {
  return (
    <section className="bg-stone-900 text-white py-12 border-y border-stone-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1 block">
            Why KeyDirect Is Disrupting Real Estate
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Built To Eliminate African & Global Rental Fraud
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80">
            <div className="font-heading text-3xl sm:text-4xl font-black text-red-500 mb-1">
              0%
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
              Unnecessary Agent Fee
            </div>
            <p className="text-[11px] text-stone-400">
              Save up to 20% on markups & caution fees
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80">
            <div className="font-heading text-3xl sm:text-4xl font-black text-emerald-400 mb-1">
              100%
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
              Verified Land Titles
            </div>
            <p className="text-[11px] text-stone-400">
              C of O, Governor’s Consent & Deeds audited
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80">
            <div className="font-heading text-3xl sm:text-4xl font-black text-white mb-1">
              ₦0
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
              Inspection Charges
            </div>
            <p className="text-[11px] text-stone-400">
              All physical property viewings are strictly free
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80">
            <div className="font-heading text-3xl sm:text-4xl font-black text-amber-400 mb-1">
              NIN & BVN
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
              Biometric ID Checked
            </div>
            <p className="text-[11px] text-stone-400">
              No phantom landlords or impersonators
            </p>
          </div>

        </div>

        {/* Corporate trust note */}
        <div className="mt-8 text-center text-xs text-stone-400 border-t border-stone-800/60 pt-4">
          A flagship product of <strong className="text-white">SimeonJrStudios</strong> · Under the visionary leadership of <strong>CEO Afolabi Oluwadamilare Simeon</strong>.
        </div>
      </div>
    </section>
  );
};
