import React, { useState } from 'react';
import { 
  X, 
  Tv, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  Sparkles,
  MapPin,
  Clock,
  MessageCircle,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { 
  BillboardSlot, 
  getBillboardSlots, 
  publishToBillboardSlot,
  getBusinessProfile
} from '../utils/lazyCeoStorage';
import { Property } from '../types';

interface DigitalBillboardModalProps {
  properties?: Property[];
  isOpen: boolean;
  onClose: () => void;
  currentCurrency?: string;
  onOpenPublisherPortal?: () => void;
  onSelectProperty?: (property: Property) => void;
  onOpenChat?: (property: Property) => void;
  customBusinesses?: any[];
}

export const DigitalBillboardModal: React.FC<DigitalBillboardModalProps> = ({
  properties = [],
  isOpen,
  onClose,
  currentCurrency = 'NGN',
  onOpenPublisherPortal,
  onSelectProperty,
  onOpenChat,
  customBusinesses,
}) => {
  const [billboardSlots, setBillboardSlots] = useState<BillboardSlot[]>(() => getBillboardSlots());
  const [selectedSlotForRent, setSelectedSlotForRent] = useState<BillboardSlot | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'available'>('available');

  // Ad Publishing Form State
  const [bizName, setBizName] = useState('');
  const [bizTagline, setBizTagline] = useState('');
  const [bizCategory, setBizCategory] = useState('Real Estate & Venues');
  const [bannerUrl, setBannerUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('https://');
  const [whatsappNumber, setWhatsappNumber] = useState('+234 803 999 1122');
  const [duration, setDuration] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pricing Matrix
  const PRICING = {
    Daily: { usd: 10, ngn: 15000, label: '$10 / Day' },
    Weekly: { usd: 50, ngn: 75000, label: '$50 / Week (Save 28%)' },
    Monthly: { usd: 180, ngn: 270000, label: '$180 / Month (Save 40%)' },
  };

  const currentRate = PRICING[duration];

  const handlePublishAd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!selectedSlotForRent) return;
    if (!bizName.trim() || !bannerUrl.trim()) {
      setErrorNotice('Please provide your business name and promotional banner image URL.');
      return;
    }

    const updated = publishToBillboardSlot(selectedSlotForRent.id, {
      businessName: bizName.trim(),
      tagline: bizTagline.trim() || 'Premier Verified Business Partner',
      bannerUrl: bannerUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      category: bizCategory,
      websiteUrl: websiteUrl.trim(),
      whatsappNumber: whatsappNumber.trim(),
      duration,
      priceUsd: currentRate.usd,
      priceNgn: currentRate.ngn,
    });

    setBillboardSlots(updated);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedSlotForRent(null);
      setActiveTab('live');
    }, 1500);
  };

  const occupiedSlots = billboardSlots.filter((s) => s.isOccupied);
  const availableSlots = billboardSlots.filter((s) => !s.isOccupied);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-stone-950 text-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-orange-500/30 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg tracking-tight text-white uppercase">
                  Digital Billboard Network
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  LIVE SPACES
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Self-Service Digital Billboards · Starting at $10/day (₦15,000)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (availableSlots.length > 0) {
                  setSelectedSlotForRent(availableSlots[0]);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Rent Billboard Slot</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-stone-900/50 border-b border-stone-800 shrink-0">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'available'
                ? 'bg-stone-900 text-orange-400 border-orange-500'
                : 'text-stone-400 hover:text-white border-transparent'
            }`}
          >
            <span>Available Slots ({availableSlots.length})</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-bold">
              Open to Rent
            </span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'live'
                ? 'bg-stone-900 text-orange-400 border-orange-500'
                : 'text-stone-400 hover:text-white border-transparent'
            }`}
          >
            <span>Active Broadcasts ({occupiedSlots.length})</span>
            {occupiedSlots.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* AVAILABLE SLOTS VIEW */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              <div className="p-4 bg-linear-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-black text-base text-white">
                    Claim Prime Digital Billboard Exposure
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Upload your promotional banner or video, choose your broadcast schedule, and publish instantly.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <div className="bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                    <span className="text-stone-400 block text-[10px]">Daily Rate</span>
                    <strong className="text-white font-bold">$10 / ₦15,000</strong>
                  </div>
                  <div className="bg-stone-900 px-3 py-1.5 rounded-xl border border-orange-500/40">
                    <span className="text-orange-400 block text-[10px]">Weekly Pass</span>
                    <strong className="text-orange-300 font-bold">$50 / ₦75,000</strong>
                  </div>
                </div>
              </div>

              {availableSlots.length === 0 ? (
                <div className="p-12 text-center bg-stone-900/50 rounded-2xl border border-stone-800">
                  <p className="text-sm text-stone-400">All billboard positions are currently broadcasting live.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-stone-900 rounded-2xl border border-stone-800 hover:border-orange-500/50 p-5 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-stone-800 text-stone-300 uppercase">
                            Slot #{slot.slotNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Available Now
                          </span>
                        </div>

                        <h4 className="font-heading font-bold text-base text-white">
                          {slot.title}
                        </h4>

                        <p className="text-xs text-stone-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span>{slot.location}</span>
                        </p>
                      </div>

                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 flex items-center justify-between text-xs">
                        <span className="text-stone-400">From $10 / Day</span>
                        <span className="text-orange-400 font-bold">HD Video & Banner</span>
                      </div>

                      <button
                        onClick={() => setSelectedSlotForRent(slot)}
                        className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload & Claim Slot</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE BROADCASTS VIEW */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              {occupiedSlots.length === 0 ? (
                <div className="p-12 text-center bg-stone-900/50 rounded-2xl border border-stone-800 space-y-3">
                  <Tv className="w-10 h-10 text-stone-600 mx-auto" />
                  <h4 className="font-heading font-bold text-base text-white">No active broadcasts currently running</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Be the first business to launch your commercial across our digital network!
                  </p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-black font-bold text-xs cursor-pointer"
                  >
                    View Available Slots
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {occupiedSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-stone-900 rounded-3xl border border-orange-500/40 overflow-hidden shadow-xl flex flex-col"
                    >
                      <div className="relative aspect-16/9 bg-black overflow-hidden">
                        <img
                          src={slot.bannerUrl}
                          alt={slot.businessName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-orange-400 border border-orange-500/40">
                          BROADCASTING LIVE
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-stone-300">
                          Active until {slot.expiresAt}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase">
                              {slot.category}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {slot.location}
                            </span>
                          </div>
                          <h4 className="font-heading font-black text-lg text-white mt-1">
                            {slot.businessName}
                          </h4>
                          <p className="text-xs text-stone-300 mt-1">
                            {slot.tagline}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                          <a
                            href={`https://wa.me/${slot.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I saw your billboard on KeyDirect / LazyCEO: "${slot.businessName}"`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {slot.websiteUrl && slot.websiteUrl !== 'https://' && (
                            <a
                              href={slot.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Visit Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Claim / Rent Ad Modal */}
        {selectedSlotForRent && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
            <div 
              className="bg-stone-900 text-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-orange-500/50 relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 bg-stone-850 flex items-center justify-between border-b border-stone-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base text-white">
                      Publish to {selectedSlotForRent.title}
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Location: {selectedSlotForRent.location}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSlotForRent(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSuccess ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-white">
                    Billboard Published Live!
                  </h4>
                  <p className="text-xs text-stone-400">
                    Your ad is now actively broadcasting in high definition across the digital billboard network.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePublishAd} className="p-6 space-y-4 text-xs">
                  {errorNotice && (
                    <div className="p-3 bg-red-950 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorNotice}</span>
                    </div>
                  )}

                  {/* Dynamic Duration & Pricing Calculator */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                      Select Campaign Duration & Billing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Daily', 'Weekly', 'Monthly'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            duration === d
                              ? 'bg-orange-500/20 border-orange-400 text-orange-300 font-bold shadow-md'
                              : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750'
                          }`}
                        >
                          <div className="font-heading font-bold text-sm text-white">{d}</div>
                          <div className="text-[11px] text-orange-400 mt-0.5">
                            ${PRICING[d].usd} / ₦{PRICING[d].ngn.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Business or Product Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Velocity Luxury Event Marquee"
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Headline / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,500 Guest Grand Ballroom · Soundproof with 24/7 Power"
                      value={bizTagline}
                      onChange={(e) => setBizTagline(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  {/* Banner Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                      Billboard Banner Image URL (16:9 HD)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-orange-400 font-mono text-xs"
                    />

                    {/* Direct Upload & Presets */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs font-bold transition-all cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Banner from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (typeof event.target?.result === 'string') {
                                setBannerUrl(event.target.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setBannerUrl('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80')}
                        className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-[10px] text-orange-300 rounded cursor-pointer whitespace-nowrap"
                      >
                        Event Center Preset
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerUrl('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80')}
                        className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-[10px] text-orange-300 rounded cursor-pointer whitespace-nowrap"
                      >
                        Penthouse Preset
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                        WhatsApp Contact
                      </label>
                      <input
                        type="text"
                        required
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-400 uppercase mb-1">
                        Website (Optional)
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Space Fee</span>
                      <strong className="text-white text-base">${currentRate.usd} (₦{currentRate.ngn.toLocaleString()})</strong>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      Instant Live Activation
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold rounded-xl shadow-lg shadow-orange-500/25 uppercase tracking-wider text-xs transition-all cursor-pointer"
                  >
                    Confirm & Publish Ad to Billboard
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
