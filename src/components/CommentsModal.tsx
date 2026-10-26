import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Heart,
  Sparkles
} from 'lucide-react';
import { 
  PropertyComment, 
  getCommentsForTarget, 
  addCommentToTarget, 
  toggleLikeComment 
} from '../utils/socialEngagementStorage';
import { Property, UserRole } from '../types';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetTitle?: string;
  property?: Property | null;
  currentUser?: { name: string; role: UserRole; email: string } | null;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetTitle = 'Listing Comments & Community Discussion',
  property,
  currentUser,
}) => {
  const [comments, setComments] = useState<PropertyComment[]>(() => getCommentsForTarget(targetId));
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorRole, setAuthorRole] = useState<string>(currentUser?.role || 'Renter');

  useEffect(() => {
    if (isOpen) {
      setComments(getCommentsForTarget(targetId));
    }
  }, [isOpen, targetId]);

  useEffect(() => {
    if (currentUser?.name) setAuthorName(currentUser.name);
    if (currentUser?.role) setAuthorRole(currentUser.role);
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const name = authorName.trim() || 'Verified House Hunter';
    const updated = addCommentToTarget(targetId, name, authorRole, newCommentText);
    setComments(updated);
    setNewCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    const updated = toggleLikeComment(targetId, commentId);
    setComments(updated);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white text-stone-900 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white line-clamp-1">
                {property ? property.title : targetTitle}
              </h3>
              <p className="text-[11px] text-stone-400">
                Direct public discussion · {comments.length} verified comments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Anti-Scam Reminder:</strong> Inspection is 100% free. Never pay agent viewing fees.
          </span>
        </div>

        {/* Comments Feed */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-stone-800">No comments yet</h4>
              <p className="text-xs max-w-xs mx-auto text-stone-500">
                Be the first to share your thoughts, ask the landlord questions, or discuss this listing!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 space-y-2 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={comment.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-red-500/30"
                    />
                    <div>
                      <span className="font-bold text-xs text-stone-900 block leading-tight">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {comment.authorRole} · {comment.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified
                  </span>
                </div>

                <p className="text-xs text-stone-800 leading-relaxed pl-9">
                  {comment.text}
                </p>

                <div className="flex items-center gap-4 pl-9 pt-1 text-[11px] text-stone-500">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 font-bold transition-colors cursor-pointer ${
                      comment.hasUserLiked ? 'text-blue-600' : 'text-stone-500 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${comment.hasUserLiked ? 'fill-blue-600' : ''}`} />
                    <span>{comment.likesCount > 0 ? comment.likesCount : 'Like'}</span>
                  </button>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-400">Direct Landlord View</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Footer */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 shrink-0 space-y-2">
          {!currentUser && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-1/2 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-red-500"
              />
              <select
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-1/2 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-red-500"
              >
                <option value="Renter">House Hunter / Renter</option>
                <option value="Owner">Direct Owner / Landlord</option>
                <option value="Agent">Accredited Agent</option>
                <option value="Developer">Property Developer</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment or ask a question directly..."
              className="flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs text-stone-900 outline-none focus:border-red-500 shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
            >
              <span>Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
