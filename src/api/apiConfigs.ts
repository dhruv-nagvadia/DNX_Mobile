import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import BASE_URL from './APIUtils';
import { StorageKeys } from '@/utils/Constants';
import { replace } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import DEBUG_LOGGER, { ERROR, INFO } from '@/utils/DebugLogger';

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

// Response interceptor — global 401 handling (session expired → login).
networkCall.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      DEBUG_LOGGER('401 received — clearing session', 'interceptor', FILE, '55', ERROR);
      clearTokenCache();
      await AsyncStorage.multiRemove([StorageKeys.accessToken, StorageKeys.refreshToken]);
      replace(ROUTES.LOGIN);
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
    try {
      const result = await networkCall({ url: endpoint, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export { networkCall };
