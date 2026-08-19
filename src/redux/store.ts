import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import { authApi } from './api/auth/authApi';
import { categoryApi } from './api/category/categoryApi';
import { providerApi } from './api/provider/providerApi';
import { bookingApi } from './api/booking/bookingApi';
import { orderApi } from './api/order/orderApi';
import { reminderApi } from './api/reminder/reminderApi';

const store = configureStore({
  reducer: {
    // Local state slices
    user: userReducer,
    cart: cartReducer,

    // RTK Query reducers (one per createApi call)
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [providerApi.reducerPath]: providerApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      providerApi.middleware,
      bookingApi.middleware,
      orderApi.middleware,
      reminderApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
