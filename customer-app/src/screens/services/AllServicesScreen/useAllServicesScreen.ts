import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useSearchServicesQuery } from '@/redux/api/provider/providerApi';
import { ServiceSearchResult } from '@/redux/api/provider/types';
import { locationNote, useLocationFilter } from '@/hooks/useLocationFilter';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

type Nav = {
  navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void;
};

const PAGE_SIZE = 20;

/**
 * Every service near the customer, top-rated first — the full list behind
 * Home's "Popular services to book". Same distance rings as Home, paged
 * 20 at a time.
 */
export function useAllServicesScreen() {
  const navigation = useNavigation<Nav>();

  // GPS point / PIN code → backend searches 10 → 20 → 50 → 100 km rings.
  const { filter: locationFilter, location: loc } = useLocationFilter();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ServiceSearchResult[]>([]);
  const { data, isLoading, isFetching, refetch } = useSearchServicesQuery({
    limit: PAGE_SIZE,
    page,
    // Highest-rated business first, then most reviews; one service (its
    // most-booked) per business — same as Home.
    sort: 'rating',
    onePerProvider: true,
    ...locationFilter,
  });

  // Append each page; page 1 replaces (first load / refresh / location change).
  useEffect(() => {
    if (!data) {
      return;
    }
    setItems((prev) => {
      if (data.pagination.page === 1) {
        return data.items;
      }
      const seen = new Set(prev.map((s) => s.id));
      return [...prev, ...data.items.filter((s) => !seen.has(s.id))];
    });
  }, [data]);

  // A new location starts the list over.
  useEffect(() => {
    setPage(1);
  }, [locationFilter]);

  const total = data?.pagination.total ?? items.length;
  const hasMore = !!data && data.pagination.page < data.pagination.totalPages;

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [hasMore, isFetching]);

  const refresh = useCallback(() => {
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [page, refetch]);

  const onPress = useCallback(
    (s: ServiceSearchResult) =>
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: s.provider.id,
        name: s.provider.businessName,
      }),
    [navigation],
  );

  return {
    scopeNote: locationNote(data, loc),
    items,
    total,
    isLoading: isLoading && items.length === 0,
    isLoadingMore: isFetching && page > 1,
    isRefreshing: isFetching && page === 1 && items.length > 0,
    loadMore,
    refresh,
    onPress,
  };
}
