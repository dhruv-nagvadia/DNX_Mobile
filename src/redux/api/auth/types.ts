import { ApiEnvelope, Role } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  // Captured once at signup (typed PIN, or GPS at the time) — a fallback
  // location for Home-screen content before GPS/manual location is set.
  postalCode?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface UpdateMeRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
  city?: string;
  state?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  role?: Exclude<Role, 'ADMIN'>;
}

export interface AuthData extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

// The backend wraps the payload under `data`; RTK Query queries below use
// these envelope types and unwrap `.data` in transformResponse.
export type LoginResponse = ApiEnvelope<AuthData>;
export type MeResponse = ApiEnvelope<AuthUser>;
