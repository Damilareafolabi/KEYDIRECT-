import React, { useState } from 'react';
import { 
  ThumbsUp, 
  Heart, 
  Flame, 
  PartyPopper, 
  MessageSquare, 
  Share2,
  Check
} from 'lucide-react';
import { 
  ReactionType, 
  ReactionCounts, 
  getTargetReactions, 
  toggleTargetReaction 
} from '../utils/socialEngagementStorage';

interface SocialReactionRowProps {
  targetId: string;
  onOpenComments?: () => void;
  onShare?: () => void;
  commentsCount?: number;
  compact?: boolean;
}

export const SocialReactionRow: React.FC<SocialReactionRowProps> = ({
  targetId,
  onOpenComments,
  onShare,
  commentsCount = 0,
  compact = false,
}) => {
  const [reactions, setReactions] = useState<ReactionCounts>(() => getTargetReactions(targetId));
  const [showFlyout, setShowFlyout] = useState(false);

  const totalReactions = reactions.like + reactions.love + reactions.fire + reactions.celebrate;

  const handleSelectReaction = (type: ReactionType, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleTargetReaction(targetId, type);
    setReactions(updated);
    setShowFlyout(false);
  };

  const currentReaction = reactions.userReaction;

  return (
    <div className="relative border-t border-stone-150 pt-2.5 mt-2 flex flex-col gap-2">
      
      {/* Reaction Counts Summary Bar (Facebook-style) */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium px-1">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1 items-center">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow-xs ring-1 ring-white">
              👍
            </span>
            <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] shadow-xs ring-1 ring-white">
              ❤️
            </span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-xs ring-1 ring-white">
              🔥
            </span>
          </div>
          <span className="font-semibold text-stone-700">
            {totalReactions > 0 ? totalReactions.toLocaleString() : 'Be first to like'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-stone-400">
          {onOpenComments && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments();
              }}
              className="hover:underline hover:text-stone-700 cursor-pointer"
            >
              {commentsCount} comments
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="hover:underline hover:text-stone-700 cursor-pointer"
            >
              shares
            </button>
          )}
        </div>
      </div>

      {/* Floating Reaction Picker Flyout (Facebook-Style on hover/click) */}
      {showFlyout && (
        <div 
          className="absolute -top-11 left-0 z-30 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-2xl border border-stone-200 flex items-center gap-2 animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => handleSelectReaction('like', e)}
            className="text-lg hover:scale-130 transition-transform cursor-pointer p-0.5"
            title="Like"
          >
            👍
          </button>
          <button
            type="button"
            onClick={(e) => handleSelectReaction('love', e)}
            className="text-lg hover:scale-130 transition-transform cursor-pointer p-0.5"
            title="Love"
          >
            ❤️
          </button>
          <button
            type="button"
            onClick={(e) => handleSelectReaction('fire', e)}
            className="text-lg hover:scale-130 transition-transform cursor-pointer p-0.5"
            title="Fire"
          >
            🔥
          </button>
          <button
            type="button"
            onClick={(e) => handleSelectReaction('celebrate', e)}
            className="text-lg hover:scale-130 transition-transform cursor-pointer p-0.5"
            title="Celebrate"
          >
            🎉
          </button>
        </div>
      )}

      {/* Action Buttons Row (Like, Comment, Share) */}
      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-stone-100">
        
        {/* Like Button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => handleSelectReaction(currentReaction || 'like', e)}
            onMouseEnter={() => setShowFlyout(true)}
            onMouseLeave={() => setTimeout(() => setShowFlyout(false), 2000)}
            className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              currentReaction === 'like'
                ? 'text-blue-600 bg-blue-50/80'
                : currentReaction === 'love'
                ? 'text-red-600 bg-red-50/80'
                : currentReaction === 'fire'
                ? 'text-amber-600 bg-amber-50/80'
                : currentReaction === 'celebrate'
                ? 'text-purple-600 bg-purple-50/80'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {currentReaction === 'like' ? (
              <>
                <span>👍</span>
                <span>Liked</span>
              </>
            ) : currentReaction === 'love' ? (
              <>
                <span>❤️</span>
                <span>Love</span>
              </>
            ) : currentReaction === 'fire' ? (
              <>
                <span>🔥</span>
                <span>Fire</span>
              </>
            ) : currentReaction === 'celebrate' ? (
              <>
                <span>🎉</span>
                <span>Celebrate</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-3.5 h-3.5 text-stone-500" />
                <span>Like</span>
              </>
            )}
          </button>
        </div>

        {/* Comment Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenComments) onOpenComments();
          }}
          className="py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onShare) onShare();
          }}
          className="py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-red-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-stone-500" />
          <span>Share</span>
        </button>

      </div>

    </div>
  );
};
