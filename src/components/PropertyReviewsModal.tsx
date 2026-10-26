import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Sparkles, 
  Filter, 
  Plus, 
  Zap,
  Building,
  Calendar,
  Lock,
  Tag
} from 'lucide-react';
import { PropertyReview, Property, UserRole } from '../types';

interface PropertyReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: PropertyReview[];
  properties: Property[];
  onAddReview: (review: PropertyReview) => void;
  selectedPropertyForReview?: Property | null;
  onSelectProperty?: (prop: Property) => void;
  onOpenSafePay?: (property: Property) => void;
}

export const PropertyReviewsModal: React.FC<PropertyReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  properties,
  onAddReview,
  selectedPropertyForReview = null,
  onSelectProperty,
  onOpenSafePay,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'write'>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterPropertyId, setFilterPropertyId] = useState<string>(selectedPropertyForReview?.id || 'all');

  // Form State
  const [formPropertyId, setFormPropertyId] = useState<string>(selectedPropertyForReview?.id || properties[0]?.id || '');
  const [overallRating, setOverallRating] = useState<number>(5);
  const [accuracyRating, setAccuracyRating] = useState<number>(5);
  const [responsivenessRating, setResponsivenessRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [transactionType, setTransactionType] = useState<PropertyReview['transactionType']>('Apartment Lease');
  const [transactionRef, setTransactionRef] = useState<string>(`KD-TX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [headline, setHeadline] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [inspectionFeeSaved, setInspectionFeeSaved] = useState<number>(15000);
  const [commissionSaved, setCommissionSaved] = useState<number>(250000);
  const [selectedPros, setSelectedPros] = useState<string[]>(['Accurate 360 Tour', 'Saved ₦10k+ Inspection Fee']);
  const [renterName, setRenterName] = useState<string>('Verified Renter (Afolabi)');

  if (!isOpen) return null;

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    if (filterPropertyId !== 'all' && rev.propertyId !== filterPropertyId) return false;
    if (filterRating !== 'all' && rev.overallRating !== filterRating) return false;
    return true;
  });

  // Calculate aggregated stats
  const totalReviewsCount = reviews.length;
  const avgOverall = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';
  const totalInspectionSaved = reviews.reduce((acc, r) => acc + (r.inspectionFeeSavedNgn || 10000), 0);
  const totalCommissionSaved = reviews.reduce((acc, r) => acc + (r.commissionSavedNgn || 0), 0);

  const availablePros = [
    'Accurate 360 Tour',
    'Saved ₦10k+ Inspection Fee',
    'Direct Owner (0% Fee)',
    'Immediate Key Handover',
    'No Hidden Charges',
    'Quiet Area & No Harassment',
    'Industrial Generator 24/7',
    'Clean Heated Pool',
  ];

  const handleTogglePro = (pro: string) => {
    if (selectedPros.includes(pro)) {
      setSelectedPros(selectedPros.filter(p => p !== pro));
    } else {
      setSelectedPros([...selectedPros, pro]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !reviewText.trim()) return;

    const targetProp = properties.find(p => p.id === formPropertyId) || properties[0];

    const newReview: PropertyReview = {
      id: `rev-${Date.now()}`,
      propertyId: targetProp.id,
      propertyTitle: targetProp.title,
      propertyCategory: targetProp.category,
      propertyImage: targetProp.images[0],
      ownerId: targetProp.owner.id,
      ownerName: targetProp.owner.name,
      ownerRole: targetProp.owner.role,
      renterId: `rnt-${Math.floor(100 + Math.random() * 900)}`,
      renterName: renterName.trim() || 'Verified Renter',
      renterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      overallRating,
      accuracyRating,
      responsivenessRating,
      valueRating,
      transactionType,
      isVerifiedTransaction: true,
      transactionRef,
      inspectionFeeSavedNgn: Number(inspectionFeeSaved) || 10000,
      commissionSavedNgn: Number(commissionSaved) || 0,
      stayOrDealDate: 'April 2026',
      headline,
      reviewText,
      pros: selectedPros,
      helpfulVotes: 1,
      createdAt: 'Just now',
    };

    onAddReview(newReview);
    setActiveTab('all');
    setHeadline('');
    setReviewText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg sm:text-xl text-stone-900 tracking-tight">
                  Verified Renter Reviews & Ratings
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Verified Deals
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Only authenticated renters who completed escrow transactions can rate owners and properties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'all' ? 'write' : 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'write'
                  ? 'bg-stone-900 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'write' ? 'Browse Reviews' : 'Leave a Review'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {activeTab === 'all' ? (
            <>
              {/* Trust Scorecard Summary */}
              <div className="bg-linear-to-r from-stone-950 via-stone-900 to-red-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Big Rating Star */}
                <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0">
                    <span className="font-heading font-black text-3xl text-amber-400">{avgOverall}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">Platform Trust Score</h4>
                    <p className="text-xs text-stone-300">
                      Based on {totalReviewsCount} verified completed leases, party bookings, and land deals.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Zero Fake Reviews
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> SafePay Escrow Backed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings Counters */}
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <div className="text-[10px] uppercase font-bold text-stone-300 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-red-400" />
                      Inspection Fees Avoided
                    </div>
                    <div className="font-heading font-black text-base sm:text-lg text-emerald-400">
                      ₦{totalInspectionSaved.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-300">Saved via Free 360° Virtual Look</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <div className="text-[10px] uppercase font-bold text-stone-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Agent Fees Avoided
                    </div>
                    <div className="font-heading font-black text-base sm:text-lg text-white">
                      ₦{totalCommissionSaved.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-300">10% Agency commission eliminated</div>
                  </div>
                </div>

              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <Filter className="w-3.5 h-3.5 text-red-500" />
                  <span>Filter by Property:</span>
                  <select
                    value={filterPropertyId}
                    onChange={(e) => setFilterPropertyId(e.target.value)}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-800 outline-none focus:border-red-500"
                  >
                    <option value="all">All Properties ({reviews.length})</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title.substring(0, 38)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-stone-500">Stars:</span>
                  {[5, 4, 3].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        filterRating === stars
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      <span>{stars}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                  ))}
                  {filterRating !== 'all' && (
                    <button
                      onClick={() => setFilterRating('all')}
                      className="text-[11px] text-stone-500 hover:text-red-500 underline ml-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-300">
                    <Star className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="font-bold text-stone-700">No verified reviews found for this filter.</p>
                    <p className="text-xs text-stone-400 mt-1">Be the first verified tenant to leave a review!</p>
                    <button
                      onClick={() => setActiveTab('write')}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer"
                    >
                      Leave a Verified Review
                    </button>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all space-y-3"
                    >
                      
                      {/* Top Row: Renter identity + Verified Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.renterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                            alt={rev.renterName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-black text-sm text-stone-900">{rev.renterName}</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Verified Renter
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-2">
                              <span>Deal Ref: <strong className="text-stone-700">{rev.transactionRef}</strong></span>
                              <span>·</span>
                              <span>{rev.transactionType}</span>
                              <span>·</span>
                              <span>{rev.stayOrDealDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.overallRating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                              }`}
                            />
                          ))}
                          <span className="font-black text-xs text-amber-700 ml-1">{rev.overallRating}.0</span>
                        </div>
                      </div>

                      {/* Property Title Tag */}
                      <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 truncate">
                          Property: {rev.propertyTitle}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-500 uppercase shrink-0">
                          Landlord: {rev.ownerName} ({rev.ownerRole})
                        </span>
                      </div>

                      {/* Headline & Body */}
                      <div>
                        <h4 className="font-heading font-black text-sm text-stone-900 mb-1">
                          "{rev.headline}"
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {rev.reviewText}
                        </p>
                      </div>

                      {/* Badges: Savings & Pros */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {rev.inspectionFeeSavedNgn > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black flex items-center gap-1">
                            <Zap className="w-3 h-3 text-emerald-600" />
                            Saved ₦{rev.inspectionFeeSavedNgn.toLocaleString()} Inspection Fee
                          </span>
                        )}
                        {rev.commissionSavedNgn > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-black flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-indigo-600" />
                            Saved ₦{rev.commissionSavedNgn.toLocaleString()} Agent Fee
                          </span>
                        )}
                        {rev.pros?.map((pro, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                            ✓ {pro}
                          </span>
                        ))}
                      </div>

                      {/* Sub-Ratings Matrix */}
                      <div className="grid grid-cols-3 gap-2 bg-stone-50/80 p-2.5 rounded-xl text-[11px] text-stone-600 font-medium">
                        <div>
                          360° Virtual Tour Accuracy: <strong className="text-stone-900">{rev.accuracyRating}/5</strong>
                        </div>
                        <div>
                          Owner Responsiveness: <strong className="text-stone-900">{rev.responsivenessRating}/5</strong>
                        </div>
                        <div>
                          Value for Money: <strong className="text-stone-900">{rev.valueRating}/5</strong>
                        </div>
                      </div>

                      {/* Owner Reply if available */}
                      {rev.ownerResponse && (
                        <div className="mt-2 bg-stone-100/90 rounded-2xl p-3 border-l-4 border-red-600 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                            <span>Response from Landlord ({rev.ownerName}):</span>
                            <span className="text-[10px] text-stone-400 font-normal ml-auto">
                              {rev.ownerResponse.respondedAt}
                            </span>
                          </div>
                          <p className="text-stone-600 italic">"{rev.ownerResponse.text}"</p>
                        </div>
                      )}

                      {/* Helpful votes */}
                      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-100">
                        <span>Posted {rev.createdAt}</span>
                        <button
                          onClick={() => {
                            rev.helpfulVotes = (rev.helpfulVotes || 0) + 1;
                            rev.userVotedHelpful = true;
                          }}
                          className={`flex items-center gap-1 font-bold text-xs transition-colors cursor-pointer ${
                            rev.userVotedHelpful ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({rev.helpfulVotes || 0})</span>
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Write Review Form */
            <form onSubmit={handleSubmitReview} className="space-y-5 bg-stone-50 p-5 sm:p-6 rounded-3xl border border-stone-200">
              
              <div className="border-b border-stone-200 pb-4">
                <h4 className="font-heading font-black text-base text-stone-900">
                  Write a Verified Renter Review
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Your review directly protects fellow Nigerians from unfair ₦10,000 inspection fees, scam deposits, and dishonest landlords.
                </p>
              </div>

              {/* Select Property */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Select Property You Rented / Inspected:
                </label>
                <select
                  value={formPropertyId}
                  onChange={(e) => setFormPropertyId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-none focus:border-red-500"
                  required
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {p.title} ({p.neighbourhood}, {p.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Renter Details & Transaction Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Your Name / Organization:
                  </label>
                  <input
                    type="text"
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    placeholder="e.g. Dr. Kelechi Nwosu"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Verified Transaction Reference:
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Transaction Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Apartment Lease', 'Party Booking', 'Event Center Hire', 'Room Rental', 'Land Purchase', 'Commercial Lease'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setTransactionType(type)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        transactionType === type
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:border-red-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Ratings Matrix */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Overall Satisfaction:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className="cursor-pointer p-0.5"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-bold text-xs text-amber-700 ml-1">{overallRating} Stars</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">360° Virtual Look Accuracy (Did reality match the tour?):</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setAccuracyRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= accuracyRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Landlord Direct Communication & Courtesy:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setResponsivenessRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= responsivenessRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Fair Price & Value for Money:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setValueRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= valueRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Financial Savings Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Inspection Fee Saved (₦):
                  </label>
                  <input
                    type="number"
                    value={inspectionFeeSaved}
                    onChange={(e) => setInspectionFeeSaved(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-red-500 font-semibold"
                    placeholder="15000"
                  />
                  <span className="text-[10px] text-stone-500">Normal Lagos/Abuja agent physical inspection charge avoided.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Agent Commission Saved (₦):
                  </label>
                  <input
                    type="number"
                    value={commissionSaved}
                    onChange={(e) => setCommissionSaved(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-red-500 font-semibold"
                    placeholder="300000"
                  />
                  <span className="text-[10px] text-stone-500">10% agency middleman fee you avoided by dealing directly.</span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Review Headline:
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. 100% soundproof party penthouse, zero agent fee, smooth direct deal!"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-bold outline-none focus:border-red-500"
                  required
                />
              </div>

              {/* Detailed Review Text */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Detailed Experience & Condition of Property:
                </label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Describe your inspection, the live video call with owner, handover of keys, generator power, security, and whether everything was transparent..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 outline-none focus:border-red-500 leading-relaxed"
                  required
                />
              </div>

              {/* Highlights Chips */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Select Key Highlights (Pros):
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePros.map((pro) => (
                    <button
                      type="button"
                      key={pro}
                      onClick={() => handleTogglePro(pro)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedPros.includes(pro)
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-300 hover:border-emerald-500'
                      }`}
                    >
                      {selectedPros.includes(pro) ? '✓ ' : '+ '}
                      {pro}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Publish Verified Review</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
