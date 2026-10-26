import React from 'react';
import { 
  X, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Zap, 
  Bot, 
  DollarSign, 
  Share2, 
  Award,
  Users,
  Building,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface AccountAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; role: UserRole; email: string } | null;
  currentCurrency: string;
}

export const AccountAnalyticsModal: React.FC<AccountAnalyticsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const totalViews = 18450;
  const directInquiries = 142;
  const lazyCeoLeads = 38;
  const rawCommissionSavedNgn = 18500000;
  const convertedCommission = convertCurrency(rawCommissionSavedNgn, 'NGN', currentCurrency);
  const billboardImpressions = 45200;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg tracking-tight">
                  Performance & Account Analytics
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Audited metrics for {currentUser?.name || 'Verified Publisher'} · {currentUser?.role || 'Owner'}
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
        <div className="p-6 space-y-6">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1">
                <Eye className="w-4 h-4 text-stone-400" />
                <span>Total Views</span>
              </div>
              <div className="font-heading text-2xl font-black text-stone-900">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">
                ↑ +24% this week
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <span>Direct Inquiries</span>
              </div>
              <div className="font-heading text-2xl font-black text-stone-900">
                {directInquiries}
              </div>
              <div className="text-[10px] text-stone-500 font-medium mt-1">
                0% agent fee conversations
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1">
                <Bot className="w-4 h-4 text-emerald-500" />
                <span>LazyCEO Leads</span>
              </div>
              <div className="font-heading text-2xl font-black text-emerald-700">
                {lazyCeoLeads} Hunted
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">
                Autonomously captured
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Fees Saved</span>
              </div>
              <div className="font-heading text-2xl font-black text-emerald-700">
                {formatCurrency(convertedCommission, currentCurrency, true)}
              </div>
              <div className="text-[10px] text-stone-500 font-medium mt-1">
                By bypassing street agents
              </div>
            </div>

          </div>

          {/* Traffic Channel Sources Breakdown */}
          <div className="bg-stone-50 p-5 rounded-3xl border border-stone-200 space-y-3">
            <h4 className="font-heading font-black text-sm text-stone-900 uppercase tracking-wide">
              Lead Acquisition Channels
            </h4>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>KeyDirect Search & Hero Filter Card</span>
                  <span>45% (8,300 views)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>Digital Billboard Global Showcase</span>
                  <span>28% (5,160 views)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>LazyCEO Autonomous Proactive Pitches</span>
                  <span>17% (3,140 views)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>Automated Social Media (TikTok, IG, WhatsApp, FB, LinkedIn)</span>
                  <span>10% (1,850 views)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-red-600 uppercase">Top Search Interest</span>
              <div className="font-bold text-sm text-stone-900">Soundproof Party Apartments (Lekki & VI)</div>
              <p className="text-xs text-stone-500">
                Surge in weekend birthday party bookings with rooftop heated pools and sound systems.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
              <span className="text-[11px] font-bold text-blue-600 uppercase">High Capital Inquiries</span>
              <div className="font-bold text-sm text-stone-900">Commercial Land for Rent & Outright Buy</div>
              <p className="text-xs text-stone-500">
                Diaspora and corporate inquiries for expressway frontage and registered Governor’s Consent.
              </p>
            </div>
          </div>

          {/* Export / Sync Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Analytics
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
