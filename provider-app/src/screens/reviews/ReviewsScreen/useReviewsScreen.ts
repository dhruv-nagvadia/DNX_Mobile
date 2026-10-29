import { useCallback, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import { useGetBusinessReviewsQuery, useReplyToReviewMutation } from '@/redux/api/business/businessApi';

import { ReviewsRouteProp } from './types';

/** Ports `frontend/src/components/BusinessReviews/BusinessReviews.tsx`'s
 * summary header + per-row inline reply editor. */
export function useReviewsScreen() {
  const route = useRoute<ReviewsRouteProp>();
  const { businessId } = route.params;

  const { data: reviews = [], isLoading, isFetching, refetch } = useGetBusinessReviewsQuery(businessId);
  const [replyToReview, { isLoading: saving }] = useReplyToReviewMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const summary = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => Math.round(r.rating) === star).length,
    }));
    return { count, avg, distribution };
  }, [reviews]);

  const startReply = useCallback((reviewId: string, existing: string | null | undefined) => {
    setEditingId(reviewId);
    setDraft(existing ?? '');
  }, []);

  const cancelReply = useCallback(() => {
    setEditingId(null);
    setDraft('');
  }, []);

  const saveReply = useCallback(async () => {
    if (!editingId) return;
    await replyToReview({ businessId, reviewId: editingId, reply: draft.trim() || null })
      .unwrap()
      .catch(() => undefined);
    setEditingId(null);
    setDraft('');
  }, [editingId, draft, businessId, replyToReview]);

  return {
    reviews,
    summary,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    editingId,
    draft,
    setDraft,
    saving,
    startReply,
    cancelReply,
    saveReply,
  };
}
