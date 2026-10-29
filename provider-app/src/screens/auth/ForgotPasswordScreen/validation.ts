import { ForgotPasswordErrors, ForgotPasswordForm, ForgotPasswordStep } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a map of field errors; empty object means the form is valid. */
export function validateForgotPassword(
  form: ForgotPasswordForm,
  step: ForgotPasswordStep,
): ForgotPasswordErrors {
  const errors: ForgotPasswordErrors = {};

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email)) errors.email = 'Enter a valid email';

  if (step === 'reset') {
    if (!form.otp.trim()) errors.otp = 'Enter the code sent to your email';
    if (!form.newPassword) errors.newPassword = 'New password is required';
    else if (form.newPassword.length < 8) errors.newPassword = 'Minimum 8 characters';
  }

  return errors;
}
