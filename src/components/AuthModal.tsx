import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { loginAccount, registerAccount, UserAccount } from '../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: UserRole; email: string; phone?: string; id?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('Owner');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ninNumber, setNinNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserAccount | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-check.');
        return;
      }

      const res = registerAccount({
        name: fullName,
        email,
        phone,
        password,
        role,
        nin: ninNumber || undefined,
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Registration failed.');
        return;
      }

      setAuthenticatedUser(res.user);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        setIsSuccess(false);
        onClose();
      }, 1200);
    } else {
      // Login mode
      const res = loginAccount(email, password);

      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Login failed. Please check credentials.');
        return;
      }

      setAuthenticatedUser(res.user);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        setIsSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <KeyRound className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base tracking-tight">
                {mode === 'login' ? 'Sign In to KeyDirect' : 'Create Verified Account'}
              </h3>
              <p className="text-[11px] text-stone-400">
                100% Real Live Authentication · Direct Owner Verification
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

        {isSuccess && authenticatedUser ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-lg text-stone-900">
              Welcome, {authenticatedUser.name}!
            </h4>
            <p className="text-xs text-stone-500">
              Session active with role: <strong className="text-stone-900">{authenticatedUser.role}</strong> ({authenticatedUser.email})
            </p>
            <div className="pt-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 py-1.5 px-3 rounded-full inline-block border border-emerald-200">
              ✓ Verified & Connected
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4 overflow-y-auto">
            
            {/* Mode switch */}
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                {mode === 'register' ? 'Register As' : 'Account Role'}
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['Owner', 'Renter', 'Agent', 'Developer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-lg font-bold transition-all cursor-pointer border text-center ${
                      role === r
                        ? 'bg-red-50 border-red-500 text-red-600'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              
              {/* Full Name (in register mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                    Full Legal Name
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <User className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Afolabi Oluwadamilare Simeon"
                      className="w-full bg-transparent outline-none text-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Email Address
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                  <Mail className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. dammyblack88@gmail.com"
                    className="w-full bg-transparent outline-none text-stone-900"
                  />
                </div>
              </div>

              {/* Phone (in register mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                    Phone Number (Nigerian Mobile)
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <Phone className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 999 1122"
                      className="w-full bg-transparent outline-none text-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Password
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                  <Lock className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-transparent outline-none text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-600 cursor-pointer ml-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (in register mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                    Confirm Password
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <Lock className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-transparent outline-none text-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Optional NIN for Owner / Agent */}
              {mode === 'register' && (role === 'Owner' || role === 'Agent' || role === 'Developer') && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>NIN Government Verification (Optional for Fast-track)</span>
                  </div>
                  <input
                    type="text"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    placeholder="11-digit NIN for verified Landlord badge"
                    className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider mt-2"
              >
                {mode === 'login' ? 'Sign In Now' : 'Complete Verified Registration'}
              </button>
            </form>

            <div className="text-center text-[11px] text-stone-400 pt-2 border-t border-stone-100">
              Protected by SimeonJrStudios Anti-Scam Identity Protocol
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
