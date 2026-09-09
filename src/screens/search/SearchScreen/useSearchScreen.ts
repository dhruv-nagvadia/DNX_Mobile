import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useAppSelector } from '@/redux/hooks';
import { Provider, ProviderSort } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';

import { SearchNavigationProp } from './types';

export type TypeFilter = 'ALL' | 'SERVICE' | 'STORE';

/** Provider search with type, category, rating, sort and location filters (browse-friendly). */
export function useSearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();

  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('ALL');
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [sort, setSort] = useState<ProviderSort>('rating');

  const trimmed = query.trim();

  const { data: allCategories = [] } = useGetCategoriesQuery();
  // Categories shown depend on the selected business kind.
  const categories = useMemo(
    () =>
      type === 'ALL'
        ? allCategories
        : allCategories.filter((c) => (c.type ?? 'SERVICE') === type),
    [allCategories, type],
  );

  // The customer's chosen search location — GPS powers "nearest"; a typed
  // city/PIN narrows results to that area regardless of sort.
  const location = useAppSelector((s) => s.location.current);
  const hasCoords = location?.mode === 'gps' && location.lat != null && location.lng != null;

  const { data, isFetching } = useGetProvidersQuery({
    search: trimmed.length >= 2 ? trimmed : undefined,
    type: type === 'ALL' ? undefined : type,
    categorySlug: categorySlug ?? undefined,
    minRating: minRating || undefined,
    openNow: openNow || undefined,
    city: location?.mode === 'manual' ? location.city : undefined,
    postalCode: location?.mode === 'manual' ? location.postalCode : undefined,
    sort,
    lat: sort === 'nearest' && hasCoords ? location!.lat : undefined,
    lng: sort === 'nearest' && hasCoords ? location!.lng : undefined,
    limit: 30,
  });

  // Switching type clears a category that no longer applies.
  const selectType = useCallback((t: TypeFilter) => {
    setType(t);
    setCategorySlug(null);
  }, []);

  const toggleCategory = useCallback((slug: string) => {
    setCategorySlug((prev) => (prev === slug ? null : slug));
  }, []);

  const clearCategory = useCallback(() => setCategorySlug(null), []);

  const toggleRating = useCallback((r: number) => {
    setMinRating((prev) => (prev === r ? 0 : r));
  }, []);

  const toggleOpenNow = useCallback(() => setOpenNow((prev) => !prev), []);

  const onProviderPress = useCallback(
    (p: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: p.id, name: p.businessName });
    },
    [navigation],
  );

  const goToLocationPicker = useCallback(
    () => navigation.navigate(ROUTES.LOCATION_PICKER),
    [navigation],
  );

  return {
    query,
    setQuery,
    type,
    selectType,
    categories,
    categorySlug,
    toggleCategory,
    clearCategory,
    minRating,
    toggleRating,
    openNow,
    toggleOpenNow,
    sort,
    setSort,
    // "Nearest" needs GPS coordinates — a typed city/PIN doesn't power distance sort.
    nearestAvailable: hasCoords,
    locationLabel: location?.label ?? null,
    goToLocationPicker,
    providers: data?.items ?? [],
    isFetching,
    onProviderPress,
  };
}
