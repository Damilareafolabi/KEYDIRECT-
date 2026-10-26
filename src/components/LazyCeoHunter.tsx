import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Zap, 
  Phone, 
  PartyPopper,
  TrendingUp,
  Building
} from 'lucide-react';
import { LazyCeoLead, PropertyCategory } from '../types';

interface LazyCeoHunterProps {
  activeCategory: PropertyCategory;
  onOpenLeadPipeline: () => void;
  onLeadCaptured: (lead: LazyCeoLead) => void;
}

export const LazyCeoHunter: React.FC<LazyCeoHunterProps> = ({
  activeCategory,
  onOpenLeadPipeline,
  onLeadCaptured,
}) => {
  const [isOpenBubble, setIsOpenBubble] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [proactiveMessage, setProactiveMessage] = useState<string>('');
  const [clientInput, setClientInput] = useState('');
  const [isCaptured, setIsCaptured] = useState(false);

  // Dynamic proactive pitches based on what user is browsing
  useEffect(() => {
    let msg = '';
    if (activeCategory === 'Party Apartments') {
      msg = "🎉 Looking for a soundproof party penthouse in Lekki with rooftop pool and NO noise curfew? I'm LazyCEO — tell me your party date and guest size, I'll negotiate directly with the owner for you!";
    } else if (activeCategory === 'Event Centers') {
      msg = "🏛️ Need a banquet marquee or wedding arena for 500-1500 guests with guaranteed chillers and 0% agent fee? Tell me your event date!";
    } else if (activeCategory === 'Plots / Land') {
      msg = "📜 Are you looking to BUY outright or RENT commercial land for an event yard/car lot? I hunt verified C of O deals directly from families!";
    } else {
      msg = "💼 Welcome! I am LazyCEO — SimeonJrStudios' client-hunter agent. I do the talking and negotiate direct deals for you with 0% agent commission. What property or service are you hunting for today?";
    }
    setProactiveMessage(msg);
    setIsOpenBubble(true);
  }, [activeCategory]);

  const handleQuickLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientInput.trim()) return;

    const newLead: LazyCeoLead = {
      id: `lead-${Date.now()}`,
      clientName: 'Client Interested in ' + activeCategory,
      clientNeed: clientInput,
      budgetFormatted: 'Negotiating Direct (0% Commission)',
      location: 'Lagos / Abuja',
      capturedAt: 'Just now',
      urgency: 'Hot',
      pitchUsed: proactiveMessage,
      whatsappContact: '+234 803 000 0000',
    };

    onLeadCaptured(newLead);
    setIsCaptured(true);
    setTimeout(() => {
      setIsCaptured(false);
      setIsOpenBubble(false);
      setClientInput('');
    }, 2500);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-6 z-40 bg-stone-900 text-white p-3 rounded-full shadow-2xl border border-red-500 hover:scale-105 transition-all cursor-pointer flex items-center gap-2 group"
      >
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs">
          ⚡
        </div>
        <span className="text-xs font-bold pr-2 hidden sm:inline">LazyCEO Hunter Active</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      
      {/* Speech Bubble */}
      {isOpenBubble && (
        <div className="bg-stone-950 text-white rounded-3xl p-4 shadow-2xl border border-stone-800 mb-2 relative">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-600/40">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-xs tracking-wider uppercase text-white">
                    LazyCEO™ Client-Hunter
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="text-[9px] text-stone-400">Autonomous Deal Hunter · SimeonJrStudios</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-stone-400 hover:text-white rounded-lg cursor-pointer text-xs"
                title="Minimize Hunter"
              >
                _
              </button>
              <button
                onClick={() => setIsOpenBubble(false)}
                className="p-1 text-stone-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {isCaptured ? (
            <div className="py-3 text-center space-y-1 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 mx-auto animate-bounce" />
              <div className="font-bold text-xs">Direct Deal Lead Captured!</div>
              <p className="text-[10px] text-stone-300">LazyCEO is matching you with direct verified hosts right now.</p>
            </div>
          ) : (
            <>
              {/* Proactive Pitch Text */}
              <p className="text-xs text-stone-200 leading-relaxed font-medium mb-3">
                {proactiveMessage}
              </p>

              {/* Fast Lead Capture Input */}
              <form onSubmit={handleQuickLeadSubmit} className="space-y-2">
                <div className="flex items-center bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 focus-within:border-red-500">
                  <input
                    type="text"
                    value={clientInput}
                    onChange={(e) => setClientInput(e.target.value)}
                    placeholder="e.g. Need party pad for 25 people on Friday..."
                    className="w-full bg-transparent text-xs text-white placeholder:text-stone-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shrink-0 ml-1"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>

              {/* Action shortcuts */}
              <div className="flex items-center justify-between pt-2 text-[10px] text-stone-400 border-t border-stone-800/80 mt-2">
                <button
                  onClick={onOpenLeadPipeline}
                  className="text-red-400 hover:text-red-300 font-bold cursor-pointer flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>View Hunter Pipeline & Settings</span>
                </button>
                <span className="text-stone-500">Zero commission</span>
              </div>
            </>
          )}

        </div>
      )}

      {/* Floating Avatar Trigger */}
      {!isOpenBubble && (
        <button
          onClick={() => setIsOpenBubble(true)}
          className="bg-stone-900 text-white p-3 rounded-2xl shadow-2xl border border-red-500/80 hover:bg-stone-800 transition-all cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight pr-1">
            <div className="font-heading font-black text-xs text-white flex items-center gap-1">
              LazyCEO™
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-[10px] text-stone-400">Hunting Clients...</div>
          </div>
        </button>
      )}

    </div>
  );
};
