import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import couponReducer from './slices/couponSlice';
import locationReducer from './slices/locationSlice';
import { authApi } from './api/auth/authApi';
import { categoryApi } from './api/category/categoryApi';
import { productTypeApi } from './api/productType/productTypeApi';
import { providerApi } from './api/provider/providerApi';
import { bookingApi } from './api/booking/bookingApi';
import { orderApi } from './api/order/orderApi';
import { cartApi } from './api/cart/cartApi';
import { reminderApi } from './api/reminder/reminderApi';
import { notificationApi } from './api/notification/notificationApi';
import { addressApi } from './api/address/addressApi';

const store = configureStore({
  reducer: {
    // Local state slices
    user: userReducer,
    cart: cartReducer,
    coupons: couponReducer,
    location: locationReducer,

    // RTK Query reducers (one per createApi call)
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productTypeApi.reducerPath]: productTypeApi.reducer,
    [providerApi.reducerPath]: providerApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [reminderApi.reducerPath]: reminderApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Redux Toolkit's immutability / serializability checks walk the WHOLE state tree after
    // every action (all cached API lists, image URLs, ...) — in a development build that
    // adds a noticeable delay to every tap. They are already off in release builds, so
    // turning them off here makes debug feel like release.
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }).concat(
      authApi.middleware,
      categoryApi.middleware,
      productTypeApi.middleware,
      providerApi.middleware,
      bookingApi.middleware,
      orderApi.middleware,
      cartApi.middleware,
      reminderApi.middleware,
      notificationApi.middleware,
      addressApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
