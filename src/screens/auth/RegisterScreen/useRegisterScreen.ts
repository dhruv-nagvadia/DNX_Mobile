import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRegisterMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentUser } from '@/redux/slices/userSlice';
import { setTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';

import { RegisterErrors, RegisterForm, RegisterScreenNavigationProp } from './types';
import { validateRegister } from './validation';

const FILE = 'useRegisterScreen';

const EMPTY: RegisterForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

/** All state and handlers for RegisterScreen. Registers a customer (role USER). */
export function useRegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<RegisterForm>(EMPTY);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  // True when the email is already taken, so the UI can offer sign-in instead.
  const [accountExists, setAccountExists] = useState(false);

  const onChange = useCallback((key: keyof RegisterForm, value: string) => {
    // Phone is digits-only and capped at 10, so it can't drift out of shape.
    const next = key === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [key]: next }));
    // Clear a field's error the moment the user starts correcting it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  /** Validates just the field being left, so errors surface before submit. */
  const onBlur = useCallback(
    (key: keyof RegisterForm) => {
      const fieldErrors = validateRegister(form);
      setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
    },
    [form],
  );

  const onSubmit = useCallback(async () => {
    setServerError(null);
    setAccountExists(false);
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      // No role sent → backend defaults to USER (customer).
      const result = await registerUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      }).unwrap();

      await AsyncStorage.multiSet([
        [StorageKeys.accessToken, result.accessToken],
        [StorageKeys.refreshToken, result.refreshToken],
      ]);
      setTokenCache(result.accessToken);

      dispatch(
        setCurrentUser({
          id: result.id,
          email: result.email,
          fullName: result.fullName,
          role: result.role,
        }),
      );
    } catch (err) {
      const status = (err as { status?: number })?.status;
      DEBUG_LOGGER('Register failed', 'onSubmit', FILE, '58', ERROR);

      if (status === 409) {
        // One person can be both a customer and a provider, so an existing
        // email means "sign in", never "register again with another address".
        setAccountExists(true);
        setServerError(
          'You already have a DNX account with this email. The same account works here and on DNX for Business.',
        );
        return;
      }
      setServerError('Something went wrong while creating your account. Please try again.');
    }
  }, [form, registerUser, dispatch]);

  const goToLogin = useCallback(() => {
    navigation.navigate(ROUTES.LOGIN);
  }, [navigation]);

  return {
    form,
    errors,
    serverError,
    accountExists,
    isLoading,
    onChange,
    onBlur,
    onSubmit,
    goToLogin,
  };
}
