import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  Building, 
  MapPin, 
  FileText, 
  DollarSign,
  AlertCircle,
  Image as ImageIcon,
  RotateCw,
  Video,
  Sparkles
} from 'lucide-react';
import { Property, PropertyCategory, ListingType, UserRole } from '../types';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProp: Property) => void;
  currentCurrency: string;
  currentUser?: { name: string; role: UserRole; email: string; phone?: string; id?: string } | null;
}

const PROPERTY_IMAGE_PRESETS = [
  {
    label: 'Luxury Duplex with Pool',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Self Contain / Mini Flat',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Hotel Suite / Room',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Shop & Retail Plaza',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Industrial Warehouse',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Soundproof Party Penthouse',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Modern Highrise Apartment',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Grand Event Center / Hall',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Dry Land / Plot in Lekki',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Commercial Glass Tower Office',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  currentCurrency,
  currentUser,
}) => {
  const [listingType, setListingType] = useState<ListingType>('Direct Owner');
  const [category, setCategory] = useState<PropertyCategory>('Apartments');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [pricePeriod, setPricePeriod] = useState<'per annum' | 'monthly' | 'per night' | 'per event' | 'total purchase'>('per annum');
  const [state, setState] = useState('Lagos');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [selectedImage, setSelectedImage] = useState(PROPERTY_IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [documentType, setDocumentType] = useState<'C of O' | 'Deed of Assignment' | "Governor's Consent">('C of O');
  const [ninNumber, setNinNumber] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(currentUser?.phone || '+234 803 123 4567');
  const [description, setDescription] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [guestCapacity, setGuestCapacity] = useState('50');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);
  
  // Anti-impersonation and Anti-AI states
  const [agencyName, setAgencyName] = useState('');
  const [agentLicenseNumber, setAgentLicenseNumber] = useState('');
  const [agreedAntiAi, setAgreedAntiAi] = useState(true);
  const [agreedAntiImpersonation, setAgreedAntiImpersonation] = useState(true);
  const [agreedToZeroFee, setAgreedToZeroFee] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Flexible Contact Methods (WhatsApp, Snap of Paper Note, Custom Anyhow Link, Commission)
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.phone || '+234 803 123 4567');
  const [contactPaperUrl, setContactPaperUrl] = useState('');
  const [uploadedPaperName, setUploadedPaperName] = useState<string | null>(null);
  const [customContactLink, setCustomContactLink] = useState('');
  const [customContactLinkLabel, setCustomContactLinkLabel] = useState('Chat / Contact Agent Link');
  const [agentCommissionRate, setAgentCommissionRate] = useState('10% on agreement signing only · ₦0 upfront fees');

  // File upload reader for images
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // File upload reader for piece of paper / handwritten note / signpost
  const handlePaperFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedPaperName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setContactPaperUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // File upload reader for video walkthrough
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedVideoName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setVirtualTourUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (currentUser?.name) {
      setOwnerName(currentUser.name);
    }
    if (currentUser?.phone) {
      setOwnerPhone(currentUser.phone);
    }
    if (currentUser?.role === 'Owner') setListingType('Direct Owner');
    else if (currentUser?.role === 'Agent') setListingType('Verified Agent');
    else if (currentUser?.role === 'Developer') setListingType('Developer');
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !neighbourhood) return;

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 5000000;
    const finalImage = customImageUrl.trim() || selectedImage;

    const isParty = category === 'Party Apartments';
    const isEvent = category === 'Event Centers';

    const newProperty: Property = {
      id: `kd-user-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || `Direct ${listingType} listing in ${neighbourhood}, ${state}. Clean title (${documentType}) registered manually on KeyDirect. Zero agent fees, guaranteed ₦0 inspection charges.`,
      category,
      listingType,
      baseCurrency: currentCurrency === 'USD' ? 'USD' : 'NGN',
      basePrice: numericPrice,
      pricePeriod: isParty ? 'per night' : isEvent ? 'per event' : pricePeriod,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 1,
      sittingRooms: 1,
      state,
      lga: 'Eti-Osa',
      neighbourhood,
      address: address || `${neighbourhood}, ${state}`,
      latitude: 6.4474,
      longitude: 3.4723,
      images: [finalImage, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'],
      isVerifiedListing: true,
      hasVirtualTour: true,
      virtualTour360Rooms: [
        {
          name: 'Main Living & Panoramic Lounge',
          panoramaUrl: finalImage,
          description: 'Spacious interior with natural lighting and modern finishings.',
          hotspots: ['Master Balcony', 'Dining Area', 'En-suite Corridor'],
        },
      ],
      videoTourUrl: virtualTourUrl || 'https://assets.mixkit.co/videos/preview/mixkit-modern-interior-of-a-living-room-41525-large.mp4',
      verification: {
        isNinVerified: Boolean(ninNumber),
        isBvnVerified: true,
        documentType,
        verificationStatus: 'Approved',
        verifiedAt: new Date().toISOString().split('T')[0],
        inspectorName: 'KeyDirect Manual Verification Board',
        kycTier: 'Tier 2 Government Title Audited',
      },
      eventSpecs: (isParty || isEvent) ? {
        guestCapacity: parseInt(guestCapacity) || 50,
        allowsPartyDj: true,
        allowsPoolParty: true,
        hasIndustrialGenerator: true,
      } : undefined,
      owner: {
        id: currentUser?.id || `usr-${Date.now()}`,
        name: ownerName || currentUser?.name || 'Direct Property Owner',
        role: listingType === 'Direct Owner' ? 'Owner' : listingType === 'Developer' ? 'Developer' : 'Agent',
        phone: ownerPhone || '+234 800 000 0000',
        whatsappNumber: whatsappNumber || ownerPhone || '+234 800 000 0000',
        contactPaperUrl: contactPaperUrl.trim() || undefined,
        customContactLink: customContactLink.trim() || undefined,
        customContactLinkLabel: customContactLinkLabel.trim() || 'Chat / View Agent Profile',
        agentCommissionRate: listingType === 'Verified Agent' ? agentCommissionRate : '0% Direct Owner Deal',
        isVerified: true,
        rating: 5.0,
        responseTime: 'Instant',
        avatar: currentUser && 'avatar' in currentUser ? (currentUser as any).avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      amenities: ['Verified Title Document', 'Zero Agent Commission', 'Physical Inspection Available', '₦0 Inspection Guarantee'],
      featuredInBillboard: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProperty(newProperty);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg tracking-tight">
                List Property on KeyDirect
              </h3>
              <p className="text-xs text-stone-400">
                Direct Landlord & Verified Space Registration
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

        {/* Free direct registration alert banner */}
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Verified Direct Registration:</strong> Direct landlord, hotel, retail, self contain, and commercial space registration is active.
          </span>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-heading font-black text-2xl text-stone-900">
              Listing Verified & Published!
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Your property has been indexed and is now live with <strong>₦0 inspection fees</strong> and direct connections!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Listing Role Pill Selector */}
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Listing Entity Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Direct Owner', 'Verified Agent', 'Developer'] as ListingType[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setListingType(r)}
                    className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer border ${
                      listingType === r
                        ? 'bg-red-50 border-red-600 text-red-600 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium"
                >
                  <option value="Apartments">Apartments</option>
                  <option value="Self Contain">Self Contain (Room & Parlour / Mini Flat)</option>
                  <option value="Hotels">Hotels & Guest Suites</option>
                  <option value="Shops & Retail">Shops & Retail</option>
                  <option value="Warehouses">Warehouses & Logistics Hubs</option>
                  <option value="Party Apartments">Party Apartments</option>
                  <option value="Event Centers">Event Centers</option>
                  <option value="Plots / Land">Plots / Land</option>
                  <option value="Rooms">Rooms</option>
                  <option value="Commercial">Commercial / Offices</option>
                  <option value="Rental">Rental</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Property Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4-Bedroom Fully Detached Luxury Villa with Pool"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-medium"
                />
              </div>
            </div>

            {/* Price & Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Price (in {currentCurrency})
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 15,000,000"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Price Period
                </label>
                <select
                  value={pricePeriod}
                  onChange={(e) => setPricePeriod(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium"
                >
                  <option value="per annum">Per Annum (Yearly)</option>
                  <option value="monthly">Monthly</option>
                  <option value="per night">Per Night (Shortlet / Party)</option>
                  <option value="per event">Per Event (Hall / Marquee)</option>
                  <option value="total purchase">Total Purchase (Outright Sale)</option>
                </select>
              </div>
            </div>

            {/* Location (State & Neighbourhood) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  State / Region
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja (FCT)">Abuja (FCT)</option>
                  <option value="Rivers">Rivers (Port Harcourt)</option>
                  <option value="Oyo">Oyo (Ibadan)</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Enugu">Enugu State</option>
                  <option value="Delta">Delta State</option>
                  <option value="Akwa Ibom">Akwa Ibom</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Neighbourhood
                </label>
                <input
                  type="text"
                  required
                  value={neighbourhood}
                  onChange={(e) => setNeighbourhood(e.target.value)}
                  placeholder="e.g. Lekki Phase 1, Maitama, Old GRA"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-medium"
                />
              </div>
            </div>

            {/* Photos & Visuals Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Property Photos & 360° Visuals
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Device Upload Supported
                </span>
              </div>

              {/* Direct Device File Upload Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadedFileName ? `Photo: ${uploadedFileName.slice(0, 20)}...` : 'Upload Photo from Device / Camera'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                  />
                </label>

                <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border border-stone-700">
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{uploadedVideoName ? `Video: ${uploadedVideoName.slice(0, 20)}...` : 'Upload 360° Video Walkthrough'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset Selector */}
              <div className="text-[11px] text-stone-500 font-medium">Or pick an architectural preset:</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PROPERTY_IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(preset.url);
                      setCustomImageUrl('');
                      setUploadedFileName(null);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer ${
                      selectedImage === preset.url && !customImageUrl
                        ? 'border-red-600 scale-102 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] p-0.5 truncate text-center">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>

              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => {
                  setCustomImageUrl(e.target.value);
                  setUploadedFileName(null);
                }}
                placeholder="Or paste an image URL (https://...)"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs"
              />
            </div>

            {/* Rooms / Capacity */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                />
              </div>
              {(category === 'Party Apartments' || category === 'Event Centers') && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Guest Capacity</label>
                  <input
                    type="number"
                    min="10"
                    value={guestCapacity}
                    onChange={(e) => setGuestCapacity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              )}
            </div>

            {/* Title Document Verification */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Anti-Scam Title Verification (Manual Upload)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 uppercase mb-1">
                    Title Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  >
                    <option value="C of O">Certificate of Occupancy (C of O)</option>
                    <option value="Governor's Consent">Governor’s Consent</option>
                    <option value="Deed of Assignment">Deed of Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 uppercase mb-1">
                    NIN / BVN Number (Optional Fast-track)
                  </label>
                  <input
                    type="text"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    placeholder="Enter 11-digit NIN"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details & Flexible Reaching Options */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-stone-900 text-xs sm:text-sm">
                  Direct Contact & Communication Methods
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Direct Connection · ₦0 Inspection Pass
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Owner / Agent Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Afolabi Simeon"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Direct Phone Call Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-medium"
                  />
                </div>
              </div>

              {/* Direct WhatsApp & Any Custom Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>Direct WhatsApp Chat Number</span>
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">Renters will chat you directly on WhatsApp with 1-click.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                    Drop Any Custom Link (Linktree, Social, Website)
                  </label>
                  <input
                    type="url"
                    value={customContactLink}
                    onChange={(e) => setCustomContactLink(e.target.value)}
                    placeholder="https://linktr.ee/youragentprofile or wa.link/..."
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-stone-900 font-medium focus:ring-purple-500"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">Optional: Drop your social portfolio, Linktree, or website.</p>
                </div>
              </div>

              {/* Upload a Piece of Paper with Number or Signpost */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Upload / Snap a Piece of Paper with Phone Number or Gate Signpost
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>{uploadedPaperName ? `Uploaded: ${uploadedPaperName}` : 'Snap / Upload Paper Note'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePaperFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-stone-400">or paste image URL:</span>
                  <input
                    type="url"
                    value={contactPaperUrl}
                    onChange={(e) => setContactPaperUrl(e.target.value)}
                    placeholder="https://... photo of paper note on wall / gate"
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 text-xs"
                  />
                </div>
                {contactPaperUrl && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contact note photo attached! Renters will be able to zoom into your handwritten phone note.</span>
                  </div>
                )}
              </div>

              {/* Agent Closing Success Commission Settings */}
              {listingType === 'Verified Agent' && (
                <div className="pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                      Agent Closing Success Commission
                    </label>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      ₦0 Upfront Inspection Strictly Enforced
                    </span>
                  </div>
                  <select
                    value={agentCommissionRate}
                    onChange={(e) => setAgentCommissionRate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 text-xs font-semibold"
                  >
                    <option value="10% upon lease agreement signing only · ₦0 upfront fees">
                      10% Closing Commission (Standard Residential Lease · ₦0 Inspection)
                    </option>
                    <option value="5% upon finalized purchase agreement · ₦0 upfront fees">
                      5% Closing Commission (Property / Land Sale · ₦0 Inspection)
                    </option>
                    <option value="5% upon booking confirmation · ₦0 upfront fees">
                      5% Booking Commission (Shortlet / Party Venue · ₦0 Inspection)
                    </option>
                    <option value="Negotiable upon closing agreement only · ₦0 upfront fees">
                      Negotiable upon closing agreement only (₦0 Upfront Fees)
                    </option>
                  </select>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Clients will see this transparent rate upfront so they know exactly what you charge upon successful deal signing.
                  </p>
                </div>
              )}
            </div>

            {/* Anti-Impersonation Shield for Verified Agents */}
            {listingType === 'Verified Agent' && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Agent Anti-Impersonation & Licensing Verification</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  KeyDirect strictly prohibits middleman unauthorized subletting and blocks all rogue impersonators. All verified agent listings require a registered brokerage and direct landlord mandate.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Registered Agency / Brokerage Firm
                    </label>
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Apex Crown Properties Ltd"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Official License / Accreditation ID
                    </label>
                    <input
                      type="text"
                      required
                      value={agentLicenseNumber}
                      onChange={(e) => setAgentLicenseNumber(e.target.value)}
                      placeholder="e.g. LASRERA/2026/0491 or NIESV ID"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedAntiImpersonation}
                    onChange={(e) => setAgreedAntiImpersonation(e.target.checked)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-amber-900 text-[11px]">
                    <strong>Anti-Impersonation Mandate:</strong> I legally certify that I hold an active, written mandate directly from the registered title deed holder. Middleman impersonation results in instant ban & legal reporting.
                  </span>
                </label>
              </div>
            )}

            {/* Strict Anti-AI Media Certification */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Strict Anti-AI Media Policy: Real Photography & Video Only</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                KeyDirect strictly prohibits AI-generated visuals, fake synthetic renders, or deepfake videos. All uploaded photos and 360° virtual room walkthroughs must be 100% genuine physical photographs taken on-site.
              </p>
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedAntiAi}
                  onChange={(e) => setAgreedAntiAi(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-rose-950 text-[11px]">
                  I certify that all uploaded media items are <strong>100% real physical photos & videos taken on-site</strong>. Zero AI-generated images or videos are included.
                </span>
              </label>
            </div>

            {/* Zero Commission Agreement */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToZeroFee}
                onChange={(e) => setAgreedToZeroFee(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-stone-600 text-[11px]">
                I certify that this property is directly available from me with <strong>zero agent commissions</strong> and zero inspection fees for tenants.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreedToZeroFee || !agreedAntiAi || (listingType === 'Verified Agent' && !agreedAntiImpersonation)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              Publish Listing
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
