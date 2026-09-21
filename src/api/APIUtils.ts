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
  changePassword: '/auth/change-password',

  // Categories (shared)
  categories: '/categories',

  // In-app notifications (shared/token-based; any role)
  notifications: '/notifications',
  notificationsUnreadCount: '/notifications/unread-count',
  notificationsReadAll: '/notifications/read-all',
  notificationRead: (id: string) => `/notifications/${id}/read`,

  // Customer discovery
  providers: '/customer/providers',
  providerById: (id: string) => `/customer/providers/${id}`,
  providerBookedSlots: (id: string) => `/customer/providers/${id}/booked-slots`,

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
  reminderDone: (id: string) => `/customer/reminders/${id}/done`,

  // Saved addresses (on-location service bookings)
  addresses: '/customer/addresses',
  address: (id: string) => `/customer/addresses/${id}`,

  // Reverse geocoding proxy — Nominatim (reliably returns real Indian postal
  // codes, unlike calling BigDataCloud directly from the device).
  geoReverse: '/geo/reverse',
};
