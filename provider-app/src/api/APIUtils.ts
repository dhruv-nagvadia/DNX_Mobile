import { NativeModules, Platform } from 'react-native';
import { API_BASE_URL } from '@env';

/**
 * Base URL for the backend API.
 *
 * Normally this comes straight from `API_BASE_URL` in whichever `.env.<APP_ENV>`
 * file is active — APP_ENV is set by the npm script you ran (android:dev/
 * staging/production, ios:*, start:*; see package.json and babel.config.js).
 * dev/staging/production each point at their own backend.
 *
 * If that's missing for some reason, fall back to the same local-dev
 * defaults the customer app uses:
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
    /^(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(
      h,
    );
  // Android emulator reaches the host Mac via 10.0.2.2 and Metro reports that, so it works too.
  return isLocal(target[2]) && isLocal(metroHost) ? `${target[1]}${metroHost}${target[3]}` : url;
}

const BASE_URL = withMetroHost(API_BASE_URL || DEV_FALLBACK);

export default BASE_URL;

/**
 * Every endpoint this app calls. Paths mirror `frontend/src/api/endpoints.ts`
 * (the web provider dashboard) exactly — same backend, same routes, just a
 * different TypeScript client.
 */
export const endpoints = {
  // Reverse geocoding (our backend proxies Nominatim) — coordinates → address.
  geoReverse: '/geo/reverse',
  // Auth — provider accounts (PROVIDER); refresh/me are shared/token-based
  register: '/provider/auth/register',
  login: '/provider/auth/login',
  forgotPassword: '/provider/auth/forgot-password',
  resetPassword: '/provider/auth/reset-password',
  refresh: '/auth/refresh',
  me: '/auth/me',
  changePassword: '/auth/change-password',

  // Categories (shared/public)
  categories: '/categories',

  // In-app notifications (shared/token-based; any role)
  notifications: '/notifications',
  notificationsUnreadCount: '/notifications/unread-count',
  notificationsReadAll: '/notifications/read-all',
  notificationRead: (id: string) => `/notifications/${id}/read`,

  // Push notification device tokens (FCM) — POST to register, DELETE on logout
  devices: '/devices',

  // My businesses
  myBusinesses: '/provider/businesses',
  myBusinessById: (id: string) => `/provider/businesses/${id}`,
  myBusinessImages: (id: string) => `/provider/businesses/${id}/images`,
  myBusinessHours: (id: string) => `/provider/businesses/${id}/hours`,
  myBusinessDateHours: (id: string) => `/provider/businesses/${id}/date-hours`,

  // Bookings (SERVICE businesses)
  myAllBookings: '/provider/bookings',
  myBusinessBookings: (id: string) => `/provider/businesses/${id}/bookings`,
  myBusinessBooking: (id: string, bookingId: string) =>
    `/provider/businesses/${id}/bookings/${bookingId}`,
  myBusinessBookingCollect: (id: string, bookingId: string) =>
    `/provider/businesses/${id}/bookings/${bookingId}/collect`,

  // Orders (STORE businesses)
  myOrders: '/provider/orders',
  myOrder: (orderId: string) => `/provider/orders/${orderId}`,
  myOrderCollect: (orderId: string) => `/provider/orders/${orderId}/collect`,

  // Catalog
  businessServices: (businessId: string) => `/provider/businesses/${businessId}/services`,
  businessService: (businessId: string, serviceId: string) =>
    `/provider/businesses/${businessId}/services/${serviceId}`,
  businessProducts: (businessId: string) => `/provider/businesses/${businessId}/products`,
  businessProduct: (businessId: string, productId: string) =>
    `/provider/businesses/${businessId}/products/${productId}`,
  businessStockAdjustments: (businessId: string) => `/provider/businesses/${businessId}/stock-adjustments`,
  businessProductStock: (businessId: string, productId: string) =>
    `/provider/businesses/${businessId}/products/${productId}/stock`,
  businessProductAvailability: (businessId: string, productId: string) =>
    `/provider/businesses/${businessId}/products/${productId}/availability`,

  // Coupons
  businessCoupons: (businessId: string) => `/provider/businesses/${businessId}/coupons`,
  // Every coupon across all of the owner's businesses (global Offers screen).
  allCoupons: '/provider/coupons',
  businessCoupon: (businessId: string, couponId: string) =>
    `/provider/businesses/${businessId}/coupons/${couponId}`,

  // Reviews
  businessReviews: (businessId: string) => `/provider/businesses/${businessId}/reviews`,
  // Every business review / product review across all of the owner's businesses.
  allReviews: '/provider/reviews',
  allProductReviews: '/provider/product-reviews',
  // Public list of one product's reviews (same endpoint the customer app uses).
  productReviews: (productId: string) => `/customer/products/${productId}/reviews`,
  businessReviewReply: (businessId: string, reviewId: string) =>
    `/provider/businesses/${businessId}/reviews/${reviewId}/reply`,
  businessProductReviewReply: (businessId: string, productId: string, reviewId: string) =>
    `/provider/businesses/${businessId}/products/${productId}/reviews/${reviewId}/reply`,

  // Earnings & uploads
  myEarnings: '/provider/earnings',
  uploadImage: '/provider/uploads/image',
};
