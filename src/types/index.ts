export type ListingType = 'Direct Owner' | 'Verified Agent' | 'Developer';

export type PropertyCategory = 
  | 'Apartments' 
  | 'Self Contain'
  | 'Shops & Retail'
  | 'Warehouses'
  | 'Hotels'
  | 'Party Apartments'
  | 'Event Centers'
  | 'Rooms' 
  | 'Commercial' 
  | 'Plots / Land' 
  | 'Rental' 
  | 'Cities';

export type LandAction = 'Buy Land' | 'Rent / Lease Land' | 'Any';

export type UserRole = 'Owner' | 'Agent' | 'Developer' | 'Renter';

export interface EventSpecs {
  guestCapacity?: number;
  allowsPartyDj?: boolean;
  allowsPoolParty?: boolean;
  overnightStayAllowed?: boolean;
  securityGuardsProvided?: boolean;
  curfewHours?: string;
  hasIndustrialGenerator?: boolean;
}

export interface VerificationData {
  isNinVerified: boolean;
  isBvnVerified: boolean;
  documentType: 'C of O' | 'Deed of Assignment' | "Governor's Consent" | 'Gazette' | 'Survey Plan' | 'CAC Certificate';
  verificationStatus: 'Approved' | 'Pending' | 'Rejected';
  verifiedAt: string;
  inspectorName?: string;
  kycTier?: 'Tier 1 Identity Verified' | 'Tier 2 Government Title Audited';
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: PropertyCategory;
  listingType: ListingType;
  landAction?: LandAction; // specifically for Plots / Land (Rent or Buy)
  baseCurrency: string; // e.g. 'NGN', 'USD'
  basePrice: number;
  pricePeriod: 'per annum' | 'monthly' | 'per night' | 'per event' | 'total purchase';
  bedrooms: number;
  bathrooms: number;
  sittingRooms?: number;
  areaSqFt?: number;
  state: string;
  lga: string;
  neighbourhood: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  isVerifiedListing: boolean;
  hasVirtualTour?: boolean;
  virtualTour360Rooms?: {
    name: string;
    panoramaUrl: string;
    description: string;
    hotspots: string[];
  }[];
  videoTourUrl?: string;
  floorPlanUrl?: string;
  inspectionFeeSavedNgn?: number;
  verification: VerificationData;
  eventSpecs?: EventSpecs;
  owner: {
    id: string;
    name: string;
    role: UserRole;
    phone: string;
    whatsappNumber?: string;
    contactPaperUrl?: string; // photo/snap of handwritten paper note with phone number or signpost
    customContactLink?: string; // any custom link (Linktree, social, website, WhatsApp direct)
    customContactLinkLabel?: string; // e.g. "Chat with Agent on Link"
    agentCommissionRate?: string; // e.g. "5% on closing agreement only · ₦0 upfront fees"
    isVerified: boolean;
    rating: number;
    responseTime: string;
    avatar: string;
  };
  amenities: string[];
  featuredInBillboard?: boolean;
  viewsCount?: number;
  inquiriesCount?: number;
  createdAt: string;
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number;
}

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'ar' | 'zh' | 'ha' | 'yo' | 'ig';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isFromUser: boolean;
  propertyId: string;
}

export interface CommunityChatMessage {
  id: string;
  roomId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  isVerified: boolean;
  text: string;
  timestamp: string;
  listingRefId?: string;
  listingTitle?: string;
}

export interface CommunityRoom {
  id: string;
  name: string;
  category: string;
  description: string;
  activeUsers: number;
  isHot?: boolean;
}

export interface BusinessBillboardAd {
  id: string;
  businessName: string;
  tagline: string;
  category: 'Real Estate' | 'Party & Event Planning' | 'Catering & Drinks' | 'Sound & DJ Equipment' | 'Interior Decor' | 'Legal & Land Title Audit' | 'Fintech & Escrow' | 'General Business';
  description: string;
  imageUrl: string;
  whatsappNumber: string;
  websiteUrl: string;
  targetCity: string;
  badge: string;
  views: number;
  clicks: number;
  ownerName: string;
}

export interface LazyCeoLead {
  id: string;
  clientName: string;
  clientNeed: string;
  budgetFormatted: string;
  location: string;
  capturedAt: string;
  urgency: 'Hot' | 'Medium' | 'Direct Deal';
  pitchUsed: string;
  whatsappContact: string;
}

