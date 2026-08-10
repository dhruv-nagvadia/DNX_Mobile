import { useMemo } from 'react';
import { useRoute } from '@react-navigation/native';

import { useGetProviderReviewsQuery } from '@/redux/api/provider/providerApi';

import { ReviewsRouteProp } from './types';

/** Loads a provider's reviews and computes the average + star breakdown. */
export function useReviewsScreen() {
  const { params } = useRoute<ReviewsRouteProp>();
  const { data: reviews = [], isLoading } = useGetProviderReviewsQuery(params.providerId);

  const summary = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    // Counts for 5★ down to 1★.
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const n = reviews.filter((r) => r.rating === star).length;
      return { star, n, pct: count ? (n / count) * 100 : 0 };
    });
    return { count, avg, distribution };
  }, [reviews]);

  return {
    businessName: params.businessName,
    reviews,
    isLoading,
    ...summary,
  };
}
