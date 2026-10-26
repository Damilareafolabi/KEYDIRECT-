import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles,
  Lock,
  Layers,
  MapPin,
  PartyPopper
} from 'lucide-react';
import { Property, UserRole } from '../types';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onOpenSafePay: (property: Property) => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  property,
  onOpenSafePay,
}) => {
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [activeView, setActiveView] = useState<'camera' | '360tour' | 'splitscreen'>('camera');
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Live Encrypted Walkthrough'>('Connecting');
  const [currentPanoramaIndex, setCurrentPanoramaIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setConnectionStatus('Connecting');
      return;
    }

    const timer = setTimeout(() => {
      setConnectionStatus('Live Encrypted Walkthrough');
    }, 1200);

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen || !property) return null;

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const rooms = property.virtualTour360Rooms || [
    {
      name: 'Main Living Hall & Lounge',
      panoramaUrl: property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'Living room with luxury marble finish and 24/7 power.',
      hotspots: ['Main Entry', 'Balcony View'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-stone-950 rounded-3xl max-w-5xl w-full h-[92vh] max-h-[820px] shadow-2xl border border-stone-800 flex flex-col relative overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-linear-to-b from-black/90 via-black/50 to-transparent p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-900 absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-sm sm:text-base text-white">
                  {property.owner.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Identity
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <span className="text-emerald-400 font-bold">{connectionStatus}</span>
                <span>·</span>
                <span className="font-mono">{formatCallTime(callDuration)}</span>
                <span>·</span>
                <span className="text-stone-400">{property.title.substring(0, 30)}...</span>
              </div>
            </div>
          </div>

          {/* Mode Switchers */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-stone-900/90 border border-stone-700/80 rounded-2xl p-1 text-xs">
              <button
                onClick={() => setActiveView('camera')}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  activeView === 'camera' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                Owner Video
              </button>
              <button
                onClick={() => setActiveView('360tour')}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === '360tour' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                360° Walkthrough
              </button>
              <button
                onClick={() => setActiveView('splitscreen')}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'splitscreen' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                Split Screen
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Video Canvas Area */}
        <div className="flex-1 relative w-full h-full bg-stone-950 flex items-center justify-center overflow-hidden">
          
          {activeView === 'camera' && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Simulated Live Owner Video Stream with high-definition property backdrop */}
              <img
                src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'}
                alt="Owner Live Video"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-stone-950/40" />

              {/* Watermark: Verified Anti-Scam Identity Check */}
              <div className="absolute bottom-24 left-6 z-20 bg-stone-900/90 backdrop-blur-md border border-stone-700 rounded-2xl p-3 max-w-sm">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  Live Face & Title Check Passed
                </div>
                <p className="text-[11px] text-stone-300 leading-snug">
                  Host is physically at <strong className="text-white">{property.neighbourhood}</strong> showing live spaces. Zero ₦10,000 street inspection fee required.
                </p>
              </div>

              {/* Picture-in-Picture: Renter's Own Camera */}
              <div className="absolute top-24 right-6 z-20 w-32 sm:w-44 aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700 bg-stone-900">
                {!isVideoMuted ? (
                  <div className="w-full h-full relative bg-stone-800 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Your Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-bold bg-black/60 px-1.5 py-0.5 rounded text-white">
                      You (Verified)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-400 text-xs">
                    <VideoOff className="w-6 h-6 mb-1 text-stone-500" />
                    <span>Camera Off</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === '360tour' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={rooms[currentPanoramaIndex]?.panoramaUrl}
                alt={rooms[currentPanoramaIndex]?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />

              {/* Room Selector Pills */}
              <div className="absolute top-24 left-6 z-20 flex flex-wrap gap-2">
                {rooms.map((room, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPanoramaIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                      currentPanoramaIndex === idx
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-black/60 text-stone-300 hover:bg-black/80'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>

              {/* Live Audio Visualizer Banner */}
              <div className="absolute bottom-24 left-6 right-6 z-20 bg-black/70 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-white">
                    {property.owner.name} is walking you through: <strong className="text-red-400">{rooms[currentPanoramaIndex]?.name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-red-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1 h-2 bg-red-600 rounded-full animate-bounce delay-150" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce delay-100" />
                </div>
              </div>
            </div>
          )}

          {activeView === 'splitscreen' && (
            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
              {/* Left: Owner Camera */}
              <div className="relative w-full h-full border-b md:border-b-0 md:border-r border-stone-800">
                <img
                  src={property.images[0]}
                  alt="Owner Live Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold">
                  Owner Live Stream ({property.owner.name})
                </div>
              </div>

              {/* Right: 360 Walkthrough */}
              <div className="relative w-full h-full">
                <img
                  src={rooms[currentPanoramaIndex]?.panoramaUrl}
                  alt="360 Tour"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold">
                  360° Walkthrough: {rooms[currentPanoramaIndex]?.name}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-linear-to-t from-black via-black/80 to-transparent p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          
          {/* Left: Call Security info */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted Inspection</span>
          </div>

          {/* Center Call Control Buttons */}
          <div className="flex items-center gap-3 mx-auto">
            
            {/* Toggle Mic */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isAudioMuted
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-600'
              }`}
              title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Toggle Video */}
            <button
              onClick={() => setIsVideoMuted(!isVideoMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isVideoMuted
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-600'
              }`}
              title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Toggle Speaker */}
            <button
              onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                isSpeakerMuted
                  ? 'bg-stone-800 text-stone-500 border border-stone-700'
                  : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-600'
              }`}
              title={isSpeakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={onClose}
              className="w-14 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl font-bold gap-1 px-4"
              title="End Video Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>

          </div>

          {/* Right Action: Be Sure Before Payment / SafePay Escrow */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSafePay(property);
              }}
              className="px-4 py-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2 border border-emerald-400/40"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Be Sure Before Payment (SafePay Escrow)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
