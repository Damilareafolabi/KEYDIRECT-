import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck, 
  UserCheck, 
  Lock, 
  AlertOctagon, 
  Building2, 
  Award,
  PhoneCall
} from 'lucide-react';

interface AntiScamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AntiScamModal: React.FC<AntiScamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl tracking-tight">
                KeyDirect Anti-Scam Verification Protocol
              </h3>
              <p className="text-xs text-stone-400">
                Architected by SimeonJrStudios · Leadership: CEO Afolabi Oluwadamilare Simeon
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800">
          
          {/* Mission statement */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-stone-900 text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold text-red-950 mb-1">
              "The Nigerian real estate ecosystem has suffered for decades under unregulated street agents, fake landlord impostors, and extortionate inspection fees. KeyDirect was founded to restore 100% transparency."
            </p>
            <span className="text-xs font-bold text-red-700 block mt-1">
              — CEO Afolabi Oluwadamilare Simeon, SimeonJrStudios
            </span>
          </div>

          {/* 4 Pillars of Scam Elimination */}
          <div>
            <h4 className="font-heading font-bold text-base text-stone-900 mb-3 uppercase tracking-wider text-xs">
              The 4 Pillars of Guaranteed Trust
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pillar 1 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-stone-900">1. NIN & BVN Identity Screening</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every property owner or agent undergoes biometric NIN identity hashing and BVN name confirmation. Impostors and phantom landlords cannot create listings.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-stone-900">2. Legal Title Cross-Verification</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We audit Certificates of Occupancy (C of O), Deeds of Assignment, and Governor’s Consents against Lagos & Abuja land registry archives before badging a listing.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-stone-900">3. On-Site Physical Audits</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  KeyDirect Trust Officers physically visit listed houses and plots to confirm actual vacancy, verify landlord keys, and record geotagged coordinate watermarks.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-stone-900">4. Zero Inspection Fee Law</h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  No listing on KeyDirect is permitted to charge "registration fees", "fuel money", or "viewing passes". All physical viewings are guaranteed 100% free.
                </p>
              </div>

            </div>
          </div>

          {/* Red Flag Warning */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4" />
              <span>Red Flags To Report Immediately</span>
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
              <li>Any advertiser asking you to transfer money to a private bank account before seeing the property.</li>
              <li>Anyone claiming they are "out of the country" but asking for a deposit to courier the keys.</li>
              <li>Any agent trying to impose 10% "caution fee" on direct owner listings.</li>
            </ul>
          </div>

          {/* Contact fraud hotline */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span><strong>Trust & Anti-Fraud Desk:</strong> trust@keydirect.ng · +234 800-KEYDIRECT</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer"
            >
              I Understand
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
