import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  ArrowRight, 
  Zap, 
  CreditCard, 
  Clock, 
  FileText,
  UserCheck,
  Building,
  RotateCcw
} from 'lucide-react';
import { Property, SafePayEscrowDeal, UserRole } from '../types';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface SafePayEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  currentUser: { name: string; role: UserRole; email: string } | null;
  currentCurrency: string;
  onOpenVideoCall: (prop: Property) => void;
  onOpenVirtualLook: (prop: Property) => void;
  onSuccessDeal: (deal: SafePayEscrowDeal) => void;
}

export const SafePayEscrowModal: React.FC<SafePayEscrowModalProps> = ({
  isOpen,
  onClose,
  property,
  currentUser,
  currentCurrency,
  onOpenVideoCall,
  onOpenVirtualLook,
  onSuccessDeal,
}) => {
  const [step, setStep] = useState<'checklist' | 'escrow-deposit' | 'locked-escrow' | 'key-release'>('checklist');
  const [hasInspectedOnline, setHasInspectedOnline] = useState(true);
  const [hasCheckedTitle, setHasCheckedTitle] = useState(true);
  const [hasConfirmedNoFees, setHasConfirmedNoFees] = useState(true);
  const [escrowCode] = useState(`KD-KEY-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !property) return null;

  const isUserVerified = !!currentUser;
  const isOwnerVerified = property.owner.isVerified;

  const convertedPrice = convertCurrency(property.basePrice, property.baseCurrency, currentCurrency);
  const formattedPrice = formatCurrency(convertedPrice, currentCurrency);

  const canProceed = hasInspectedOnline && hasCheckedTitle && hasConfirmedNoFees;

  const handleDepositEscrow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('locked-escrow');
      
      const newDeal: SafePayEscrowDeal = {
        id: `deal-${Date.now()}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyPriceFormatted: `${formattedPrice} / ${property.pricePeriod}`,
        renterId: 'rnt-active',
        renterName: currentUser?.name || 'Verified Renter',
        isRenterVerified: true,
        ownerId: property.owner.id,
        ownerName: property.owner.name,
        isOwnerVerified: true,
        amountNgn: property.basePrice,
        escrowFeeNgn: 0,
        status: 'Funds In Escrow',
        inspectionType: '360 Virtual Look',
        keyHandoverCode: escrowCode,
        createdAt: 'Just now',
      };

      onSuccessDeal(newDeal);
    }, 1500);
  };

  const handleConfirmHandover = () => {
    setStep('key-release');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-stone-900 tracking-tight">
                  Be Sure Before Payment (SafePay Escrow)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Zero Scam Protection
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Only verified people are permitted to transact. Funds are held safely until keys are in your hands.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Strict Verification Status Pill */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800">
                  Renter Identity: <span className="text-emerald-700 font-black">{currentUser?.name || 'Afolabi Simeon (Verified)'}</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  NIN & Phone Authenticated · Safe to transacting
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:border-l sm:border-stone-200 sm:pl-4">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-800">
                  Owner Identity: <span className="text-emerald-700 font-black">{property.owner.name}</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Title: {property.verification.documentType} ({property.verification.verificationStatus})
                </div>
              </div>
            </div>

          </div>

          {/* Step 1: Pre-Payment Checklist */}
          {step === 'checklist' && (
            <div className="space-y-5">
              
              <div className="border-l-4 border-amber-500 bg-amber-50/80 rounded-r-2xl p-4 text-xs text-amber-900">
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  KeyDirect Golden Rule: NEVER pay cash directly to an agent or unknown bank account!
                </div>
                <p className="leading-relaxed">
                  Scammers create fake urgency ("pay now someone else is coming with cash"). With KeyDirect SafePay Escrow, your money sits securely in Central Bank regulated custody. The landlord cannot touch a dime until you inspect, receive the keys, and authorize release.
                </p>
              </div>

              {/* Property summary */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-black text-sm text-stone-900">{property.title}</h4>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {property.neighbourhood}, {property.state} · Direct {property.owner.role} Deal
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-heading font-black text-base text-red-600">{formattedPrice}</div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase">{property.pricePeriod}</div>
                </div>
              </div>

              {/* Mandatory Checklist Items */}
              <div className="space-y-3">
                <h5 className="font-heading font-black text-xs uppercase text-stone-700 tracking-wider">
                  Mandatory Anti-Scam Verification Checkpoints:
                </h5>

                <label className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 cursor-pointer hover:border-emerald-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasInspectedOnline}
                    onChange={(e) => setHasInspectedOnline(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">
                      1. I have inspected via 360° Virtual Look or Live 1-on-1 Video Call
                    </span>
                    <span className="text-stone-500">
                      I confirmed the layout, soundproofing, generator power, and pool without paying any street agent ₦10,000 inspection fee.
                    </span>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenVirtualLook(property)}
                        className="text-[11px] font-bold text-red-600 hover:underline"
                      >
                        Launch 360° Tour →
                      </button>
                      <span className="text-stone-300">·</span>
                      <button
                        type="button"
                        onClick={() => onOpenVideoCall(property)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline"
                      >
                        Launch Live Video Call with Landlord →
                      </button>
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 cursor-pointer hover:border-emerald-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasCheckedTitle}
                    onChange={(e) => setHasCheckedTitle(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">
                      2. I verified the Landlord's Title Deed ({property.verification.documentType})
                    </span>
                    <span className="text-stone-500">
                      Title is audited on KeyDirect database. Owner verified under Nigerian Identity KYC ({property.verification.verificationStatus}).
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 cursor-pointer hover:border-emerald-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasConfirmedNoFees}
                    onChange={(e) => setHasConfirmedNoFees(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">
                      3. Zero Illegal Middleman Commissions Confirmed
                    </span>
                    <span className="text-stone-500">
                      I am dealing directly with verified owner/agent. No unaccredited street cartel is charging 10% agency + 10% caution fee.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!canProceed}
                  onClick={() => setStep('escrow-deposit')}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    canProceed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to SafePay Escrow Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Step 2: Escrow Deposit */}
          {step === 'escrow-deposit' && (
            <div className="space-y-5">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center gap-3">
                <Lock className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Escrow Safe Deposit Guarantee</div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Your payment of <strong>{formattedPrice}</strong> is placed into KeyDirect Escrow. The owner ({property.owner.name}) receives a notification that funds are secured, but payment is locked until you physically collect the keys.
                  </p>
                </div>
              </div>

              {/* Payment Breakdown Card */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Agreed Rent / Booking Amount:</span>
                  <span className="font-bold text-stone-900">{formattedPrice}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Street Agent Inspection Fee:</span>
                  <span className="font-bold text-emerald-600">₦0 (100% Free Virtual Look)</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>KeyDirect Escrow Protection Fee:</span>
                  <span className="font-bold text-emerald-600">₦0 (Zero Markup)</span>
                </div>
                <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-sm font-black text-stone-900">
                  <span>Total Escrow Deposit:</span>
                  <span className="text-base text-red-600">{formattedPrice}</span>
                </div>
              </div>

              {/* Deposit Action */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep('checklist')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100"
                >
                  ← Back to Checklist
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDepositEscrow}
                  className="px-6 py-3 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Securing Escrow Deposit...' : 'Lock Funds in SafePay Escrow'}</span>
                </button>
              </div>

            </div>
          )}

          {/* Step 3: Locked in Escrow & Key Code Generated */}
          {step === 'locked-escrow' && (
            <div className="space-y-5 text-center py-4">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                  ✓ Funds Secured in SafePay Escrow
                </span>
                <h4 className="font-heading font-black text-xl text-stone-900 mt-2">
                  Your Payment is 100% Protected
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  The landlord has been notified. When you arrive at the property and receive the physical keys, share your secret Handover Code with the landlord to authorize release.
                </p>
              </div>

              {/* Key Handover Code Box */}
              <div className="bg-stone-950 text-white rounded-3xl p-5 max-w-sm mx-auto shadow-2xl border border-stone-800 space-y-2">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Your Key Handover Release Code
                </div>
                <div className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-emerald-400">
                  {escrowCode}
                </div>
                <p className="text-[10px] text-stone-400">
                  Do not disclose this code until you physically hold the keys and confirm room condition.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleConfirmHandover}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Simulate: I Received Keys & Inspect OK</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold"
                >
                  Done For Now
                </button>
              </div>

            </div>
          )}

          {/* Step 4: Deal Completed */}
          {step === 'key-release' && (
            <div className="space-y-5 text-center py-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="font-heading font-black text-2xl text-stone-900">
                  Transaction Successfully Completed!
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Keys are confirmed in your possession. Funds released to <strong>{property.owner.name}</strong>. Zero scam, zero unnecessary agent commission, zero inspection fees!
                </p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 max-w-md mx-auto text-left border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Property:</span>
                  <span className="font-bold text-stone-900">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Release Code:</span>
                  <span className="font-mono font-bold text-emerald-700">{escrowCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Inspection Fee Saved:</span>
                  <span className="font-bold text-emerald-700">₦{property.inspectionFeeSavedNgn || 15000}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Agent Commission Saved:</span>
                  <span className="font-bold text-emerald-700">10% Direct Deal</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white font-black text-xs shadow-xl cursor-pointer"
              >
                Return to KeyDirect Platform
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
