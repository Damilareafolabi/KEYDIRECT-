import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Phone, 
  MessageCircle,
  Video,
  UserCheck
} from 'lucide-react';
import { Property, UserRole } from '../types';
import { ScheduledInspection, saveScheduledInspection } from '../utils/propertyStorage';
import { UserAccount } from '../utils/auth';

interface ScheduleInspectionModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | { name: string; role: UserRole; email: string } | null;
  onSuccess: (inspection: ScheduledInspection) => void;
}

export const ScheduleInspectionModal: React.FC<ScheduleInspectionModalProps> = ({
  property,
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [inspectionType, setInspectionType] = useState<'Physical Inspection (₦0 Fee)' | 'Live 360° Video Walkthrough'>('Physical Inspection (₦0 Fee)');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM (Morning)');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser && 'phone' in currentUser ? currentUser.phone : '+234 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [specialNote, setSpecialNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedInspection, setConfirmedInspection] = useState<ScheduledInspection | null>(null);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const newInspection: ScheduledInspection = {
      id: `insp-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      neighbourhood: property.neighbourhood,
      ownerName: property.owner.name,
      ownerPhone: property.owner.phone,
      date,
      timeSlot,
      inspectionType,
      userName: fullName,
      userPhone: phone,
      userEmail: email,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    saveScheduledInspection(newInspection);
    setConfirmedInspection(newInspection);
    setIsSuccess(true);
    onSuccess(newInspection);
  };

  const getCleanPhone = (p: string) => p.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg tracking-tight">
                Schedule Property Inspection
              </h3>
              <p className="text-xs text-stone-400">
                Guaranteed ₦0 Inspection Fee · Direct Landlord Connection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess && confirmedInspection ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
                ₦0 Inspection Pass Confirmed
              </span>
              <h4 className="font-heading font-black text-2xl text-stone-900">
                Inspection Booked Successfully!
              </h4>
              <p className="text-stone-500 text-xs max-w-md mx-auto mt-1">
                Your direct booking has been verified with <strong>{property.owner.name}</strong>. Zero agent mobilization fees charged.
              </p>
            </div>

            {/* Pass Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <span className="text-stone-500 font-medium">Pass Reference:</span>
                <span className="font-mono font-bold text-red-600">{confirmedInspection.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Property:</span>
                <span className="font-bold text-stone-900 truncate max-w-[220px]">{property.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Scheduled Date:</span>
                <span className="font-bold text-stone-900">{confirmedInspection.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Time Window:</span>
                <span className="font-bold text-stone-900">{confirmedInspection.timeSlot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Direct Landlord Contact:</span>
                <span className="font-bold text-stone-900">{property.owner.phone}</span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={`https://wa.me/${getCleanPhone(property.owner.phone)}?text=${encodeURIComponent(
                  `Hello ${property.owner.name}, I booked a ₦0 inspection on KeyDirect for "${property.title}" on ${confirmedInspection.date} (${confirmedInspection.timeSlot}). Ref: ${confirmedInspection.id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Landlord on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="py-3 px-6 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Property Summary Pill */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="font-bold text-stone-900 truncate">{property.title}</h4>
                <p className="text-stone-500 flex items-center gap-1 mt-0.5 truncate text-[11px]">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{property.neighbourhood}, {property.state}</span>
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    ₦0 Inspection Fee
                  </span>
                  <span className="text-stone-500 text-[10px]">Host: {property.owner.name}</span>
                </div>
              </div>
            </div>

            {/* Inspection Format */}
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Select Inspection Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setInspectionType('Physical Inspection (₦0 Fee)')}
                  className={`p-3 rounded-xl font-bold border transition-all text-left cursor-pointer ${
                    inspectionType === 'Physical Inspection (₦0 Fee)'
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Physical Walk-in</span>
                  </div>
                  <p className="text-[10px] font-normal text-stone-500">
                    Visit the property on-site with verified host. ₦0 fee.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectionType('Live 360° Video Walkthrough')}
                  className={`p-3 rounded-xl font-bold border transition-all text-left cursor-pointer ${
                    inspectionType === 'Live 360° Video Walkthrough'
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Live 360° Video Call</span>
                  </div>
                  <p className="text-[10px] font-normal text-stone-500">
                    Host walks you through in HD video before traveling.
                  </p>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Preferred Date
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent outline-none text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Time Slot Window
                </label>
                <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                  <Clock className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-transparent outline-none text-stone-900 cursor-pointer"
                  >
                    <option value="10:00 AM - 12:00 PM (Morning)">10:00 AM - 12:00 PM (Morning)</option>
                    <option value="12:00 PM - 02:00 PM (Midday)">12:00 PM - 02:00 PM (Midday)</option>
                    <option value="02:00 PM - 04:00 PM (Afternoon)">02:00 PM - 04:00 PM (Afternoon)</option>
                    <option value="04:00 PM - 06:00 PM (Evening)">04:00 PM - 06:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visitor Details */}
            <div className="space-y-2 text-xs">
              <label className="block text-[11px] font-bold text-stone-500 uppercase">
                Your Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone Number (+234...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 outline-none focus:border-red-500"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address (for calendar invite)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 outline-none focus:border-red-500"
              />

              <textarea
                rows={2}
                placeholder="Any special inquiry or party requirement? (Optional)"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 outline-none focus:border-red-500 resize-none"
              />
            </div>

            {/* Anti-Scam Callout */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>KeyDirect Anti-Scam Policy:</strong> You will NOT be asked to pay any money for this inspection. Report any agent demanding "form fees" immediately.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Confirm ₦0 Inspection Slot
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
