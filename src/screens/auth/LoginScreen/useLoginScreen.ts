import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLoginMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentUser } from '@/redux/slices/userSlice';
import { setTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';

import { LoginErrors, LoginForm, LoginScreenNavigationProp } from './types';
import { validateLogin } from './validation';

const FILE = 'useLoginScreen';

/** All state, effects, and handlers for LoginScreen. */
export function useLoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const onChange = useCallback((key: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error the moment the user starts correcting it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  /** Validates just the field being left, so errors surface before submit. */
  const onBlur = useCallback(
    (key: keyof LoginForm) => {
      const fieldErrors = validateLogin(form);
      setErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
    },
    [form],
  );

  const onSubmit = useCallback(async () => {
    setServerError(null);
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await login({ email: form.email.trim(), password: form.password }).unwrap();

      await AsyncStorage.multiSet([
        [StorageKeys.accessToken, result.accessToken],
        [StorageKeys.refreshToken, result.refreshToken],
      ]);
      setTokenCache(result.accessToken);

      // Setting the user flips RootNavigator to the main app automatically.
      dispatch(
        setCurrentUser({
          id: result.id,
          email: result.email,
          fullName: result.fullName,
          role: result.role,
        }),
      );
    } catch (err) {
      DEBUG_LOGGER('Login failed', 'onSubmit', FILE, '48', ERROR);
      setServerError('That email and password don’t match. Please try again.');
    }
  }, [form, login, dispatch]);

  const goToRegister = useCallback(() => {
    navigation.navigate(ROUTES.REGISTER);
  }, [navigation]);

  return { form, errors, serverError, isLoading, onChange, onBlur, onSubmit, goToRegister };
}
