import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary } from 'react-native-image-picker';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCurrentUser, setCurrentUser } from '@/redux/slices/userSlice';
import { resetAllApiCaches } from '@/redux/resetApiCaches';
import { clearTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateMeMutation,
  useUploadImageMutation,
} from '@/redux/api/auth/authApi';
import {
  useGetAllProductReviewsQuery,
  useGetAllReviewsQuery,
  useGetMyBusinessesQuery,
} from '@/redux/api/business/businessApi';
import { useGetUnreadCountQuery } from '@/redux/api/notification/notificationApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { PasswordForm, ProfileForm } from './types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileScreen'>;

/** Ports `frontend/src/pages/provider/ProfilePage/useProfilePage.ts` — editable
 * name/email, client-side stats derived from `getMyBusinesses()`, and the same
 * logout shape as `AppShell`'s (token clear → clearCurrentUser → cache reset). */
export function useProfileScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const { data: businesses = [] } = useGetMyBusinessesQuery();
  const { data: unreadCount = 0 } = useGetUnreadCountQuery();
  const { data: allReviews = [] } = useGetAllReviewsQuery();
  const { data: allProductReviews = [] } = useGetAllProductReviewsQuery();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [uploadImage] = useUploadImageMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: deletingAccount }] = useDeleteAccountMutation();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    fullName: currentUser?.fullName ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
  });
  const [error, setError] = useState<string | null>(null);

  const [changingPasswordModal, setChangingPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const services = businesses.reduce((sum, b) => sum + b.services.length, 0);
    const products = businesses.reduce((sum, b) => sum + (b.products?.length ?? 0), 0);
    // Weighted by review count, so a business with 1 review doesn't skew it.
    const ratingCount = businesses.reduce((sum, b) => sum + (b.ratingCount ?? 0), 0);
    const avgRating = ratingCount
      ? businesses.reduce((sum, b) => sum + (b.ratingAvg ?? 0) * (b.ratingCount ?? 0), 0) /
        ratingCount
      : null;
    return { businessCount: businesses.length, services, products, avgRating };
  }, [businesses]);

  /** Unreplied business + product reviews across every business. */
  const reviewsNeedingReply = useMemo(
    () =>
      allReviews.filter((r) => !r.providerReply).length +
      allProductReviews.filter((r) => !r.providerReply).length,
    [allReviews, allProductReviews],
  );

  /** "Since Aug 2026" from the account's createdAt (null when unknown). */
  const memberSince = useMemo(() => {
    if (!currentUser?.createdAt) {
      return null;
    }
    const d = new Date(currentUser.createdAt);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [currentUser?.createdAt]);

  const startEdit = useCallback(() => {
    setForm({
      fullName: currentUser?.fullName ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
    });
    setError(null);
    setEditing(true);
  }, [currentUser]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setError(null);
  }, []);

  const onChange = useCallback((key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    setError(null);
    if (!form.fullName.trim()) {
      setError('Enter your name');
      return;
    }
    const phone = form.phone.trim();
    try {
      const updated = await updateMe({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        ...(phone ? { phone } : {}),
      }).unwrap();
      dispatch(setCurrentUser(updated));
      setEditing(false);
    } catch {
      setError('Could not save. That email may already be in use.');
    }
  }, [form, updateMe, dispatch]);

  const changeAvatar = useCallback(async () => {
    setAvatarError(null);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    const asset = result.assets?.[0];
    if (result.didCancel || !asset?.uri) {
      return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        type: asset.type ?? 'image/jpeg',
      } as unknown as Blob);
      const { url } = await uploadImage(formData).unwrap();
      const updated = await updateMe({ avatarUrl: url }).unwrap();
      dispatch(setCurrentUser(updated));
    } catch {
      setAvatarError('Could not update your photo. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  }, [uploadImage, updateMe, dispatch]);

  const openPasswordModal = useCallback(() => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError(null);
    setChangingPasswordModal(true);
  }, []);
  const closePasswordModal = useCallback(() => setChangingPasswordModal(false), []);
  const onPasswordChange = useCallback((key: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submitPasswordChange = useCallback(async () => {
    setPasswordError(null);
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setChangingPasswordModal(false);
    } catch {
      setPasswordError('Could not change password. Check your current password.');
    }
  }, [passwordForm, changePassword]);

  const clearSession = useCallback(async () => {
    clearTokenCache();
    await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
    resetAllApiCaches(dispatch);
    dispatch(clearCurrentUser());
  }, [dispatch]);

  const logout = useCallback(() => {
    Alert.alert('Log out?', 'You will need to sign in again to manage your businesses.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          clearSession();
        },
      },
    ]);
  }, [clearSession]);

  const openDeleteModal = useCallback(() => {
    setDeletePassword('');
    setDeleteError(null);
    setDeleteModal(true);
  }, []);
  const closeDeleteModal = useCallback(() => setDeleteModal(false), []);
  const onDeletePasswordChange = useCallback((value: string) => {
    setDeletePassword(value);
    setDeleteError(null);
  }, []);

  const submitDeleteAccount = useCallback(async () => {
    setDeleteError(null);
    if (!deletePassword) {
      setDeleteError('Enter your password');
      return;
    }
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      setDeleteModal(false);
      await clearSession();
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 400 || status === 401 || status === 403) {
        setDeleteError('Incorrect password');
      } else {
        const msg = (err as { data?: { message?: string } })?.data?.message;
        setDeleteError(msg || 'Could not delete your account. Please try again.');
      }
    }
  }, [deletePassword, deleteAccount, clearSession]);

  return {
    currentUser,
    businesses,
    stats,
    memberSince,
    unreadCount,
    reviewsNeedingReply,
    editing,
    form,
    onChange,
    error,
    saving,
    startEdit,
    cancelEdit,
    save,
    changeAvatar,
    uploadingAvatar,
    avatarError,
    changingPasswordModal,
    passwordForm,
    passwordError,
    changingPassword,
    openPasswordModal,
    closePasswordModal,
    onPasswordChange,
    submitPasswordChange,
    logout,
    deleteModal,
    deletePassword,
    deleteError,
    deletingAccount,
    openDeleteModal,
    closeDeleteModal,
    onDeletePasswordChange,
    submitDeleteAccount,
    goToBusiness: (businessId: string) =>
      navigation.navigate(ROUTES.BUSINESS_DETAIL, { businessId }),
    goToBusinesses: () => navigation.navigate(ROUTES.BUSINESSES),
    goToEarnings: () => navigation.navigate(ROUTES.EARNINGS),
    goToOffers: () => navigation.navigate(ROUTES.ALL_OFFERS),
    goToReviews: () => navigation.navigate(ROUTES.REVIEWS),
    goToNotifications: () => navigation.navigate(ROUTES.NOTIFICATIONS),
    goToSupport: () => navigation.navigate(ROUTES.SUPPORT),
  };
}
