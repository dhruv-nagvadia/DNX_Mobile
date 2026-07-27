import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import { authApi } from './api/auth/authApi';
import { categoryApi } from './api/category/categoryApi';
import { providerApi } from './api/provider/providerApi';

const store = configureStore({
  reducer: {
    // Local state slices
    user: userReducer,

    // RTK Query reducers (one per createApi call)
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [providerApi.reducerPath]: providerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      providerApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
