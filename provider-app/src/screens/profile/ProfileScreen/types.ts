export interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
