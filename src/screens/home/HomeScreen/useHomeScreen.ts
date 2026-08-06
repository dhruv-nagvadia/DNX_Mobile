import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGetCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCurrentUser } from '@/redux/slices/userSlice';
import { clearTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import { Category } from '@/redux/api/category/types';
import { HomeScreenNavigationProp } from './types';
import { LOCATION, OFFERS, MOST_BOOKED, REMINDERS, RECENTLY_VIEWED, TRUST_STATS } from './mock';

/** All state, data-fetching, and handlers for the customer HomeScreen. */
export function useHomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  // Empty until the booking feature ships — the section stays hidden while empty.
  const { data: bookings = [] } = useGetMyBookingsQuery();

  const firstName = (currentUser?.fullName ?? 'there').split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const onCategoryPress = useCallback(
    (category: Category) => {
      navigation.navigate(ROUTES.CATEGORY, { slug: category.slug, name: category.name });
    },
    [navigation],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
    clearTokenCache();
    dispatch(clearCurrentUser());
  }, [dispatch]);

  return {
    firstName,
    greeting,
    categories,
    categoriesLoading,
    bookings,
    onCategoryPress,
    logout,
    // Static placeholder content (swap for real data later).
    location: LOCATION,
    offers: OFFERS,
    mostBooked: MOST_BOOKED,
    reminders: REMINDERS,
    recentlyViewed: RECENTLY_VIEWED,
    trustStats: TRUST_STATS,
  };
}
