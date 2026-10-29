import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRegisterMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentUser } from '@/redux/slices/userSlice';
import { resetAllApiCaches } from '@/redux/resetApiCaches';
import { setTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';

import { RegisterErrors, RegisterForm, RegisterScreenNavigationProp } from './types';
import { validateRegister } from './validation';

const FILE = 'useRegisterScreen';

/** All state, effects, and handlers for RegisterScreen. */
export function useRegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const onChange = useCallback((key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const onBlur = useCallback(
    (key: keyof RegisterForm) => {
      const fieldErrors = validateRegister(form);
      setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
    },
    [form],
  );

  const onSubmit = useCallback(async () => {
    setServerError(null);
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      }).unwrap();

      await AsyncStorage.multiSet([
        [StorageKeys.accessToken, result.accessToken],
        [StorageKeys.refreshToken, result.refreshToken],
      ]);
      setTokenCache(result.accessToken);
      resetAllApiCaches(dispatch);

      dispatch(
        setCurrentUser({
          id: result.id,
          email: result.email,
          fullName: result.fullName,
          role: result.role,
          phone: result.phone,
        }),
      );
    } catch (err) {
      DEBUG_LOGGER('Registration failed', 'onSubmit', FILE, '58', ERROR);
      const data = (err as { data?: { message?: string } })?.data;
      setServerError(data?.message || 'Could not create your account. Please try again.');
    }
  }, [form, register, dispatch]);

  const goToLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    form,
    errors,
    serverError,
    isLoading,
    onChange,
    onBlur,
    onSubmit,
    goToLogin,
  };
}
