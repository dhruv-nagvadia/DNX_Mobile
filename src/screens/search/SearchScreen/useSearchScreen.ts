import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Provider, ProviderSort } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';

import { SearchNavigationProp } from './types';

export type TypeFilter = 'ALL' | 'SERVICE' | 'STORE';

/** Provider search with type, category, rating and sort filters (browse-friendly). */
export function useSearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();

  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('ALL');
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
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

  const { data, isFetching } = useGetProvidersQuery({
    search: trimmed.length >= 2 ? trimmed : undefined,
    type: type === 'ALL' ? undefined : type,
    categorySlug: categorySlug ?? undefined,
    minRating: minRating || undefined,
    sort,
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

  const onProviderPress = useCallback(
    (p: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: p.id, name: p.businessName });
    },
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
    sort,
    setSort,
    providers: data?.items ?? [],
    isFetching,
    onProviderPress,
  };
}
