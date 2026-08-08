/** Route name constants — never use raw string route names. */
export const ROUTES = {
  SPLASH: 'SplashScreen',
  ONBOARDING: 'OnboardingScreen',
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  TABS: 'Tabs',
  HOME: 'HomeScreen',
  BOOKINGS: 'BookingsScreen',
  REMINDERS: 'RemindersScreen',
  PROFILE: 'ProfileScreen',
  CATEGORY: 'CategoryScreen',
  PROVIDER_LIST: 'ProviderListScreen',
  PROVIDER_DETAILS: 'ProviderDetailsScreen',
  GALLERY: 'GalleryScreen',
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
  [ROUTES.REMINDERS]: undefined;
  [ROUTES.PROFILE]: undefined;
  [ROUTES.CATEGORY]: { slug: string; name: string };
  [ROUTES.PROVIDER_LIST]: { categorySlug?: string; subcategorySlug?: string; title: string };
  [ROUTES.PROVIDER_DETAILS]: { providerId: string; name?: string };
  [ROUTES.GALLERY]: { images: string[]; index?: number };
  [ROUTES.ACCOUNT]: undefined;
};
