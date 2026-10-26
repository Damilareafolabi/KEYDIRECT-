import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  DollarSign, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileText, 
  Phone, 
  MessageCircle, 
  Link2, 
  Image as ImageIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CURRENCY_RATES, formatCurrency, convertCurrency } from '../utils/currency';

interface AgentCommissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onOpenListProperty?: () => void;
}

export const AgentCommissionGuideModal: React.FC<AgentCommissionGuideModalProps> = ({
  isOpen,
  onClose,
  currentCurrency,
  onOpenListProperty,
}) => {
  // Calculator state
  const [propertyPrice, setPropertyPrice] = useState<number>(3500000); // ₦3.5M
  const [transactionType, setTransactionType] = useState<'rent' | 'sale' | 'shortlet'>('rent');
  const [commissionPercent, setCommissionPercent] = useState<number>(10); // 10% standard

  if (!isOpen) return null;

  // Calculate estimated closing commission
  const agentCommission = (propertyPrice * commissionPercent) / 100;
  // Inspection fee saved for client (traditional agents charge ₦15,000 - ₦30,000 for 3 visits)
  const clientInspectionSaved = 25000;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg tracking-tight">
                Agent Earnings & Commission Standards
              </h3>
              <p className="text-xs text-stone-400">
                How Much Agents Make on KeyDirect · Fair Success Fees · ₦0 Inspection Fee Policy
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

        {/* Core Philosophy Banner */}
        <div className="bg-linear-to-r from-red-600 to-rose-600 text-white p-5 text-sm">
          <div className="font-heading font-black text-base uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-yellow-300 shrink-0" />
            <span>The KeyDirect Standard: Never Charge for Looking. Earn Big on Closing!</span>
          </div>
          <p className="text-white/90 text-xs sm:text-sm mt-1 leading-relaxed">
            On KeyDirect, agents list properties 100% free with zero portal subscription fees. House hunters view properties for ₦0 inspection fees, meaning you get 10x more inquiries. When a client rents or buys, you collect your standard legal success commission upon signed agreement!
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* 4 Pillars of Agent Pricing & Policy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-xs">1</span>
                <span>₦0 Upfront Inspection Fees</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Traditional agents charge ₦5,000–₦20,000 just to view a house, scaring away 90% of serious clients. KeyDirect bans upfront inspection fees. Virtual inspections and physical walkthroughs are strictly free!
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">2</span>
                <span>Transparent Closing Commission (5% - 10%)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upon successfully sealing a lease or purchase agreement with keys handed over, agents earn their standard legal commission (usually 10% for residential rent, 5% for property sales).
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-xs">3</span>
                <span>Drop WhatsApp, Number, Paper Note or Any Link</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Agents have 100% freedom! You can drop direct WhatsApp, telephone number, snap a photo of a handwritten paper note or gate signpost, or attach any link (Linktree, personal website, social page).
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-xs">4</span>
                <span>Free Uploads & Automated Client Hunter</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero upload fees! Our automated LazyCEO agent hunts prospective renters and buyers across the web and feeds leads straight to your portal.
              </p>
            </div>
          </div>

          {/* Interactive Agent Commission & Savings Calculator */}
          <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-black text-base text-white">
                  Interactive Agent Success Fee Calculator
                </h4>
                <p className="text-[11px] text-stone-400">
                  Calculate your fair legal closing earnings on KeyDirect
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {/* Transaction Type */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1.5">
                  Deal Type
                </label>
                <div className="grid grid-cols-3 gap-1 bg-stone-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('rent');
                      setCommissionPercent(10);
                      setPropertyPrice(3000000);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      transactionType === 'rent' ? 'bg-red-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('sale');
                      setCommissionPercent(5);
                      setPropertyPrice(45000000);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      transactionType === 'sale' ? 'bg-red-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('shortlet');
                      setCommissionPercent(10);
                      setPropertyPrice(150000);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      transactionType === 'shortlet' ? 'bg-red-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Shortlet
                  </button>
                </div>
              </div>

              {/* Property Base Price */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1.5">
                  Property Value ({currentCurrency})
                </label>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-hidden focus:border-red-500"
                />
              </div>

              {/* Commission Percentage */}
              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase mb-1.5">
                  Agreed Closing Commission (%)
                </label>
                <select
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(parseFloat(e.target.value) || 5)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-hidden focus:border-red-500"
                >
                  <option value={5}>5% (Standard Sales / Land)</option>
                  <option value={7.5}>7.5% (Commercial / Event)</option>
                  <option value={10}>10% (Residential Rent Standard)</option>
                  <option value={0}>0% (Direct Owner No-Fee)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
              <div className="bg-stone-950/80 rounded-2xl p-4 border border-emerald-500/30">
                <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                  Agent Legal Payout Upon Agreement
                </div>
                <div className="font-heading font-black text-2xl text-emerald-400 mt-1">
                  {formatCurrency(
                    convertCurrency(agentCommission, 'NGN', currentCurrency),
                    currentCurrency
                  )}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Earned honestly when keys are handed over. 100% legal & protected.
                </div>
              </div>

              <div className="bg-stone-950/80 rounded-2xl p-4 border border-red-500/30">
                <div className="text-[11px] text-red-400 font-bold uppercase tracking-wider">
                  Client Inspection Fee Charged
                </div>
                <div className="font-heading font-black text-2xl text-red-400 mt-1">
                  ₦0 / $0 Free
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Saved client ~₦{clientInspectionSaved.toLocaleString()} in scam/viewing passes, closing 5x faster!
                </div>
              </div>
            </div>
          </div>

          {/* Flexible Agent Contact Methods Illustrated */}
          <div>
            <h4 className="font-heading font-bold text-stone-900 text-sm mb-3">
              How Agents Can Connect on KeyDirect:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <MessageCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                <div className="font-bold text-stone-800">Direct WhatsApp</div>
                <div className="text-[10px] text-stone-500">1-click WhatsApp chat link</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <Phone className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                <div className="font-bold text-stone-800">Direct Phone</div>
                <div className="text-[10px] text-stone-500">One-tap direct dial call</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <ImageIcon className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                <div className="font-bold text-stone-800">Paper / Signpost Snap</div>
                <div className="text-[10px] text-stone-500">Upload paper with phone number</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                <Link2 className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
                <div className="font-bold text-stone-800">Any Custom Link</div>
                <div className="text-[10px] text-stone-500">Linktree, social, website</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
            >
              Close Guide
            </button>

            {onOpenListProperty && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenListProperty();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                <span>List a Property as Verified Agent (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
