import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import { authApi } from './api/auth/authApi';
import { businessApi } from './api/business/businessApi';
import { notificationApi } from './api/notification/notificationApi';
import { categoryApi } from './api/category/categoryApi';

const store = configureStore({
  reducer: {
    // Local state slices
    user: userReducer,

    // RTK Query reducers (one per createApi call)
    [authApi.reducerPath]: authApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      businessApi.middleware,
      notificationApi.middleware,
      categoryApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
