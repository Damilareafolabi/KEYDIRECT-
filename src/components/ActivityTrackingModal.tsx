import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Eye, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  UserCheck, 
  TrendingUp, 
  Video, 
  MapPin, 
  Compass, 
  RotateCw, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { UserActivityLog, RenterRequest, Property, UserRole } from '../types';

interface ActivityTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: UserRole;
  currentUserName?: string;
  activities: UserActivityLog[];
  renterRequests: RenterRequest[];
  properties: Property[];
  onOpenProperty?: (property: Property) => void;
  onOpenChatWithProperty?: (property: Property) => void;
  onOpenVirtualLook?: (property: Property) => void;
}

export const ActivityTrackingModal: React.FC<ActivityTrackingModalProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'Owner',
  currentUserName = 'Afolabi Oluwadamilare Simeon',
  activities,
  renterRequests,
  properties,
  onOpenProperty,
  onOpenChatWithProperty,
  onOpenVirtualLook,
}) => {
  const [activeTab, setActiveTab] = useState<'seller' | 'renter' | 'audit'>('seller');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesFilter = filterAction === 'ALL' || act.action === filterAction;
    const matchesSearch = 
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.propertyTitle && act.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate seller metrics
  const totalViews = properties.reduce((acc, p) => acc + (p.viewsCount || 24), 0);
  const totalInquiries = properties.reduce((acc, p) => acc + (p.inquiriesCount || 6), 0);
  const totalFeesSaved = properties.reduce((acc, p) => acc + (p.inspectionFeeSavedNgn || 15000), 0);
  const verifiedListings = properties.filter((p) => p.isVerifiedListing).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-white text-base sm:text-lg">
                  KeyDirect Activity & Audit Tracker
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                  PostGIS Live
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Real-time tracking for Owners, Agents, Developers & Renters · SimeonJrStudios Core
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 border-b border-stone-800 bg-stone-950/40 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'seller'
                ? 'border-red-500 text-red-400 bg-stone-900/40 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Seller Audit Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('renter')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'renter'
                ? 'border-red-500 text-red-400 bg-stone-900/40 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Renter Request Tracker</span>
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-black">
              {renterRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-red-500 text-red-400 bg-stone-900/40 rounded-t-lg'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Audit Trail</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: SELLER AUDIT DASHBOARD */}
          {activeTab === 'seller' && (
            <div className="space-y-5">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4">
                  <div className="text-stone-400 text-xs flex items-center gap-1.5 mb-1">
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    <span>Total Listing Views</span>
                  </div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-white">
                    {totalViews.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+32% this week</span>
                  </div>
                </div>

                <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4">
                  <div className="text-stone-400 text-xs flex items-center gap-1.5 mb-1">
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Virtual Look Watches</span>
                  </div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-white">
                    {(totalViews * 2.4).toFixed(0)} mins
                  </div>
                  <div className="text-[11px] text-cyan-400 font-semibold mt-1">
                    Avg 4.8 min / tour
                  </div>
                </div>

                <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4">
                  <div className="text-stone-400 text-xs flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Renter Inquiries</span>
                  </div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-white">
                    {totalInquiries}
                  </div>
                  <div className="text-[11px] text-stone-400 font-medium mt-1">
                    100% Direct Landlords
                  </div>
                </div>

                <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4">
                  <div className="text-stone-400 text-xs flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Renter Fees Saved</span>
                  </div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-emerald-400">
                    ₦{totalFeesSaved.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-bold mt-1">
                    ₦0 Inspection Fee Policy
                  </div>
                </div>
              </div>

              {/* Performance Table for Seller Listings */}
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
                  <div className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span>Active Managed Listings & Direct Pipeline</span>
                  </div>
                  <span className="text-xs text-stone-400">
                    {properties.length} Properties Tracked
                  </span>
                </div>

                <div className="divide-y divide-stone-800/60 overflow-x-auto">
                  {properties.slice(0, 6).map((prop) => (
                    <div key={prop.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-900/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="font-heading font-bold text-white text-sm line-clamp-1">
                            {prop.title}
                          </div>
                          <div className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                            <span className="text-stone-300 font-medium">{prop.category}</span>
                            <span>•</span>
                            <span>{prop.neighbourhood.split(',')[0]}, {prop.state}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">{prop.listingType}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-6 text-xs text-stone-300">
                        <div>
                          <div className="text-stone-500 text-[10px] uppercase font-bold">Views</div>
                          <div className="font-bold text-white">{prop.viewsCount || 42}</div>
                        </div>
                        <div>
                          <div className="text-stone-500 text-[10px] uppercase font-bold">Inquiries</div>
                          <div className="font-bold text-white">{prop.inquiriesCount || 8}</div>
                        </div>
                        <div>
                          <div className="text-stone-500 text-[10px] uppercase font-bold">Status</div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified</span>
                          </span>
                        </div>

                        {onOpenVirtualLook && (
                          <button
                            onClick={() => onOpenVirtualLook(prop)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>360° View</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RENTER REQUEST TRACKER */}
          {activeTab === 'renter' && (
            <div className="space-y-4">
              <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-black text-white text-sm sm:text-base">
                    Direct Landlord Request & Inquiry Tracker
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Say goodbye to physical inspection fees. Track real-time responses directly from owners and verified agents.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>₦0 Inspection Fee Guaranteed</span>
                </div>
              </div>

              <div className="space-y-3">
                {renterRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 hover:border-stone-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      {req.propertyImage && (
                        <img
                          src={req.propertyImage}
                          alt={req.propertyTitle}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-white text-sm sm:text-base">
                            {req.propertyTitle}
                          </span>
                        </div>
                        
                        <div className="text-xs text-stone-400 mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-stone-300 font-medium">Owner: {req.ownerName}</span>
                          <span>•</span>
                          <span className="text-red-400 font-semibold">{req.requestType}</span>
                          <span>•</span>
                          <span className="text-stone-500">{req.submittedAt}</span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            req.status === 'Owner Replied'
                              ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                              : req.status === 'Tour Completed'
                              ? 'bg-blue-900/80 text-blue-300 border border-blue-700/60'
                              : 'bg-amber-900/80 text-amber-300 border border-amber-700/60'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-emerald-400 font-bold text-[11px]">
                            Saved ₦{req.inspectionFeeSavedNgn.toLocaleString()} Inspection Fee
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {onOpenChatWithProperty && (
                        <button
                          onClick={() => {
                            const p = properties.find((item) => item.id === req.propertyId);
                            if (p) onOpenChatWithProperty(p);
                          }}
                          className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                          <span>Direct Chat</span>
                        </button>
                      )}

                      {onOpenVirtualLook && (
                        <button
                          onClick={() => {
                            const p = properties.find((item) => item.id === req.propertyId);
                            if (p) onOpenVirtualLook(p);
                          }}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>360° Look</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search audit trail by user, event, or property..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {['ALL', 'LISTING_CREATED', 'VIRTUAL_TOUR_VIEWED', 'INQUIRY_SUBMITTED', 'OFFLINE_MAP_CACHED'].map((act) => (
                    <button
                      key={act}
                      onClick={() => setFilterAction(act)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        filterAction === act
                          ? 'bg-red-600 text-white'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {act.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline List */}
              <div className="space-y-2.5">
                {filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3 flex items-start gap-3 hover:border-stone-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                      {act.action === 'VIRTUAL_TOUR_VIEWED' ? (
                        <RotateCw className="w-4 h-4 text-cyan-400" />
                      ) : act.action === 'OFFLINE_MAP_CACHED' ? (
                        <Compass className="w-4 h-4 text-amber-400" />
                      ) : act.action === 'INQUIRY_SUBMITTED' ? (
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-red-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading font-bold text-xs text-white">
                            {act.userName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-semibold">
                            {act.userRole}
                          </span>
                          <span className="text-stone-500 text-[11px]">•</span>
                          <span className="text-[11px] text-stone-300 font-medium">
                            {act.description}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 whitespace-nowrap">
                          {act.timestamp}
                        </span>
                      </div>

                      {act.propertyTitle && (
                        <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span>Listing: {act.propertyTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950/90 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Spatial Geo-Audit Active · PostGIS Engine Live</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
