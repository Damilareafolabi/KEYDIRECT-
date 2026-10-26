import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Phone, 
  CheckCircle2, 
  Flame, 
  Building, 
  Sliders, 
  MessageSquare,
  Users
} from 'lucide-react';
import { LazyCeoLead } from '../types';

interface LazyCeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LazyCeoLead[];
  onAddManualLead: (lead: LazyCeoLead) => void;
}

export const LazyCeoModal: React.FC<LazyCeoModalProps> = ({
  isOpen,
  onClose,
  leads,
  onAddManualLead,
}) => {
  const [huntTargetIndustry, setHuntTargetIndustry] = useState('Party Apartments & Luxury Shortlets');
  const [huntingIntensity, setHuntingIntensity] = useState('Aggressive (Talks to 100% of Visitors)');
  const [customPitchText, setCustomPitchText] = useState('Ask them if they need a soundproof party pad or direct C of O land with 0% agent fee');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const initialMockLeads: LazyCeoLead[] = [
    {
      id: 'lead-1',
      clientName: 'Deji Adeleke',
      clientNeed: 'Birthday party penthouse in Lekki for 40 guests this Saturday. Need pool & DJ gear.',
      budgetFormatted: '₦450,000 / night',
      location: 'Lekki Phase 1, Lagos',
      capturedAt: '8 mins ago',
      urgency: 'Hot',
      pitchUsed: 'Soundproof Lekki Penthouse Pitch',
      whatsappContact: '+234 803 444 8899',
    },
    {
      id: 'lead-2',
      clientName: 'Folashade Events Ltd',
      clientNeed: 'Wedding banquet center for 1,200 guests in Victoria Island. December 2026.',
      budgetFormatted: '₦4,500,000 / event',
      location: 'Victoria Island, Lagos',
      capturedAt: '25 mins ago',
      urgency: 'Hot',
      pitchUsed: 'Royal Grand Marquee VI Pitch',
      whatsappContact: '+234 802 777 1100',
    },
    {
      id: 'lead-3',
      clientName: 'Chief Emeka Okoli (Diaspora)',
      clientNeed: 'Wants to buy 2 dry plots in Sangotedo with Governor Consent for duplex development.',
      budgetFormatted: '₦170,000,000 Outright',
      location: 'Sangotedo, Lagos',
      capturedAt: '1 hour ago',
      urgency: 'Direct Deal',
      pitchUsed: 'Dry Land with Governor Consent Pitch',
      whatsappContact: '+44 7911 123456',
    },
  ];

  const allLeads = [...leads, ...initialMockLeads];

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-stone-950 text-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-800 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-xl tracking-tight text-white uppercase">
                  LazyCEO™ Autonomous Client-Hunter
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                  ACTIVE HUNTER
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Engineered by SimeonJrStudios · Let LazyCEO do the talking and hunt clients for KeyDirect or ANY business
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Mission & Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="text-[11px] font-bold text-stone-400 uppercase">Total Clients Hunted</div>
              <div className="font-heading text-3xl font-black text-emerald-400 mt-1">42 Leads</div>
              <div className="text-[10px] text-stone-500">Without asking or running ads</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="text-[11px] font-bold text-stone-400 uppercase">Pipeline Deal Value</div>
              <div className="font-heading text-3xl font-black text-white mt-1">₦245,500,000</div>
              <div className="text-[10px] text-stone-500">Party rentals, event spaces & land</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="text-[11px] font-bold text-stone-400 uppercase">Agent Cut Eliminated</div>
              <div className="font-heading text-3xl font-black text-red-500 mt-1">100% (0% Fee)</div>
              <div className="text-[10px] text-stone-500">Direct-to-owner contracts</div>
            </div>
          </div>

          {/* Hunted Leads Feed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <h4 className="font-heading font-black text-base text-white">
                  Recently Hunted High-Intent Leads
                </h4>
              </div>
              <span className="text-xs text-stone-400">Live Real-Time Captures</span>
            </div>

            <div className="space-y-3">
              {allLeads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-red-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{lead.clientName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/30 text-red-400 border border-red-500/30">
                        {lead.urgency}
                      </span>
                      <span className="text-[11px] text-stone-500">{lead.capturedAt}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed font-medium">
                      "{lead.clientNeed}"
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-0.5">
                      <span>Location: <strong className="text-stone-300">{lead.location}</strong></span>
                      <span>·</span>
                      <span>Budget: <strong className="text-emerald-400">{lead.budgetFormatted}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${lead.whatsappContact.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.clientName)}%2C%20KeyDirect%20LazyCEO%20connected%20us%20directly!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Lead</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Form for ANY Business */}
          <form onSubmit={handleSaveConfig} className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-500" />
                <h4 className="font-heading font-black text-sm text-white uppercase">
                  Configure LazyCEO For Your Specific Business
                </h4>
              </div>
              {isSavedNotice && (
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Config Updated!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Target Business / Offering</label>
                <select
                  value={huntTargetIndustry}
                  onChange={(e) => setHuntTargetIndustry(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                >
                  <option value="Party Apartments & Luxury Shortlets">Party Apartments & Luxury Shortlets</option>
                  <option value="Event Centers & Wedding Venues">Event Centers & Wedding Venues</option>
                  <option value="Commercial Land & Outright Plots">Commercial Land & Outright Plots</option>
                  <option value="DJ Sound & Festival Audio">DJ Sound & Festival Audio</option>
                  <option value="Gourmet Catering & Drinks">Gourmet Catering & Drinks</option>
                  <option value="Legal Title Audit & Conveyancing">Legal Title Audit & Conveyancing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Hunting Mode</label>
                <select
                  value={huntingIntensity}
                  onChange={(e) => setHuntingIntensity(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
                >
                  <option value="Aggressive (Talks to 100% of Visitors)">Aggressive (Talks to 100% of Visitors)</option>
                  <option value="High Intent Only (Browsing > 30s)">High Intent Only (Browsing &gt; 30s)</option>
                  <option value="Party & Weekend Hunter Only">Party & Weekend Hunter Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Custom Pitch Instruction</label>
              <input
                type="text"
                value={customPitchText}
                onChange={(e) => setCustomPitchText(e.target.value)}
                placeholder="What should LazyCEO say to visitors?"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer"
            >
              Update LazyCEO Hunter Algorithm
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
