import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useLocationFilter } from '@/hooks/useLocationFilter';
import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { Provider, ProviderSort } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';

import { ProviderListNavigationProp, ProviderListRouteProp } from './types';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

export type ListSort = Extract<ProviderSort, 'rating' | 'reviews' | 'nearest'>;

/**
 * Businesses of one sub-category (e.g. "Unisex Salon") near the customer,
 * with name search, sort chips (top rated / nearest / most reviewed) and
 * "Open now" / "4★ & above" filters — all applied by the backend. Paged.
 */
export function useProviderListScreen() {
  const navigation = useNavigation<ProviderListNavigationProp>();
  const { params } = useRoute<ProviderListRouteProp>();
  const { filter: locationFilter, location } = useLocationFilter();

  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ListSort>('rating');
  const [openNow, setOpenNow] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Provider[]>([]);

  // Debounce typing so each keystroke doesn't hit the API.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchText.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchText]);

  // "Nearest" needs device coordinates; without them the chip is hidden.
  const canSortNearest = location?.lat != null && location?.lng != null;

  const query = useMemo(
    () => ({
      categorySlug: params.categorySlug,
      subcategorySlug: params.subcategorySlug,
      limit: PAGE_SIZE,
      sort,
      ...(sort === 'nearest' && canSortNearest ? { lat: location?.lat, lng: location?.lng } : {}),
      ...(search ? { search } : {}),
      ...(openNow ? { openNow: true } : {}),
      ...(topRatedOnly ? { minRating: 4 } : {}),
      ...locationFilter,
    }),
    [
      params.categorySlug,
      params.subcategorySlug,
      sort,
      canSortNearest,
      location?.lat,
      location?.lng,
      search,
      openNow,
      topRatedOnly,
      locationFilter,
    ],
  );

  // Any filter change starts the list over from page 1.
  useEffect(() => {
    setPage(1);
  }, [query]);

  const { data, isLoading, isFetching } = useGetProvidersQuery({ ...query, page });

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

  const total = data?.pagination.total ?? items.length;
  const hasMore = !!data && data.pagination.page < data.pagination.totalPages;

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [hasMore, isFetching]);

  const onProviderPress = useCallback(
    (provider: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: provider.id,
        name: provider.businessName,
      });
    },
    [navigation],
  );

  const area = location?.address ?? location?.city;
  const noun = total === 1 ? 'place' : 'places';

  return {
    title: params.title,
    subtitle: isLoading ? undefined : `${total} ${noun}${area ? ` near ${area}` : ' near you'}`,
    providers: items,
    total,
    shown: items.length,
    hasMore,
    isLoading: isLoading && items.length === 0,
    isLoadingMore: isFetching && page > 1,
    isFiltering: isFetching && page === 1 && items.length > 0,
    searchText,
    setSearchText,
    sort,
    setSort,
    canSortNearest,
    openNow,
    toggleOpenNow: () => setOpenNow((v) => !v),
    topRatedOnly,
    toggleTopRatedOnly: () => setTopRatedOnly((v) => !v),
    loadMore,
    onProviderPress,
  };
}
