import { AppDispatch } from './store';
import { authApi } from './api/auth/authApi';
import { categoryApi } from './api/category/categoryApi';
import { providerApi } from './api/provider/providerApi';
import { bookingApi } from './api/booking/bookingApi';
import { orderApi } from './api/order/orderApi';
import { cartApi } from './api/cart/cartApi';
import { reminderApi } from './api/reminder/reminderApi';
import { notificationApi } from './api/notification/notificationApi';
import { addressApi } from './api/address/addressApi';

/**
 * Wipes every RTK Query cache. Each `createApi` instance keeps its own cache
 * keyed by endpoint+args, with no per-user scoping — a query with no args
 * (e.g. "my bookings") reuses the exact same cache entry across accounts, so
 * logging out and into a different account without this would keep showing
 * the previous account's data until the app is force-quit and reopened.
 * Call this on logout/account-deletion AND right after a successful login,
 * since either one can leave a stale, still-warm cache from the other account.
 */
export function resetAllApiCaches(dispatch: AppDispatch): void {
  dispatch(authApi.util.resetApiState());
  dispatch(categoryApi.util.resetApiState());
  dispatch(providerApi.util.resetApiState());
  dispatch(bookingApi.util.resetApiState());
  dispatch(orderApi.util.resetApiState());
  dispatch(cartApi.util.resetApiState());
  dispatch(reminderApi.util.resetApiState());
  dispatch(notificationApi.util.resetApiState());
  dispatch(addressApi.util.resetApiState());
}
