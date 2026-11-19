import { NativeModules, Platform } from 'react-native';
import { API_BASE_URL } from '@env';

/**
 * Base URL for the backend API.
 *
 * Normally this comes straight from `API_BASE_URL` in whichever `.env.<APP_ENV>`
 * file is active — APP_ENV is set by the npm script you ran (android:dev/
 * staging/production, ios:*, start:*; see package.json and babel.config.js).
 * dev/staging/production each point at their own backend. Swapping to a real
 * domain later is a one-line edit in the matching `.env.*` file.
 *
 * If that's missing for some reason, fall back to the same local-dev
 * defaults this always used:
 *   • iOS simulator          → localhost
 *   • Android emulator/device → the LAN IP below (update via `ipconfig getifaddr en0`)
 */
const LAN_IP = '192.168.1.5';
const DEV_HOST = Platform.OS === 'android' ? LAN_IP : 'localhost';
const DEV_FALLBACK = `http://${DEV_HOST}:4000/api/v1`;

/**
 * In development, point at whatever machine Metro is serving the bundle from.
 * The Mac's LAN IP changes with the Wi-Fi network, and a stale IP in
 * .env.development makes every request time out after 20s; Metro's own
 * address is always the right one. Only private/local hosts are swapped.
 * Release builds are untouched.
 */
/**
 * Metro's address (e.g. "http://172.18.5.32:8081/"). The new architecture
 * (bridgeless) only exposes it via getConstants(), so use React Native's own
 * getDevServer() and fall back to the old bridge constant.
 */
function metroDevServerUrl(): string | undefined {
  try {
    const getDevServer = require('react-native/Libraries/Core/Devtools/getDevServer');
    const info = getDevServer();
    if (info?.bundleLoadedFromServer && info.url) {
      return info.url;
    }
  } catch {
    // Older RN without this module — fall through.
  }
  const sourceCode = NativeModules?.SourceCode;
  return sourceCode?.getConstants?.().scriptURL ?? sourceCode?.scriptURL;
}

function withMetroHost(url: string): string {
  if (!__DEV__) {
    return url;
  }
  const metroHost = metroDevServerUrl()?.match(/^https?:\/\/([^/:]+)/)?.[1];
  const target = url.match(/^(https?:\/\/)([^/:]+)(.*)$/);
  if (!metroHost || !target) {
    return url;
  }
  const isLocal = (h: string) =>
    /^(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(h);
  // Android emulator reaches the host Mac via 10.0.2.2 and Metro reports that, so it works too.
  return isLocal(target[2]) && isLocal(metroHost) ? `${target[1]}${metroHost}${target[3]}` : url;
}

const BASE_URL = withMetroHost(API_BASE_URL || DEV_FALLBACK);

export default BASE_URL;

export const endpoints = {
  // Auth — customer accounts (USER); refresh/me are shared/token-based
  register: '/customer/auth/register',
  login: '/customer/auth/login',
  forgotPassword: '/customer/auth/forgot-password',
  resetPassword: '/customer/auth/reset-password',
  refresh: '/auth/refresh',
  me: '/auth/me',
  changePassword: '/auth/change-password',
  deleteAccount: '/auth/me',

  // Categories (shared)
  categories: '/categories',
  productTypes: '/customer/product-types',

  // In-app notifications (shared/token-based; any role)
  notifications: '/notifications',
  notificationsUnreadCount: '/notifications/unread-count',
  notificationsReadAll: '/notifications/read-all',
  notificationRead: (id: string) => `/notifications/${id}/read`,

  // Push notification device tokens (FCM) — POST to register, DELETE on logout
  devices: '/devices',

  // Customer discovery
  providers: '/customer/providers',
  providerById: (id: string) => `/customer/providers/${id}`,
  providerBookedSlots: (id: string) => `/customer/providers/${id}/booked-slots`,
  productSearch: '/customer/products',
  serviceSearch: '/customer/services',

  // Bookings
  bookings: '/customer/bookings',
  myBookings: '/customer/bookings/mine',
  cancelBooking: (id: string) => `/customer/bookings/${id}/cancel`,
  rescheduleBooking: (id: string) => `/customer/bookings/${id}/reschedule`,
  bookingReview: (id: string) => `/customer/bookings/${id}/review`,

  // Payments
  paymentLink: '/customer/payments/link',
  paymentSimulate: '/customer/payments/simulate',
  paymentVerify: '/customer/payments/verify',
  paymentSync: '/customer/payments/sync',
  orderPaymentLink: '/customer/payments/orders/link',
  orderPaymentSimulate: '/customer/payments/orders/simulate',
  orderPaymentVerify: '/customer/payments/orders/verify',
  orderPaymentSync: '/customer/payments/orders/sync',
  // Pay-then-place cart checkout — the order is created only once payment is confirmed.
  orderCheckoutStart: '/customer/payments/orders/checkout',
  orderCheckoutConfirm: '/customer/payments/orders/checkout/confirm',
  orderCheckoutSync: '/customer/payments/orders/checkout/sync',

  // Product orders (store businesses)
  orders: '/customer/orders',
  myOrders: '/customer/orders/mine',
  cancelOrder: (id: string) => `/customer/orders/${id}/cancel`,
  validateCoupon: '/customer/coupons/validate',
  storeCoupons: (id: string) => `/customer/providers/${id}/coupons`,
  platformCoupons: '/customer/platform-coupons',
  applicablePlatformCoupons: (providerId: string) => `/customer/providers/${providerId}/platform-coupons`,
  orderReview: (id: string) => `/customer/orders/${id}/review`,
  orderProductReview: (orderId: string, productId: string) =>
    `/customer/orders/${orderId}/products/${productId}/review`,
  productReviews: (id: string) => `/customer/products/${id}/reviews`,

  // Persistent cart
  cart: '/customer/cart',

  // Reviews (public)
  providerReviews: (id: string) => `/customer/providers/${id}/reviews`,

  // Reminders
  reminders: '/customer/reminders',
  reminder: (id: string) => `/customer/reminders/${id}`,
  reminderRespond: (id: string) => `/customer/reminders/${id}/respond`,

  // Saved addresses (on-location service bookings)
  addresses: '/customer/addresses',
  address: (id: string) => `/customer/addresses/${id}`,

  // Reverse geocoding proxy — Nominatim (reliably returns real Indian postal
  // codes, unlike calling BigDataCloud directly from the device).
  geoReverse: '/geo/reverse',
};
