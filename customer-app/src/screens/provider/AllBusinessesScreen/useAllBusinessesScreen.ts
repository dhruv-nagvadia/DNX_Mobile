import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { Provider } from '@/redux/api/provider/types';
import { useAppSelector } from '@/redux/hooks';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

type Nav = {
  navigate: <T extends keyof RootStackParamList>(r: T, p?: RootStackParamList[T]) => void;
};

const PAGE_SIZE = 20;

/**
 * Every STORE or SERVICE business near the customer — the full lists behind
 * Home's "Order from stores" and "Popular services to book". Same location
 * fallback as Home (postal code → city → state), paged 20 at a time.
 */
export function useAllBusinessesScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AllBusinessesScreen'>>();
  const type = params?.type ?? 'SERVICE';
  const categorySlug = params?.categorySlug;
  const sort = params?.sort;

  const loc = useAppSelector((s) => s.location.current);
  const locationFilter = useMemo(
    () => ({
      ...(loc?.postalCode ? { postalCode: loc.postalCode } : {}),
      ...(loc?.city ? { city: loc.city } : {}),
      ...(loc?.state ? { state: loc.state } : {}),
    }),
    [loc?.postalCode, loc?.city, loc?.state],
  );

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Provider[]>([]);
  const { data, isLoading, isFetching, refetch } = useGetProvidersQuery({
    type,
    limit: PAGE_SIZE,
    page,
    ...(categorySlug ? { categorySlug } : {}),
    ...(sort ? { sort } : {}),
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
      const seen = new Set(prev.map((p) => p.id));
      return [...prev, ...data.items.filter((p) => !seen.has(p.id))];
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

  const scope = data?.locationScope;
  const scopeNote =
    scope === 'city'
      ? `Showing results across ${loc?.city ?? 'your city'}`
      : scope === 'state'
        ? `Showing results across ${loc?.state ?? 'your state'}`
        : null;

  const onPress = useCallback(
    (p: Provider) =>
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: p.id, name: p.businessName }),
    [navigation],
  );

  return {
    type,
    categorySlug,
    title: params?.title,
    items,
    total,
    isLoading: isLoading && items.length === 0,
    isLoadingMore: isFetching && page > 1,
    isRefreshing: isFetching && page === 1 && items.length > 0,
    scopeNote,
    loadMore,
    refresh,
    onPress,
  };
}
