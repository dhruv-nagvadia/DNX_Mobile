import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import couponReducer from './slices/couponSlice';
import { authApi } from './api/auth/authApi';
import { categoryApi } from './api/category/categoryApi';
import { providerApi } from './api/provider/providerApi';
import { bookingApi } from './api/booking/bookingApi';
import { orderApi } from './api/order/orderApi';
import { cartApi } from './api/cart/cartApi';
import { reminderApi } from './api/reminder/reminderApi';
import { notificationApi } from './api/notification/notificationApi';

const store = configureStore({
  reducer: {
    // Local state slices
    user: userReducer,
    cart: cartReducer,
    coupons: couponReducer,

    // RTK Query reducers (one per createApi call)
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [providerApi.reducerPath]: providerApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      providerApi.middleware,
      bookingApi.middleware,
      orderApi.middleware,
      cartApi.middleware,
      reminderApi.middleware,
      notificationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
