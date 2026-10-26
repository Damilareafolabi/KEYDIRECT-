/**
 * KeyDirect Real Estate
 * Tagline: "Real People. Real Places. Direct Connections."
 * Parent Company: SimeonJrStudios
 * Leadership: CEO Afolabi Oluwadamilare Simeon
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  KeyRound, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Tv, 
  Code2, 
  CheckCircle2, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  X,
  Phone,
  Mail,
  Zap,
  Building,
  HeartHandshake,
  RotateCw,
  Users,
  PartyPopper,
  TrendingUp,
  Share2,
  Bot,
  Heart,
  Calendar,
  UserCheck,
  PlusCircle
} from 'lucide-react';

import { 
  Property, 
  PropertyCategory, 
  ListingType, 
  SupportedLanguage, 
  UserRole, 
  LandAction,
  BusinessBillboardAd,
  LazyCeoLead,
  UserActivityLog,
  RenterRequest 
} from './types';
import { INITIAL_BUSINESS_BILLBOARDS } from './data/properties';
import { 
  getAllMergedProperties, 
  persistManualProperty, 
  getFavoritePropertyIds, 
  toggleFavoriteProperty,
  ScheduledInspection,
  loadShowcaseDemoProperties,
  resetToEmptyLiveProperties 
} from './utils/propertyStorage';
import { 
  getActiveSession, 
  setActiveSession, 
  UserAccount 
} from './utils/auth';
import { CURRENCY_RATES, convertCurrency, formatCurrency } from './utils/currency';
import { TRANSLATIONS } from './utils/i18n';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchCard } from './components/SearchCard';
import { PromoBanner } from './components/PromoBanner';
import { PropertyCard } from './components/PropertyCard';
import { PropertyMap } from './components/PropertyMap';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { DirectChatDrawer } from './components/DirectChatDrawer';
import { DigitalBillboardModal } from './components/DigitalBillboardModal';
import { AntiScamModal } from './components/AntiScamModal';
import { LazyCeoPlatform } from './components/LazyCeoPlatform';
import { SocialShareModal } from './components/SocialShareModal';
import { ListPropertyModal } from './components/ListPropertyModal';
import { AuthModal } from './components/AuthModal';
import { TrustStatsBanner } from './components/TrustStatsBanner';

// Core Innovations Components
import { VirtualLookModal } from './components/VirtualLookModal';
import { CommunityChatModal } from './components/CommunityChatModal';
import { PublisherPortalModal } from './components/PublisherPortalModal';
import { AccountAnalyticsModal } from './components/AccountAnalyticsModal';
import { SocialMediaAutoPosterModal } from './components/SocialMediaAutoPosterModal';
import { LazyCeoHunter } from './components/LazyCeoHunter';
import { LazyCeoModal } from './components/LazyCeoModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ScheduleInspectionModal } from './components/ScheduleInspectionModal';
import { ActivityTrackingModal } from './components/ActivityTrackingModal';
import { CommentsModal } from './components/CommentsModal';
import { AgentCommissionGuideModal } from './components/AgentCommissionGuideModal';

export default function App() {
  // Global & Localized State
  const [properties, setProperties] = useState<Property[]>(() => getAllMergedProperties());
  const [billboardAds, setBillboardAds] = useState<BusinessBillboardAd[]>(INITIAL_BUSINESS_BILLBOARDS);
  const [lazyCeoLeads, setLazyCeoLeads] = useState<LazyCeoLead[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<string>('NGN');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Favorites & Inspections
  const [favorites, setFavorites] = useState<string[]>(() => getFavoritePropertyIds());
  const [isShowingFavoritesOnly, setIsShowingFavoritesOnly] = useState<boolean>(false);

  // Filter States
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>('Cities');
  const [landAction, setLandAction] = useState<LandAction>('Any');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('All Types');
  const [bedroomCount, setBedroomCount] = useState<string>('Bedrooms Any');
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [advertiserFilter, setAdvertiserFilter] = useState<string>('Owners and agents');
  const [isMapView, setIsMapView] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<string>('Owners');

  // Modals & Drawers States
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [selectedPropertyForChat, setSelectedPropertyForChat] = useState<Property | null>(null);
  const [selectedPropertyForVirtualLook, setSelectedPropertyForVirtualLook] = useState<Property | null>(null);
  const [selectedPropertyForInspection, setSelectedPropertyForInspection] = useState<Property | null>(null);
  const [selectedPropertyForComments, setSelectedPropertyForComments] = useState<Property | null>(null);
  
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isBillboardOpen, setIsBillboardOpen] = useState<boolean>(false);
  const [isAntiScamOpen, setIsAntiScamOpen] = useState<boolean>(false);
  const [isLazyCeoPlatformOpen, setIsLazyCeoPlatformOpen] = useState<boolean>(false);
  const [selectedPropertyForShare, setSelectedPropertyForShare] = useState<Property | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isScheduleInspectionOpen, setIsScheduleInspectionOpen] = useState<boolean>(false);
  const [isCommunityChatOpen, setIsCommunityChatOpen] = useState<boolean>(false);
  const [isPublisherPortalOpen, setIsPublisherPortalOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isSocialPosterOpen, setIsSocialPosterOpen] = useState<boolean>(false);
  const [isLazyCeoModalOpen, setIsLazyCeoModalOpen] = useState<boolean>(false);
  const [isActivityTrackerOpen, setIsActivityTrackerOpen] = useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [isAgentGuideOpen, setIsAgentGuideOpen] = useState<boolean>(false);

  // Persistent Activity Log & Renter Requests
  const [activities, setActivities] = useState<UserActivityLog[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('kd_user_activity_logs_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [renterRequests, setRenterRequests] = useState<RenterRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('kd_renter_requests_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Real Persistent User Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getActiveSession());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Activity logger helper
  const logActivity = (
    action: UserActivityLog['action'],
    description: string,
    propertyId?: string,
    propertyTitle?: string,
    metadata?: Record<string, any>
  ) => {
    const newLog: UserActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.id,
      userName: currentUser?.name || 'Verified Landlord / User',
      userRole: currentUser?.role || 'Owner',
      action,
      description,
      propertyId,
      propertyTitle,
      metadata,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
    };

    setActivities((prev) => {
      const updated = [newLog, ...prev.slice(0, 49)];
      try {
        localStorage.setItem('kd_user_activity_logs_v1', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Add newly published property with persistence & audit logging
  const handleAddProperty = (newProp: Property) => {
    const updated = persistManualProperty(newProp);
    setProperties(updated);
    logActivity('LISTING_CREATED', `Direct ${newProp.listingType} published: ${newProp.title}`, newProp.id, newProp.title);
    showToast(`Property "${newProp.title}" published with KYC verification!`);
  };

  // Load verified showcase demonstrations
  const handleLoadShowcase = () => {
    const demo = loadShowcaseDemoProperties();
    setProperties(demo);
    logActivity('STATUS_CHANGED', 'Loaded verified demonstration listings for showcase preview.');
    showToast('Loaded verified showcase properties demo.');
  };

  // Reset to clean live empty state
  const handleResetEmpty = () => {
    const empty = resetToEmptyLiveProperties();
    setProperties(empty);
    logActivity('STATUS_CHANGED', 'Marketplace reset to clean live deployment (zero mock listings).');
    showToast('Database reset to clean empty live deployment.');
  };

  // Toggle Favorite
  const handleToggleFavorite = (propertyId: string) => {
    const updated = toggleFavoriteProperty(propertyId);
    setFavorites(updated);
    const isNowFav = updated.includes(propertyId);
    showToast(isNowFav ? 'Saved to Favorites ❤️' : 'Removed from Saved Listings');
  };

  // Open Comments Modal
  const handleOpenComments = (property?: Property | null) => {
    setSelectedPropertyForComments(property || null);
    setIsCommentsOpen(true);
  };

  // Open Global Platform Share Modal
  const handleOpenPlatformShare = () => {
    setSelectedPropertyForShare(null);
    setIsShareModalOpen(true);
  };

  // Add newly submitted billboard ad from any business
  const handleAddBillboardAd = (ad: BusinessBillboardAd) => {
    setBillboardAds((prev) => [ad, ...prev]);
    showToast(`Billboard Ad for "${ad.businessName}" is now LIVE!`);
  };

  // Capture lead from LazyCEO autonomous hunter
  const handleLeadCaptured = (lead: LazyCeoLead) => {
    setLazyCeoLeads((prev) => [lead, ...prev]);
    showToast(`⚡ LazyCEO Hunted a Lead: "${lead.clientNeed.slice(0, 35)}..."!`);
  };

  // Role button selector handler
  const handleSelectRole = (role: 'Owners' | 'Agents' | 'Developers') => {
    setActiveRole(role);
    if (role === 'Owners') {
      setAdvertiserFilter('Direct Owners Only');
      showToast('Filtered to 0% Agent Commission Direct Owner listings!');
    } else if (role === 'Agents') {
      setAdvertiserFilter('Verified Agents');
      showToast('Filtered to verified licensed agents!');
    } else if (role === 'Developers') {
      setAdvertiserFilter('Developers');
      showToast('Filtered to primary real estate developer projects!');
    }
  };

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Favorites only filter
      if (isShowingFavoritesOnly && !favorites.includes(prop.id)) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'Cities') {
        if (prop.category !== activeCategory) return false;
      }

      // Land action sub-filter (for Plots / Land)
      if (activeCategory === 'Plots / Land' && landAction !== 'Any') {
        if (prop.landAction && prop.landAction !== landAction) return false;
      }

      // Location search
      if (searchLocation.trim()) {
        const query = searchLocation.toLowerCase();
        const matchesLocation =
          prop.neighbourhood.toLowerCase().includes(query) ||
          prop.state.toLowerCase().includes(query) ||
          prop.address.toLowerCase().includes(query) ||
          prop.title.toLowerCase().includes(query);
        if (!matchesLocation) return false;
      }

      // Bedroom count filter
      if (bedroomCount !== 'Bedrooms Any') {
        const reqBeds = parseInt(bedroomCount);
        if (!isNaN(reqBeds)) {
          if (bedroomCount.includes('+')) {
            if (prop.bedrooms < reqBeds) return false;
          } else {
            if (prop.bedrooms !== reqBeds) return false;
          }
        }
      }

      // Advertiser / Listing Type filter
      if (advertiserFilter === 'Direct Owners Only') {
        if (prop.listingType !== 'Direct Owner') return false;
      } else if (advertiserFilter === 'Verified Agents') {
        if (prop.listingType !== 'Verified Agent') return false;
      } else if (advertiserFilter === 'Developers') {
        if (prop.listingType !== 'Developer') return false;
      }

      // Budget min/max filter
      const convertedPrice = convertCurrency(
        prop.basePrice,
        prop.baseCurrency,
        currentCurrency
      );

      if (minBudget) {
        const min = parseFloat(minBudget.replace(/[^0-9.]/g, ''));
        if (!isNaN(min) && convertedPrice < min) return false;
      }
      if (maxBudget) {
        const max = parseFloat(maxBudget.replace(/[^0-9.]/g, ''));
        if (!isNaN(max) && convertedPrice > max) return false;
      }

      return true;
    });
  }, [
    properties,
    favorites,
    isShowingFavoritesOnly,
    activeCategory,
    landAction,
    searchLocation,
    bedroomCount,
    advertiserFilter,
    minBudget,
    maxBudget,
    currentCurrency,
  ]);

  // Statistics for quick count badges
  const directOwnerCount = useMemo(() => {
    return properties.filter((p) => p.listingType === 'Direct Owner').length;
  }, [properties]);

  const partyApartmentCount = useMemo(() => {
    return properties.filter((p) => p.category === 'Party Apartments').length;
  }, [properties]);

  const landCount = useMemo(() => {
    return properties.filter((p) => p.category === 'Plots / Land').length;
  }, [properties]);

  const userListingsCount = useMemo(() => {
    if (!currentUser) return 0;
    return properties.filter((p) => p.owner.name === currentUser.name || p.owner.id === currentUser.id).length;
  }, [properties, currentUser]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-red-500 selection:text-white relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating LazyCEO Autonomous Client Hunter */}
      <LazyCeoHunter
        activeCategory={activeCategory}
        onOpenLeadPipeline={() => setIsLazyCeoModalOpen(true)}
        onLeadCaptured={handleLeadCaptured}
      />

      {/* Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsShowingFavoritesOnly(false);
          if (cat === 'Rental') {
            setAdvertiserFilter('Direct Owners Only');
          }
        }}
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrentCurrency}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenBillboard={() => setIsBillboardOpen(true)}
        onOpenAntiScam={() => setIsAntiScamOpen(true)}
        onOpenListProperty={() => setIsListPropertyOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenChat={() => {
          if (!selectedPropertyForChat && properties.length > 0) {
            setSelectedPropertyForChat(properties[0]);
          }
          setIsChatOpen(true);
        }}
        onOpenCommunityChat={() => setIsCommunityChatOpen(true)}
        onOpenPublisherPortal={() => setIsPublisherPortalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSocialAutoPoster={() => setIsSocialPosterOpen(true)}
        onOpenLazyCeo={() => setIsLazyCeoPlatformOpen(true)}
        onOpenActivityTracker={() => setIsActivityTrackerOpen(true)}
        onSharePlatform={handleOpenPlatformShare}
        onOpenAgentGuide={() => setIsAgentGuideOpen(true)}
        favoritesCount={favorites.length}
        onToggleFavoritesFilter={() => setIsShowingFavoritesOnly(!isShowingFavoritesOnly)}
        isShowingFavoritesOnly={isShowingFavoritesOnly}
        currentUser={currentUser}
      />

      {/* Hero Section with Virtual Inspection Badge & 3 Horizontal Feature Cards */}
      <Hero
        currentLanguage={currentLanguage}
        onSelectRole={handleSelectRole}
        onOpenListProperty={() => setIsListPropertyOpen(true)}
        activeRole={activeRole}
        onOpenVirtualLookDemo={() => {
          if (properties.length > 0) {
            setSelectedPropertyForVirtualLook(properties[0]);
          }
        }}
        onFilterDirectOwners={() => {
          setAdvertiserFilter('Direct Owners Only');
          showToast('Filtered to 0% Agent Commission Direct Owners!');
          const el = document.getElementById('listings-container');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFilterFreeInspection={() => {
          showToast('All properties feature ₦0 inspection fees & free 360° virtual tours!');
          const el = document.getElementById('listings-container');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Promo & Innovation Callout Strip */}
      <PromoBanner
        currentLanguage={currentLanguage}
        onFilterDirectOwners={() => {
          setAdvertiserFilter('Direct Owners Only');
          showToast('Filtered to 0% Agent Commission Direct Landlord listings!');
          const el = document.getElementById('listings-container');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAntiScam={() => setIsAntiScamOpen(true)}
      />

      {/* Interactive Property Search and Filter Console */}
      <SearchCard
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setIsShowingFavoritesOnly(false);
        }}
        searchLocation={searchLocation}
        onSearchLocationChange={setSearchLocation}
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        bedroomCount={bedroomCount}
        onBedroomCountChange={setBedroomCount}
        minBudget={minBudget}
        onMinBudgetChange={setMinBudget}
        maxBudget={maxBudget}
        onMaxBudgetChange={setMaxBudget}
        advertiserFilter={advertiserFilter}
        onAdvertiserFilterChange={setAdvertiserFilter}
        landAction={landAction}
        onLandActionChange={setLandAction}
        isMapView={isMapView}
        onToggleMapView={() => setIsMapView(!isMapView)}
        onTriggerSearch={() => {
          const el = document.getElementById('listings-container');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        currentCurrency={currentCurrency}
        currentLanguage={currentLanguage}
      />

      {/* Main Real Estate Listings Section */}
      <main id="listings-container" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Listings Header & Quick Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {isShowingFavoritesOnly
                  ? 'Your Saved Favorite Properties'
                  : activeCategory === 'Cities'
                  ? 'Verified Properties & Party Spaces in Nigeria'
                  : `${activeCategory} in Nigeria`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                {filteredProperties.length} Available
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                Virtual Tour Ready (₦0 Fee)
              </span>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Direct connection to verified hosts, landlords & developers. All prices converted in real-time to {currentCurrency}.
            </p>
          </div>

          {/* Quick Direct Owner, Saved & Map Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {favorites.length > 0 && (
              <button
                onClick={() => setIsShowingFavoritesOnly(!isShowingFavoritesOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isShowingFavoritesOnly
                    ? 'bg-red-600 border-red-600 text-white shadow-md'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isShowingFavoritesOnly ? 'fill-white text-white' : 'text-red-600'}`} />
                <span>Saved ({favorites.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                if (advertiserFilter === 'Direct Owners Only') {
                  setAdvertiserFilter('Owners and agents');
                } else {
                  setAdvertiserFilter('Direct Owners Only');
                  showToast('Showing only Direct Landlord listings (0% Agent Commission)');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                advertiserFilter === 'Direct Owners Only'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${advertiserFilter === 'Direct Owners Only' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Direct Owners ({directOwnerCount})</span>
            </button>

            <button
              onClick={() => setIsMapView(!isMapView)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {isMapView ? 'Show List View' : 'Show Spatial Map'}
            </button>
          </div>
        </div>

        {/* View Render: Spatial Map or Property Grid */}
        {isMapView ? (
          <PropertyMap
            properties={filteredProperties}
            currentCurrency={currentCurrency}
            currentLanguage={currentLanguage}
            onSelectProperty={(p) => setSelectedPropertyForDetail(p)}
            onOpenChat={(p) => {
              setSelectedPropertyForChat(p);
              setIsChatOpen(true);
            }}
            onCloseMapView={() => setIsMapView(false)}
          />
        ) : (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-14 sm:py-16 bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl mb-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.18)_0%,transparent_70%)] pointer-events-none" />
                
                <div className="relative z-10 max-w-xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-xl">
                    <Building className="w-8 h-8" />
                  </div>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Portal Ready · 100% Free Registration & Direct Listings</span>
                  </div>

                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                    Be the First Property Owner to List for Free!
                  </h3>

                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    KeyDirect Real Estate is completely free for early growth. Register your account, upload photos and 360° videos of your apartment, hotel, shop, room, self-contain, or warehouse, and connect directly with tenants worldwide without agent inspection charges.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setIsListPropertyOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Publish Property For Free (₦0 Fees)</span>
                    </button>

                    <button
                      onClick={() => setIsLazyCeoPlatformOpen(true)}
                      className="w-full sm:w-auto px-5 py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer border border-stone-700 flex items-center justify-center gap-2"
                    >
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span>Open LazyCEO Marketing Portal</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-center gap-4 text-xs text-stone-400">
                    <span>Preview option:</span>
                    <button
                      onClick={handleLoadShowcase}
                      className="text-red-400 hover:text-red-300 underline cursor-pointer font-semibold"
                    >
                      Load Verified Showcase Demonstration
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-lg text-stone-800">
                  {isShowingFavoritesOnly ? 'You have no saved favorite properties yet' : 'No properties matched your criteria'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {isShowingFavoritesOnly 
                    ? 'Click the heart icon on any property card to save it here for fast access.' 
                    : 'Try clearing your search location or resetting your minimum budget.'}
                </p>
                <button
                  onClick={() => {
                    setIsShowingFavoritesOnly(false);
                    setSearchLocation('');
                    setMinBudget('');
                    setMaxBudget('');
                    setBedroomCount('Bedrooms Any');
                    setAdvertiserFilter('Owners and agents');
                    setActiveCategory('Cities');
                  }}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-red-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between bg-stone-100 rounded-xl px-4 py-2 text-xs text-stone-600">
                  <span className="font-medium">Active Database: {properties.length} Registered Listings</span>
                  <button
                    onClick={handleResetEmpty}
                    className="text-stone-500 hover:text-red-600 underline font-semibold cursor-pointer"
                  >
                    Clear to Empty Live Mode
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      currentCurrency={currentCurrency}
                      currentLanguage={currentLanguage}
                      isFavorite={favorites.includes(prop.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectProperty={(p) => setSelectedPropertyForDetail(p)}
                      onOpenChat={(p) => {
                        setSelectedPropertyForChat(p);
                        setIsChatOpen(true);
                      }}
                      onOpenVirtualLook={(p) => setSelectedPropertyForVirtualLook(p)}
                      onScheduleInspection={(p) => {
                        setSelectedPropertyForInspection(p);
                        setIsScheduleInspectionOpen(true);
                      }}
                      onShare={(p) => {
                        setSelectedPropertyForShare(p);
                        setIsShareModalOpen(true);
                      }}
                      onOpenComments={(p) => handleOpenComments(p)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Trust & Anti-Scam Statistics Banner */}
      <TrustStatsBanner />

      {/* Global Real Estate Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
            
            {/* Brand column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 -rotate-45" />
                </div>
                <div>
                  <div className="font-heading font-black text-base text-white tracking-tight">KEYDIRECT</div>
                  <div className="text-[9px] tracking-widest text-red-500 font-bold uppercase">REAL ESTATE</div>
                </div>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Direct connections to real property owners. 100% Free Virtual Look & 360° Walkthroughs. ₦0 Inspection Fee Guarantee.
              </p>
              <div className="text-[11px] text-stone-500">
                Engineered by <strong className="text-white">SimeonJrStudios</strong><br />
                Leadership: <strong>CEO Afolabi Oluwadamilare Simeon</strong>
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <div className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-3">
                Party, Events & Land
              </div>
              <ul className="space-y-2">
                <li><button onClick={() => { setActiveCategory('Party Apartments'); }} className="hover:text-white cursor-pointer">Party Apartments & Rooftop Pools</button></li>
                <li><button onClick={() => { setActiveCategory('Event Centers'); }} className="hover:text-white cursor-pointer">Event Centers & Marquees (1,500 Cap)</button></li>
                <li><button onClick={() => { setActiveCategory('Plots / Land'); setLandAction('Buy Land'); }} className="hover:text-white cursor-pointer">Buy Land with C of O (Outright)</button></li>
                <li><button onClick={() => { setActiveCategory('Plots / Land'); setLandAction('Rent / Lease Land'); }} className="hover:text-white cursor-pointer">Rent / Lease Commercial Land</button></li>
                <li><button onClick={() => setIsBillboardOpen(true)} className="hover:text-white cursor-pointer">Global Digital Billboard for Any Business</button></li>
              </ul>
            </div>

            {/* Innovation Tools */}
            <div>
              <div className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-3">
                Innovations & Automation
              </div>
              <ul className="space-y-2">
                <li><button onClick={() => { if (properties.length > 0) setSelectedPropertyForVirtualLook(properties[0]); }} className="hover:text-white cursor-pointer font-bold text-red-400">Virtual Look 360° Theater (₦0 Fee)</button></li>
                <li><button onClick={() => setIsLazyCeoModalOpen(true)} className="hover:text-white cursor-pointer">LazyCEO™ Client-Hunter Agent</button></li>
                <li><button onClick={() => setIsSocialPosterOpen(true)} className="hover:text-white cursor-pointer">Social Media Auto-Poster</button></li>
                <li><button onClick={() => setIsCommunityChatOpen(true)} className="hover:text-white cursor-pointer">Community Real Estate Chat Rooms</button></li>
                <li><button onClick={() => setIsAnalyticsOpen(true)} className="hover:text-white cursor-pointer">Market Analytics & Capital Trends</button></li>
              </ul>
            </div>

            {/* Direct Verification */}
            <div>
              <div className="font-heading font-bold text-white uppercase text-xs tracking-wider mb-3">
                Trust & Compliance
              </div>
              <ul className="space-y-2">
                <li><button onClick={() => setIsAntiScamOpen(true)} className="hover:text-white cursor-pointer text-emerald-400 font-bold">Anti-Scam 4-Pillars Protocol</button></li>
                <li><button onClick={() => setIsListPropertyOpen(true)} className="hover:text-white cursor-pointer">Direct Property & Space Registration</button></li>
                <li><button onClick={() => setIsPublisherPortalOpen(true)} className="hover:text-white cursor-pointer">Owner Portal & Government Title Audit</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:text-white cursor-pointer">Verified Landlord & Agent Sign In</button></li>
                <li><button onClick={() => setIsAgentGuideOpen(true)} className="hover:text-white cursor-pointer text-amber-400 font-semibold">Agent Terms & ₦0 Inspection Guide</button></li>
                <li><button onClick={() => setIsLazyCeoPlatformOpen(true)} className="hover:text-white cursor-pointer text-amber-300 font-semibold">LazyCEO™ Marketing Platform</button></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <div>
              © 2026 KeyDirect Real Estate · Powered by SimeonJrStudios. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-stone-400">
              <span className="hover:text-white cursor-pointer" onClick={() => setIsAntiScamOpen(true)}>₦0 Inspection Fee Policy</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setIsListPropertyOpen(true)}>Manual Registration</span>
              <span>·</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setIsAuthOpen(true)}>Real Authentication</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Modals & Portals */}

      {/* 1. Virtual Look 360° & HD Walkthrough Theater */}
      <VirtualLookModal
        property={selectedPropertyForVirtualLook}
        isOpen={Boolean(selectedPropertyForVirtualLook)}
        onClose={() => setSelectedPropertyForVirtualLook(null)}
        currentCurrency={currentCurrency}
        onOpenChat={(p) => {
          setSelectedPropertyForVirtualLook(null);
          setSelectedPropertyForChat(p);
          setIsChatOpen(true);
        }}
      />

      {/* 2. Property Detail Inspection Modal */}
      <PropertyDetailModal
        property={selectedPropertyForDetail}
        onClose={() => setSelectedPropertyForDetail(null)}
        currentCurrency={currentCurrency}
        currentLanguage={currentLanguage}
        isFavorite={selectedPropertyForDetail ? favorites.includes(selectedPropertyForDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenChat={(p) => {
          setSelectedPropertyForDetail(null);
          setSelectedPropertyForChat(p);
          setIsChatOpen(true);
        }}
        onScheduleInspection={(p) => {
          setSelectedPropertyForDetail(null);
          setSelectedPropertyForInspection(p);
          setIsScheduleInspectionOpen(true);
        }}
        onOpenVirtualLook={(p) => {
          setSelectedPropertyForDetail(null);
          setSelectedPropertyForVirtualLook(p);
        }}
        onShare={(p) => {
          setSelectedPropertyForShare(p);
          setIsShareModalOpen(true);
        }}
        onOpenComments={(p) => handleOpenComments(p)}
      />

      {/* 3. Dedicated Schedule ₦0 Inspection Modal */}
      <ScheduleInspectionModal
        property={selectedPropertyForInspection}
        isOpen={isScheduleInspectionOpen}
        onClose={() => setIsScheduleInspectionOpen(false)}
        currentUser={currentUser}
        onSuccess={(insp) => {
          showToast(`₦0 Inspection booked for ${insp.date}! Landlord notified.`);
        }}
      />

      {/* 4. Direct Landlord 1-on-1 Chat Drawer */}
      <DirectChatDrawer
        property={selectedPropertyForChat}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* 5. Multi-User Community Chat Rooms */}
      <CommunityChatModal
        isOpen={isCommunityChatOpen}
        onClose={() => setIsCommunityChatOpen(false)}
        currentUser={currentUser}
        onRequireAuth={() => setIsAuthOpen(true)}
        onSelectPropertyById={(id) => {
          const found = properties.find((p) => p.id === id);
          if (found) setSelectedPropertyForDetail(found);
        }}
      />

      {/* 6. Publisher & Property Owner Portal (KYC Verification Center) */}
      <PublisherPortalModal
        isOpen={isPublisherPortalOpen}
        onClose={() => setIsPublisherPortalOpen(false)}
        currentUser={currentUser}
        properties={properties}
        onAddProperty={handleAddProperty}
        onAddBillboardAd={handleAddBillboardAd}
        currentCurrency={currentCurrency}
      />

      {/* 7. Digital Billboard (Properties + ANY Business Worldwide) */}
      <DigitalBillboardModal
        properties={properties}
        isOpen={isBillboardOpen}
        onClose={() => setIsBillboardOpen(false)}
        currentCurrency={currentCurrency}
        onSelectProperty={(p) => setSelectedPropertyForDetail(p)}
        onOpenChat={(p) => {
          setSelectedPropertyForChat(p);
          setIsChatOpen(true);
        }}
        onOpenPublisherPortal={() => setIsPublisherPortalOpen(true)}
        customBusinesses={billboardAds}
      />

      {/* 8. LazyCEO Autonomous Client Hunter Control Panel */}
      <LazyCeoModal
        isOpen={isLazyCeoModalOpen}
        onClose={() => setIsLazyCeoModalOpen(false)}
        leads={lazyCeoLeads}
        onAddManualLead={(lead) => handleLeadCaptured(lead)}
      />

      {/* 9. Account Analytics Modal */}
      <AccountAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        currentUser={currentUser}
        currentCurrency={currentCurrency}
      />

      {/* 10. Social Media Auto-Poster (TikTok, IG, WhatsApp, FB, LinkedIn) */}
      <SocialMediaAutoPosterModal
        isOpen={isSocialPosterOpen}
        onClose={() => setIsSocialPosterOpen(false)}
        properties={properties}
        billboards={billboardAds}
        currentCurrency={currentCurrency}
      />

      {/* 11. Anti-Scam 4-Pillars Trust Hub */}
      <AntiScamModal
        isOpen={isAntiScamOpen}
        onClose={() => setIsAntiScamOpen(false)}
      />

      {/* 12. LazyCEO Automated Marketing & Virtual 3D Showroom Platform */}
      <LazyCeoPlatform
        isOpen={isLazyCeoPlatformOpen}
        onClose={() => setIsLazyCeoPlatformOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Multi-Platform Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        property={selectedPropertyForShare}
        currentCurrency={currentCurrency}
      />

      {/* Facebook-style Community Comments Modal */}
      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        targetId={selectedPropertyForComments?.id || 'platform-global'}
        targetTitle={selectedPropertyForComments ? selectedPropertyForComments.title : 'KeyDirect & LazyCEO Community'}
        property={selectedPropertyForComments}
        currentUser={currentUser}
      />

      {/* Agent Commission Standards & Calculator Modal */}
      <AgentCommissionGuideModal
        isOpen={isAgentGuideOpen}
        onClose={() => setIsAgentGuideOpen(false)}
        currentCurrency={currentCurrency}
        onOpenListProperty={() => setIsListPropertyOpen(true)}
      />

      {/* 13. Manual List Property Modal (No Live API Key Required) */}
      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => setIsListPropertyOpen(false)}
        onAddProperty={handleAddProperty}
        currentCurrency={currentCurrency}
        currentUser={currentUser}
      />

      {/* 14. Real Active User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user as UserAccount);
          showToast(`Welcome, ${user.name}! Authenticated as ${user.role}.`);
        }}
      />

      {/* 15. User Profile & Account Management Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onLogout={() => {
          setActiveSession(null);
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
        onOpenListProperty={() => setIsListPropertyOpen(true)}
        onRoleChanged={(newRole) => {
          setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
          showToast(`Active role switched to ${newRole}!`);
        }}
        myListingsCount={userListingsCount}
        favoritesCount={favorites.length}
      />

      {/* 16. Activity & Audit Tracking System */}
      <ActivityTrackingModal
        isOpen={isActivityTrackerOpen}
        onClose={() => setIsActivityTrackerOpen(false)}
        currentUserRole={currentUser?.role || 'Owner'}
        currentUserName={currentUser?.name || 'Verified Landlord'}
        activities={activities}
        renterRequests={renterRequests}
        properties={properties}
        onOpenProperty={(p) => setSelectedPropertyForDetail(p)}
        onOpenChatWithProperty={(p) => {
          setSelectedPropertyForChat(p);
          setIsChatOpen(true);
        }}
        onOpenVirtualLook={(p) => setSelectedPropertyForVirtualLook(p)}
      />

    </div>
  );
}
