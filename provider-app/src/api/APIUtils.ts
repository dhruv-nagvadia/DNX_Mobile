import { Platform } from 'react-native';
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

const BASE_URL = API_BASE_URL || DEV_FALLBACK;

export default BASE_URL;

/**
 * Every endpoint this app calls. Paths mirror `frontend/src/api/endpoints.ts`
 * (the web provider dashboard) exactly — same backend, same routes, just a
 * different TypeScript client.
 */
export const endpoints = {
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
  businessProductStock: (businessId: string, productId: string) =>
    `/provider/businesses/${businessId}/products/${productId}/stock`,
  businessProductAvailability: (businessId: string, productId: string) =>
    `/provider/businesses/${businessId}/products/${productId}/availability`,

  // Coupons
  businessCoupons: (businessId: string) => `/provider/businesses/${businessId}/coupons`,
  businessCoupon: (businessId: string, couponId: string) =>
    `/provider/businesses/${businessId}/coupons/${couponId}`,

  // Reviews
  businessReviews: (businessId: string) => `/provider/businesses/${businessId}/reviews`,
  businessReviewReply: (businessId: string, reviewId: string) =>
    `/provider/businesses/${businessId}/reviews/${reviewId}/reply`,
  businessProductReviewReply: (businessId: string, productId: string, reviewId: string) =>
    `/provider/businesses/${businessId}/products/${productId}/reviews/${reviewId}/reply`,

  // Earnings & uploads
  myEarnings: '/provider/earnings',
  uploadImage: '/provider/uploads/image',
};
