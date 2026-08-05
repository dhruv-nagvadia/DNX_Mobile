/** Route name constants — never use raw string route names. */
export const ROUTES = {
  SPLASH: 'SplashScreen',
  ONBOARDING: 'OnboardingScreen',
  LOGIN: 'LoginScreen',
  REGISTER: 'RegisterScreen',
  HOME: 'HomeScreen',
  CATEGORY: 'CategoryScreen',
  PROVIDER_LIST: 'ProviderListScreen',
  PROVIDER_DETAILS: 'ProviderDetailsScreen',
  ACCOUNT: 'AccountScreen',
} as const;

/** Type-safe params for every route. `undefined` = no params. */
export type RootStackParamList = {
  [ROUTES.SPLASH]: undefined;
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.CATEGORY]: { slug: string; name: string };
  [ROUTES.PROVIDER_LIST]: { categorySlug?: string; title?: string };
  [ROUTES.PROVIDER_DETAILS]: { providerId: string };
  [ROUTES.ACCOUNT]: undefined;
};
