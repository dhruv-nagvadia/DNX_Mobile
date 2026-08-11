import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { useGetRemindersQuery } from '@/redux/api/reminder/reminderApi';
import { useUpdateMeMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCurrentUser, setCurrentUser } from '@/redux/slices/userSlice';
import { clearTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';

import { ProfileScreenNavigationProp } from './types';

export function useProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.currentUser);

  const { data: bookings = [] } = useGetMyBookingsQuery();
  const { data: reminders = [] } = useGetRemindersQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();

  const stats = useMemo(
    () => ({
      bookings: bookings.length,
      reviews: bookings.filter((b) => b.review).length,
      reminders: reminders.filter((r) => !r.completedAt).length,
    }),
    [bookings, reminders],
  );

  // Edit-profile modal.
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  const openEdit = useCallback(() => {
    setForm({ fullName: user?.fullName ?? '', email: user?.email ?? '' });
    setError(null);
    setEditOpen(true);
  }, [user]);
  const closeEdit = useCallback(() => setEditOpen(false), []);
  const onField = useCallback(
    (key: 'fullName' | 'email', value: string) => setForm((p) => ({ ...p, [key]: value })),
    [],
  );

  const saveEdit = useCallback(async () => {
    setError(null);
    try {
      const updated = await updateMe({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      }).unwrap();
      dispatch(setCurrentUser(updated));
      setEditOpen(false);
    } catch {
      setError('Could not save. That email may already be in use.');
    }
  }, [form, updateMe, dispatch]);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
    clearTokenCache();
    dispatch(clearCurrentUser());
  }, [dispatch]);

  return {
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    stats,
    editOpen,
    form,
    error,
    saving,
    openEdit,
    closeEdit,
    onField,
    saveEdit,
    logout,
    goToBookings: useCallback(() => navigation.navigate(ROUTES.BOOKINGS), [navigation]),
    goToReminders: useCallback(() => navigation.navigate(ROUTES.REMINDERS), [navigation]),
  };
}
