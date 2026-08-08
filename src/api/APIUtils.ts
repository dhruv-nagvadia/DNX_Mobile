import { Platform } from 'react-native';

/**
 * Base URL for the backend API (development).
 *
 * Host cheatsheet:
 *   • iOS simulator          → localhost
 *   • Android emulator       → 10.0.2.2 (host alias) OR the LAN IP below
 *   • Physical device (iOS/Android) → your Mac's LAN IP, on the same Wi-Fi
 *
 * LAN_IP is currently this machine's IP. If your Wi-Fi/network changes,
 * update it (find it with `ipconfig getifaddr en0`).
 * For production, swap this for your deployed API URL.
 */
const LAN_IP = '192.168.1.2';

// Android runs on a physical device here, so use the LAN IP (also works on the
// emulator). iOS uses localhost for the simulator.
const DEV_HOST = Platform.OS === 'android' ? LAN_IP : 'localhost';

const BASE_URL = `http://${DEV_HOST}:4000/api/v1`;

export default BASE_URL;

export const endpoints = {
  // Auth — customer accounts (USER); refresh/me are shared/token-based
  register: '/customer/auth/register',
  login: '/customer/auth/login',
  refresh: '/auth/refresh',
  me: '/auth/me',

  // Categories (shared)
  categories: '/categories',

  // Customer discovery
  providers: '/customer/providers',
  providerById: (id: string) => `/customer/providers/${id}`,
  providerBookedSlots: (id: string) => `/customer/providers/${id}/booked-slots`,

  // Bookings
  bookings: '/customer/bookings',
  myBookings: '/customer/bookings/mine',
};
