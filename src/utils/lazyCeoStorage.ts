export type PlanTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface BusinessProfile {
  businessName: string;
  tagline: string;
  industry: string;
  description: string;
  targetAudience: string;
  phone: string;
  website: string;
  email: string;
  city: string;
  connectedAccounts: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
  tier: PlanTier;
}

export interface VirtualRoomMediaItem {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  uploaderName: string;
  uploaderBusiness: string;
  category: string;
  uploadedAt: string;
  wallPosition: number; // 0 to 5 for wall frames
}

export interface BillboardSlot {
  id: string;
  title: string;
  slotNumber: number;
  location: string;
  isOccupied: boolean;
  businessName?: string;
  tagline?: string;
  bannerUrl?: string;
  videoUrl?: string;
  category?: string;
  websiteUrl?: string;
  whatsappNumber?: string;
  duration?: 'Daily' | 'Weekly' | 'Monthly';
  priceUsd?: number;
  priceNgn?: number;
  publishedAt?: string;
  expiresAt?: string;
}

export interface BusinessMapPin {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  website?: string;
  description: string;
  isVerified: boolean;
  imageUrl?: string;
}

export interface MarketingPost {
  id: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  title: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  targetChannels: string[];
  status: 'Ready' | 'Scheduled' | 'Published';
  scheduledDate: string;
  characterCount: number;
}

const STORAGE_PROFILE_KEY = 'lz_business_profile_v1';
const STORAGE_VIRTUAL_MEDIA_KEY = 'lz_virtual_media_v1';
const STORAGE_BILLBOARD_SLOTS_KEY = 'lz_billboard_slots_v1';
const STORAGE_MAP_PINS_KEY = 'lz_map_pins_v1';
const STORAGE_POSTS_KEY = 'lz_scheduled_posts_v1';
const STORAGE_OFFLINE_CACHE_KEY = 'lz_offline_cache_active_v1';

// Initial clean empty billboard slots with dynamic pricing
const INITIAL_BILLBOARD_SLOTS: BillboardSlot[] = [
  {
    id: 'bb-slot-01',
    slotNumber: 1,
    title: 'Lekki Admiralty Way Mega Billboard',
    location: 'Lekki Phase 1 Waterfront, Lagos',
    isOccupied: false,
  },
  {
    id: 'bb-slot-02',
    slotNumber: 2,
    title: 'Victoria Island Financial District LED Screen',
    location: 'Ahmadu Bello Way, Victoria Island',
    isOccupied: false,
  },
  {
    id: 'bb-slot-03',
    slotNumber: 3,
    title: 'Abuja Maitama Central Tower Billboard',
    location: 'Maitama Expressway, Abuja (FCT)',
    isOccupied: false,
  },
  {
    id: 'bb-slot-04',
    slotNumber: 4,
    title: 'Port Harcourt Trans-Amadi Commercial Screen',
    location: 'Trans-Amadi Axis, Port Harcourt',
    isOccupied: false,
  },
  {
    id: 'bb-slot-05',
    slotNumber: 5,
    title: 'Global Diaspora Prime Showcase Billboard',
    location: 'Worldwide Digital Network & Portal App',
    isOccupied: false,
  },
];

// Initial starter media for 3D room showcase
const INITIAL_VIRTUAL_MEDIA: VirtualRoomMediaItem[] = [
  {
    id: 'vrm-01',
    title: 'Architectural Luxury Living Showcase',
    description: 'High-end interior design and modern architecture showcase room.',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    uploaderName: 'Afolabi Simeon',
    uploaderBusiness: 'SimeonJrStudios Architecture',
    category: 'Architecture & Design',
    uploadedAt: '2026-03-20',
    wallPosition: 0,
  },
  {
    id: 'vrm-02',
    title: 'VIP Private Party Penthouse Deck',
    description: 'Soundproof luxury rooftop with illuminated skyline views.',
    mediaType: 'image',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    uploaderName: 'Segun Arinze',
    uploaderBusiness: 'Velocity Hospitality',
    category: 'Event & Party',
    uploadedAt: '2026-03-21',
    wallPosition: 1,
  },
];

// Initial Business Pins for Google / Offline Maps
const INITIAL_MAP_PINS: BusinessMapPin[] = [
  {
    id: 'pin-01',
    name: 'SimeonJrStudios Headquarters',
    category: 'Media & Technology',
    address: 'Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    lat: 6.4474,
    lng: 3.4723,
    phone: '+234 803 999 1122',
    website: 'https://keydirect.ng',
    description: 'Autonomous marketing automation, real estate systems, and 3D digital experiences.',
    isVerified: true,
  },
  {
    id: 'pin-02',
    name: 'Maitama Executive Business Hub',
    category: 'Commercial Hub',
    address: 'Gana Street, Maitama',
    city: 'Abuja (FCT)',
    lat: 9.0765,
    lng: 7.3986,
    phone: '+234 802 333 4455',
    website: 'https://keydirect.ng',
    description: 'Direct owner commercial executive suites, showrooms, and event facilities.',
    isVerified: true,
  },
  {
    id: 'pin-03',
    name: 'Victoria Island Digital Media Center',
    category: 'Advertising & Billboard Hub',
    address: 'Ozumba Mbadiwe Avenue, VI',
    city: 'Lagos',
    lat: 6.4281,
    lng: 3.4219,
    phone: '+234 809 111 2233',
    website: 'https://keydirect.ng',
    description: 'High-impact digital LED billboards, streaming rooms, and showcase event marquees.',
    isVerified: true,
  },
];

