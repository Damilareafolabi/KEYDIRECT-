import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Building, 
  Calendar, 
  Flame, 
  Radio, 
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { CommunityRoom, CommunityChatMessage, UserRole, Property } from '../types';
import { INITIAL_COMMUNITY_ROOMS, INITIAL_COMMUNITY_MESSAGES } from '../data/properties';

interface CommunityChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; role: UserRole; email: string } | null;
  onRequireAuth: () => void;
  onSelectPropertyById: (id: string) => void;
}

export const CommunityChatModal: React.FC<CommunityChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequireAuth,
  onSelectPropertyById,
}) => {
  const [rooms] = useState<CommunityRoom[]>(INITIAL_COMMUNITY_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string>('room-parties');
  const [messages, setMessages] = useState<CommunityChatMessage[]>(INITIAL_COMMUNITY_MESSAGES);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const currentRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];
  const roomMessages = messages.filter((m) => m.roomId === activeRoomId);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    const newMsg: CommunityChatMessage = {
      id: `cmsg-${Date.now()}`,
      roomId: activeRoomId,
      senderName: currentUser.name || 'Verified Member',
      senderRole: currentUser.role || 'Renter',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      isVerified: true,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated community chatter response
    setTimeout(() => {
      let autoReply = '';
      if (activeRoomId === 'room-parties') {
        autoReply = "We also have private security bouncers on standby if your party goes past 2:00 AM. KeyDirect escrow ensures your deposit is 100% safe!";
      } else if (activeRoomId === 'room-land-investors') {
        autoReply = "Always verify the survey plan at Alausa Land Bureau before making any deposit. KeyDirect verifies this directly.";
      } else {
        autoReply = "Direct owner communication is the future of African real estate. Zero 10% agent commission!";
      }

      const botReply: CommunityChatMessage = {
        id: `cmsg-${Date.now() + 1}`,
        roomId: activeRoomId,
        senderName: 'Timi Green (Trust Moderator)',
        senderRole: 'Agent',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        isVerified: true,
        text: autoReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Sidebar: Rooms List */}
        <div className="w-full md:w-80 bg-stone-900 text-white flex flex-col border-r border-stone-800">
          
          {/* Header */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm tracking-wide">KeyDirect Community</h3>
                <p className="text-[10px] text-stone-400">Live Real Estate & Party Chat</p>
              </div>
            </div>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Active Chat Rooms
            </div>
            {rooms.map((room) => {
              const isActive = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs truncate">{room.name}</span>
                    {room.isHot && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-stone-900 flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 fill-current" /> HOT
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] line-clamp-1 ${isActive ? 'text-white/80' : 'text-stone-400'}`}>
                    {room.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] mt-1.5 opacity-80">
                    <Users className="w-3 h-3" />
                    <span>{room.activeUsers} people online</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* User state badge */}
          <div className="p-3 bg-stone-950 border-t border-stone-800 text-xs">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name[0]?.toUpperCase()}
                  </div>
                  <span className="truncate text-stone-200 font-semibold">{currentUser.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {currentUser.role}
                </span>
              </div>
            ) : (
              <button
                onClick={onRequireAuth}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center cursor-pointer"
              >
                Sign In to Join Conversation
              </button>
            )}
          </div>

        </div>

        {/* Right Main Chat Area */}
        <div className="flex-1 flex flex-col bg-stone-50 overflow-hidden">
          
          {/* Room Header */}
          <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-black text-base text-stone-900">
                  {currentRoom.name}
                </h4>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {currentRoom.activeUsers} online
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{currentRoom.description}</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {roomMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-2xs border ${
                  msg.senderRole === 'Owner'
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : msg.senderRole === 'Agent'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-stone-800 text-white border-stone-600'
                }`}>
                  {msg.senderName.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'KD'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-stone-900">{msg.senderName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        msg.senderRole === 'Owner'
                          ? 'bg-emerald-100 text-emerald-800'
                          : msg.senderRole === 'Agent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {msg.senderRole}
                      </span>
                      {msg.isVerified && (
                        <span title="Identity Verified">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{msg.text}</p>

                  {/* Attached listing preview tag if present */}
                  {msg.listingRefId && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPropertyById(msg.listingRefId!);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold border border-red-200 cursor-pointer"
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>View: {msg.listingTitle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-stone-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentUser ? `Share a message in ${currentRoom.name}...` : 'Please sign in to send messages...'}
                className="flex-1 bg-stone-100 focus:bg-white border border-stone-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-stone-900 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-stone-400 mt-1.5 flex items-center justify-between">
              <span>Anti-Scam Shield: Off-platform inspection fee solicitations are banned.</span>
              <span className="font-semibold text-stone-500">Press Enter to send</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
