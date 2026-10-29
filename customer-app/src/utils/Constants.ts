/** Keys used with AsyncStorage. Centralized so they never drift. */
export const StorageKeys = {
  accessToken: '@dnx/accessToken',
  refreshToken: '@dnx/refreshToken',
  onboardingDone: '@dnx/onboardingDone',
  recentlyViewed: '@dnx/recentlyViewed',
  location: '@dnx/location',
  recentSearches: '@dnx/recentSearches',
  recentSearchViews: '@dnx/recentSearchViews',
} as const;

export const AppConfig = {
  defaultPageLimit: 20,
  // Keep in sync with package.json's "version" — shown on Profile → About.
  version: '0.1.0',
} as const;
