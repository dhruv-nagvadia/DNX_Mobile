import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useGetAllProductReviewsQuery,
  useGetAllReviewsQuery,
  useGetMyBusinessesQuery,
  useReplyToProductReviewMutation,
  useReplyToReviewMutation,
} from '@/redux/api/business/businessApi';
import { BusinessReview } from '@/redux/api/business/types';

import { RatingFilter, ReviewItem, ReviewSort, ReviewTypeFilter, ReviewsRouteProp } from './types';

const MAX_REPLY = 1000;

/** GET /provider/reviews also returns the owning business on each row. */
type OwnerBusinessReview = BusinessReview & { provider?: { id: string; businessName: string } };

function matchesRating(r: ReviewItem, filter: RatingFilter): boolean {
  switch (filter) {
    case 'needsReply':
      return !r.providerReply;
    case '5':
      return Math.round(r.rating) === 5;
    case '4':
      return Math.round(r.rating) === 4;
    case 'low':
      return Math.round(r.rating) <= 3;
    default:
      return true;
  }
}

function compare(sort: ReviewSort) {
  const time = (r: ReviewItem) => new Date(r.createdAt).getTime() || 0;
  return (a: ReviewItem, b: ReviewItem) => {
    switch (sort) {
      case 'oldest':
        return time(a) - time(b);
      case 'highest':
        return b.rating - a.rating || time(b) - time(a);
      case 'lowest':
        return a.rating - b.rating || time(b) - time(a);
      default:
        return time(b) - time(a);
    }
  };
}

/** All reviews (business + product) across every business the owner has,
 * optionally preselected to one business via `route.params.businessId`. */
