/**
 * Route name constants — never use raw string route names.
 *
 * All 11 phases of the provider-mobile build plan have real screens as of
 * this route list (scaffold through profile & notifications; polish is a
 * cross-cutting pass, not new screens).
 */
export const ROUTES = {
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen',
  TABS: 'Tabs',
  HOME: 'HomeScreen',
  BOOKINGS_ORDERS: 'BookingsOrdersScreen',
  BUSINESSES: 'BusinessesScreen',
  BUSINESS_DETAIL: 'BusinessDetailScreen',
  BUSINESS_HOURS: 'BusinessHoursScreen',
  BUSINESS_CALENDAR: 'BusinessCalendarScreen',
  BUSINESS_EDIT: 'BusinessEditScreen',
  SERVICES: 'ServicesScreen',
  SERVICE_FORM: 'ServiceFormScreen',
  PRODUCTS: 'ProductsScreen',
  PRODUCT_FORM: 'ProductFormScreen',
  STOCK: 'StockScreen',
  COUPONS: 'CouponsScreen',
  COUPON_FORM: 'CouponFormScreen',
  REVIEWS: 'ReviewsScreen',
  EARNINGS: 'EarningsScreen',
  PROFILE: 'ProfileScreen',
  NOTIFICATIONS: 'NotificationsScreen',
} as const;

/** Type-safe params for every route. `undefined` = no params. */
export type RootStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.FORGOT_PASSWORD]: undefined;
  [ROUTES.TABS]: undefined;
  [ROUTES.HOME]: undefined;
  // `tab` opens this screen straight onto Bookings or Orders (e.g. from Home's stat tiles).
  [ROUTES.BOOKINGS_ORDERS]: { tab?: 'bookings' | 'orders' } | undefined;
  [ROUTES.BUSINESSES]: undefined;
  [ROUTES.BUSINESS_DETAIL]: { businessId: string };
  [ROUTES.BUSINESS_HOURS]: { businessId: string };
  [ROUTES.BUSINESS_CALENDAR]: { businessId: string };
  [ROUTES.BUSINESS_EDIT]: { businessId: string };
  [ROUTES.SERVICES]: { businessId: string };
  [ROUTES.SERVICE_FORM]: { businessId: string; serviceId?: string };
  [ROUTES.PRODUCTS]: { businessId: string };
  [ROUTES.PRODUCT_FORM]: { businessId: string; productId?: string };
  [ROUTES.STOCK]: { businessId: string };
  [ROUTES.COUPONS]: { businessId: string };
  [ROUTES.COUPON_FORM]: { businessId: string; couponId?: string };
  [ROUTES.REVIEWS]: { businessId: string };
  [ROUTES.EARNINGS]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.NOTIFICATIONS]: undefined;
};
