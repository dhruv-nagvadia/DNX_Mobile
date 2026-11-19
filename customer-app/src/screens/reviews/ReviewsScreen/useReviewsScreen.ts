import { useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import { useGetProviderReviewsQuery } from '@/redux/api/provider/providerApi';

import { ReviewFilter, ReviewsRouteProp } from './types';

/** Loads a provider's reviews, computes the average + star breakdown, and filters the list. */
export function useReviewsScreen() {
  const { params } = useRoute<ReviewsRouteProp>();
  const { data: reviews = [], isLoading } = useGetProviderReviewsQuery(params.providerId);
  const [filter, setFilter] = useState<ReviewFilter>('all');

  const summary = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    // Counts for 5★ down to 1★.
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const n = reviews.filter((r) => r.rating === star).length;
      return { star, n, pct: count ? (n / count) * 100 : 0 };
    });
    const withComments = reviews.filter((r) => !!r.comment?.trim()).length;
    return { count, avg, distribution, withComments };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    if (filter === 'all') {
      return reviews;
    }
    if (filter === 'comments') {
      return reviews.filter((r) => !!r.comment?.trim());
    }
    return reviews.filter((r) => r.rating === filter);
  }, [reviews, filter]);

  return {
    businessName: params.businessName,
    reviews,
    visibleReviews,
    filter,
    setFilter,
    isLoading,
    ...summary,
  };
}
