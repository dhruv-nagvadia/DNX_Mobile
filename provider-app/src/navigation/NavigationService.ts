import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from './routes';

/**
 * Imperative navigation for use OUTSIDE React components
 * (e.g. Axios interceptors, services).
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    // @ts-expect-error — params typing is enforced by callers via RootStackParamList
    navigationRef.navigate(name, params);
  }
}

export function replace<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name as string, params));
  }
}
