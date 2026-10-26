import { UserRole } from '../types';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  nin?: string;
  bvn?: string;
  isVerified: boolean;
  kycTier: 'Tier 1 Identity Verified' | 'Tier 2 Government Title Audited';
  avatar: string;
  registeredAt: string;
}

const STORAGE_USERS_KEY = 'kd_registered_users_v1';
const STORAGE_SESSION_KEY = 'kd_active_session_v1';

// Initial pre-registered demo accounts for instant testing
const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-ceo-01',
    name: 'Afolabi Simeon',
    email: 'dammyblack88@gmail.com',
    phone: '+234 803 999 1122',
    role: 'Owner',
    password: 'password123',
    nin: '19283746501',
    bvn: '22334455667',
    isVerified: true,
    kycTier: 'Tier 2 Government Title Audited',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-01-10',
  },
  {
    id: 'usr-agent-02',
    name: 'Engr. Babatunde Adeyemi',
    email: 'babatunde@keydirect.ng',
    phone: '+234 802 333 4455',
    role: 'Agent',
    password: 'password123',
    nin: '44556677889',
    bvn: '99887766554',
    isVerified: true,
    kycTier: 'Tier 2 Government Title Audited',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-02-15',
  },
  {
    id: 'usr-renter-03',
    name: 'Chioma Okonjo',
    email: 'chioma@gmail.com',
    phone: '+234 814 555 7788',
    role: 'Renter',
    password: 'password123',
    nin: '33445566778',
    isVerified: true,
    kycTier: 'Tier 1 Identity Verified',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-03-01',
  },
  {
    id: 'usr-dev-04',
    name: 'Eko Atlantic Heights Ltd',
    email: 'dev@ekoatlantic.com',
    phone: '+234 809 111 2233',
    role: 'Developer',
    password: 'password123',
    nin: '99881122334',
    isVerified: true,
    kycTier: 'Tier 2 Government Title Audited',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    registeredAt: '2026-03-12',
  },
];

// Helper to get all accounts from localStorage or seed with defaults
export function getAllAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  } catch (e) {
    console.error('Failed to read accounts from localStorage', e);
    return DEFAULT_ACCOUNTS;
  }
}

// Save accounts to storage
function saveAccounts(accounts: UserAccount[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to localStorage', e);
  }
}

// Get active session from localStorage
export function getActiveSession(): UserAccount | null {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS[0];
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Default to the first account if none set
    const defaultUser = DEFAULT_ACCOUNTS[0];
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  } catch (e) {
    console.error('Failed to read session', e);
    return DEFAULT_ACCOUNTS[0];
  }
}

// Set active session
export function setActiveSession(user: UserAccount | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to write session', e);
  }
}

export interface RegisterParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  nin?: string;
}

// Real Registration
export function registerAccount(params: RegisterParams): { success: boolean; error?: string; user?: UserAccount } {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.name.trim();
  const cleanPhone = params.phone.trim();
  const cleanPassword = params.password.trim();

  if (!cleanName) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }
  if (!cleanPhone) {
    return { success: false, error: 'Phone number is required for verified landlord/renter contact.' };
  }

  const accounts = getAllAccounts();
  const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please Sign In instead.',
    };
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    role: params.role,
    password: cleanPassword,
    nin: params.nin || undefined,
    isVerified: true,
    kycTier: params.role === 'Owner' || params.role === 'Agent' || params.role === 'Developer'
      ? 'Tier 2 Government Title Audited'
      : 'Tier 1 Identity Verified',
    avatar: `https://images.unsplash.com/photo-${1534528741775 + (accounts.length * 1000)}?auto=format&fit=crop&w=200&q=80`,
    registeredAt: new Date().toISOString().split('T')[0],
  };

  accounts.unshift(newUser);
  saveAccounts(accounts);
  setActiveSession(newUser);

  return { success: true, user: newUser };
}

// Real Login
export function loginAccount(email: string, password: string): { success: boolean; error?: string; user?: UserAccount } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email address.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Please enter your password.' };
  }

  const accounts = getAllAccounts();
  const user = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      error: 'No registered account found with this email. Please check your spelling or register a new account.',
    };
  }

  if (user.password && user.password !== cleanPassword) {
    return {
      success: false,
      error: 'Incorrect password. Please try again.',
    };
  }

  setActiveSession(user);
  return { success: true, user };
}

// Switch Role dynamically
export function switchActiveRole(role: UserRole): UserAccount | null {
  const current = getActiveSession();
  if (!current) return null;
  const updated = { ...current, role };
  setActiveSession(updated);
  
  const accounts = getAllAccounts();
  const idx = accounts.findIndex((a) => a.id === current.id);
  if (idx !== -1) {
    accounts[idx] = updated;
    saveAccounts(accounts);
  }
  return updated;
}
