/** Route name constants — never use raw string route names. */
export const ROUTES = {
  SPLASH: 'SplashScreen',
  ONBOARDING: 'OnboardingScreen',
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  TABS: 'Tabs',
  HOME: 'HomeScreen',
  BOOKINGS: 'BookingsScreen',
  BOOKING_DETAILS: 'BookingDetailsScreen',
  REMINDERS: 'RemindersScreen',
  ADD_REMINDER: 'AddReminderScreen',
  PROFILE: 'ProfileScreen',
  CATEGORY: 'CategoryScreen',
  PROVIDER_LIST: 'ProviderListScreen',
  PROVIDER_DETAILS: 'ProviderDetailsScreen',
  BOOKING_SUMMARY: 'BookingSummaryScreen',
  BOOKING_PROCESSING: 'BookingProcessingScreen',
  BOOKING_SUCCESS: 'BookingSuccessScreen',
  COUPONS: 'CouponsScreen',
  LOCATION_PICKER: 'LocationPickerScreen',
  GALLERY: 'GalleryScreen',
  SEARCH: 'SearchScreen',
  REVIEWS: 'ReviewsScreen',
  ACCOUNT: 'AccountScreen',
  CART: 'CartScreen',
  PRODUCT_DETAILS: 'ProductDetailScreen',
  ORDER_DETAILS: 'OrderDetailScreen',
  CHECKOUT_PROCESSING: 'CheckoutProcessingScreen',
  ORDER_SUCCESS: 'OrderSuccessScreen',
  NOTIFICATIONS: 'NotificationsScreen',
  DEBUG_LOGS: 'DebugLogsScreen',
} as const;

/** Type-safe params for every route. `undefined` = no params. */
export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.TABS]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.BOOKINGS]: undefined;
  [ROUTES.BOOKING_DETAILS]: { bookingId: string };
  [ROUTES.REMINDERS]: undefined;
  [ROUTES.ADD_REMINDER]: {
    id?: string;
    prefillTitle?: string;
    prefillType?: string;
    providerId?: string;
  };
  [ROUTES.PROFILE]: undefined;
  [ROUTES.CATEGORY]: { slug: string; name: string };
  [ROUTES.PROVIDER_LIST]: { categorySlug?: string; subcategorySlug?: string; title: string };
  [ROUTES.PROVIDER_DETAILS]: {
    providerId: string;
    name?: string;
    // When set, the screen reschedules this booking instead of creating a new one.
    rescheduleBookingId?: string;
    rescheduleServiceId?: string;
  };
  [ROUTES.BOOKING_SUMMARY]: { providerId: string; serviceId: string; startTime: string };
  [ROUTES.BOOKING_PROCESSING]: {
    providerId: string;
    providerName: string;
    serviceId: string;
    serviceName: string;
    startTime: string;
    method: 'ONLINE' | 'CASH' | 'PARTIAL';
    couponCode?: string;
    currency: string;
  };
  [ROUTES.BOOKING_SUCCESS]: {
    bookingId: string;
    providerName: string;
    serviceName: string;
    startTime: string;
    amountMinor: number;
    amountPaidMinor: number;
    currency: string;
    // 'pending' = booking stands, but the online/partial payment didn't go
    // through — shown as a note, not a failure state (matches ORDER_SUCCESS's
    // `failedNames`, just for the single-booking case).
    outcome: 'paid' | 'partial' | 'cash' | 'pending';
  };
  [ROUTES.COUPONS]: {
    providerId: string;
    subtotalMinor: number;
    currency: string;
    // The service being booked — needed for SERVICE-scoped coupons.
    serviceId?: string;
    // Cart line items — needed for PRODUCT-scoped coupons.
    items?: { productId: string; lineTotalMinor: number }[];
  };
  [ROUTES.LOCATION_PICKER]: undefined;
  [ROUTES.GALLERY]: { images: string[]; index?: number };
  [ROUTES.SEARCH]: undefined;
  [ROUTES.REVIEWS]: { providerId: string; businessName?: string };
  [ROUTES.ACCOUNT]: undefined;
  [ROUTES.CART]: undefined;
  [ROUTES.PRODUCT_DETAILS]: { providerId: string; productId: string };
  [ROUTES.ORDER_DETAILS]: { orderId: string };
  [ROUTES.CHECKOUT_PROCESSING]: {
    method: 'ONLINE' | 'CASH' | 'PARTIAL';
    currency: string;
    // A snapshot of the cart at the moment "Checkout" was tapped — this
    // screen runs the whole place-order/pay flow itself (including opening
    // Razorpay), so it never has to hand control back to the Cart screen
    // mid-payment.
    groups: {
      providerId: string;
      providerName: string;
      items: { productId: string; quantity: number }[];
      couponCode?: string;
    }[];
  };
  [ROUTES.ORDER_SUCCESS]: {
    currency: string;
    placed: { orderId: string; providerName: string; amountMinor: number }[];
    // Stores whose payment didn't go through — shown as a note, not a failure state.
    failedNames?: string[];
  };
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.DEBUG_LOGS]: undefined;
};
