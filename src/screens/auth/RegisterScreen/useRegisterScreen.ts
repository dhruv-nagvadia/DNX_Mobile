import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRegisterMutation } from '@/redux/api/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentUser } from '@/redux/slices/userSlice';
import { setTokenCache } from '@/api/apiConfigs';
import { StorageKeys } from '@/utils/Constants';
import { ROUTES } from '@/navigation/routes';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';
import { lookupByPincode } from '@/utils/locationApi';

import { RegisterErrors, RegisterForm, RegisterScreenNavigationProp } from './types';
import { validateRegister } from './validation';

const FILE = 'useRegisterScreen';
const PIN_RE = /^\d{6}$/;

const EMPTY: RegisterForm = {
  fullName: '',
  email: '',
  phone: '',
  pincode: '',
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

  // City/state resolved from the typed PIN code (India Post lookup), sent
  // alongside it at submit so Home-screen content has a fallback location
  // before the customer grants GPS permission or sets one manually.
  const [pincodeLocation, setPincodeLocation] = useState<{ city?: string; state?: string }>({});
  const [resolvingPincode, setResolvingPincode] = useState(false);

  const onChange = useCallback((key: keyof RegisterForm, value: string) => {
    // Phone and PIN are digits-only and capped in length, so they can't drift out of shape.
    let next = value;
    if (key === 'phone') next = value.replace(/\D/g, '').slice(0, 10);
    else if (key === 'pincode') next = value.replace(/\D/g, '').slice(0, 6);
    setForm((prev) => ({ ...prev, [key]: next }));
    // Clear a field's error the moment the user starts correcting it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  // Debounced PIN → city/state resolution, mirroring LocationPickerScreen's pattern.
  useEffect(() => {
    const pincode = form.pincode.trim();
    if (!PIN_RE.test(pincode)) {
      setPincodeLocation({});
      setResolvingPincode(false);
      return;
    }
    let cancelled = false;
    setResolvingPincode(true);
    const timer = setTimeout(async () => {
      const matches = await lookupByPincode(pincode);
      if (!cancelled) {
        const best = matches[0];
        setPincodeLocation(best ? { city: best.district, state: best.state } : {});
        setResolvingPincode(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.pincode]);

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
        postalCode: form.pincode.trim(),
        city: pincodeLocation.city,
        state: pincodeLocation.state,
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
          postalCode: result.postalCode,
          city: result.city,
          state: result.state,
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
  }, [form, pincodeLocation, registerUser, dispatch]);

  const goToLogin = useCallback(() => {
    navigation.navigate(ROUTES.LOGIN);
  }, [navigation]);

  return {
    form,
    errors,
    serverError,
    accountExists,
    isLoading,
    pincodeLocation,
    resolvingPincode,
    onChange,
    onBlur,
    onSubmit,
    goToLogin,
  };
}
