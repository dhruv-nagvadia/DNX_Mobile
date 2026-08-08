import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCurrentUser } from '@/redux/slices/userSlice';
import { clearTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import { ProfileScreenNavigationProp } from './types';

export function useProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.currentUser);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
    clearTokenCache();
    dispatch(clearCurrentUser());
  }, [dispatch]);

  const goToBookings = useCallback(() => navigation.navigate(ROUTES.BOOKINGS), [navigation]);
  const goToReminders = useCallback(() => navigation.navigate(ROUTES.REMINDERS), [navigation]);

  return {
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    logout,
    goToBookings,
    goToReminders,
  };
}
