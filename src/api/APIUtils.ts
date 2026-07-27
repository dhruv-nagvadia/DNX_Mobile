import Config from 'react-native-config';

/**
 * Single source of truth for the base URL and every endpoint path.
 * BASE_URL comes from .env via react-native-config — never hardcode it.
 */
const BASE_URL = Config.BASE_URL || 'http://localhost:4000/api/v1';

export default BASE_URL;

export const endpoints = {
  // Auth
  register: '/auth/register',
  login: '/auth/login',
  refresh: '/auth/refresh',
  me: '/auth/me',

  // Categories
  categories: '/categories',

  // Providers
  providers: '/providers',
  providerById: (id: string) => `/providers/${id}`,

  // Bookings
  myBookings: '/bookings/mine',
};
