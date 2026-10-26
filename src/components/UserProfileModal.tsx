import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  Building, 
  Heart, 
  CheckCircle2, 
  RefreshCw,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { UserAccount, switchActiveRole } from '../utils/auth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | { name: string; role: UserRole; email: string; phone?: string } | null;
  onLogout: () => void;
  onOpenListProperty: () => void;
  onRoleChanged: (newRole: UserRole) => void;
  myListingsCount: number;
  favoritesCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenListProperty,
  onRoleChanged,
  myListingsCount,
  favoritesCount,
}) => {
  if (!isOpen || !currentUser) return null;

  const roles: UserRole[] = ['Owner', 'Renter', 'Agent', 'Developer'];

  const handleSwitch = (r: UserRole) => {
    switchActiveRole(r);
    onRoleChanged(r);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-red-400">
              {currentUser.name[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-heading font-black text-base tracking-tight text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          
          {/* Verification Status Card */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">KeyDirect Verified Profile</span>
                <span className="text-[11px] text-emerald-700">Zero-Agent Anti-Scam Authenticated</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              Active
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="font-heading font-black text-xl text-stone-900">{myListingsCount}</div>
              <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">My Listings</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="font-heading font-black text-xl text-red-600">{favoritesCount}</div>
              <div className="text-[11px] font-bold text-stone-500 uppercase mt-0.5">Saved Homes</div>
            </div>
          </div>

          {/* Role Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Current Operating Role
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleSwitch(r)}
                  className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                    currentUser.role === r
                      ? 'bg-red-50 border-red-500 text-red-600 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                onClose();
                onOpenListProperty();
              }}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Property Manually (No API Key Required)</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-200"
            >
              <LogOut className="w-4 h-4 text-stone-500" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
