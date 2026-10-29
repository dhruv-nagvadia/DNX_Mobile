import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useRequestPasswordResetMutation, useResetPasswordMutation } from '@/redux/api/auth/authApi';
import { ROUTES } from '@/navigation/routes';

import {
  EmailErrors,
  EmailForm,
  ForgotPasswordNavigationProp,
  ForgotPasswordStep,
  ResetErrors,
  ResetForm,
} from './types';
import { validateEmail, validateReset } from './validation';

const serverMessage = (err: unknown, fallback: string) =>
  (err as { data?: { message?: string } })?.data?.message ?? fallback;

/** All state, effects, and handlers for the two-step forgot-password flow. */
export function useForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [requestReset, { isLoading: sending }] = useRequestPasswordResetMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [emailForm, setEmailForm] = useState<EmailForm>({ email: '' });
  const [emailErrors, setEmailErrors] = useState<EmailErrors>({});
  const [resetForm, setResetForm] = useState<ResetForm>({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetErrors, setResetErrors] = useState<ResetErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const onEmailChange = useCallback((value: string) => {
    setEmailForm({ email: value });
    setEmailErrors((prev) => (prev.email ? {} : prev));
  }, []);

  const onResetChange = useCallback((key: keyof ResetForm, value: string) => {
    setResetForm((prev) => ({ ...prev, [key]: value }));
    setResetErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  const sendCode = useCallback(async () => {
    setServerError(null);
    const validationErrors = validateEmail(emailForm);
    setEmailErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await requestReset({ email: emailForm.email.trim() }).unwrap();
      setNotice('If that email is registered, a 6-digit code is on its way — it can take a minute.');
      setStep('reset');
    } catch (err) {
      setServerError(serverMessage(err, 'Could not send the code. Please try again.'));
    }
  }, [emailForm, requestReset]);

  const submitReset = useCallback(async () => {
    setServerError(null);
    const validationErrors = validateReset(resetForm);
    setResetErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await resetPassword({
        email: emailForm.email.trim(),
        otp: resetForm.otp.trim(),
        newPassword: resetForm.newPassword,
      }).unwrap();
      navigation.navigate(ROUTES.LOGIN);
    } catch (err) {
      setServerError(serverMessage(err, 'Could not reset your password. Please try again.'));
    }
  }, [emailForm, resetForm, resetPassword, navigation]);

  const backToEmail = useCallback(() => {
    setServerError(null);
    setNotice(null);
    setStep('email');
  }, []);

  const goToLogin = useCallback(() => navigation.navigate(ROUTES.LOGIN), [navigation]);

  return {
    step,
    emailForm,
    emailErrors,
    resetForm,
    resetErrors,
    serverError,
    notice,
    isLoading: step === 'email' ? sending : resetting,
    onEmailChange,
    onResetChange,
    sendCode,
    submitReset,
    backToEmail,
    goToLogin,
  };
}
