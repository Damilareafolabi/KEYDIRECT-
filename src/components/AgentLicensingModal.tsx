import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  CreditCard, 
  AlertTriangle, 
  Ban, 
  UserX, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Search, 
  ArrowRight,
  Flame,
  BadgeAlert
} from 'lucide-react';
import { AgentAccreditation, RogueAgentReport, Property } from '../types';

interface AgentLicensingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accreditations: AgentAccreditation[];
  rogueReports: RogueAgentReport[];
  properties: Property[];
  onAddAccreditation: (acc: AgentAccreditation) => void;
  onReportRogueAgent: (report: RogueAgentReport) => void;
}

export const AgentLicensingModal: React.FC<AgentLicensingModalProps> = ({
  isOpen,
  onClose,
  accreditations,
  rogueReports,
  properties,
  onAddAccreditation,
  onReportRogueAgent,
}) => {
  const [activeTab, setActiveTab] = useState<'licensing' | 'anti-rogue' | 'report'>('licensing');

  // Agent Registration Form State
  const [agentName, setAgentName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isPayingFee, setIsPayingFee] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Rogue Agent Report Form State
  const [reportedPropertyId, setReportedPropertyId] = useState(properties[0]?.id || '');
  const [allegedName, setAllegedName] = useState('');
  const [violationReason, setViolationReason] = useState<RogueAgentReport['violationReason']>(
    'Asked for ₦10,000 inspection fee'
  );
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim() || !licenseNumber.trim()) return;

    setIsPayingFee(true);
    setTimeout(() => {
      setIsPayingFee(false);
      const newAccreditation: AgentAccreditation = {
        id: `agt-${Date.now()}`,
        agentName,
        agencyName: agencyName.trim() || `${agentName} Properties Ltd`,
        licenseNumber,
        annualFeeNgn: 50000,
        paymentStatus: 'Paid & Active',
        verifiedAt: new Date().toISOString().split('T')[0],
        expiresAt: '2027-04-20',
        badge: 'Licensed & Verified Broker',
      };

      onAddAccreditation(newAccreditation);
      setRegistrationSuccess(true);
    }, 1200);
  };

  const handleReportRogue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allegedName.trim()) return;

    const prop = properties.find((p) => p.id === reportedPropertyId) || properties[0];

    const newReport: RogueAgentReport = {
      id: `rep-${Date.now()}`,
      reportedListingId: prop.id,
      reportedListingTitle: prop.title,
      allegedImpersonatorName: allegedName,
      claimedRole: 'Direct Owner',
      violationReason,
      status: 'Banned & Blacklisted',
      actionTaken: 'Listing removed immediately. Phone and IP blacklisted across KeyDirect database.',
      reportedBy: 'Platform Integrity Community',
      timestamp: 'Just now',
    };

    onReportRogueAgent(newReport);
    setReportSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-stone-900 tracking-tight">
                  Agent Accreditation & Rogue Agent Elimination
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase">
                  Zero Fake Owners
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Direct Owners register for free. Agents must pay the ₦50,000 accreditation fee or face immediate expulsion.
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

        {/* Tab Controls */}
        <div className="px-6 pt-4 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('licensing');
              setRegistrationSuccess(false);
            }}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'licensing'
                ? 'bg-white text-stone-900 border-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Agent Licensing & ₦50,000 Fee</span>
          </button>

          <button
            onClick={() => setActiveTab('anti-rogue')}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'anti-rogue'
                ? 'bg-white text-stone-900 border-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            <Ban className="w-4 h-4 text-red-600" />
            <span>Rogue Agent Blocklist ({rogueReports.length} Taken Out)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('report');
              setReportSuccess(false);
            }}
            className={`px-4 py-2.5 rounded-t-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'report'
                ? 'bg-white text-stone-900 border-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            <BadgeAlert className="w-4 h-4 text-amber-600" />
            <span>Report Fake Owner / Impersonator</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: Agent Accreditation & Fee Payment */}
          {activeTab === 'licensing' && (
            <div className="space-y-6">
              
              {/* Policy Explanation Banner */}
              <div className="bg-linear-to-r from-stone-950 via-stone-900 to-red-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    Strict Platform Integrity Policy
                  </span>
                  <h4 className="font-heading font-black text-xl text-white mt-2">
                    Why Must Agents Pay the Accreditation Fee?
                  </h4>
                  <p className="text-xs text-stone-300 max-w-xl mt-1 leading-relaxed">
                    Direct Property Owners list for FREE by submitting verifiable title deeds (C of O, Gazette, Governor’s Consent). Real estate agents, brokers, and consultants MUST pay the annual <strong>₦50,000 Accreditation & Licensing Fee</strong> and verify with LASRERA / ERCAAS to prevent cartel price-fixing and ghost property listings.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
                  <div className="text-[10px] uppercase font-bold text-stone-300">Annual Licensing Fee</div>
                  <div className="font-heading font-black text-2xl text-emerald-400">₦50,000</div>
                  <div className="text-[10px] text-stone-300">12 Months Verified Broker Badge</div>
                </div>
              </div>

              {/* Registration Form / Success */}
              {registrationSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-black text-xl text-emerald-950">
                    Agent Accreditation Active & Verified!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    License verified for <strong>{agentName}</strong>. You are authorized to publish verified listings as an Accredited Agent with 0% hidden inspection fees.
                  </p>
                  <button
                    onClick={() => setRegistrationSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                  >
                    View Active Accredited Agents
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePayRegistration} className="bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200 space-y-4">
                  <h5 className="font-heading font-black text-sm text-stone-900">
                    Apply for Agent Accreditation & Pay Licensing Fee
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Agent / Broker Full Name:
                      </label>
                      <input
                        type="text"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="e.g. Babatunde Fashola"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                        Agency / Firm Name:
                      </label>
                      <input
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="e.g. Prime Crest Realtors Ltd"
                        className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Government Real Estate License / Registration Number:
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. LASRERA/BR/2026/0491 or ERCAAS/AG/8812"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono outline-none focus:border-red-500"
                      required
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Cross-referenced against Lagos State Real Estate Regulatory Authority (LASRERA) database.
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">Total Accreditation Fee:</span>
                      <div className="text-[10px] text-stone-500">Payable annually to maintain KeyDirect agent publishing rights.</div>
                    </div>
                    <span className="font-heading font-black text-lg text-emerald-700">₦50,000</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isPayingFee}
                      className="px-6 py-3 rounded-2xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isPayingFee ? 'Processing Payment...' : 'Pay ₦50,000 Accreditation & Activate'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Active Accredited Agents List */}
              <div className="space-y-3">
                <h5 className="font-heading font-black text-xs uppercase text-stone-700 tracking-wider">
                  Accredited Licensed Agents on Platform ({accreditations.length}):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {accreditations.map((acc) => (
                    <div key={acc.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <h6 className="font-heading font-black text-xs text-stone-900 truncate">{acc.agentName}</h6>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black shrink-0">
                            ✓ {acc.paymentStatus}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">{acc.agencyName}</div>
                        <div className="text-[10px] font-mono text-stone-400 mt-1">License: {acc.licenseNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Rogue Agent Scanner & Blocklist ("Take Them Out") */}
          {activeTab === 'anti-rogue' && (
            <div className="space-y-5">
              
              <div className="bg-red-50 border-l-4 border-red-600 rounded-r-2xl p-4 text-xs text-red-950 flex items-start gap-3">
                <Flame className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-sm mb-1">
                    Zero Tolerance: Impersonators Posing as Direct Owners Are Taken Out Instantly!
                  </h5>
                  <p className="leading-relaxed">
                    Street agents frequently attempt to register as "Direct Owners" to dodge the ₦50,000 fee and secretly charge renters ₦10,000 inspection fees. Our autonomous scanner cross-checks phone numbers across national directories and analyzes chat transcripts for broker jargon.
                  </p>
                </div>
              </div>

              {/* Rogue Agents Blocklist Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <h5 className="font-heading font-black text-stone-800 uppercase tracking-wider">
                    Recent Rogue Agents Blocked & Purged ({rogueReports.length}):
                  </h5>
                  <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <Ban className="w-3.5 h-3.5" />
                    Banned Automatically
                  </span>
                </div>

                <div className="space-y-3">
                  {rogueReports.map((report) => (
                    <div 
                      key={report.id}
                      className="bg-white rounded-2xl p-4 border border-red-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                          <UserX className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-sm text-stone-900">
                              {report.allegedImpersonatorName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                              {report.status}
                            </span>
                          </div>
                          <div className="text-xs text-red-700 font-semibold mt-0.5">
                            Violation: {report.violationReason}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1">
                            Action Taken: <strong className="text-stone-700">{report.actionTaken}</strong>
                          </div>
                          <div className="text-[10px] text-stone-400 mt-1">
                            Listing: "{report.reportedListingTitle}" · {report.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        <span className="px-3 py-1.5 rounded-xl bg-stone-900 text-stone-200 text-xs font-bold flex items-center gap-1.5">
                          <Ban className="w-3.5 h-3.5 text-red-400" />
                          <span>Purged</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Report Rogue Agent Form */}
          {activeTab === 'report' && (
            <div className="space-y-5">
              
              {reportSuccess ? (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <Ban className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-black text-xl text-red-950">
                    Rogue Agent Blocked & Taken Out!
                  </h4>
                  <p className="text-xs text-red-800 max-w-md mx-auto">
                    Thank you for keeping KeyDirect clean. The listing was removed, and the phone number has been permanently blacklisted from creating future owner accounts.
                  </p>
                  <button
                    onClick={() => setActiveTab('anti-rogue')}
                    className="px-6 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs"
                  >
                    View Blocklist Feed
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportRogue} className="bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200 space-y-4">
                  <div>
                    <h5 className="font-heading font-black text-base text-stone-900">
                      Report an Impersonator / Rogue Agent
                    </h5>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Did someone posing as a "Direct Owner" ask you for an inspection fee or reveal they are actually an unlicensed broker? Report them immediately.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Target Listing:
                    </label>
                    <select
                      value={reportedPropertyId}
                      onChange={(e) => setReportedPropertyId(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-none focus:border-red-500"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.owner.name} - {p.owner.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Impersonator / Broker Contact Name or Phone:
                    </label>
                    <input
                      type="text"
                      value={allegedName}
                      onChange={(e) => setAllegedName(e.target.value)}
                      placeholder="e.g. Agent Chidi (posing as landlord)"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                      Nature of Violation:
                    </label>
                    <div className="space-y-2">
                      {([
                        'Asked for ₦10,000 inspection fee',
                        'Broker language detected (Brief from Principal)',
                        'Duplicate phone number across 12 unrelated properties',
                        'Cannot produce Title Deed / C of O',
                        'Refused Live Video Face-Check'
                      ] as const).map((reason) => (
                        <label 
                          key={reason}
                          className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-stone-200 cursor-pointer text-xs font-medium text-stone-800 hover:border-red-500"
                        >
                          <input
                            type="radio"
                            name="violationReason"
                            value={reason}
                            checked={violationReason === reason}
                            onChange={() => setViolationReason(reason)}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span>{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Block & Take Out Rogue Agent</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
