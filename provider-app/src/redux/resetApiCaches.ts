import { AppDispatch } from './store';
import { authApi } from './api/auth/authApi';
import { businessApi } from './api/business/businessApi';
import { notificationApi } from './api/notification/notificationApi';

/**
 * Wipes every RTK Query cache. Each `createApi` instance keeps its own cache
 * keyed by endpoint+args, with no per-user scoping — a query with no args
 * (e.g. "my businesses") reuses the exact same cache entry across accounts,
 * so logging out and into a different account without this would keep
 * showing the previous account's data until the app is force-quit and
 * reopened. Call this on logout AND right after a successful login, since
 * either one can leave a stale, still-warm cache from the other account.
 */
export function resetAllApiCaches(dispatch: AppDispatch): void {
  dispatch(authApi.util.resetApiState());
  dispatch(businessApi.util.resetApiState());
  dispatch(notificationApi.util.resetApiState());
}
