import { EmailErrors, EmailForm, ResetErrors, ResetForm } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(form: EmailForm): EmailErrors {
  const errors: EmailErrors = {};
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email)) errors.email = 'Enter a valid email';
  return errors;
}

export function validateReset(form: ResetForm): ResetErrors {
  const errors: ResetErrors = {};
  if (!/^\d{6}$/.test(form.otp)) errors.otp = 'Enter the 6-digit code';

  if (!form.newPassword) errors.newPassword = 'Password is required';
  else if (form.newPassword.length < 8) errors.newPassword = 'Minimum 8 characters';

  if (form.confirmPassword !== form.newPassword) errors.confirmPassword = 'Passwords don’t match';

  return errors;
}
