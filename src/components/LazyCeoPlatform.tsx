import React, { useState, useEffect } from 'react';
import { 
  X, 
  Rocket, 
  Send, 
  Calendar, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  Tv, 
  MapPin, 
  Eye, 
  Sparkles, 
  Layers, 
  Lock, 
  Flame, 
  TrendingUp, 
  Zap, 
  Compass, 
  Download, 
  RotateCw, 
  ChevronRight, 
  UserCheck, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Megaphone,
  Upload
} from 'lucide-react';
import { 
  BusinessProfile, 
  getBusinessProfile, 
  saveBusinessProfile, 
  MarketingPost, 
  PlanTier,
  isOfflineCacheActive,
  toggleOfflineCache,
  getBusinessMapPins,
  addBusinessMapPin,
  BusinessMapPin
} from '../utils/lazyCeoStorage';
import { VirtualRoom3D } from './VirtualRoom3D';
import { DigitalBillboardModal } from './DigitalBillboardModal';
import { UserAccount } from '../utils/auth';

interface LazyCeoPlatformProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | { name: string; email: string; phone?: string } | null;
  onOpenAuth?: () => void;
}

export const LazyCeoPlatform: React.FC<LazyCeoPlatformProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
}) => {
  const [profile, setProfile] = useState<BusinessProfile>(() => getBusinessProfile());
  const [activeTab, setActiveTab] = useState<'pipelines' | 'virtualroom' | 'map' | 'billboards' | 'pricing' | 'profile'>('pipelines');
  const [activePipelineFreq, setActivePipelineFreq] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Daily');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [isVirtualRoomOpen, setIsVirtualRoomOpen] = useState(false);
  const [isBillboardModalOpen, setIsBillboardModalOpen] = useState(false);
  const [offlineCached, setOfflineCached] = useState<boolean>(() => isOfflineCacheActive());
  const [mapPins, setMapPins] = useState<BusinessMapPin[]>(() => getBusinessMapPins());
  const [isAddPinModalOpen, setIsAddPinModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Pin Form State
  const [pinName, setPinName] = useState('');
  const [pinCategory, setPinCategory] = useState('Showroom & Office');
  const [pinAddress, setPinAddress] = useState('');
  const [pinCity, setPinCity] = useState('Lagos');
  const [pinPhone, setPinPhone] = useState('+234 ');
  const [pinDescription, setPinDescription] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  // Real Automated Content Generation based on Business Profile
  const generatePostPipelines = (biz: BusinessProfile): MarketingPost[] => {
    return [
      {
        id: 'post-daily-1',
        frequency: 'Daily',
        title: 'Daily High-Yield Value Insight & Engagement Hook',
        content: `Stop wasting capital on middleman markups! At ${biz.businessName}, we connect you directly to premier verified solutions with 0% unneeded commission fees. \n\nWhether you need ${biz.industry.toLowerCase()} or high-impact opportunities in ${biz.city}, direct transparency always wins.\n\nDrop a comment or DM "DIRECT" to get instant access to today's catalog!`,
        hashtags: ['#DirectConnections', '#ZeroCommissions', '#VerifiedBusiness', '#Entrepreneurship', '#SmartGrowth'],
        callToAction: 'Tap link in bio to schedule a ₦0 tour or direct WhatsApp connection!',
        targetChannels: ['Instagram', 'X (Twitter)', 'Facebook', 'LinkedIn'],
        status: 'Ready',
        scheduledDate: 'Today (Automated Broadcast)',
        characterCount: 380,
      },
      {
        id: 'post-daily-2',
        frequency: 'Daily',
        title: 'Daily Behind-The-Scenes & Client Trust Story',
        content: `Behind every success story at ${biz.businessName} is our rigorous verification standard. Every product and place is 100% audited before we showcase it.\n\nWhy pay extra when you can deal directly with the source? What is your biggest challenge in ${biz.industry}? Let's solve it together!`,
        hashtags: ['#BehindTheScenes', '#TrustFirst', '#QualityAssured', '#DirectOwner'],
        callToAction: 'Visit our 3D Virtual Showroom online for free!',
        targetChannels: ['TikTok', 'Instagram Stories', 'LinkedIn Pulse'],
        status: 'Scheduled',
        scheduledDate: 'Tomorrow at 9:00 AM',
        characterCount: 320,
      },
      {
        id: 'post-weekly-1',
        frequency: 'Weekly',
        title: 'Weekly 5-Part Strategic Growth Thread',
        content: `THE COMPLETE GUIDE TO EXPANDING IN ${biz.city.toUpperCase()}:\n\n1/ Stop paying inspection and discovery fees upfront.\n2/ Insist on verified government titles and clear legal credentials.\n3/ Use 3D virtual walkthroughs to inspect venues before traveling.\n4/ Leverage automated social marketing to talk about your business 24/7.\n5/ Connect directly with ${biz.businessName} for uncompromised excellence.\n\nSave this thread for your upcoming investment sprint!`,
        hashtags: ['#WeeklyMasterclass', '#BusinessGrowth', '#DirectAccess', '#LagosTech', '#DiasporaInvest'],
        callToAction: 'Share this thread with an entrepreneur who needs to save 10% in fees!',
        targetChannels: ['X (Twitter)', 'LinkedIn Article', 'WhatsApp Newsletter'],
        status: 'Ready',
        scheduledDate: 'Every Monday 8:00 AM',
        characterCount: 512,
      },
      {
        id: 'post-monthly-1',
        frequency: 'Monthly',
        title: 'Monthly Executive Retrospective & VIP Showcase',
        content: `EXECUTIVE BRIEFING — ${biz.businessName.toUpperCase()}:\n\nThis month, our clients saved millions in avoided agent fees and direct contracts across ${biz.city}.\n\nHighlights of the Month:\n- Over 140+ direct inquiries completed.\n- 3D Virtual Showroom traffic increased by 320%.\n- Zero recorded complaints under our Anti-Scam Biometric Protocol.\n\nWe have 3 exclusive prime slots opening for next month. Inquire before public release!`,
        hashtags: ['#MonthlyReport', '#ExecutiveBrief', '#HighYield', '#KeyDirectEcosystem'],
        callToAction: 'Contact leadership directly via WhatsApp for VIP reservations.',
        targetChannels: ['LinkedIn Newsletter', 'Email Broadcast', 'Executive PDF Digest'],
        status: 'Ready',
        scheduledDate: '1st of Every Month',
        characterCount: 610,
      },
      {
        id: 'post-yearly-1',
        frequency: 'Yearly',
        title: 'Annual Milestone Vision & Brand Celebration',
        content: `REFLECTING ON 365 DAYS OF UNSTOPPABLE PROGRESS:\n\nWhen we launched ${biz.businessName}, the mission was simple: eliminate extortionate gatekeeper fees, empower real people, and build direct, transparent connections that endure.\n\nTo all our investors, partners, and clients: thank you for trusting our vision. The coming year brings full 3D interactive showrooms, autonomous client hunting, and nationwide digital billboard integration.\n\nThe future is direct. Welcome to the new era.`,
        hashtags: ['#AnnualMilestone', '#Vision2026', '#SimeonJrStudios', '#FutureOfBusiness'],
        callToAction: 'Read our full annual growth report on KeyDirect.',
        targetChannels: ['All Connected Channels', 'Press Release', 'Global Billboard Broadcast'],
        status: 'Scheduled',
        scheduledDate: 'Annual Anniversary',
        characterCount: 680,
      },
    ];
  };

  const marketingPipelines = generatePostPipelines(profile);
  const activePosts = marketingPipelines.filter((p) => p.frequency === activePipelineFreq);

  const handleCopyPost = (p: MarketingPost) => {
    const text = `${p.content}\n\n${p.callToAction}\n\n${p.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedPostId(p.id);
    showToast('Post content & hashtags copied to clipboard!');
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const handleToggleOffline = () => {
    const next = !offlineCached;
    setOfflineCached(next);
    toggleOfflineCache(next);
    showToast(next ? 'Google Maps & Pins cached offline in browser!' : 'Offline cache cleared.');
  };

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinName.trim() || !pinAddress.trim()) return;

    if (profile.tier === 'FREE' && mapPins.length >= 1) {
      showToast('Free tier allows 1 Map Pin. Upgrade to Pro for 5 Pins!');
      setIsUpgradeModalOpen(true);
      return;
    }

    const newPin: BusinessMapPin = {
      id: `pin-${Date.now()}`,
      name: pinName.trim(),
      category: pinCategory,
      address: pinAddress.trim(),
      city: pinCity,
      lat: pinCity === 'Abuja' ? 9.0765 : 6.4474,
      lng: pinCity === 'Abuja' ? 7.3986 : 3.4723,
      phone: pinPhone.trim(),
      description: pinDescription.trim() || 'Verified enterprise location on LazyCEO Map.',
      isVerified: true,
    };

    const updated = addBusinessMapPin(newPin);
    setMapPins(updated);
    setIsAddPinModalOpen(false);
    showToast(`Business Pin "${newPin.name}" added to Map!`);
  };

  const handleUpgradeTier = (newTier: PlanTier) => {
    const updated = { ...profile, tier: newTier };
    setProfile(updated);
    saveBusinessProfile(updated);
    setIsUpgradeModalOpen(false);
    showToast(`Upgraded to ${newTier} Plan successfully!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-stone-950 text-white rounded-3xl max-w-6xl w-full h-[94vh] overflow-hidden shadow-2xl border border-cyan-500/30 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Toast */}
        {toast && (
          <div className="absolute top-20 right-6 z-70 bg-cyan-950 border border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-in slide-in-from-top-2">
            {toast}
          </div>
        )}

        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-cyan-500/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg sm:text-xl tracking-tight text-white uppercase">
                  LazyCEO Marketing Automation
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {profile.tier} ACTIVE
                </span>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  AUTONOMOUS TALK 24/7
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Automated Daily · Weekly · Monthly · Yearly Social Marketing Pipelines for Entrepreneurs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-orange-500/20"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{profile.tier === 'ENTERPRISE' ? 'Manage Plan' : 'Upgrade Plan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 bg-stone-900/60 border-b border-stone-800 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('pipelines')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pipelines'
                ? 'bg-stone-900 text-cyan-400 border-cyan-400'
                : 'text-stone-400 hover:text-white border-transparent'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Automated Post Pipelines</span>
          </button>

          <button
            onClick={() => setIsVirtualRoomOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-t-xl text-stone-300 hover:text-white transition-all cursor-pointer border-b-2 border-transparent flex items-center gap-1.5 whitespace-nowrap hover:bg-stone-900"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Virtual Showroom</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 text-[9px] rounded-full font-bold">
              Three.js
            </span>
          </button>

          <button
            onClick={() => setIsBillboardModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-t-xl text-stone-300 hover:text-white transition-all cursor-pointer border-b-2 border-transparent flex items-center gap-1.5 whitespace-nowrap hover:bg-stone-900"
          >
            <Tv className="w-3.5 h-3.5 text-orange-400" />
            <span>Digital Billboards ($10/day)</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-stone-900 text-cyan-400 border-cyan-400'
                : 'text-stone-400 hover:text-white border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Google Maps & Offline Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-stone-900 text-cyan-400 border-cyan-400'
                : 'text-stone-400 hover:text-white border-transparent'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Accounts & Brand Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-stone-900 text-orange-400 border-orange-400'
                : 'text-stone-400 hover:text-white border-transparent'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>Plans & Tiers ($29 / $99)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. MARKETING POST PIPELINES TAB */}
          {activeTab === 'pipelines' && (
            <div className="space-y-6">
              
              {/* Profile summary banner */}
              <div className="p-4 bg-linear-to-r from-cyan-950/40 via-stone-900 to-stone-950 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-black text-base text-white">
                      {profile.businessName}
                    </h4>
                    <span className="text-xs text-stone-400">· {profile.industry}</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 max-w-xl line-clamp-1">
                    {profile.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVirtualRoomOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View in 3D Showroom</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Frequency Selector: Daily / Weekly / Monthly / Yearly */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex bg-stone-900 p-1 rounded-2xl border border-stone-800">
                  {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setActivePipelineFreq(freq)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        activePipelineFreq === freq
                          ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {freq} Pipeline
                    </button>
                  ))}
                </div>

                <div className="text-xs text-stone-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Autonomous Posting Engine Active</span>
                </div>
              </div>

              {/* Generated Posts Cards */}
              <div className="grid grid-cols-1 gap-4">
                {activePosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-stone-900/90 rounded-2xl border border-stone-800 hover:border-cyan-500/50 p-5 space-y-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 uppercase">
                            {post.frequency} Automated Post
                          </span>
                          <span className="text-[11px] text-stone-400">{post.scheduledDate}</span>
                        </div>
                        <h4 className="font-heading font-black text-base text-white">
                          {post.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopyPost(post)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-stone-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border border-stone-700"
                        title="Copy text & hashtags"
                      >
                        {copiedPostId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Post</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Post Content Body */}
                    <div className="p-4 bg-stone-950 rounded-xl border border-stone-850 text-xs text-stone-200 leading-relaxed whitespace-pre-line font-sans select-all">
                      {post.content}
                    </div>

                    {/* Call to action & hashtags */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-stone-850">
                      <div className="flex flex-wrap gap-1.5">
                        {post.hashtags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-stone-800 text-cyan-300 text-[10px] font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                        <span>Connected:</span>
                        {post.targetChannels.map((ch, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-stone-800 text-white text-[10px] font-bold">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 2. GOOGLE MAPS & OFFLINE HUB TAB */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="p-4 bg-linear-to-r from-cyan-950/30 to-stone-900 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-black text-base text-white">
                    Google Maps Integration & Offline Map Cache
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Search registered business locations, billboards, and verified properties across Nigeria with offline fallback.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleOffline}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      offlineCached
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{offlineCached ? 'Offline Cache Active' : 'Cache Maps Offline'}</span>
                  </button>

                  <button
                    onClick={() => setIsAddPinModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Add Business Pin</span>
                  </button>
                </div>
              </div>

              {/* Interactive Vector / Tile Map Display */}
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden h-[420px] relative flex flex-col">
                <div className="p-3 bg-stone-850 border-b border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span className="font-bold text-white">Google Maps Satellite & Street Vectors</span>
                    {offlineCached && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        OFFLINE SYNCHRONIZED
                      </span>
                    )}
                  </div>
                  <span className="text-stone-400 text-[11px]">{mapPins.length} Active Pins Loaded</span>
                </div>

                {/* Map Visual Simulation with Pins */}
                <div className="flex-1 relative bg-stone-950 flex items-center justify-center overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full text-stone-850 stroke-stone-800" fill="none">
                    <path d="M-50,150 Q300,250 600,180 T1200,300" strokeWidth="40" stroke="#101826" />
                    <path d="M50,450 Q400,380 800,490 T1400,420" strokeWidth="60" stroke="#0e1522" />
                    <circle cx="350" cy="220" r="180" fill="rgba(0, 240, 255, 0.03)" />
                    <circle cx="750" cy="300" r="220" fill="rgba(255, 107, 0, 0.03)" />
                  </svg>

                  {/* Pin Markers */}
                  {mapPins.map((pin, index) => {
                    const coords = [
                      { left: '32%', top: '45%' },
                      { left: '62%', top: '35%' },
                      { left: '48%', top: '65%' },
                      { left: '75%', top: '55%' },
                    ];
                    const pos = coords[index % coords.length];

                    return (
                      <div
                        key={pin.id}
                        style={{ left: pos.left, top: pos.top }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                      >
                        <div className="w-9 h-9 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold shadow-lg shadow-cyan-500/40 hover:scale-110 transition-transform">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="font-bold text-white">{pin.name}</div>
                          <div className="text-[10px] text-cyan-300">{pin.address}, {pin.city}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pins Directory List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mapPins.map((pin) => (
                  <div key={pin.id} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">{pin.category}</span>
                      <span className="text-[10px] text-stone-500">{pin.city}</span>
                    </div>
                    <h5 className="font-heading font-black text-sm text-white">{pin.name}</h5>
                    <p className="text-stone-400 text-[11px]">{pin.description}</p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-850">
                      <span>{pin.address}</span>
                      <a
                        href={`https://wa.me/${pin.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 font-bold hover:underline"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SOCIAL ACCOUNTS & BRAND PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-5 bg-stone-900 rounded-3xl border border-stone-800 space-y-4">
                <h4 className="font-heading font-black text-base text-white">
                  Business Profile & Brand Identity
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={profile.businessName}
                      onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Tagline / Unique Selling Proposition
                    </label>
                    <input
                      type="text"
                      value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Target Audience & Customer Profile
                    </label>
                    <textarea
                      rows={2}
                      value={profile.targetAudience}
                      onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-white outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <h5 className="font-heading font-black text-sm text-white mb-3">
                    Connected Social Media Accounts
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {(['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'youtube'] as const).map((platform) => (
                      <div key={platform} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                        <div className="flex items-center justify-between text-stone-400 uppercase text-[10px] font-bold">
                          <span>{platform}</span>
                          <span className="text-emerald-400">Connected</span>
                        </div>
                        <input
                          type="text"
                          value={profile.connectedAccounts[platform] || ''}
                          onChange={(e) => {
                            const updated = {
                              ...profile.connectedAccounts,
                              [platform]: e.target.value,
                            };
                            setProfile({ ...profile, connectedAccounts: updated });
                          }}
                          placeholder={`@your_${platform}`}
                          className="w-full bg-stone-900 border border-stone-750 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-cyan-400 font-mono text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    saveBusinessProfile(profile);
                    showToast('Business profile & social accounts saved!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

          {/* 4. PRICING & TIERS TAB ($29 / $99) */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                  Transparent Pricing
                </span>
                <h4 className="font-heading font-black text-2xl sm:text-3xl text-white">
                  Choose Your LazyCEO Growth Plan
                </h4>
                <p className="text-xs text-stone-400">
                  Automate your business talking point 24/7/365 across Nigeria and global digital networks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* FREE TIER */}
                <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${
                  profile.tier === 'FREE' ? 'bg-stone-900 border-cyan-400 shadow-xl' : 'bg-stone-900/60 border-stone-800'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-base text-stone-300">Starter</span>
                      {profile.tier === 'FREE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-heading font-black text-3xl text-white">$0</span>
                      <span className="text-xs text-stone-500"> / forever free</span>
                    </div>
                    <ul className="space-y-2 text-xs text-stone-300">
                      <li className="flex items-center gap-2">✓ 1 Social Account connected</li>
                      <li className="flex items-center gap-2">✓ Daily automated text updates</li>
                      <li className="flex items-center gap-2">✓ 2 Virtual Room photo uploads</li>
                      <li className="flex items-center gap-2">✓ 1 Verified Map Pin</li>
                      <li className="flex items-center gap-2 text-stone-500">✕ Video screen uploads</li>
                      <li className="flex items-center gap-2 text-stone-500">✕ Digital Billboard credits</li>
                    </ul>
                  </div>

                  <button
                    disabled={profile.tier === 'FREE'}
                    onClick={() => handleUpgradeTier('FREE')}
                    className="w-full py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 font-bold text-xs disabled:opacity-50 cursor-pointer"
                  >
                    {profile.tier === 'FREE' ? 'Current Plan' : 'Downgrade to Free'}
                  </button>
                </div>

                {/* PRO TIER ($29/mo) */}
                <div className={`p-6 rounded-3xl border-2 flex flex-col justify-between space-y-6 relative ${
                  profile.tier === 'PRO' ? 'bg-stone-900 border-orange-500 shadow-2xl shadow-orange-500/20' : 'bg-stone-900 border-orange-500/60'
                }`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-black text-lg text-white">LazyCEO Pro</span>
                      {profile.tier === 'PRO' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-heading font-black text-4xl text-white">$29</span>
                      <span className="text-xs text-stone-400"> / month</span>
                    </div>
                    <ul className="space-y-2 text-xs text-stone-200">
                      <li className="flex items-center gap-2 font-bold text-orange-300">✓ Unlimited Social Accounts</li>
                      <li className="flex items-center gap-2 font-bold text-orange-300">✓ Daily, Weekly, Monthly, Yearly Pipelines</li>
                      <li className="flex items-center gap-2">✓ Full 3D Virtual Room with Video Support</li>
                      <li className="flex items-center gap-2">✓ 5 Business Map Pins with Offline Sync</li>
                      <li className="flex items-center gap-2">✓ 1 Free Digital Billboard slot / month</li>
                      <li className="flex items-center gap-2">✓ Automated WhatsApp Direct Connect</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgradeTier('PRO')}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {profile.tier === 'PRO' ? 'Active Plan (Selected)' : 'Upgrade to Pro ($29/mo)'}
                  </button>
                </div>

                {/* ENTERPRISE TIER ($99/mo) */}
                <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 ${
                  profile.tier === 'ENTERPRISE' ? 'bg-stone-900 border-cyan-400 shadow-xl' : 'bg-stone-900/60 border-stone-800'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-base text-stone-300">Enterprise</span>
                      {profile.tier === 'ENTERPRISE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-heading font-black text-3xl text-white">$99</span>
                      <span className="text-xs text-stone-500"> / month</span>
                    </div>
                    <ul className="space-y-2 text-xs text-stone-300">
                      <li className="flex items-center gap-2 font-bold text-cyan-300">✓ Dedicated Autonomous Marketing Agent</li>
                      <li className="flex items-center gap-2 font-bold text-cyan-300">✓ Unlimited Digital Billboards</li>
                      <li className="flex items-center gap-2">✓ Priority Map Placement with 3D Pins</li>
                      <li className="flex items-center gap-2">✓ Automated Customer Chatbot Integration</li>
                      <li className="flex items-center gap-2">✓ Custom Domain Whitelabel Showroom</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgradeTier('ENTERPRISE')}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all cursor-pointer"
                  >
                    {profile.tier === 'ENTERPRISE' ? 'Active Plan (Selected)' : 'Select Enterprise ($99/mo)'}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* 3D Virtual Room Embedded Modal */}
        <VirtualRoom3D
          isOpen={isVirtualRoomOpen}
          onClose={() => setIsVirtualRoomOpen(false)}
          businessProfile={profile}
          onRequireUpgrade={() => {
            setIsVirtualRoomOpen(false);
            setActiveTab('pricing');
          }}
        />

        {/* Billboard Modal */}
        <DigitalBillboardModal
          isOpen={isBillboardModalOpen}
          onClose={() => setIsBillboardModalOpen(false)}
        />

        {/* Add Map Pin Modal */}
        {isAddPinModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div 
              className="bg-stone-900 text-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-cyan-500/40 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h4 className="font-heading font-black text-base text-white">Add Business Map Pin</h4>
                <button onClick={() => setIsAddPinModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={pinName}
                    onChange={(e) => setPinName(e.target.value)}
                    placeholder="e.g. Lekki Luxury Event Lounge"
                    className="w-full bg-stone-800 border border-stone-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">City</label>
                    <select
                      value={pinCity}
                      onChange={(e) => setPinCity(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                    >
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Port Harcourt">Port Harcourt</option>
                      <option value="Ibadan">Ibadan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={pinPhone}
                      onChange={(e) => setPinPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full bg-stone-800 border border-stone-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={pinAddress}
                    onChange={(e) => setPinAddress(e.target.value)}
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    className="w-full bg-stone-800 border border-stone-750 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={pinDescription}
                    onChange={(e) => setPinDescription(e.target.value)}
                    placeholder="Describe your services or physical showroom..."
                    className="w-full bg-stone-800 border border-stone-750 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl uppercase text-xs cursor-pointer shadow-md"
                >
                  Publish Pin to Map
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
