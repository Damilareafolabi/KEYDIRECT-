import React, { useState } from 'react';
import { 
  KeyRound, 
  Tv, 
  ShieldCheck, 
  Code2, 
  PlusCircle, 
  User, 
  Globe, 
  DollarSign, 
  ChevronDown, 
  Menu, 
  X,
  MessageSquare,
  Users,
  Building,
  TrendingUp,
  Share2,
  Bot,
  PartyPopper,
  Sparkles,
  Heart,
  Activity
} from 'lucide-react';
import { PropertyCategory, SupportedLanguage, UserRole } from '../types';
import { CURRENCY_RATES } from '../utils/currency';
import { TRANSLATIONS } from '../utils/i18n';

interface NavbarProps {
  activeCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  currentCurrency: string;
  onSelectCurrency: (currency: string) => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (language: SupportedLanguage) => void;
  onOpenBillboard: () => void;
  onOpenBackendCode?: () => void;
  onOpenAntiScam: () => void;
  onOpenListProperty: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onOpenChat: () => void;
  onOpenCommunityChat: () => void;
  onOpenPublisherPortal: () => void;
  onOpenAnalytics: () => void;
  onOpenSocialAutoPoster: () => void;
  onOpenLazyCeo: () => void;
  onOpenActivityTracker?: () => void;
  onSharePlatform?: () => void;
  onOpenAgentGuide?: () => void;
  favoritesCount?: number;
  onToggleFavoritesFilter?: () => void;
  isShowingFavoritesOnly?: boolean;
  currentUser: { name: string; role: UserRole; email: string } | null;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  currentCurrency,
  onSelectCurrency,
  currentLanguage,
  onSelectLanguage,
  onOpenBillboard,
  onOpenBackendCode,
  onOpenAntiScam,
  onOpenListProperty,
  onOpenAuth,
  onOpenProfile,
  onOpenChat,
  onOpenCommunityChat,
  onOpenPublisherPortal,
  onOpenAnalytics,
  onOpenSocialAutoPoster,
  onOpenLazyCeo,
  onOpenActivityTracker,
  onSharePlatform,
  onOpenAgentGuide,
  favoritesCount = 0,
  onToggleFavoritesFilter,
  isShowingFavoritesOnly = false,
  currentUser,
  unreadCount = 1,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const navCategories: PropertyCategory[] = [
    'Apartments',
    'Party Apartments',
    'Event Centers',
    'Plots / Land',
    'Commercial',
    'Hotels',
    'Rental',
  ];

