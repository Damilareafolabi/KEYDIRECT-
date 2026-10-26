import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Globe, 
  PartyPopper,
  Building,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { Property, BusinessBillboardAd } from '../types';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface SocialMediaAutoPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  billboards: BusinessBillboardAd[];
  currentCurrency: string;
}

export const SocialMediaAutoPosterModal: React.FC<SocialMediaAutoPosterModalProps> = ({
  isOpen,
  onClose,
  properties,
  billboards,
  currentCurrency,
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id || '');
  const [activePlatform, setActivePlatform] = useState<'tiktok' | 'instagram' | 'whatsapp' | 'facebook' | 'linkedin'>('tiktok');
  const [copied, setCopied] = useState(false);
  const [dispatchedAll, setDispatchedAll] = useState(false);

  if (!isOpen) return null;

  const currentProperty = properties.find((p) => p.id === selectedPropId) || properties[0];
  const convertedPrice = convertCurrency(currentProperty.basePrice, currentProperty.baseCurrency, currentCurrency);
  const formattedPrice = formatCurrency(convertedPrice, currentCurrency);

  const isParty = currentProperty.category === 'Party Apartments';
  const isEvent = currentProperty.category === 'Event Centers';
  const isLand = currentProperty.category === 'Plots / Land';

  // Platform specific generated scripts
  const templates: Record<string, { title: string; icon: string; copy: string }> = {
    tiktok: {
      title: 'TikTok Viral Short Video Script & Caption',
      icon: '🎵',
      copy: `POV: You found a soundproof party penthouse in ${currentProperty.neighbourhood} with ZERO noise curfew and NO 10% agent commission 🤯🔥

🎥 [Video Hook]: "Stop paying street agents ₦500k for party houses they don't even own! Watch this..."
📍 Location: ${currentProperty.neighbourhood}, ${currentProperty.state}
💰 Price: ${formattedPrice} / ${currentProperty.pricePeriod} (Direct from Landlord!)
✨ Features: ${currentProperty.amenities.slice(0, 4).join(' · ')}
🛡️ Title & Identity: Verified ${currentProperty.verification.documentType} by KeyDirect Anti-Scam Shield!

👉 Comment "DIRECT" or tap the link in bio to chat with the owner on WhatsApp right now! 
#LagosPartyPenthouses #LekkiShortlet #DirectFromOwner #KeyDirect #LagosNightlife #ZeroCommission`,
    },
    instagram: {
      title: 'Instagram Carousel & Reel Caption',
      icon: '📸',
      copy: `🚨 ZERO AGENT COMMISSION ALERT in ${currentProperty.neighbourhood.toUpperCase()} 🚨

Say goodbye to fake inspection fees and 10% agent markups. You are dealing directly with the verified owner on KeyDirect.

🏡 Property: ${currentProperty.title}
📍 Location: ${currentProperty.neighbourhood}, ${currentProperty.state}
💵 Direct Price: ${formattedPrice} / ${currentProperty.pricePeriod}
🔑 Capacity & Specs: ${currentProperty.bedrooms ? `${currentProperty.bedrooms} Beds · ` : ''}${currentProperty.bathrooms} Baths ${currentProperty.eventSpecs?.guestCapacity ? `· ${currentProperty.eventSpecs.guestCapacity} Guests` : ''}

✅ Title Verified: ${currentProperty.verification.documentType}
✅ NIN/BVN Biometric Screened Owner
✅ Free Physical Inspection Guaranteed

📲 Send a direct DM with "KEY" or visit keydirect.ng to inspect and book!
.
.
#KeyDirect #NigerianRealEstate #LekkiApartments #LagosRentals #AbujaProperties #SimeonJrStudios #DirectOwner`,
    },
    whatsapp: {
      title: 'WhatsApp Broadcast & Status Template',
      icon: '💬',
      copy: `*KEYDIRECT VERIFIED LISTING (0% AGENT COMMISSION)* 🔑

🔥 *${currentProperty.title}*
📍 *Location:* ${currentProperty.neighbourhood}, ${currentProperty.state}
💰 *Direct Price:* ${formattedPrice} / ${currentProperty.pricePeriod}

*HIGHLIGHTS:*
• 100% Direct from verified landlord (Save up to ₦1.5M in agent fees)
• ${currentProperty.amenities.slice(0, 3).join('\n• ')}
• Title document verified: *${currentProperty.verification.documentType}*
• Physical inspection is 100% FREE!

Click here to chat directly with the host on KeyDirect:
https://keydirect.ng/property/${currentProperty.slug}`,
    },
    facebook: {
      title: 'Facebook Marketplace & Community Groups Post',
      icon: '📘',
      copy: `[DIRECT OWNER PROPERTY - NO STREET AGENT FEES] 

Are you looking for verified ${currentProperty.category.toLowerCase()} in ${currentProperty.state}? Look no further!

Property: ${currentProperty.title}
Address: ${currentProperty.address}, ${currentProperty.neighbourhood}
Price: ${formattedPrice} (${currentProperty.pricePeriod})

Why rent or buy through KeyDirect?
1. Deal directly with the registered owner (No middlemen markups)
2. Verified ${currentProperty.verification.documentType} title checked with government land registry
3. NIN and BVN screened seller
4. Strictly zero inspection fee policy

Interested buyers or event planners can message directly or call through KeyDirect Trust platform.`,
    },
    linkedin: {
      title: 'LinkedIn Corporate & Diaspora Investment Post',
      icon: '💼',
      copy: `Transforming African Real Estate through 100% Direct-to-Owner Transparency & Anti-Scam Verification.

Delighted to showcase this prime asset on KeyDirect:
📍 Asset: ${currentProperty.title} (${currentProperty.neighbourhood}, ${currentProperty.state})
💼 Capital Value: ${formattedPrice} (${currentProperty.pricePeriod})
📑 Legal Compliance: Fully audited ${currentProperty.verification.documentType} with state land registry reference.

By eliminating arbitrary agency cuts and identity fraud, KeyDirect (backed by SimeonJrStudios under CEO Afolabi Oluwadamilare Simeon) provides corporate executives and diaspora investors with frictionless real estate access.

#RealEstateTech #AfricanInnovation #PropTech #DirectInvestment #KeyDirect #SimeonJrStudios`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(templates[activePlatform].copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoDispatchAll = () => {
    setDispatchedAll(true);
    setTimeout(() => setDispatchedAll(false), 2500);
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
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-pink-500 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg tracking-tight uppercase">
                  Social Media Omni-Channel Automation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-950 text-pink-400 border border-pink-800">
                  TikTok · IG · WhatsApp · FB · LinkedIn
                </span>
              </div>
              <p className="text-xs text-stone-400">
                1-Click Viral Campaign Generator for Party Pads, Event Arenas, Land & Businesses
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

        {/* Property Selector Bar */}
        <div className="p-4 bg-stone-900/80 border-b border-stone-800 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0">
            Select Asset to Promote:
          </span>
          <select
            value={selectedPropId}
            onChange={(e) => setSelectedPropId(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer flex-1 max-w-md font-medium"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.category}] {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-stone-900/40 border-b border-stone-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'tiktok', label: 'TikTok', icon: '🎵' },
            { id: 'instagram', label: 'Instagram', icon: '📸' },
            { id: 'whatsapp', label: 'WhatsApp Status', icon: '💬' },
            { id: 'facebook', label: 'Facebook Groups', icon: '📘' },
            { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePlatform(item.id as any)}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                activePlatform === item.id
                  ? 'bg-stone-900 text-red-400 border-red-500 shadow-sm'
                  : 'text-stone-400 hover:text-white border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Generated Copy Display */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300">
              {templates[activePlatform].title}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold transition-all cursor-pointer border border-stone-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Post'}</span>
              </button>

              <button
                onClick={handleAutoDispatchAll}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Auto-Post to All Channels</span>
              </button>
            </div>
          </div>

          {dispatchedAll && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Broadcast queued across TikTok, Instagram, WhatsApp, Facebook & LinkedIn via KeyDirect Webhooks!</span>
            </div>
          )}

          <pre className="p-5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-200 font-sans leading-relaxed whitespace-pre-wrap select-all">
            {templates[activePlatform].copy}
          </pre>
        </div>

      </div>
    </div>
  );
};
