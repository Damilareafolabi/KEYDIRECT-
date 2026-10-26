import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  Sparkles,
  Zap,
  ShieldCheck, 
  CheckCircle2,
  Globe,
  Send,
  SendHorizontal
} from 'lucide-react';
import { Property } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  currentCurrency?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  property,
  currentCurrency = 'NGN',
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://keydirect.ng';
  
  // Decide whether sharing a specific property or the global platform
  const isPlatformShare = !property;

  const shareTitle = isPlatformShare
    ? 'KeyDirect Real Estate & LazyCEO — ₦0 Inspection Fees & Automated Marketing'
    : `${property.title} — KeyDirect ₦0 Inspection Fee Verified`;

  const shareText = isPlatformShare
    ? `Stop paying agent inspection fees! Connect directly with verified landlords and business owners worldwide on KeyDirect & LazyCEO with 100% free 360° virtual tours.`
    : `Check out "${property.title}" in ${property.neighbourhood}, ${property.state}. Direct verified owner connection with 0% unneeded agent commissions and ₦0 inspection fees! Take the 360° virtual tour online:`;

  const fullShareMessage = `${shareText}\n${currentUrl}\n\n#KeyDirect #LazyCEO #ZeroInspectionFees #NigeriaRealEstate #Lagos #Abuja #DirectLandlord`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: currentUrl,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleCopyForPlatform = (platform: string, template: string) => {
    navigator.clipboard.writeText(template);
    setCopiedChannel(platform);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

  // Pre-configured social URLs
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareMessage)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareTitle + '\n' + shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}&hashtags=KeyDirect,LazyCEO,ZeroFees,NigeriaRealEstate`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle + '\n' + shareText)}`;

  const tiktokCaption = isPlatformShare
    ? `Stop paying ₦10k+ inspection fees just to see an apartment or shop! Check out KeyDirect Real Estate — 100% free 360° virtual tours and direct landlord contact. Link in bio! #RealEstate #KeyDirect #Lagos #Abuja #LazyCEO #ZeroFees`
    : `Stop paying ₦10k+ inspection fees! Take a virtual 360° look inside "${property.title}" in ${property.neighbourhood} directly from verified owner. 0% Commission! Link in bio. #RealEstate #KeyDirect #Lekki #Abuja #ZeroFees`;

  const instagramCaption = isPlatformShare
    ? `🚨 STOP PAYING AGENT INSPECTION FEES FOR PROPERTIES IN NIGERIA & WORLDWIDE!\n\nKeyDirect connects you directly with verified landlords, owners, and developers with ₦0 inspection charges. Take 360° Virtual Look tours online from anywhere you are!\n\nTap link in bio to explore free listings or register your property/business for free automarketing!\n\n#KeyDirect #LazyCEO #RealEstateNigeria #LekkiPhase1 #AbujaHomes #DirectOwner #ZeroCommission`
    : `Verified Listing Alert! 🚨\n\n📍 ${property.title}\n📍 Location: ${property.neighbourhood}, ${property.state}\n💰 ₦0 Street Inspection Fee Guarantee\n🔑 Clean Title: ${property.verification.documentType}\n\nTake the 360° Virtual Tour online for FREE and chat with the verified owner directly. Tap link in bio!\n\n#KeyDirect #RealEstateNigeria #LekkiPhase1 #AbujaHomes #PartyApartments #VerifiedOwner`;

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-800 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-stone-850 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              {isPlatformShare ? <Globe className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-heading font-black text-base text-white">
                {isPlatformShare ? 'Share This Platform to the World' : 'Share for Viral Publicity'}
              </h4>
              <p className="text-[11px] text-stone-400">
                {isPlatformShare 
                  ? 'Spread the ₦0 inspection fee revolution on Facebook, WhatsApp, TikTok & X' 
                  : 'Post across Facebook, TikTok, Instagram, WhatsApp, X & LinkedIn'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          
          {/* Target Snapshot Banner */}
          {property ? (
            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center gap-3">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="overflow-hidden flex-1">
                <div className="font-bold text-white truncate">{property.title}</div>
                <div className="text-[11px] text-stone-400 truncate">{property.neighbourhood}, {property.state}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                  ₦0 Inspection Fee Verified
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-linear-to-r from-red-950 via-stone-950 to-red-950 rounded-2xl border border-red-500/30 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                  GLOBAL VIRAL SHARE
                </span>
                <span className="text-emerald-400 font-bold text-[11px]">
                  ⚡ Say Goodbye to Inspection Scams!
                </span>
              </div>
              <h4 className="font-heading font-black text-white text-sm">
                KeyDirect Real Estate & LazyCEO Portal
              </h4>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Empowering real people with 0% middleman commission, 100% free 360° virtual property tours, and automated marketing for small businesses.
              </p>
            </div>
          )}

          {/* 1-Click Viral Platform Channels Grid */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              1-Click Direct Share
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span className="font-black text-base">f</span>
                <span>Facebook Share</span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-stone-800 hover:bg-black text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-700"
              >
                <span className="font-black text-sm">𝕏</span>
                <span>Post on X</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[#229ed9] hover:bg-[#1d8bc0] text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              {/* LinkedIn */}
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 p-2.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span className="font-black text-xs">in</span>
                <span>Share to LinkedIn Network</span>
              </a>
            </div>
          </div>

          {/* TikTok & Instagram Caption Copiers */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              TikTok & Instagram Viral Captions
            </label>

            {/* TikTok */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span>TikTok Video Caption & Script</span>
                </span>
                <button
                  onClick={() => handleCopyForPlatform('tiktok', tiktokCaption)}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-bold text-stone-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedChannel === 'tiktok' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedChannel === 'tiktok' ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-2 italic">
                "{tiktokCaption}"
              </p>
            </div>

            {/* Instagram */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600"></span>
                  <span>Instagram Reel / Post Caption</span>
                </span>
                <button
                  onClick={() => handleCopyForPlatform('instagram', instagramCaption)}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-bold text-stone-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedChannel === 'instagram' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedChannel === 'instagram' ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-2 italic">
                "{instagramCaption}"
              </p>
            </div>
          </div>

          {/* Direct Link Copy & Native Share */}
          <div className="pt-2 border-t border-stone-800 space-y-2">
            <label className="block text-[11px] font-bold text-stone-400 uppercase">
              {isPlatformShare ? 'Platform Direct Web Link' : 'Direct Property Link'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-300 font-mono text-[11px] outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-stone-700"
              >
                <Share2 className="w-3.5 h-3.5 text-red-400" />
                <span>Open Device Native Share Sheet</span>
              </button>
            )}
          </div>

          {/* Authenticity Anti-AI Pledge */}
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-[11px] text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Authenticity Verified:</strong> 100% Real Physical Photography & Video Tour only. No AI images or synthetic media allowed.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
