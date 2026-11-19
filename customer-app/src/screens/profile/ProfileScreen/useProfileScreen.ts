import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { useGetMyOrdersQuery } from '@/redux/api/order/orderApi';
import { useGetRemindersQuery } from '@/redux/api/reminder/reminderApi';
import { useGetAddressesQuery } from '@/redux/api/address/addressApi';
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetMeQuery,
  useUpdateMeMutation,
} from '@/redux/api/auth/authApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCurrentUser, setCurrentUser } from '@/redux/slices/userSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { resetAllApiCaches } from '@/redux/resetApiCaches';
import { clearTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import { lookupByPincode } from '@/utils/locationApi';

import { ProfileScreenNavigationProp } from './types';

const PIN_RE = /^\d{6}$/;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "9173662183" → "+91 91736 62183"; anything else is shown as stored. */
export function formatPhone(phone?: string | null): string {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (digits.length === 10) {return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;}
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone ?? '';
}

/** ISO date → "Aug 2026"; null when missing/invalid. */
function formatMonthYear(iso?: string | null): string | null {
  if (!iso) {return null;}
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {return null;}
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

export function useProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.currentUser);

  const { data: bookings = [] } = useGetMyBookingsQuery();
  // SERVICES-ONLY: orders not fetched for launch — restore by removing the `{ skip: true }` arg
  const { data: orders = [] } = useGetMyOrdersQuery(undefined, { skip: true });
  const { data: reminders = [] } = useGetRemindersQuery();
  const { data: addresses = [] } = useGetAddressesQuery();
  // `/auth/me` also returns createdAt (not kept on the stored user) — used
  // only for the "Customer since …" line.
  const { data: me } = useGetMeQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();

  const stats = useMemo(
    () => ({
      bookings: bookings.length,
      orders: orders.length,
      reminders: reminders.filter((r) => r.status === 'PENDING').length,
    }),
    [bookings, orders, reminders],
  );

  // Pending reminders whose occurrence falls today — the amber "N due today" pill.
  const remindersDueToday = useMemo(() => {
    const today = new Date();
    return reminders.filter(
      (r) => r.status === 'PENDING' && isSameLocalDay(new Date(r.dueDate), today),
    ).length;
  }, [reminders]);

  const customerSince = useMemo(
    () => formatMonthYear((me as { createdAt?: string | null } | undefined)?.createdAt),
    [me],
  );

  // "Home, Work • 2 saved" — or a prompt when there are none.
  const addressesSummary = useMemo(() => {
    if (addresses.length === 0) {return 'Add a pickup/visit address';}
    const labels = Array.from(
      new Set(addresses.map((a) => a.label?.trim()).filter((l): l is string => !!l)),
    );
    const count = `${addresses.length} saved`;
    return labels.length ? `${labels.join(', ')} • ${count}` : count;
  }, [addresses]);

  const locationLine = useMemo(() => {
    const place = [user?.city, user?.state].filter(Boolean).join(', ');
    return [place, user?.postalCode].filter(Boolean).join(' • ');
  }, [user]);

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
      if (key === 'phone') {next = value.replace(/\D/g, '').slice(0, 10);}
      else if (key === 'pincode') {next = value.replace(/\D/g, '').slice(0, 6);}
      setForm((p) => ({ ...p, [key]: next }));
    },
    [],
  );

  // Debounced PIN → city/state resolution, mirroring RegisterScreen's pattern.
  useEffect(() => {
    if (!editOpen) {return;}
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
        if (best) {setPincodeLocation({ city: best.district, state: best.state });}
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

  const endSession = useCallback(async () => {
    await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
    clearTokenCache();
    dispatch(clearCart()); // drop the local copy; it's saved on the server per user
    dispatch(clearCurrentUser());
    // Otherwise the next account signed into on this device would see this
    // account's cached data (e.g. bookings, reminders) until the app restarts.
    resetAllApiCaches(dispatch);
  }, [dispatch]);

  const logout = useCallback(async () => {
    await endSession();
  }, [endSession]);

  // Delete-account modal — requires re-entering the password, same as
  // changing it, since this is irreversible.
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ password: '' });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDelete = useCallback(() => {
    setDeleteForm({ password: '' });
    setDeleteError(null);
    setDeleteOpen(true);
  }, []);
  const closeDelete = useCallback(() => setDeleteOpen(false), []);
  const onDeleteField = useCallback(
    (value: string) => setDeleteForm({ password: value }),
    [],
  );

  const confirmDelete = useCallback(async () => {
    setDeleteError(null);
    if (!deleteForm.password) {
      setDeleteError('Enter your password to confirm');
      return;
    }
    try {
      await deleteAccount({ password: deleteForm.password }).unwrap();
      setDeleteOpen(false);
      // Setting the user to null flips RootNavigator to the auth stack —
      // same cleanup as a normal logout.
      await endSession();
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setDeleteError(message ?? 'Could not delete your account. Please try again.');
    }
  }, [deleteForm, deleteAccount, endSession]);

  return {
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phoneDisplay: formatPhone(user?.phone),
    locationLine,
    customerSince,
    addressesSummary,
    remindersDueToday,
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
    deleteOpen,
    deleteForm,
    deleteError,
    deleting,
    openDelete,
    closeDelete,
    onDeleteField,
    confirmDelete,
    goToBookings: useCallback(
      () => navigation.navigate(ROUTES.BOOKINGS, { tab: 'bookings' }),
      [navigation],
    ),
    goToOrders: useCallback(() => navigation.navigate(ROUTES.BOOKINGS, { tab: 'orders' }), [navigation]),
    goToReminders: useCallback(() => navigation.navigate(ROUTES.REMINDERS), [navigation]),
    goToAddresses: useCallback(() => navigation.navigate(ROUTES.ADDRESSES), [navigation]),
    goToHelpSupport: useCallback(() => navigation.navigate(ROUTES.HELP_SUPPORT), [navigation]),
    goToAbout: useCallback(() => navigation.navigate(ROUTES.ABOUT), [navigation]),
    goToNotifications: useCallback(() => navigation.navigate(ROUTES.NOTIFICATIONS), [navigation]),
    goToTerms: useCallback(() => navigation.navigate(ROUTES.TERMS), [navigation]),
    goToPrivacy: useCallback(() => navigation.navigate(ROUTES.PRIVACY_POLICY), [navigation]),
    goToRefund: useCallback(() => navigation.navigate(ROUTES.REFUND_POLICY), [navigation]),
  };
}