  const languageLabels: Record<SupportedLanguage, { label: string; flag: string }> = {
    en: { label: 'English', flag: '🇬🇧' },
    yo: { label: 'Yorùbá', flag: '🇳🇬' },
    ha: { label: 'Hausa', flag: '🇳🇬' },
    ig: { label: 'Igbo', flag: '🇳🇬' },
    fr: { label: 'Français', flag: '🇫🇷' },
    es: { label: 'Español', flag: '🇪🇸' },
    ar: { label: 'العربية', flag: '🇦🇪' },
    zh: { label: '中文', flag: '🇨🇳' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      
      {/* Top micro-bar: Leadership & Trust ticker + Feature Shortcuts */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Zero Agent Commissions
          </span>
          <span className="text-stone-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-stone-300">
            Engineered by <strong className="text-white">SimeonJrStudios</strong> · Leadership: CEO Afolabi Oluwadamilare Simeon
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          
          {/* LazyCEO hunter shortcut */}
          <button
            onClick={onOpenLazyCeo}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer text-xs"
            title="LazyCEO Autonomous Client Hunter"
          >
            <Bot className="w-3.5 h-3.5 text-red-500" />
            <span>LazyCEO™</span>
          </button>

          <span className="text-stone-700">|</span>

          {/* Social Auto-Poster */}
          <button
            onClick={onOpenSocialAutoPoster}
            className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="TikTok, IG, WhatsApp, FB, LinkedIn Auto-Poster"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Social Auto-Poster</span>
          </button>

          <span className="text-stone-700">|</span>

          {/* Analytics */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="View Account Performance Analytics"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          <span className="text-stone-700">|</span>

          {/* Activity & Audit Tracker */}
          {onOpenActivityTracker && (
            <>
              <button
                onClick={onOpenActivityTracker}
                className="flex items-center gap-1 text-cyan-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                title="Seller Audit Dashboard & Renter Request Tracker"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Audit Tracker</span>
              </button>

              <span className="text-stone-700">|</span>
            </>
          )}

          {/* Agent Guide & Commission Standards */}
          {onOpenAgentGuide && (
            <>
              <button
                onClick={onOpenAgentGuide}
                className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                title="Agent Earnings & ₦0 Inspection Fee Standards"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Agent Terms & ₦0 Rule</span>
              </button>

              <span className="text-stone-700">|</span>
            </>
          )}

          {/* Anti-Scam Shield */}
          <button
            onClick={onOpenAntiScam}
            className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Anti-Scam</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('Cities')}>
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <KeyRound className="w-5 h-5 -rotate-45" />
            </div>
            <div className="leading-tight">
              <span className="font-heading text-lg font-black tracking-tight text-stone-900 block">
                KEYDIRECT
              </span>
              <span className="text-[10px] tracking-widest font-bold text-red-600 block uppercase">
                REAL ESTATE
              </span>
            </div>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'text-red-600 bg-red-50'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {category === 'Party Apartments' && <PartyPopper className="w-3 h-3 text-red-500" />}
                    {category}
                    {category === 'Cities' && <ChevronDown className="w-3 h-3 opacity-60" />}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Global Controls & Actions */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLanguageDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer border border-stone-200"
                title="Select Currency"
              >
                <DollarSign className="w-3.5 h-3.5 text-stone-500" />
                <span>{currentCurrency}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Display Currency
                  </div>
                  {Object.values(CURRENCY_RATES).map((rate) => (
                    <button
                      key={rate.code}
                      onClick={() => {
                        onSelectCurrency(rate.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                        currentCurrency === rate.code ? 'font-bold text-red-600 bg-red-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{rate.name}</span>
                      <span className="font-mono text-stone-500 font-semibold">{rate.symbol} {rate.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLanguageDropdownOpen(!languageDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer border border-stone-200"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>{currentLanguage.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Switch Language
                  </div>
                  {(Object.keys(languageLabels) as SupportedLanguage[]).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => {
                        onSelectLanguage(langKey);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                        currentLanguage === langKey ? 'font-bold text-red-600 bg-red-50/50' : 'text-stone-700'
                      }`}
                    >
                      <span>{languageLabels[langKey].label}</span>
                      <span>{languageLabels[langKey].flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Community Multi-User Chat Room */}
            <button
              onClick={onOpenCommunityChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors cursor-pointer"
              title="Join Public Real Estate & Party Chat Rooms"
            >
              <Users className="w-3.5 h-3.5 text-red-600" />
              <span>Chat Rooms</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </button>

            {/* Digital Billboard Button */}
            <button
              onClick={onOpenBillboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 hover:text-red-600 hover:bg-red-50 rounded-lg border border-stone-300 transition-colors cursor-pointer"
              title="Global Digital Billboard for Any Business"
            >
              <Tv className="w-3.5 h-3.5 text-red-600" />
              <span>Billboard</span>
            </button>

            {/* Publisher & Owner Portal Button */}
            <button
              onClick={onOpenPublisherPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-lg transition-all cursor-pointer shadow-xs"
              title="Property Owner Publishing Portal & KYC Document Center"
            >
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>Owner Portal</span>
            </button>

            {/* Share Platform to the World Button */}
            {onSharePlatform && (
              <button
                onClick={onSharePlatform}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg shadow-sm shadow-red-600/30 transition-all cursor-pointer"
                title="Share KeyDirect & LazyCEO to the World"
              >
                <Globe className="w-3.5 h-3.5 text-white" />
                <span className="hidden xl:inline">Share to World</span>
                <span className="xl:hidden">Share</span>
              </button>
            )}

            {/* Saved Favorites Button */}
            {onToggleFavoritesFilter && (
              <button
                onClick={onToggleFavoritesFilter}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  isShowingFavoritesOnly
                    ? 'bg-red-50 border-red-500 text-red-600 shadow-2xs'
                    : 'text-stone-700 bg-stone-100 hover:bg-stone-200 border-stone-200'
                }`}
                title="View Saved Favorite Listings"
              >
                <Heart className={`w-3.5 h-3.5 ${isShowingFavoritesOnly || favoritesCount > 0 ? 'fill-red-600 text-red-600' : 'text-stone-500'}`} />
                <span className="hidden lg:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account Login / Profile */}
            <button
              onClick={currentUser ? (onOpenProfile || onOpenAuth) : onOpenAuth}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border ${
                currentUser
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700 font-semibold'
              }`}
              title={currentUser ? `Logged in as ${currentUser.name} (${currentUser.role}) - Click for Profile` : 'Sign In / Register'}
            >
              {currentUser ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name[0]?.toUpperCase()}
                  </div>
                  <span className="hidden xl:inline text-xs truncate max-w-[85px]">{currentUser.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span className="text-xs">Sign In</span>
                </>
              )}
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCommunityChat}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
              title="Chat Rooms"
            >
              <Users className="w-5 h-5 text-red-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100">
            {navCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onSelectCategory(category);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg text-left ${
                  activeCategory === category ? 'bg-red-50 text-red-600' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenPublisherPortal();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-center text-xs font-bold text-white bg-stone-900 rounded-lg"
            >
              Owner Portal & KYC
            </button>
            <button
              onClick={() => {
                onOpenCommunityChat();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-center text-xs font-bold text-stone-800 bg-stone-100 rounded-lg flex items-center justify-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-red-600" />
              Chat Rooms
            </button>
            {onSharePlatform && (
              <button
                onClick={() => {
                  onSharePlatform();
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 text-center text-xs font-black text-white bg-linear-to-r from-red-600 to-rose-600 rounded-lg flex items-center justify-center gap-1 shadow-sm"
              >
                <Globe className="w-3.5 h-3.5" />
                Share World
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenBillboard();
                setMobileMenuOpen(false);
              }}
              className="py-2 text-center text-xs font-bold text-stone-700 bg-stone-100 rounded-lg"
            >
              Billboard
            </button>
            <button
              onClick={() => {
                onOpenAnalytics();
                setMobileMenuOpen(false);
              }}
              className="py-2 text-center text-xs font-bold text-stone-700 bg-stone-100 rounded-lg"
            >
              Analytics
            </button>
            <button
              onClick={() => {
                onOpenSocialAutoPoster();
                setMobileMenuOpen(false);
              }}
              className="py-2 text-center text-xs font-bold text-stone-700 bg-stone-100 rounded-lg"
            >
              Auto-Poster
            </button>
          </div>

          <div className="pt-2 flex gap-2">
            {onToggleFavoritesFilter && (
              <button
                onClick={() => {
                  onToggleFavoritesFilter();
                  setMobileMenuOpen(false);
                }}
                className={`flex-1 py-2.5 text-center text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${
                  isShowingFavoritesOnly ? 'bg-red-50 border-red-500 text-red-600' : 'bg-stone-100 border-stone-200 text-stone-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-red-600 text-red-600' : ''}`} />
                <span>Saved ({favoritesCount})</span>
              </button>
            )}
            <button
              onClick={() => {
                if (currentUser) {
                  (onOpenProfile || onOpenAuth)();
                } else {
                  onOpenAuth();
                }
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-red-600 rounded-lg cursor-pointer"
            >
              {currentUser ? `Profile: ${currentUser.name.split(' ')[0]}` : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
