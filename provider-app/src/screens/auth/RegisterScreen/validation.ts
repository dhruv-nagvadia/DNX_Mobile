import { RegisterErrors, RegisterForm } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a map of field errors; empty object means the form is valid. */
export function validateRegister(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!form.fullName.trim()) errors.fullName = 'Business owner name is required';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email)) errors.email = 'Enter a valid email';

  if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 8) errors.password = 'Minimum 8 characters';

  return errors;
}
