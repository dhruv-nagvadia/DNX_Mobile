export interface ProfileForm {
  fullName: string;
  email: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
