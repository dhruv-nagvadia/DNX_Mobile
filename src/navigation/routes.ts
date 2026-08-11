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
  GALLERY: 'GalleryScreen',
  SEARCH: 'SearchScreen',
  REVIEWS: 'ReviewsScreen',
  ACCOUNT: 'AccountScreen',
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
  [ROUTES.GALLERY]: { images: string[]; index?: number };
  [ROUTES.SEARCH]: undefined;
  [ROUTES.REVIEWS]: { providerId: string; businessName?: string };
  [ROUTES.ACCOUNT]: undefined;
};
