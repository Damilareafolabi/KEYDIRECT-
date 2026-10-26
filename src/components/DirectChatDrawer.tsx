import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  CheckCheck, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { Property, ChatMessage, UserRole } from '../types';

interface DirectChatDrawerProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectChatDrawer: React.FC<DirectChatDrawerProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOwnerTyping, setIsOwnerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize simulated chat history when opening for a property
  useEffect(() => {
    if (property) {
      setMessages([
        {
          id: 'sys-01',
          senderId: 'system',
          senderName: 'KeyDirect Trust Protocol',
          senderRole: 'Agent',
          text: `Direct connection opened with ${property.owner.name} (${property.owner.role}). Title: ${property.verification.documentType} (Verified). Do not make off-platform payments.`,
          timestamp: 'Just now',
          isFromUser: false,
          propertyId: property.id,
        },
        {
          id: 'welcome-01',
          senderId: property.owner.id,
          senderName: property.owner.name,
          senderRole: property.owner.role,
          text: `Hello! I am the direct owner of ${property.title} in ${property.neighbourhood}. Happy to answer any questions or host you for an on-site physical inspection. Zero agent fees!`,
          timestamp: 'Just now',
          isFromUser: false,
          propertyId: property.id,
        },
      ]);
    }
  }, [property]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOwnerTyping]);

  if (!isOpen || !property) return null;

  const quickQuestions = [
    'Is this property still available?',
    'Can I schedule a physical inspection this Saturday?',
    'Can you confirm the annual service charge breakdown?',
    'Is the title document verified with Lagos/Abuja Land Registry?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-01',
      senderName: 'You (Verified Searcher)',
      senderRole: 'Renter',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromUser: true,
      propertyId: property.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Real-time direct owner response channel
    setIsOwnerTyping(true);
    setTimeout(() => {
      setIsOwnerTyping(false);
      let reply = `Thank you for reaching out regarding ${property.title}. `;
      if (text.includes('inspection') || text.includes('Saturday')) {
        reply += `I would be delighted to show you the property. Our facility manager will be on-site from 10:00 AM to 4:00 PM. No inspection fees are charged!`;
      } else if (text.includes('available')) {
        reply += `Yes, it is 100% available and ready for immediate possession once the standard digital tenancy agreement is signed.`;
      } else if (text.includes('title') || text.includes('Registry')) {
        reply += `Yes, the ${property.verification.documentType} was thoroughly verified by SimeonJrStudios legal compliance team. The land registry reference is documented on KeyDirect.`;
      } else {
        reply += `I have noted your inquiry and our team is ready to assist you directly. Feel free to request an inspection slot.`;
      }

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: property.owner.id,
        senderName: property.owner.name,
        senderRole: property.owner.role,
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromUser: false,
        propertyId: property.id,
      };

      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-stone-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-sm tracking-wide">
                  {property.owner.name}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-[11px] text-stone-400">
                Direct {property.owner.role} · Active Now (Zero Commission)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Context Strip */}
        <div className="bg-stone-100 p-3 flex items-center gap-3 border-b border-stone-200">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
          <div className="overflow-hidden flex-1 text-xs">
            <div className="font-bold text-stone-900 truncate">{property.title}</div>
            <div className="text-stone-500 flex items-center gap-1 truncate text-[11px]">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span>{property.neighbourhood}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
            {property.verification.documentType}
          </span>
        </div>

        {/* Anti-Scam Security Notice */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>KeyDirect Escrow Protection:</strong> Never send payment before viewing and verified title handover.
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50">
          {messages.map((msg) => {
            if (msg.senderId === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block px-3 py-1 bg-stone-200 text-stone-700 text-[11px] rounded-full font-medium">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isFromUser ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-stone-400 mb-0.5 px-1 font-semibold">
                  {msg.senderName}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.isFromUser
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-white text-stone-900 border border-stone-200/90 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.isFromUser && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })}

          {isOwnerTyping && (
            <div className="flex items-center gap-2 text-stone-400 text-xs italic p-2">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce delay-200"></span>
              <span>{property.owner.name} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Footer */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message to the owner..."
            className="flex-1 bg-stone-100 focus:bg-white border border-stone-200 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 outline-none transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer shadow-xs"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