export function useReviewsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ReviewsRouteProp>();
  const routeBusinessId = route.params?.businessId;

  const businessQuery = useGetAllReviewsQuery();
  const productQuery = useGetAllProductReviewsQuery();
  const { data: businesses = [] } = useGetMyBusinessesQuery();
  const [replyToReview, { isLoading: savingBusiness }] = useReplyToReviewMutation();
  const [replyToProductReview, { isLoading: savingProduct }] = useReplyToProductReviewMutation();

  const [businessFilter, setBusinessFilter] = useState<string | null>(routeBusinessId ?? null);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [sort, setSort] = useState<ReviewSort>('newest');
  const [typeFilter, setTypeFilter] = useState<ReviewTypeFilter>('all');
  const [sheetOpen, setSheetOpen] = useState(false);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [replyError, setReplyError] = useState<string | null>(null);

  const allItems = useMemo<ReviewItem[]>(() => {
    const nameById = new Map(businesses.map((b) => [b.id, b.businessName]));
    const biz = ((businessQuery.data ?? []) as OwnerBusinessReview[]).map((r) => {
      const businessId = r.provider?.id ?? routeBusinessId ?? '';
      return {
        key: `b:${r.id}`,
        kind: 'business' as const,
        id: r.id,
        rating: r.rating,
        comment: r.comment ?? null,
        providerReply: r.providerReply ?? null,
        repliedAt: r.repliedAt ?? null,
        createdAt: r.createdAt,
        userName: r.user?.fullName || 'Customer',
        businessId,
        businessName: r.provider?.businessName ?? nameById.get(businessId) ?? 'Business',
      };
    });
    const prod = (productQuery.data ?? []).map((r) => ({
      key: `p:${r.id}`,
      kind: 'product' as const,
      id: r.id,
      rating: r.rating,
      comment: r.comment ?? null,
      providerReply: r.providerReply ?? null,
      repliedAt: r.repliedAt ?? null,
      createdAt: r.createdAt,
      userName: r.user?.fullName || 'Customer',
      businessId: r.product.provider.id,
      businessName: r.product.provider.businessName,
      product: { id: r.product.id, name: r.product.name, imageUrl: r.product.imageUrl ?? null },
    }));
    return [...biz, ...prod];
  }, [businessQuery.data, productQuery.data, businesses, routeBusinessId]);

  const hasProductReviews = (productQuery.data?.length ?? 0) > 0;
  const effectiveType: ReviewTypeFilter = typeFilter === 'product' && !hasProductReviews ? 'all' : typeFilter;

  /** Reviews in the selected business + type — the base for counts and chips. */
  const scoped = useMemo(
    () =>
      allItems.filter(
        (r) =>
          (!businessFilter || r.businessId === businessFilter) && (effectiveType === 'all' || r.kind === effectiveType),
      ),
    [allItems, businessFilter, effectiveType],
  );

  const reviews = useMemo(
    () => scoped.filter((r) => matchesRating(r, ratingFilter)).sort(compare(sort)),
    [scoped, ratingFilter, sort],
  );

  const needsReplyCount = useMemo(() => scoped.filter((r) => !r.providerReply).length, [scoped]);

  /** Rating summary — business reviews only (product ratings are per product). */
  const summary = useMemo(() => {
    const rated = allItems.filter((r) => r.kind === 'business' && (!businessFilter || r.businessId === businessFilter));
    const count = rated.length;
    const avg = count ? rated.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: rated.filter((r) => Math.round(r.rating) === star).length,
    }));
    return { count, avg, distribution };
  }, [allItems, businessFilter]);

  const businessChips = useMemo(
    () => businesses.map((b) => ({ id: b.id, name: b.businessName })),
    [businesses],
  );
  const selectedBusinessName = businessFilter
    ? (businesses.find((b) => b.id === businessFilter)?.businessName ??
      allItems.find((r) => r.businessId === businessFilter)?.businessName ??
      null)
    : null;

  const startReply = useCallback((item: ReviewItem) => {
    setEditingKey(item.key);
    setDraft(item.providerReply ?? '');
    setReplyError(null);
  }, []);

  const cancelReply = useCallback(() => {
    setEditingKey(null);
    setDraft('');
    setReplyError(null);
  }, []);

  const sendReply = useCallback(
    async (item: ReviewItem, reply: string | null) => {
      if (!item.businessId) {
        setReplyError('Could not find the business for this review.');
        return;
      }
      setReplyError(null);
      try {
        if (item.kind === 'product' && item.product) {
          await replyToProductReview({
            businessId: item.businessId,
            productId: item.product.id,
            reviewId: item.id,
            reply,
          }).unwrap();
        } else {
          await replyToReview({ businessId: item.businessId, reviewId: item.id, reply }).unwrap();
        }
        setEditingKey(null);
        setDraft('');
      } catch {
        setReplyError(reply === null ? 'Could not remove the reply. Please try again.' : 'Could not post your reply. Please try again.');
      }
    },
    [replyToProductReview, replyToReview],
  );

  const saveReply = useCallback(
    (item: ReviewItem) => {
      const text = draft.trim();
      if (!text) {
        setReplyError('Write a reply before posting.');
        return;
      }
      if (text.length > MAX_REPLY) {
        setReplyError(`Replies can be at most ${MAX_REPLY} characters.`);
        return;
      }
      sendReply(item, text);
    },
    [draft, sendReply],
  );

  const removeReply = useCallback(
    (item: ReviewItem) => {
      Alert.alert('Remove reply?', 'Your public reply will be deleted from this review.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => sendReply(item, null) },
      ]);
    },
    [sendReply],
  );

  const refresh = useCallback(() => {
    businessQuery.refetch();
    productQuery.refetch();
  }, [businessQuery, productQuery]);

  return {
    reviews,
    scopedCount: scoped.length,
    totalCount: allItems.length,
    needsReplyCount,
    summary,
    businessChips,
    businessFilter,
    setBusinessFilter,
    selectedBusinessName,
    ratingFilter,
    setRatingFilter,
    sort,
    setSort,
    typeFilter: effectiveType,
    setTypeFilter,
    hasProductReviews,
    sheetOpen,
    openSheet: () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
    isLoading: businessQuery.isLoading || productQuery.isLoading,
    isError: businessQuery.isError && productQuery.isError,
    refreshing: (businessQuery.isFetching || productQuery.isFetching) && !businessQuery.isLoading,
    refresh,
    editingKey,
    draft,
    setDraft,
    replyError,
    saving: savingBusiness || savingProduct,
    startReply,
    cancelReply,
    saveReply,
    removeReply,
    maxReply: MAX_REPLY,
    goBack: () => navigation.goBack(),
  };
}
