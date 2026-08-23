import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import BASE_URL, { endpoints } from './APIUtils';
import { StorageKeys } from '@/utils/Constants';
import DEBUG_LOGGER, { ERROR, INFO } from '@/utils/DebugLogger';
import { logApi } from '@/utils/logger';

const FILE = 'apiConfigs';

// ── Token cache ───────────────────────────────────────────────────────────
// Read from storage once, then keep in memory. Reading AsyncStorage on every
// request adds latency to hot paths like search.
let _cachedToken: string | null = null;

export const setTokenCache = (token: string | null) => {
  _cachedToken = token;
  DEBUG_LOGGER('Token cache updated', 'setTokenCache', FILE, '20', INFO);
};

export const clearTokenCache = () => {
  _cachedToken = null;
};

export const loadTokenFromStorage = async (): Promise<string | null> => {
  _cachedToken = await AsyncStorage.getItem(StorageKeys.accessToken);
  return _cachedToken;
};

// ── Axios instance ──────────────────────────────────────────────────────────
const networkCall = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// Request interceptor — attach Bearer token (cache-first).
networkCall.interceptors.request.use(async (config) => {
  if (!_cachedToken) {
    _cachedToken = await AsyncStorage.getItem(StorageKeys.accessToken);
  }
  if (_cachedToken) {
    config.headers.Authorization = `Bearer ${_cachedToken}`;
  }
  return config;
});

// ── Token refresh (on 401) ───────────────────────────────────────────────────
// The access token is short-lived (15m). When a request 401s we transparently
// mint a new access token from the stored refresh token and retry — so a long
// session (e.g. browse, then book) doesn't fail. Concurrent 401s share one
// refresh via `refreshPromise`.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await AsyncStorage.getItem(StorageKeys.refreshToken);
  if (!refreshToken) return null;
  try {
    // Bare axios (not `networkCall`) so this request skips the interceptors.
    const res = await axios.post(`${BASE_URL}${endpoints.refresh}`, { refreshToken });
    const tokens = res.data?.data ?? res.data;
    const accessToken: string | undefined = tokens?.accessToken;
    if (!accessToken) return null;
    setTokenCache(accessToken);
    await AsyncStorage.multiSet([
      [StorageKeys.accessToken, accessToken],
      [StorageKeys.refreshToken, tokens.refreshToken ?? refreshToken],
    ]);
    return accessToken;
  } catch {
    return null;
  }
}

/** Clears the session in Redux; RootNavigator swaps to the auth stack on its own. */
async function endSession() {
  clearTokenCache();
  await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
  try {
    // Lazy require avoids a circular import (store → apis → apiConfigs).
    const store = require('../redux/store').default;
    const { clearCurrentUser } = require('../redux/slices/userSlice');
    const { clearCart } = require('../redux/slices/cartSlice');
    store.dispatch(clearCart());
    store.dispatch(clearCurrentUser());
  } catch {
    // If the store isn't ready, the next launch starts unauthenticated anyway.
  }
}

// Response interceptor — refresh the token on 401 and retry once.
networkCall.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;

      if (newToken) {
        // Retry the original request; the request interceptor re-attaches the
        // freshly cached token.
        return networkCall(original);
      }

      DEBUG_LOGGER('Refresh failed — signing out', 'interceptor', FILE, '55', ERROR);
      await endSession();
    }

    return Promise.reject(error);
  },
);

// ── RTK Query base query ─────────────────────────────────────────────────────
export interface AxiosBaseQueryArgs {
  endpoint: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

/**
 * Adapts our Axios instance to the shape RTK Query expects:
 *   success → { data }
 *   failure → { error: { status, data } }
 */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, { status?: number; data?: unknown }> =>
  async ({ endpoint, method = 'get', data, params, headers }) => {
    const started = Date.now();
    // Skip FormData (file uploads) in logs — it isn't JSON-serialisable.
    const request =
      data instanceof FormData
        ? { form: true }
        : data !== undefined || params !== undefined
          ? { params, data }
          : undefined;
    try {
      const result = await networkCall({ url: endpoint, method, data, params, headers });
      logApi({
        method,
        endpoint,
        status: result.status,
        ms: Date.now() - started,
        ok: true,
        request,
        response: result.data,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const status = err.response?.status;
      const errData = err.response?.data || err.message;
      logApi({ method, endpoint, status, ms: Date.now() - started, ok: false, request, error: errData });
      return { error: { status, data: errData } };
    }
  };

export { networkCall };
