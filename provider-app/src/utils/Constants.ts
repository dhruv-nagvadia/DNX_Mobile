/** Keys used with AsyncStorage. Centralized so they never drift. */
export const StorageKeys = {
  accessToken: '@dnxp/accessToken',
  refreshToken: '@dnxp/refreshToken',
  activeBusinessId: '@dnxp/activeBusinessId',
  /** Set when the user signed in WITHOUT "Keep me signed in" — the session is dropped on next launch. */
  sessionOnly: '@dnxp/sessionOnly',
} as const;

export const AppConfig = {
  defaultPageLimit: 20,
  // Keep in sync with package.json's "version" — shown on Profile → About.
  version: '0.1.0',
} as const;