export interface AccountAnalytics {
  totalViews: number;
  totalInquiries: number;
  lazyCeoLeadsHunted: number;
  commissionsSavedNgn: number;
  billboardImpressions: number;
  socialPostsPublished: number;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCategory: PropertyCategory;
  propertyImage?: string;
  ownerId: string;
  ownerName: string;
  ownerRole: UserRole;
  renterId: string;
  renterName: string;
  renterAvatar?: string;
  overallRating: number; // 1 to 5
  accuracyRating: number; // 1 to 5 (Virtual Look accuracy)
  responsivenessRating: number; // 1 to 5 (Owner communication)
  valueRating: number; // 1 to 5 (Value for money)
  transactionType: 'Apartment Lease' | 'Party Booking' | 'Event Center Hire' | 'Room Rental' | 'Land Purchase' | 'Commercial Lease';
  isVerifiedTransaction: boolean;
  transactionRef: string;
  inspectionFeeSavedNgn: number;
  commissionSavedNgn: number;
  stayOrDealDate: string;
  headline: string;
  reviewText: string;
  pros?: string[];
  helpfulVotes: number;
  userVotedHelpful?: boolean;
  ownerResponse?: {
    text: string;
    respondedAt: string;
  };
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  kycTier: 'Unverified' | 'Tier 1 Identity Verified' | 'Tier 2 Government Title Audited';
  ninNumber?: string;
  bvnHash?: string;
  cacNumber?: string;
  kycDocuments: {
    title: string;
    type: string;
    status: 'Verified' | 'Pending Review' | 'Required';
    uploadedAt?: string;
  }[];
  analytics: AccountAnalytics;
}

export interface SafePayEscrowDeal {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPriceFormatted: string;
  renterId: string;
  renterName: string;
  isRenterVerified: boolean;
  ownerId: string;
  ownerName: string;
  isOwnerVerified: boolean;
  amountNgn: number;
  escrowFeeNgn: number;
  status: 'Identity Check' | 'Virtual Video Inspection' | 'Funds In Escrow' | 'Keys Handed Over' | 'Completed' | 'Refunded';
  inspectionType: '360 Virtual Look' | 'Live Video Call' | 'In-Person';
  keyHandoverCode: string;
  createdAt: string;
}

export interface AgentAccreditation {
  id: string;
  agentName: string;
  agencyName: string;
  licenseNumber: string;
  annualFeeNgn: number;
  paymentStatus: 'Paid & Active' | 'Pending Payment' | 'Suspended' | 'Revoked';
  verifiedAt: string;
  expiresAt: string;
  badge: 'Licensed & Verified Broker';
}

export interface RogueAgentReport {
  id: string;
  reportedListingId: string;
  reportedListingTitle: string;
  allegedImpersonatorName: string;
  claimedRole: 'Direct Owner' | 'Landlord';
  violationReason: 'Asked for ₦10,000 inspection fee' | 'Broker language detected (Brief from Principal)' | 'Duplicate phone number across 12 unrelated properties' | 'Cannot produce Title Deed / C of O' | 'Refused Live Video Face-Check';
  status: 'Banned & Blacklisted' | 'Under Investigation' | 'Listing Taken Down';
  actionTaken: string;
  reportedBy: string;
  timestamp: string;
}

export interface VideoCallState {
  isActive: boolean;
  propertyId?: string;
  propertyTitle?: string;
  participantName?: string;
  participantRole?: UserRole;
  isVerifiedPartner?: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isTourSharing: boolean;
  callDuration: number;
}

export type ActivityActionType =
  | 'LISTING_CREATED'
  | 'VIRTUAL_TOUR_VIEWED'
  | 'MESSAGE_SENT'
  | 'INQUIRY_SUBMITTED'
  | 'TOUR_SCHEDULED'
  | 'VERIFICATION_REQUESTED'
  | 'STATUS_CHANGED'
  | 'OFFLINE_MAP_CACHED'
  | 'ANTI_SCAM_FLAGGED';

export interface UserActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userRole: UserRole;
  action: ActivityActionType;
  description: string;
  propertyId?: string;
  propertyTitle?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  status?: 'Completed' | 'Pending' | 'In Review' | 'Active';
}

export interface RenterRequest {
  id: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  ownerName: string;
  ownerRole: UserRole;
  requestType: 'Virtual 360 Tour' | 'Live Video Walkthrough' | 'Chat Inquiry' | 'Formal Lease Offer';
  status: 'Pending Response' | 'Owner Replied' | 'Tour Completed' | 'Deal In Escrow' | 'Closed';
  inspectionFeeSavedNgn: number;
  submittedAt: string;
  updatedAt: string;
}


