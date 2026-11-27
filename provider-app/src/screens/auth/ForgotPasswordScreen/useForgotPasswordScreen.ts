import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} from '@/redux/api/auth/authApi';
import DEBUG_LOGGER, { ERROR } from '@/utils/DebugLogger';

import {
  ForgotPasswordErrors,
  ForgotPasswordForm,
  ForgotPasswordScreenNavigationProp,
  ForgotPasswordStep,
} from './types';
import { validateForgotPassword } from './validation';
import { apiErrorMessage } from '@/utils/apiError';

const FILE = 'useForgotPasswordScreen';

/** All state, effects, and handlers for ForgotPasswordScreen. */
export function useForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [requestReset, { isLoading: sending }] = useRequestPasswordResetMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const [step, setStep] = useState<ForgotPasswordStep>('request');
  const [form, setForm] = useState<ForgotPasswordForm>({ email: '', otp: '', newPassword: '' });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onChange = useCallback((key: keyof ForgotPasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const onSubmit = useCallback(async () => {
    setServerError(null);
    setSuccessMessage(null);
    const validationErrors = validateForgotPassword(form, step);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      if (step === 'request') {
        await requestReset({ email: form.email.trim() }).unwrap();
        setSuccessMessage('We sent a reset code to your email.');
        setStep('reset');
      } else {
        await resetPassword({
          email: form.email.trim(),
          otp: form.otp.trim(),
          newPassword: form.newPassword,
        }).unwrap();
        navigation.goBack();
      }
    } catch (err) {
      DEBUG_LOGGER('Password reset step failed', 'onSubmit', FILE, '48', ERROR);
      setServerError(apiErrorMessage(err, 'Something went wrong. Please try again.'));
    }
  }, [form, step, requestReset, resetPassword, navigation]);

  const goToLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    step,
    form,
    errors,
    serverError,
    successMessage,
    isLoading: sending || resetting,
    onChange,
    onSubmit,
    goToLogin,
  };
}
