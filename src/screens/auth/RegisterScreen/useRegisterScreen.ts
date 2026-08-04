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

  const onChange = useCallback((key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onSubmit = useCallback(async () => {
    setServerError(null);
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
      setServerError(
        status === 409
          ? 'An account with this email already exists.'
          : 'Something went wrong. Please try again.',
      );
    }
  }, [form, registerUser, dispatch]);

  const goToLogin = useCallback(() => {
    navigation.navigate(ROUTES.LOGIN);
  }, [navigation]);

  return { form, errors, serverError, isLoading, onChange, onSubmit, goToLogin };
}
