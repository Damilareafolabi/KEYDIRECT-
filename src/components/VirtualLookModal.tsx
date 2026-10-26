import React, { useState, useRef } from 'react';
import { 
  X, 
  RotateCw, 
  Video, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  DollarSign, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  Eye,
  Zap,
  PartyPopper,
  Compass
} from 'lucide-react';
import { Property, SupportedLanguage } from '../types';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface VirtualLookModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onOpenChat: (property: Property) => void;
}

export const VirtualLookModal: React.FC<VirtualLookModalProps> = ({
  property,
  isOpen,
  onClose,
  currentCurrency,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'360' | 'video' | 'floorplan'>('360');
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [panX, setPanX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen || !property) return null;

  const rooms = property.virtualTour360Rooms || [
    {
      name: 'Main Living & Entertainment Space',
      panoramaUrl: property.images[0],
      description: 'Spacious high-ceiling area with floor-to-ceiling glass and ambient lighting.',
      hotspots: ['Fitted AC', 'High-Speed Wi-Fi Point', 'Direct Balcony Access'],
    },
    {
      name: 'Master Suite & Private Lounge',
      panoramaUrl: property.images[1] || property.images[0],
      description: 'King-sized layout with luxury en-suite bathroom and acoustic sound isolation.',
      hotspots: ['En-suite Jacuzzi', 'Walk-in Wardrobe', 'Balcony View'],
    },
  ];

  const currentRoom = rooms[activeRoomIndex] || rooms[0];
  const convertedPrice = convertCurrency(property.basePrice, property.baseCurrency, currentCurrency);
  const savedFeeNgn = property.inspectionFeeSavedNgn || 15000;
  const convertedSavedFee = convertCurrency(savedFeeNgn, 'NGN', currentCurrency);

  // Mouse pan handlers for 360 look around
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX - panX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-stone-950 text-white rounded-3xl max-w-6xl w-full h-[92vh] overflow-hidden shadow-2xl border border-stone-800 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <RotateCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg tracking-tight uppercase text-white">
                  Virtual Look™ 360° Inspection Theater
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  ₦0 INSPECTION FEE
                </span>
              </div>
              <div className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-white font-bold">{property.title}</span>
                <span>·</span>
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span>{property.neighbourhood}, {property.state}</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('360')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === '360'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>360° Rooms ({rooms.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>HD Video Tour</span>
            </button>

            <button
              onClick={() => setActiveTab('floorplan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'floorplan'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Floor Plan</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ₦0 Inspection Fee Savings Guarantee Banner */}
        <div className="bg-emerald-950/80 px-4 sm:px-6 py-2 border-b border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero Inspection Fee Guarantee:</strong> You just saved <strong className="text-white underline">{formatCurrency(convertedSavedFee, currentCurrency)}</strong> by inspecting this property virtually on KeyDirect! No street agent viewing fee is ever charged.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Title: {property.verification.documentType}</span>
          </div>
        </div>

        {/* Main Stage Display Area */}
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center select-none">
          
          {/* TAB 1: 360° INTERACTIVE PANORAMIC LOOK AROUND */}
          {activeTab === '360' && (
            <div 
              className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Pan Canvas with Scaled Image */}
              <div 
                className="absolute inset-0 w-[200%] h-full transition-transform ease-out duration-75"
                style={{
                  transform: `translateX(${panX % 800}px)`,
                  backgroundImage: `url(${currentRoom.panoramaUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

              {/* 360° Interactive Hotspot Markers */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-around p-8">
                {currentRoom.hotspots.map((spot, i) => (
                  <div key={i} className="pointer-events-auto transform hover:scale-110 transition-transform">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 text-white border border-red-500 shadow-xl backdrop-blur-md text-xs font-bold">
                      <Sparkles className="w-3 h-3 text-red-400" />
                      <span>{spot}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Instruction Overlay */}
              <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-center gap-2 pointer-events-none">
                <Compass className="w-4 h-4 text-red-500 animate-spin-slow" />
                <span>Click & drag horizontally to rotate 360° view</span>
              </div>

              {/* Room Description Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-stone-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-stone-800 pointer-events-auto">
                <div className="font-bold text-sm text-white flex items-center gap-1.5 mb-0.5">
                  <span>{currentRoom.name}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {currentRoom.description}
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: FULL HD VIDEO WALKTHROUGH */}
          {activeTab === 'video' && (
            <div className="w-full h-full relative bg-stone-950 flex items-center justify-center">
              <video
                src={property.videoTourUrl || 'https://assets.mixkit.co/videos/preview/mixkit-modern-interior-of-a-living-room-41525-large.mp4'}
                autoPlay
                loop
                muted={isMuted}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent pointer-events-none" />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer"
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="text-xs">
                    <span className="font-bold text-white">Full HD Video Walkthrough</span>
                    <span className="text-stone-400 block text-[11px]">KeyDirect On-Site Inspection Recording</span>
                  </div>
                </div>

                <div className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-xl">
                  100% Free Online Viewing
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURAL FLOOR PLAN */}
          {activeTab === 'floorplan' && (
            <div className="w-full h-full relative p-6 flex flex-col items-center justify-center bg-stone-950 text-center">
              <div className="max-w-2xl w-full bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-2xl">
                <img
                  src={property.floorPlanUrl || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'}
                  alt="Verified Architectural Floor Plan"
                  className="w-full h-72 sm:h-96 object-cover rounded-xl"
                />
                <div className="mt-4 flex items-center justify-between text-xs text-stone-300">
                  <div className="text-left">
                    <div className="font-bold text-white">Verified 2D Architectural Schematic</div>
                    <div className="text-stone-400 text-[11px]">Total Living Area: {property.areaSqFt?.toLocaleString() || '3,400'} Sq Ft</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-lg font-bold">
                    Surveyor Verified
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Room Selector Strip & Direct Contact Actions */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
          
          {/* Room switcher buttons */}
          {activeTab === '360' && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                Jump to Room:
              </span>
              {rooms.map((room, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveRoomIndex(idx);
                    setPanX(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    activeRoomIndex === idx
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Owner Action */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto ml-auto">
            <div className="text-right">
              <div className="font-heading text-lg font-black text-white">
                {formatCurrency(convertedPrice, currentCurrency)}
              </div>
              <div className="text-[10px] text-stone-400 uppercase">
                /{property.pricePeriod} (0% Agent Fee)
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenChat(property);
              }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Deal Directly with Owner</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
