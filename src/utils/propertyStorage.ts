import { Property } from '../types';
import { INITIAL_PROPERTIES } from '../data/properties';

const STORAGE_CUSTOM_PROPS_KEY = 'kd_custom_registered_properties_v1';
const STORAGE_FAVORITES_KEY = 'kd_favorite_property_ids_v1';
const STORAGE_INSPECTIONS_KEY = 'kd_scheduled_inspections_v1';

export interface ScheduledInspection {
  id: string;
  propertyId: string;
  propertyTitle: string;
  neighbourhood: string;
  ownerName: string;
  ownerPhone: string;
  date: string;
  timeSlot: string;
  inspectionType: 'Physical Inspection (₦0 Fee)' | 'Live 360° Video Walkthrough';
  userName: string;
  userPhone: string;
  userEmail: string;
  status: 'Confirmed' | 'Pending Landlord Confirmation';
  createdAt: string;
}

// Get all properties organically registered by real users (defaults to empty on fresh deployment)
export function getAllMergedProperties(): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PROPS_KEY);
    if (!raw) return [];
    const customProps: Property[] = JSON.parse(raw);
    return Array.isArray(customProps) ? customProps : [];
  } catch (e) {
    console.error('Failed to load custom properties', e);
    return [];
  }
}

// Save a new manually registered property
export function persistManualProperty(property: Property): Property[] {
  if (typeof window === 'undefined') return [property];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PROPS_KEY);
    const existing: Property[] = raw ? JSON.parse(raw) : [];
    const updated = [property, ...existing];
    localStorage.setItem(STORAGE_CUSTOM_PROPS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to persist manual property', e);
    return [property];
  }
}

// Delete a custom property
export function deleteCustomProperty(propertyId: string): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PROPS_KEY);
    if (!raw) return [];
    const existing: Property[] = JSON.parse(raw);
    const filtered = existing.filter((p) => p.id !== propertyId);
    localStorage.setItem(STORAGE_CUSTOM_PROPS_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete property', e);
    return [];
  }
}

// Optional helper for users who want to preview verified demo data
export function loadShowcaseDemoProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  try {
    localStorage.setItem(STORAGE_CUSTOM_PROPS_KEY, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  } catch (e) {
    return INITIAL_PROPERTIES;
  }
}

// Helper to reset back to completely empty live deployment
export function resetToEmptyLiveProperties(): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.setItem(STORAGE_CUSTOM_PROPS_KEY, JSON.stringify([]));
    return [];
  } catch (e) {
    return [];
  }
}

// Favorites storage
export function getFavoritePropertyIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavoriteProperty(propertyId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getFavoritePropertyIds();
    const exists = current.includes(propertyId);
    const updated = exists ? current.filter((id) => id !== propertyId) : [...current, propertyId];
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

// Scheduled Inspections storage
export function getScheduledInspections(): ScheduledInspection[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_INSPECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveScheduledInspection(inspection: ScheduledInspection): ScheduledInspection[] {
  if (typeof window === 'undefined') return [inspection];
  try {
    const current = getScheduledInspections();
    const updated = [inspection, ...current];
    localStorage.setItem(STORAGE_INSPECTIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [inspection];
  }
}
