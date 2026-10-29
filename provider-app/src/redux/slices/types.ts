import { AuthUser } from '../api/auth/types';

export interface UserState {
  isLoggedIn: boolean;
  currentUser: AuthUser | null;
}
