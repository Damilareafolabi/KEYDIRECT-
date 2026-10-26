import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Mic, 
  Map, 
  List, 
  ChevronDown, 
  CheckCircle2, 
  X,
  PartyPopper,
  Sparkles,
  Zap,
  Building
} from 'lucide-react';
import { PropertyCategory, SupportedLanguage, LandAction } from '../types';
import { CURRENCY_RATES } from '../utils/currency';
import { TRANSLATIONS } from '../utils/i18n';

interface SearchCardProps {
  activeCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  searchLocation: string;
  onSearchLocationChange: (val: string) => void;
  propertyType: string;
  onPropertyTypeChange: (val: string) => void;
  bedroomCount: string;
  onBedroomCountChange: (val: string) => void;
  minBudget: string;
  onMinBudgetChange: (val: string) => void;
  maxBudget: string;
  onMaxBudgetChange: (val: string) => void;
  advertiserFilter: string;
  onAdvertiserFilterChange: (val: string) => void;
  landAction: LandAction;
  onLandActionChange: (action: LandAction) => void;
  isMapView: boolean;
  onToggleMapView: () => void;
  onTriggerSearch: () => void;
  currentCurrency: string;
  currentLanguage: SupportedLanguage;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  activeCategory,
  onSelectCategory,
  searchLocation,
  onSearchLocationChange,
  propertyType,
  onPropertyTypeChange,
  bedroomCount,
  onBedroomCountChange,
  minBudget,
  onMinBudgetChange,
  maxBudget,
  onMaxBudgetChange,
  advertiserFilter,
  onAdvertiserFilterChange,
  landAction,
  onLandActionChange,
  isMapView,
  onToggleMapView,
  onTriggerSearch,
  currentCurrency,
  currentLanguage,
}) => {
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currencySymbol = CURRENCY_RATES[currentCurrency]?.symbol.trim() || '₦';

  const categoryTabs: PropertyCategory[] = [
    'Apartments',
    'Party Apartments',
    'Event Centers',
    'Plots / Land',
    'Commercial',
    'Hotels',
    'Rental',
  ];

  const propertyTypes = [
    'All Types',
    'Self Contain (Room & Parlour)',
    'Studio Apartment',
    '1 Bedroom Flat',
    '2 Bedroom Apartment',
    '3 Bedroom Flat',
    '4 Bedroom Duplex',
    '5+ Bedroom Mansion',
    'Shops & Retail Plaza',
    'Warehouses & Logistics Hubs',
    'Party Penthouse (Soundproof)',
    'Event Marquee & Hall',
    'Hotels & Shortlet Suites',
    'Commercial Office Space',
    'Plots / Land',
  ];

  const bedroomOptions = [
    'Bedrooms Any',
    'Self Contain (0-1 Bed)',
    '1 Bedroom',
    '2 Bedrooms',
    '3 Bedrooms',
    '4 Bedrooms',
    '5+ Bedrooms',
  ];

  const advertiserOptions = [
    'Owners and agents',
    'Direct Owners Only',
    'Verified Agents',
    'Developers',
  ];

  const quickCities = [
    'Lekki Phase 1',
    'Victoria Island',
    'Maitama Abuja',
    'Ikeja GRA',
    'Old GRA Port Harcourt',
  ];

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-NG';
        setIsListeningVoice(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onSearchLocationChange(transcript);
          setIsListeningVoice(false);
        };
        recognition.onerror = () => setIsListeningVoice(false);
        recognition.onend = () => setIsListeningVoice(false);
        recognition.start();
      } catch (e) {
        setIsListeningVoice(false);
      }
    } else {
      onSearchLocationChange('Lekki Phase 1, Lagos');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden transform -translate-y-6 sm:-translate-y-8 relative z-20">
      
      {/* Category Tabs Header */}
      <div className="flex items-center overflow-x-auto border-b border-stone-100 px-3 sm:px-6 pt-3 pb-0 no-scrollbar gap-1 sm:gap-1.5 bg-stone-50/70">
        {categoryTabs.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-2.5 text-xs sm:text-sm font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                isActive
                  ? 'text-red-600 border-red-600 font-bold bg-white rounded-t-lg shadow-2xs'
                  : 'text-stone-600 border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              {cat === 'Party Apartments' && <PartyPopper className="w-3.5 h-3.5 text-red-500" />}
              {cat === 'Event Centers' && <Building className="w-3.5 h-3.5 text-indigo-500" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Main Filter Body */}
      <div className="p-4 sm:p-6 space-y-4">
        
        {/* Special Land Action Bar (When Plots / Land is selected: Rent or Buy) */}
        {activeCategory === 'Plots / Land' && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900">
            <span className="font-bold flex items-center gap-1.5">
              <span>Land Transaction Intent:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {(['Any', 'Buy Land', 'Rent / Lease Land'] as LandAction[]).map((action) => (
                <button
                  key={action}
                  onClick={() => onLandActionChange(action)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer border ${
                    landAction === action
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Special Party / Event helper banner */}
        {activeCategory === 'Party Apartments' && (
          <div className="flex items-center justify-between p-2.5 bg-red-50/80 rounded-xl border border-red-200 text-xs text-red-900">
            <span className="font-bold flex items-center gap-1.5">
              <PartyPopper className="w-4 h-4 text-red-600" />
              <span>Party Zoned: Soundproof glass, rooftop heated pools, DJ Pioneer hookup & zero curfew.</span>
            </span>
            <span className="text-[11px] font-bold bg-red-600 text-white px-2 py-0.5 rounded">
              0% Agent Fee
            </span>
          </div>
        )}

        {/* ROW 1: Search Location + Property Type + Search Action + Map View Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Location */}
          <div className="md:col-span-6 relative">
            <div className="flex items-center bg-stone-50 hover:bg-stone-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 border border-stone-200 rounded-xl px-3.5 py-3 transition-all">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => onSearchLocationChange(e.target.value)}
                placeholder={activeCategory === 'Party Apartments' ? 'Search Lagos / Abuja party pads...' : t.searchPlaceholder}
                className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none font-medium"
              />
              {searchLocation && (
                <button
                  onClick={() => onSearchLocationChange('')}
                  className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  isListeningVoice
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-stone-400 hover:text-red-600 hover:bg-stone-200'
                }`}
                title="Voice Search Nigerian Cities or Neighbourhoods"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => onPropertyTypeChange(e.target.value)}
                className="w-full appearance-none bg-stone-50 hover:bg-stone-100/80 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border border-stone-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-stone-800 font-medium transition-all cursor-pointer pr-8"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Red Search Button + Map View Toggle */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={onTriggerSearch}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-5 rounded-xl shadow-md shadow-red-600/30 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchBtn}</span>
            </button>

            {/* Map Toggle Button */}
            <button
              onClick={onToggleMapView}
              className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center border ${
                isMapView
                  ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              }`}
              title={isMapView ? 'Switch to List View' : 'Switch to Map View'}
            >
              {isMapView ? <List className="w-5 h-5" /> : <Map className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ROW 2: Bedrooms + Min Budget + Max Budget + Advertiser dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-stone-100">
          
          {/* Bedrooms */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Bedrooms / Capacity
            </label>
            <div className="relative">
              <select
                value={bedroomCount}
                onChange={(e) => onBedroomCountChange(e.target.value)}
                className="w-full appearance-none bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-medium transition-all cursor-pointer pr-8"
              >
                {bedroomOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Min Budget */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Min Budget ({currencySymbol})
            </label>
            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-red-500 focus-within:bg-white">
              <span className="text-xs font-mono font-bold text-stone-400 mr-1.5">{currencySymbol}</span>
              <input
                type="text"
                value={minBudget}
                onChange={(e) => onMinBudgetChange(e.target.value)}
                placeholder={t.noMinimum}
                className="w-full text-xs text-stone-800 font-medium placeholder:text-stone-400 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Max Budget */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Max Budget ({currencySymbol})
            </label>
            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-red-500 focus-within:bg-white">
              <span className="text-xs font-mono font-bold text-stone-400 mr-1.5">{currencySymbol}</span>
              <input
                type="text"
                value={maxBudget}
                onChange={(e) => onMaxBudgetChange(e.target.value)}
                placeholder={t.noMaximum}
                className="w-full text-xs text-stone-800 font-medium placeholder:text-stone-400 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Advertiser Filter */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              {t.advertiserLabel}
            </label>
            <div className="relative">
              <select
                value={advertiserFilter}
                onChange={(e) => onAdvertiserFilterChange(e.target.value)}
                className="w-full appearance-none bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-medium transition-all cursor-pointer pr-8"
              >
                {advertiserOptions.map((adv) => (
                  <option key={adv} value={adv}>
                    {adv}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-stone-500">
          <span className="font-semibold text-stone-400 text-[11px] uppercase mr-1">Popular:</span>
          {quickCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                onSearchLocationChange(city);
                onTriggerSearch();
              }}
              className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
            >
              {city}
            </button>
          ))}
          {advertiserFilter === 'Direct Owners Only' && (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Direct Owner Verified (0% Commission)
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
