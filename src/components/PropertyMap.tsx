import React, { useState } from 'react';
import { MapPin, Navigation, Eye, MessageSquare, ShieldCheck, X, List, Layers, Compass } from 'lucide-react';
import { Property, SupportedLanguage } from '../types';
import { convertCurrency, formatCurrency } from '../utils/currency';

interface PropertyMapProps {
  properties: Property[];
  currentCurrency: string;
  currentLanguage: SupportedLanguage;
  onSelectProperty: (property: Property) => void;
  onOpenChat: (property: Property) => void;
  onCloseMapView: () => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  currentCurrency,
  onSelectProperty,
  onOpenChat,
  onCloseMapView,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    properties[0] || null
  );
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [activeZone, setActiveZone] = useState<string>('All');

  const zones = ['All', 'Lagos (Island/Lekki)', 'Lagos (Mainland)', 'Abuja (FCT)', 'Port Harcourt', 'Global'];

  const filteredProperties = properties.filter((p) => {
    if (activeZone === 'All') return true;
    if (activeZone === 'Lagos (Island/Lekki)') {
      return p.state === 'Lagos' && (p.lga.includes('Eti-Osa') || p.neighbourhood.includes('Lekki') || p.neighbourhood.includes('Ikoyi') || p.neighbourhood.includes('Victoria'));
    }
    if (activeZone === 'Lagos (Mainland)') {
      return p.state === 'Lagos' && (p.neighbourhood.includes('Ikeja') || p.neighbourhood.includes('Yaba'));
    }
    if (activeZone === 'Abuja (FCT)') return p.state.includes('Abuja');
    if (activeZone === 'Port Harcourt') return p.state.includes('Rivers');
    if (activeZone === 'Global') return p.state === 'Dubai' || p.state === 'London';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col h-[750px] relative">
        
        {/* Map Header Bar */}
        <div className="bg-stone-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm tracking-wide">
                KeyDirect Interactive Spatial Map
              </div>
              <div className="text-[11px] text-stone-400">
                PostGIS Geo-Indexed Listings · {filteredProperties.length} Verified Properties Located
              </div>
            </div>
          </div>

          {/* Zone filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeZone === zone
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Return to list button */}
          <button
            onClick={onCloseMapView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 transition-colors cursor-pointer"
          >
            <List className="w-3.5 h-3.5 text-red-400" />
            <span>List View</span>
          </button>
        </div>

        {/* Map Canvas with Interactive Pinpoints */}
        <div className="flex-1 relative bg-stone-950 overflow-hidden flex items-center justify-center">
          
          {/* Map stylized background grid and vector water bodies */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Topographical vector styling representation */}
          <svg className="absolute inset-0 w-full h-full text-stone-850 stroke-stone-800 pointer-events-none" fill="none">
            <path d="M-100,200 Q200,300 450,220 T900,400 T1400,280" strokeWidth="60" stroke="#1c2438" />
            <path d="M100,550 Q500,450 850,580 T1500,500" strokeWidth="80" stroke="#162235" />
            <path d="M300,-50 L400,800" strokeWidth="4" strokeDasharray="6 6" />
            <path d="M800,-50 L750,800" strokeWidth="4" strokeDasharray="6 6" />
          </svg>

          {/* Map Overlay Controls */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-stone-900/90 backdrop-blur-md rounded-xl p-1.5 border border-stone-800 shadow-lg flex gap-1">
              <button
                onClick={() => setMapStyle('streets')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  mapStyle === 'streets' ? 'bg-red-600 text-white' : 'text-stone-300 hover:text-white'
                }`}
              >
                Topographic
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${
                  mapStyle === 'satellite' ? 'bg-red-600 text-white' : 'text-stone-300 hover:text-white'
                }`}
              >
                Satellite
              </button>
            </div>
            
            <div className="bg-stone-900/90 backdrop-blur-md rounded-xl p-2.5 border border-stone-800 text-[11px] text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Direct Owner (0% Fee)</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Verified Agent</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Developer</span>
              </div>
            </div>
          </div>

          {/* Render Spatial Pins distributed on coordinates */}
          <div className="relative w-full h-full max-w-4xl max-h-[550px] mx-auto p-8 flex flex-wrap items-center justify-around content-around">
            {filteredProperties.map((prop, idx) => {
              const convertedPrice = convertCurrency(prop.basePrice, prop.baseCurrency, currentCurrency);
              const formattedPrice = formatCurrency(convertedPrice, currentCurrency, true);
              const isSelected = selectedProperty?.id === prop.id;
              const isDirectOwner = prop.listingType === 'Direct Owner';

              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProperty(prop)}
                  className={`m-4 transition-all duration-300 cursor-pointer transform hover:scale-110 z-20 ${
                    isSelected ? 'scale-115 z-30' : ''
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-xl border backdrop-blur-md ${
                      isSelected
                        ? 'bg-red-600 text-white border-white ring-4 ring-red-500/30'
                        : isDirectOwner
                        ? 'bg-stone-900/95 text-emerald-400 border-emerald-500/50 hover:bg-stone-900 hover:border-emerald-400'
                        : 'bg-stone-900/95 text-white border-stone-700 hover:border-stone-500'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : isDirectOwner ? 'text-emerald-400' : 'text-red-500'}`} />
                    <span>{formattedPrice}</span>
                  </div>
                  <div className="text-[10px] text-center font-semibold text-stone-300 mt-1 drop-shadow-md truncate max-w-[120px]">
                    {prop.neighbourhood.split(',')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Property Floating Preview Card */}
          {selectedProperty && (
            <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-stone-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  selectedProperty.listingType === 'Direct Owner' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  {selectedProperty.listingType}
                </span>

                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="overflow-hidden flex-1">
                  <div className="font-heading font-black text-lg text-stone-900 leading-tight">
                    {formatCurrency(
                      convertCurrency(selectedProperty.basePrice, selectedProperty.baseCurrency, currentCurrency),
                      currentCurrency
                    )}
                    <span className="text-xs font-normal text-stone-500"> /{selectedProperty.pricePeriod}</span>
                  </div>
                  <div className="text-xs font-bold text-stone-800 truncate mt-0.5">
                    {selectedProperty.title}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{selectedProperty.neighbourhood}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedProperty.verification.documentType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenChat(selectedProperty)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
