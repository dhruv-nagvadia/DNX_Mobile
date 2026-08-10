import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';
import { useAppSelector } from '@/redux/hooks';
import { getRecentlyViewed, RecentProvider } from '@/utils/recentlyViewed';
import { ROUTES } from '@/navigation/routes';
import { Category } from '@/redux/api/category/types';
import { Provider } from '@/redux/api/provider/types';
import { HomeScreenNavigationProp } from './types';
import { LOCATION, OFFERS, TRUST_STATS, POPULAR_CATEGORY_ORDER } from './mock';

const RANK = new Map(POPULAR_CATEGORY_ORDER.map((slug, i) => [slug, i]));

/** All state, data-fetching, and handlers for the customer HomeScreen. */
export function useHomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  // "Most booked" businesses — top-ranked providers (a booking-count sort later).
  const { data: providersPage } = useGetProvidersQuery({ limit: 3 });

  // Recently opened businesses (cached on-device); refresh each time Home focuses.
  const [recentlyViewed, setRecentlyViewed] = useState<RecentProvider[]>([]);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getRecentlyViewed().then((list) => {
        if (active) setRecentlyViewed(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const firstName = (currentUser?.fullName ?? 'there').split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Order categories by popularity (most booked first).
  const orderedCategories = useMemo(
    () => [...categories].sort((a, b) => (RANK.get(a.slug) ?? 99) - (RANK.get(b.slug) ?? 99)),
    [categories],
  );

  const onCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate(ROUTES.CATEGORY, { slug: category.slug, name: category.name });
    },
    [navigation],
  );

  const onProviderPress = useCallback(
    (provider: Provider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, {
        providerId: provider.id,
        name: provider.businessName,
      });
    },
    [navigation],
  );

  const onRecentPress = useCallback(
    (item: RecentProvider) => {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId: item.id, name: item.name });
    },
    [navigation],
  );

  const goToProfile = useCallback(() => navigation.navigate(ROUTES.PROFILE), [navigation]);
  const goToSearch = useCallback(() => navigation.navigate(ROUTES.SEARCH), [navigation]);

  return {
    firstName,
    greeting,
    categories: orderedCategories,
    categoriesLoading,
    mostBooked: providersPage?.items ?? [],
    recentlyViewed,
    onCategoryPress,
    onProviderPress,
    onRecentPress,
    goToProfile,
    goToSearch,
    // Static placeholder content (swap for real data later).
    location: LOCATION,
    offers: OFFERS,
    trustStats: TRUST_STATS,
  };
}
