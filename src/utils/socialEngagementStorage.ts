/**
 * KeyDirect & LazyCEO Social Engagement Engine
 * Manages Facebook-style Likes, Multi-Reactions, Comments, and Viral Sharing.
 */

export type ReactionType = 'like' | 'love' | 'fire' | 'celebrate';

export interface ReactionCounts {
  like: number;
  love: number;
  fire: number;
  celebrate: number;
  userReaction?: ReactionType | null;
}

export interface PropertyComment {
  id: string;
  targetId: string; // Property ID or 'platform'
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  text: string;
  likesCount: number;
  hasUserLiked: boolean;
  createdAt: string;
}

const STORAGE_REACTIONS_KEY = 'kd_social_reactions_v1';
const STORAGE_COMMENTS_KEY = 'kd_social_comments_v1';

// Initial default reaction seeds (so listings feel alive without dummy users)
const DEFAULT_REACTIONS_MAP: Record<string, { like: number; love: number; fire: number; celebrate: number }> = {
  platform: { like: 342, love: 189, fire: 421, celebrate: 156 },
};

export function getTargetReactions(targetId: string): ReactionCounts {
  if (typeof window === 'undefined') {
    const base = DEFAULT_REACTIONS_MAP[targetId] || { like: 12, love: 5, fire: 8, celebrate: 3 };
    return { ...base, userReaction: null };
  }

  try {
    const raw = localStorage.getItem(STORAGE_REACTIONS_KEY);
    const map: Record<string, ReactionCounts> = raw ? JSON.parse(raw) : {};
    
    if (map[targetId]) {
      return map[targetId];
    }

    // Default base metrics
    const base = DEFAULT_REACTIONS_MAP[targetId] || { like: 14, love: 6, fire: 9, celebrate: 4 };
    return { ...base, userReaction: null };
  } catch (e) {
    return { like: 10, love: 4, fire: 6, celebrate: 2, userReaction: null };
  }
}

export function toggleTargetReaction(targetId: string, reaction: ReactionType): ReactionCounts {
  if (typeof window === 'undefined') {
    return { like: 1, love: 0, fire: 0, celebrate: 0, userReaction: reaction };
  }

  try {
    const raw = localStorage.getItem(STORAGE_REACTIONS_KEY);
    const map: Record<string, ReactionCounts> = raw ? JSON.parse(raw) : {};
    const current = map[targetId] || getTargetReactions(targetId);

    const prevUserReaction = current.userReaction;

    if (prevUserReaction === reaction) {
      // User is removing reaction
      current[reaction] = Math.max(0, (current[reaction] || 1) - 1);
      current.userReaction = null;
    } else {
      // If switching from another reaction, decrement the previous one
      if (prevUserReaction && current[prevUserReaction] > 0) {
        current[prevUserReaction] = Math.max(0, current[prevUserReaction] - 1);
      }
      current[reaction] = (current[reaction] || 0) + 1;
      current.userReaction = reaction;
    }

    map[targetId] = current;
    localStorage.setItem(STORAGE_REACTIONS_KEY, JSON.stringify(map));
    return current;
  } catch (e) {
    console.error('Failed to toggle reaction', e);
    return getTargetReactions(targetId);
  }
}

export function getCommentsForTarget(targetId: string): PropertyComment[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    const map: Record<string, PropertyComment[]> = raw ? JSON.parse(raw) : {};
    return map[targetId] || [];
  } catch (e) {
    console.error('Failed to load comments', e);
    return [];
  }
}

export function addCommentToTarget(
  targetId: string,
  authorName: string,
  authorRole: string,
  text: string
): PropertyComment[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    const map: Record<string, PropertyComment[]> = raw ? JSON.parse(raw) : {};
    const list = map[targetId] || [];

    const newComment: PropertyComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      targetId,
      authorName: authorName.trim() || 'Verified Renter',
      authorRole: authorRole || 'Renter',
      authorAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      text: text.trim(),
      likesCount: 0,
      hasUserLiked: false,
      createdAt: 'Just now',
    };

    const updated = [newComment, ...list];
    map[targetId] = updated;
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(map));
    return updated;
  } catch (e) {
    console.error('Failed to save comment', e);
    return [];
  }
}

export function toggleLikeComment(targetId: string, commentId: string): PropertyComment[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    const map: Record<string, PropertyComment[]> = raw ? JSON.parse(raw) : {};
    const list = map[targetId] || [];

    const updated = list.map((c) => {
      if (c.id === commentId) {
        const nextLiked = !c.hasUserLiked;
        return {
          ...c,
          hasUserLiked: nextLiked,
          likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
        };
      }
      return c;
    });

    map[targetId] = updated;
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(map));
    return updated;
  } catch (e) {
    console.error('Failed to toggle like on comment', e);
    return [];
  }
}
