/** Keys used with AsyncStorage. Centralized so they never drift. */
export const StorageKeys = {
  accessToken: '@dnx/accessToken',
  refreshToken: '@dnx/refreshToken',
  onboardingDone: '@dnx/onboardingDone',
} as const;

export const AppConfig = {
  defaultPageLimit: 20,
} as const;
