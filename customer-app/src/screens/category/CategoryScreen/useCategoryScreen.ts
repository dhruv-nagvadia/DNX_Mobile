import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useLocationFilter } from '@/hooks/useLocationFilter';
import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { Subcategory } from '@/redux/api/category/types';
import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { Provider } from '@/redux/api/provider/types';
import { ROUTES } from '@/navigation/routes';

import { CategoryScreenNavigationProp, CategoryScreenRouteProp } from './types';

/** Banner headline per category; anything else gets a generic line. */
const TAGLINES: Record<string, string> = {
  beauty: 'Look and feel your best',
  healthcare: 'Care you can trust, nearby',
  fitness: 'Get moving, stay strong',
  education: 'Learn something new',
  home: 'Fix it, clean it, sorted',
  automotive: 'Keep your ride running',
  professional: 'Experts for every need',
  events: 'Make every moment special',
  government: 'Paperwork made easy',
  other: 'Everyday help, one tap away',
};

const TOP_RATED = 3;

/** A category's sub-categories plus its top-rated businesses near the customer. */
export function useCategoryScreen() {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { params } = useRoute<CategoryScreenRouteProp>();
  const { filter: locationFilter, location } = useLocationFilter();

  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const category = categories.find((c) => c.slug === params.slug);
  const isStore = category?.type === 'STORE';

  // Highest-rated businesses in this category (also gives the total count).
  const { data: topPage } = useGetProvidersQuery({
    categorySlug: params.slug,
    sort: 'rating',
    limit: TOP_RATED,
    ...locationFilter,
  });

  const onSubcategoryPress = useCallback(
    (sub: Subcategory) => {
      navigation.navigate(ROUTES.PROVIDER_LIST, {
        categorySlug: params.slug,
        subcategorySlug: sub.slug,
        title: sub.name,
      });
    },
    [navigation, params.slug],
  );

  const onProviderPress = useCallback(
    (p: Provider) =>
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: p.id, name: p.businessName }),
    [navigation],
  );

  const goToSearch = useCallback(() => navigation.navigate(ROUTES.SEARCH), [navigation]);

  const goToTopRated = useCallback(
    () =>
      navigation.navigate(ROUTES.ALL_BUSINESSES, {
        type: isStore ? 'STORE' : 'SERVICE',
        categorySlug: params.slug,
        title: `Top rated in ${params.name}`,
        sort: 'rating',
      }),
    [navigation, isStore, params.slug, params.name],
  );

  const subcategories = category?.subcategories ?? [];
  const total = topPage?.pagination.total;
  const area = location?.address ?? location?.city ?? location?.label;
  const kind = isStore ? 'store types' : 'services';

  return {
    title: params.name,
    categorySlug: params.slug,
    bannerUrl: category?.bannerUrl,
    bannerFallbackUrl: category?.imageUrl,
    subtitle:
      total == null
        ? `${subcategories.length} ${kind}`
        : `${subcategories.length} ${kind} • ${total} ${total === 1 ? 'business' : 'businesses'} near you`,
    tagline: TAGLINES[params.slug] ?? `Find the best ${params.name.toLowerCase()}`,
    bannerLine: area
      ? `${subcategories.length ? 'Top picks' : 'Businesses'} near ${area}`
      : 'Trusted businesses near you',
    sectionTitle: isStore ? 'What are you shopping for?' : 'Choose a service',
    subcategories,
    isLoading,
    isStore,
    topRated: topPage?.items ?? [],
    hasMoreTopRated: (total ?? 0) > TOP_RATED,
    locationFilter,
    emptyText: isStore ? 'No store types here yet.' : 'No service types here yet.',
    onSubcategoryPress,
    onProviderPress,
    goToSearch,
    goToTopRated,
  };
}
