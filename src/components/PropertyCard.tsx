import React from 'react';
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  Sparkles,
  Zap,
  RotateCw,
  Video,
  PartyPopper,
  Heart,
  Calendar,
  MessageCircle,
  Link2,
  FileText,
  Camera,
  X
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types';
import { convertCurrency, formatCurrency } from '../utils/currency';
import { TRANSLATIONS } from '../utils/i18n';
import { SocialReactionRow } from './SocialReactionRow';

interface PropertyCardProps {
  property: Property;
  currentCurrency: string;
  currentLanguage: SupportedLanguage;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
  onOpenVirtualLook: (property: Property) => void;
  onScheduleInspection?: (property: Property) => void;
  onShare?: (property: Property) => void;
  onOpenComments?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currentCurrency,
  currentLanguage,
  isFavorite = false,
  onToggleFavorite,
  onSelectProperty,
  onOpenChat,
  onOpenVirtualLook,
  onScheduleInspection,
  onShare,
  onOpenComments,
}) => {
  const [showPaperModal, setShowPaperModal] = React.useState(false);
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Convert base price to active target currency
  const convertedPrice = convertCurrency(
    property.basePrice,
    property.baseCurrency,
    currentCurrency
  );

  const isDirectOwner = property.listingType === 'Direct Owner';
  const isDeveloper = property.listingType === 'Developer';
  const isParty = property.category === 'Party Apartments';
  const isEvent = property.category === 'Event Centers';

  const cleanPhone = property.owner.phone ? property.owner.phone.replace(/[^0-9]/g, '') : '2348039991122';

  return (
    <div className="group bg-white rounded-3xl border border-stone-200/90 hover:border-red-500/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Property Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Listing Type Tag */}
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs pointer-events-none ${
              isDirectOwner
                ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                : isDeveloper
                ? 'bg-indigo-600/90 text-white border border-indigo-400/40'
                : 'bg-stone-900/90 text-stone-200 border border-stone-700/50'
            }`}
          >
            {isDirectOwner ? 'Direct Owner (0% Fee)' : property.listingType}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Virtual Look Available Pill */}
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-600/95 text-white text-[11px] font-black backdrop-blur-md shadow-md animate-pulse pointer-events-none">
              <RotateCw className="w-3 h-3" />
              <span>360° Look</span>
            </span>

            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(property.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md ${
                  isFavorite
                    ? 'bg-red-600 text-white'
                    : 'bg-white/80 hover:bg-white text-stone-700 hover:text-red-600'
                }`}
                title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Anti-Inspection Fee Guarantee Image Overlay Tag */}
        <div className="absolute top-12 left-2 right-2 z-10 pointer-events-none">
          <div className="bg-red-600/90 text-white text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg text-center shadow-lg backdrop-blur-xs flex items-center justify-center gap-1.5 border border-red-400/30">
            <Zap className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="truncate">STOP PAYING AGENT INSPECTION FEES FOR PROPERTIES — SEE IT FOR FREE FROM ANYWHERE YOU ARE!</span>
          </div>
        </div>

        {/* Bottom image metadata: Category & City */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium pointer-events-none">
          <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold">
            {isParty && <PartyPopper className="w-3 h-3 text-red-400" />}
            {property.category}
          </span>
          <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
            <MapPin className="w-3 h-3 text-red-400" />
            {property.neighbourhood.split(',')[0]}, {property.state}
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Price & Savings Pill */}
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {formatCurrency(convertedPrice, currentCurrency)}
              </span>
              <span className="text-stone-500 text-xs font-semibold">
                /{property.pricePeriod}
              </span>
            </div>
            
            {/* ₦0 Inspection Fee Guarantee Callout */}
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              <Zap className="w-3 h-3 text-emerald-600" />
              ₦0 Inspection Fee
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="font-heading text-base font-bold text-stone-900 hover:text-red-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Location / Neighbourhood */}
          <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{property.address}</span>
          </p>
        </div>

        {/* Specifications Strip: Beds, Baths, Capacity, Title */}
        <div className="flex items-center gap-3 py-2 border-y border-stone-100 text-xs text-stone-600">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-stone-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-stone-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.eventSpecs?.guestCapacity && (
            <div className="flex items-center gap-1 font-bold text-stone-800">
              <PartyPopper className="w-3.5 h-3.5 text-red-500" />
              <span>{property.eventSpecs.guestCapacity} Guests</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{property.verification.documentType}</span>
          </div>
        </div>

        {/* Agent Terms / Direct Owner Commission Badge */}
        {property.owner.agentCommissionRate && (
          <div className="bg-stone-50 border border-stone-200/90 rounded-xl px-2.5 py-1 text-[10px] flex items-center justify-between">
            <span className="font-bold text-stone-700">Closing Terms:</span>
            <span className="font-black text-red-600 truncate ml-1">{property.owner.agentCommissionRate}</span>
          </div>
        )}

        {/* Action Buttons: Virtual Look (FREE) + Chat + Schedule Inspection */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
          
          {/* Owner info */}
          <div className="flex items-center gap-2 overflow-hidden max-w-[120px]">
            <img
              src={property.owner.avatar}
              alt={property.owner.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 shrink-0"
            />
            <div className="text-[11px] leading-tight truncate">
              <div className="font-bold text-stone-800 truncate">{property.owner.name}</div>
              <div className="text-stone-400 font-medium">{property.owner.role}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            
            {/* Primary Virtual Look 360 Button */}
            <button
              onClick={() => onOpenVirtualLook(property)}
              className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title="Inspect 360° Panorama and HD Walkthrough Online for Free"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Virtual Look</span>
            </button>

            {/* Direct WhatsApp Quick Connect */}
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hello ${property.owner.name}, I am viewing your verified property on KeyDirect: "${property.title}" in ${property.neighbourhood}. Is it available for inspection?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors cursor-pointer"
              title="Chat Directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>

            {/* Optional Snapped Paper Note / Gate Signpost */}
            {property.owner.contactPaperUrl && (
              <button
                onClick={() => setShowPaperModal(true)}
                className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 transition-colors cursor-pointer"
                title="View Handwritten Paper Note / Gate Signpost"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Optional Custom Anyhow Link */}
            {property.owner.customContactLink && (
              <a
                href={property.owner.customContactLink}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300 transition-colors cursor-pointer"
                title={property.owner.customContactLinkLabel || "Open Agent Link"}
              >
                <Link2 className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Schedule ₦0 Inspection */}
            {onScheduleInspection && (
              <button
                onClick={() => onScheduleInspection(property)}
                className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                title="Book ₦0 On-site Inspection"
              >
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
              </button>
            )}

            {/* In-app Chat */}
            <button
              onClick={() => onOpenChat(property)}
              className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="In-App Messaging"
            >
              <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
            </button>

            <button
              onClick={() => onSelectProperty(property)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="View Complete Property Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Paper Note / Signpost Lightbox Modal */}
        {showPaperModal && property.owner.contactPaperUrl && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={(e) => {
              e.stopPropagation();
              setShowPaperModal(false);
            }}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-4 overflow-hidden shadow-2xl border border-stone-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-black text-stone-900 text-sm">
                      {property.owner.name}’s Contact Note
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Handwritten paper / gate signpost photo
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaperModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 max-h-[60vh] flex items-center justify-center">
                <img
                  src={property.owner.contactPaperUrl}
                  alt="Handwritten contact note or signpost"
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                <a
                  href={`tel:${property.owner.phone}`}
                  className="flex-1 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold text-center"
                >
                  Call {property.owner.phone}
                </a>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Facebook-Style Like, Multi-Reaction, Comment & Share Row */}
        <SocialReactionRow
          targetId={property.id}
          onOpenComments={() => onOpenComments && onOpenComments(property)}
          onShare={() => onShare && onShare(property)}
        />

      </div>

    </div>
  );
};
