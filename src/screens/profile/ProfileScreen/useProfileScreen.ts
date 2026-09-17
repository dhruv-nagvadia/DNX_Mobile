import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { useGetRemindersQuery } from '@/redux/api/reminder/reminderApi';
import { useChangePasswordMutation, useUpdateMeMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCurrentUser, setCurrentUser } from '@/redux/slices/userSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { clearTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import { lookupByPincode } from '@/utils/locationApi';

import { ProfileScreenNavigationProp } from './types';

const PIN_RE = /^\d{6}$/;

export function useProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.currentUser);

  const { data: bookings = [] } = useGetMyBookingsQuery();
  const { data: reminders = [] } = useGetRemindersQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

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
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', pincode: '' });
  const [error, setError] = useState<string | null>(null);

  // City/state resolved from the typed PIN code (India Post lookup), sent
  // alongside it on save — same pattern as RegisterScreen.
  const [pincodeLocation, setPincodeLocation] = useState<{ city?: string; state?: string }>({});
  const [resolvingPincode, setResolvingPincode] = useState(false);

  const openEdit = useCallback(() => {
    setForm({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      pincode: user?.postalCode ?? '',
    });
    setPincodeLocation({ city: user?.city ?? undefined, state: user?.state ?? undefined });
    setError(null);
    setEditOpen(true);
  }, [user]);
  const closeEdit = useCallback(() => setEditOpen(false), []);
  const onField = useCallback(
    (key: 'fullName' | 'email' | 'phone' | 'pincode', value: string) => {
      let next = value;
      if (key === 'phone') next = value.replace(/\D/g, '').slice(0, 10);
      else if (key === 'pincode') next = value.replace(/\D/g, '').slice(0, 6);
      setForm((p) => ({ ...p, [key]: next }));
    },
    [],
  );

  // Debounced PIN → city/state resolution, mirroring RegisterScreen's pattern.
  useEffect(() => {
    if (!editOpen) return;
    const pincode = form.pincode.trim();
    if (!PIN_RE.test(pincode)) {
      setResolvingPincode(false);
      return;
    }
    let cancelled = false;
    setResolvingPincode(true);
    const timer = setTimeout(async () => {
      const matches = await lookupByPincode(pincode);
      if (!cancelled) {
        const best = matches[0];
        if (best) setPincodeLocation({ city: best.district, state: best.state });
        setResolvingPincode(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.pincode, editOpen]);

  const saveEdit = useCallback(async () => {
    setError(null);
    try {
      const updated = await updateMe({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        postalCode: form.pincode.trim() || undefined,
        city: pincodeLocation.city,
        state: pincodeLocation.state,
      }).unwrap();
      dispatch(setCurrentUser(updated));
      setEditOpen(false);
    } catch {
      setError('Could not save. That email may already be in use.');
    }
  }, [form, pincodeLocation, updateMe, dispatch]);

  // Change-password modal.
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState<string | null>(null);

  const openPasswordChange = useCallback(() => {
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwError(null);
    setPwOpen(true);
  }, []);
  const closePasswordChange = useCallback(() => setPwOpen(false), []);
  const onPwField = useCallback(
    (key: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) =>
      setPwForm((p) => ({ ...p, [key]: value })),
    [],
  );

  const savePasswordChange = useCallback(async () => {
    setPwError(null);
    if (!pwForm.currentPassword) {
      setPwError('Enter your current password');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }).unwrap();
      setPwOpen(false);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setPwError(message ?? 'Could not update password. Please try again.');
    }
  }, [pwForm, changePassword]);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
    clearTokenCache();
    dispatch(clearCart()); // drop the local copy; it's saved on the server per user
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
    pincodeLocation,
    resolvingPincode,
    openEdit,
    closeEdit,
    onField,
    saveEdit,
    pwOpen,
    pwForm,
    pwError,
    changingPassword,
    openPasswordChange,
    closePasswordChange,
    onPwField,
    savePasswordChange,
    logout,
    goToBookings: useCallback(() => navigation.navigate(ROUTES.BOOKINGS), [navigation]),
    goToReminders: useCallback(() => navigation.navigate(ROUTES.REMINDERS), [navigation]),
    goToDebugLogs: useCallback(() => navigation.navigate(ROUTES.DEBUG_LOGS), [navigation]),
  };
}
