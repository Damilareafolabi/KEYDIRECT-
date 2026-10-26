import React, { useState } from 'react';
import { 
  X, 
  Building, 
  FileCheck, 
  PlusCircle, 
  Tv, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  Zap, 
  Users, 
  DollarSign,
  PartyPopper,
  MapPin
} from 'lucide-react';
import { Property, PropertyCategory, ListingType, LandAction, UserRole, BusinessBillboardAd } from '../types';

interface PublisherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; role: UserRole; email: string } | null;
  properties: Property[];
  onAddProperty: (newProp: Property) => void;
  onAddBillboardAd: (ad: BusinessBillboardAd) => void;
  currentCurrency: string;
}

export const PublisherPortalModal: React.FC<PublisherPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  properties,
  onAddProperty,
  onAddBillboardAd,
  currentCurrency,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'kyc' | 'publish-prop' | 'publish-billboard'>('listings');

  // KYC Verification State
  const [ninNumber, setNinNumber] = useState('19283746501');
  const [bvnNumber, setBvnNumber] = useState('22334455667');
  const [cacNumber, setCacNumber] = useState('RC-1849204');
  const [titleDocType, setTitleDocType] = useState('Certificate of Occupancy (C of O)');
  const [docUploaded, setDocUploaded] = useState(true);
  const [kycSuccessNotice, setKycSuccessNotice] = useState(false);

  // New Property Form State
  const [listingCategory, setListingCategory] = useState<PropertyCategory>('Party Apartments');
  const [listingType, setListingType] = useState<ListingType>('Direct Owner');
  const [landAction, setLandAction] = useState<LandAction>('Buy Land');
  const [propTitle, setPropTitle] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState<any>('per night');
  const [propState, setPropState] = useState('Lagos');
  const [propNeighbourhood, setPropNeighbourhood] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [guestCapacity, setGuestCapacity] = useState('50');
  const [allowsDj, setAllowsDj] = useState(true);
  const [allowsPoolParty, setAllowsPoolParty] = useState(true);
  const [propDescription, setPropDescription] = useState('');

  // Business Billboard Ad Form State
  const [bizName, setBizName] = useState('');
  const [bizTagline, setBizTagline] = useState('');
  const [bizCategory, setBizCategory] = useState<any>('Party & Event Planning');
  const [bizWhatsapp, setBizWhatsapp] = useState('+234 800 000 0000');
  const [bizWebsite, setBizWebsite] = useState('https://');
  const [bizTargetCity, setBizTargetCity] = useState('Lagos & Abuja');
  const [bizDescription, setBizDescription] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propPrice || !propNeighbourhood) return;

    const numPrice = parseFloat(propPrice.replace(/[^0-9.]/g, '')) || 250000;

    const newProp: Property = {
      id: `kd-pub-${Date.now()}`,
      title: propTitle,
      slug: propTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: propDescription || `Direct verified listing in ${propNeighbourhood}, ${propState}. Certified by KeyDirect KYC framework.`,
      category: listingCategory,
      listingType,
      landAction: listingCategory === 'Plots / Land' ? landAction : undefined,
      baseCurrency: currentCurrency === 'USD' ? 'USD' : 'NGN',
      basePrice: numPrice,
      pricePeriod: listingCategory === 'Party Apartments' ? 'per night' : listingCategory === 'Event Centers' ? 'per event' : pricePeriod,
      bedrooms: listingCategory === 'Party Apartments' ? 3 : 0,
      bathrooms: 3,
      state: propState,
      lga: 'Eti-Osa',
      neighbourhood: propNeighbourhood,
      address: propAddress || `${propNeighbourhood}, ${propState}`,
      latitude: 6.4474,
      longitude: 3.4723,
      images: [
        listingCategory === 'Party Apartments'
          ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
          : listingCategory === 'Event Centers'
          ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
          : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      ],
      isVerifiedListing: true,
      verification: {
        isNinVerified: true,
        isBvnVerified: true,
        documentType: 'C of O',
        verificationStatus: 'Approved',
        verifiedAt: new Date().toISOString().split('T')[0],
        inspectorName: 'SimeonJrStudios Verification Board',
        kycTier: 'Tier 2 Government Title Audited',
      },
      eventSpecs: (listingCategory === 'Party Apartments' || listingCategory === 'Event Centers') ? {
        guestCapacity: parseInt(guestCapacity) || 50,
        allowsPartyDj: allowsDj,
        allowsPoolParty: allowsPoolParty,
        hasIndustrialGenerator: true,
      } : undefined,
      owner: {
        id: `usr-${Date.now()}`,
        name: currentUser?.name || 'Verified Publisher',
        role: currentUser?.role || 'Owner',
        phone: '+234 803 123 4567',
        isVerified: true,
        rating: 5.0,
        responseTime: 'Under 5 mins',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      amenities: ['24/7 Power Support', 'KYC Verified Documents', 'Zero Commission Direct'],
      featuredInBillboard: true,
      viewsCount: 1,
      inquiriesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProperty(newProp);
    showNotice(`"${propTitle}" published successfully to KeyDirect!`);
    setActiveTab('listings');
  };

  const handleCreateBillboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !bizTagline) return;

    const newAd: BusinessBillboardAd = {
      id: `bb-${Date.now()}`,
      businessName: bizName,
      tagline: bizTagline,
      category: bizCategory,
      description: bizDescription || `${bizName} is verified on KeyDirect for premium services.`,
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      whatsappNumber: bizWhatsapp,
      websiteUrl: bizWebsite,
      targetCity: bizTargetCity,
      badge: 'Verified Business',
      views: 120,
      clicks: 14,
      ownerName: currentUser?.name || 'Business Partner',
    };

    onAddBillboardAd(newAd);
    showNotice(`Billboard Ad for "${bizName}" is now LIVE on Digital Billboard!`);
    setActiveTab('listings');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg tracking-tight">
                  Property & Business Publisher Portal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  KYC Tier 2 Verified
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Publish Party Apartments, Event Centers, Land for Rent/Buy, & Digital Billboard Ads
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 bg-stone-100 border-b border-stone-200 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 ${
              activeTab === 'listings'
                ? 'bg-white text-red-600 border-red-600 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            My Published Listings ({properties.length})
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'kyc'
                ? 'bg-white text-red-600 border-red-600 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>KYC Document Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('publish-prop')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'publish-prop'
                ? 'bg-white text-red-600 border-red-600 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-red-600" />
            <span>+ Publish Property / Party / Land</span>
          </button>

          <button
            onClick={() => setActiveTab('publish-billboard')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'publish-billboard'
                ? 'bg-white text-red-600 border-red-600 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Publish Business Billboard Ad</span>
          </button>
        </div>

        {/* Portal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          
          {notification && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* TAB 1: LISTINGS MANAGEMENT */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-black text-lg text-stone-900">
                    Live Published Inventory
                  </h4>
                  <p className="text-xs text-stone-500">
                    All listings published directly under your account with 0% commission verified status.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('publish-prop')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Listing</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((prop) => (
                  <div key={prop.id} className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex gap-3 items-center">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden flex-1 text-xs">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-50 text-red-600">
                          {prop.category}
                        </span>
                        {prop.landAction && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                            {prop.landAction}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-700 font-bold ml-auto">
                          Active
                        </span>
                      </div>
                      <div className="font-bold text-stone-900 truncate">{prop.title}</div>
                      <div className="text-stone-500 text-[11px] truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span>{prop.neighbourhood}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500 mt-2 font-medium">
                        <span>Views: {prop.viewsCount || 340}</span>
                        <span>·</span>
                        <span>Leads: {prop.inquiriesCount || 18}</span>
                        <span>·</span>
                        <span className="text-emerald-600 font-bold">KYC {prop.verification.documentType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: KYC DOCUMENT VERIFICATION CENTER */}
          {activeTab === 'kyc' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <h4 className="font-heading font-black text-xl text-stone-900">
                    Publisher KYC & Title Verification Center
                  </h4>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Nigerian law & KeyDirect trust policy require all property owners, party hosts, and commercial land publishers to verify identity & government title records.
                </p>
              </div>

              {/* KYC Status Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-emerald-950">Current Verification Status:</div>
                  <div className="font-heading font-black text-emerald-700 text-base">
                    Tier 2: Government Title & Biometric Audited
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full">
                  Fully Verified
                </span>
              </div>

              {/* Document checklist */}
              <div className="space-y-3 text-xs">
                
                {/* 1. NIN */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">1. National Identity Number (NIN)</div>
                    <div className="text-stone-500 text-[11px]">NIN Hash: {ninNumber.slice(0, 4)}••••{ninNumber.slice(-3)}</div>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> NIMC Matched
                  </span>
                </div>

                {/* 2. BVN */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">2. Bank Verification Number (BVN) Hash</div>
                    <div className="text-stone-500 text-[11px]">NIBSS Clean Fraud Check</div>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                {/* 3. Title Document */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">3. Land / Property Title Document</div>
                    <div className="text-stone-500 text-[11px]">{titleDocType} · Lagos / Abuja Land Registry Record</div>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Audited
                  </span>
                </div>

                {/* 4. CAC Business Certificate */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">4. Corporate Affairs Commission (CAC)</div>
                    <div className="text-stone-500 text-[11px]">Reg: {cacNumber} (For Event Centers & Companies)</div>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>

              {/* Upload fresh document */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 text-center space-y-2">
                <Upload className="w-6 h-6 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-800">Upload New Title Deed or Utility Bill</div>
                <p className="text-[11px] text-stone-500">PDF, JPG, PNG up to 25MB (Encrypted storage)</p>
                <button
                  type="button"
                  onClick={() => showNotice('Document uploaded and queued for Trust Officer audit!')}
                  className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Select File
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: PUBLISH NEW PROPERTY / PARTY SPACE / LAND */}
          {activeTab === 'publish-prop' && (
            <form onSubmit={handleCreateProperty} className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs">
              <div>
                <h4 className="font-heading font-black text-lg text-stone-900">
                  Publish Verified Property Listing
                </h4>
                <p className="text-xs text-stone-500">
                  Direct Owner & Licensed Agent Publishing Wizard
                </p>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Listing Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Party Apartments', 'Event Centers', 'Plots / Land', 'Apartments', 'Commercial', 'Rooms', 'Hotels', 'Rental'] as PropertyCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setListingCategory(cat)}
                      className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer border text-center ${
                        listingCategory === cat
                          ? 'bg-red-50 border-red-500 text-red-600 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special toggle for Plots / Land: Rent / Lease vs Buy */}
              {listingCategory === 'Plots / Land' && (
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <label className="block text-[11px] font-bold text-blue-900 uppercase mb-1.5">
                    Land Transaction Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLandAction('Buy Land')}
                      className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer border ${
                        landAction === 'Buy Land'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-800 border-blue-200'
                      }`}
                    >
                      Buy Land (Outright Purchase)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLandAction('Rent / Lease Land')}
                      className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer border ${
                        landAction === 'Rent / Lease Land'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-800 border-blue-200'
                      }`}
                    >
                      Rent / Lease Land (Commercial / Event Yard)
                    </button>
                  </div>
                </div>
              )}

              {/* Special options for Party Apartments & Event Centers */}
              {(listingCategory === 'Party Apartments' || listingCategory === 'Event Centers') && (
                <div className="p-3.5 bg-red-50/80 rounded-2xl border border-red-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-red-900 font-bold">
                    <PartyPopper className="w-4 h-4 text-red-600" />
                    <span>Party & Event Specifics</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Max Guest Capacity</label>
                      <input
                        type="number"
                        value={guestCapacity}
                        onChange={(e) => setGuestCapacity(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-stone-700 font-semibold cursor-pointer pt-4">
                      <input
                        type="checkbox"
                        checked={allowsDj}
                        onChange={(e) => setAllowsDj(e.target.checked)}
                        className="rounded text-red-600"
                      />
                      <span>Allows DJ & Loud Sound</span>
                    </label>
                    <label className="flex items-center gap-2 text-stone-700 font-semibold cursor-pointer pt-4">
                      <input
                        type="checkbox"
                        checked={allowsPoolParty}
                        onChange={(e) => setAllowsPoolParty(e.target.checked)}
                        className="rounded text-red-600"
                      />
                      <span>Allows Pool Parties</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="e.g. Luxury Soundproof Party Penthouse with Rooftop Pool"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Price (₦ or USD)</label>
                  <input
                    type="text"
                    required
                    value={propPrice}
                    onChange={(e) => setPropPrice(e.target.value)}
                    placeholder="e.g. 350,000 per night or 85,000,000"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">State</label>
                  <select
                    value={propState}
                    onChange={(e) => setPropState(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900"
                  >
                    <option value="Lagos">Lagos State</option>
                    <option value="Abuja (FCT)">Abuja (FCT)</option>
                    <option value="Rivers">Rivers (Port Harcourt)</option>
                    <option value="Oyo">Oyo (Ibadan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Neighbourhood</label>
                  <input
                    type="text"
                    required
                    value={propNeighbourhood}
                    onChange={(e) => setPropNeighbourhood(e.target.value)}
                    placeholder="e.g. Lekki Phase 1, Victoria Island, Maitama"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Publish to KeyDirect Network
              </button>
            </form>
          )}

          {/* TAB 4: PUBLISH DIGITAL BILLBOARD AD FOR ANY BUSINESS */}
          {activeTab === 'publish-billboard' && (
            <form onSubmit={handleCreateBillboard} className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-heading font-black text-lg text-stone-900">
                    Publish Business to Global Digital Billboard
                  </h4>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Open to ANY business! Showcase your event services, DJ gear, catering, law firm, fintech, or company to thousands of high-intent clients.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="e.g. VibeMasters Sound & DJ Rentals"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Category</label>
                  <select
                    value={bizCategory}
                    onChange={(e) => setBizCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900"
                  >
                    <option value="Sound & DJ Equipment">Sound & DJ Equipment</option>
                    <option value="Party & Event Planning">Party & Event Planning</option>
                    <option value="Catering & Drinks">Catering & Drinks</option>
                    <option value="Interior Decor">Interior Decor</option>
                    <option value="Legal & Land Title Audit">Legal & Land Title Audit</option>
                    <option value="Real Estate">Real Estate & Development</option>
                    <option value="General Business">General Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Headline / Punchy Tagline</label>
                <input
                  type="text"
                  required
                  value={bizTagline}
                  onChange={(e) => setBizTagline(e.target.value)}
                  placeholder="e.g. Lagos & Abuja High-Wattage Sound, Pioneer CDJs & Festival Lights"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">WhatsApp Line</label>
                  <input
                    type="text"
                    required
                    value={bizWhatsapp}
                    onChange={(e) => setBizWhatsapp(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Website URL</label>
                  <input
                    type="text"
                    value={bizWebsite}
                    onChange={(e) => setBizWebsite(e.target.value)}
                    placeholder="https://mybusiness.ng"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Target Coverage</label>
                  <input
                    type="text"
                    value={bizTargetCity}
                    onChange={(e) => setBizTargetCity(e.target.value)}
                    placeholder="e.g. Lagos, Abuja, Port Harcourt"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                Launch on Global Digital Billboard
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
