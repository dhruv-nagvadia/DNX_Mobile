import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLoginMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentUser } from '@/redux/slices/userSlice';
import { setTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';

import { LoginErrors, LoginForm } from './types';
import { validateLogin } from './validation';

const FILE = 'useLoginScreen';

/** All state, effects, and handlers for LoginScreen live here. */
export function useLoginScreen() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});

  const onChange = useCallback((key: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onSubmit = useCallback(async () => {
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await login(form).unwrap();

      // Persist tokens + prime the in-memory cache used by the interceptor.
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
      DEBUG_LOGGER('Login failed', 'onSubmit', FILE, '46', ERROR);
      Alert.alert('Login failed', 'Please check your credentials and try again.');
    }
  }, [form, login, dispatch]);

  return { form, errors, isLoading, onChange, onSubmit };
}