export function getBusinessProfile(): BusinessProfile {
  if (typeof window === 'undefined') {
    return {
      businessName: 'My Enterprise Brand',
      tagline: 'Leading the future of automated growth',
      industry: 'Real Estate & Hospitality',
      description: 'We deliver high-yield direct real estate investments, luxury party apartments, and premium venues across Nigeria and worldwide.',
      targetAudience: 'High-net-worth investors, party planners, entrepreneurs, and discerning renters seeking 0% commission properties.',
      phone: '+234 803 999 1122',
      website: 'https://keydirect.ng',
      email: 'dammyblack88@gmail.com',
      city: 'Lagos & Abuja',
      connectedAccounts: {
        instagram: '@keydirect_official',
        twitter: '@keydirect_ng',
        linkedin: 'KeyDirect Real Estate',
        tiktok: '@keydirect_360',
        facebook: 'KeyDirect Africa',
        youtube: 'KeyDirect 360 Tours',
      },
      tier: 'PRO',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading profile', e);
  }

  const defaultProfile: BusinessProfile = {
    businessName: 'SimeonJrStudios Real Estate & Media',
    tagline: 'Talk about your business 24/7/365 with automated marketing',
    industry: 'Real Estate & Media Production',
    description: 'Connecting renters, hosts, and businesses directly with zero inspection fees and automated multi-channel viral exposure.',
    targetAudience: 'Property investors, holidaymakers, party hosts, and commercial retail brands.',
    phone: '+234 803 999 1122',
    website: 'https://keydirect.ng',
    email: 'dammyblack88@gmail.com',
    city: 'Lagos, Nigeria',
    connectedAccounts: {
      instagram: '@keydirect_realestate',
      twitter: '@keydirect_ng',
      linkedin: 'KeyDirect Global',
      tiktok: '@keydirect_360look',
      facebook: 'KeyDirect Real Estate',
      youtube: 'KeyDirect 360 Walkthroughs',
    },
    tier: 'PRO',
  };

  localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export function saveBusinessProfile(profile: BusinessProfile): BusinessProfile {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  }
  return profile;
}

export function getVirtualRoomMedia(): VirtualRoomMediaItem[] {
  if (typeof window === 'undefined') return INITIAL_VIRTUAL_MEDIA;
  try {
    const raw = localStorage.getItem(STORAGE_VIRTUAL_MEDIA_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading virtual media', e);
  }
  localStorage.setItem(STORAGE_VIRTUAL_MEDIA_KEY, JSON.stringify(INITIAL_VIRTUAL_MEDIA));
  return INITIAL_VIRTUAL_MEDIA;
}

export function addVirtualRoomMedia(item: VirtualRoomMediaItem): VirtualRoomMediaItem[] {
  const current = getVirtualRoomMedia();
  const updated = [item, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_VIRTUAL_MEDIA_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteVirtualRoomMedia(id: string): VirtualRoomMediaItem[] {
  const current = getVirtualRoomMedia();
  const updated = current.filter((m) => m.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_VIRTUAL_MEDIA_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getBillboardSlots(): BillboardSlot[] {
  if (typeof window === 'undefined') return INITIAL_BILLBOARD_SLOTS;
  try {
    const raw = localStorage.getItem(STORAGE_BILLBOARD_SLOTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading billboard slots', e);
  }
  localStorage.setItem(STORAGE_BILLBOARD_SLOTS_KEY, JSON.stringify(INITIAL_BILLBOARD_SLOTS));
  return INITIAL_BILLBOARD_SLOTS;
}

export function publishToBillboardSlot(slotId: string, adDetails: {
  businessName: string;
  tagline: string;
  bannerUrl: string;
  videoUrl?: string;
  category: string;
  websiteUrl: string;
  whatsappNumber: string;
  duration: 'Daily' | 'Weekly' | 'Monthly';
  priceUsd: number;
  priceNgn: number;
}): BillboardSlot[] {
  const slots = getBillboardSlots();
  const now = new Date();
  const exp = new Date(now);
  if (adDetails.duration === 'Daily') exp.setDate(exp.getDate() + 1);
  else if (adDetails.duration === 'Weekly') exp.setDate(exp.getDate() + 7);
  else exp.setMonth(exp.getMonth() + 1);

  const updated = slots.map((s) => {
    if (s.id === slotId) {
      return {
        ...s,
        isOccupied: true,
        businessName: adDetails.businessName,
        tagline: adDetails.tagline,
        bannerUrl: adDetails.bannerUrl,
        videoUrl: adDetails.videoUrl,
        category: adDetails.category,
        websiteUrl: adDetails.websiteUrl,
        whatsappNumber: adDetails.whatsappNumber,
        duration: adDetails.duration,
        priceUsd: adDetails.priceUsd,
        priceNgn: adDetails.priceNgn,
        publishedAt: now.toISOString().split('T')[0],
        expiresAt: exp.toISOString().split('T')[0],
      };
    }
    return s;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_BILLBOARD_SLOTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getBusinessMapPins(): BusinessMapPin[] {
  if (typeof window === 'undefined') return INITIAL_MAP_PINS;
  try {
    const raw = localStorage.getItem(STORAGE_MAP_PINS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading map pins', e);
  }
  localStorage.setItem(STORAGE_MAP_PINS_KEY, JSON.stringify(INITIAL_MAP_PINS));
  return INITIAL_MAP_PINS;
}

export function addBusinessMapPin(pin: BusinessMapPin): BusinessMapPin[] {
  const current = getBusinessMapPins();
  const updated = [pin, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_MAP_PINS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function isOfflineCacheActive(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_OFFLINE_CACHE_KEY) === 'true';
}

export function toggleOfflineCache(active: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_OFFLINE_CACHE_KEY, active ? 'true' : 'false');
  }
}
