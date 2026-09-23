import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import {
  ListProvidersParams,
  Provider,
  ProviderListResult,
  ProductSearchListResult,
  Review,
  SearchProductsParams,
  SearchServicesParams,
  ServiceSearchListResult,
} from './types';
import { ApiEnvelope } from '../types';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Providers', 'Provider', 'Reviews', 'ProductSearch', 'ServiceSearch'],
  endpoints: (builder) => ({
    getProviders: builder.query<ProviderListResult, ListProvidersParams | void>({
      query: (params) => ({
        endpoint: endpoints.providers,
        method: 'get',
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiEnvelope<ProviderListResult>) => res.data,
      providesTags: ['Providers'],
    }),

    searchProducts: builder.query<ProductSearchListResult, SearchProductsParams | void>({
      query: (params) => ({
        endpoint: endpoints.productSearch,
        method: 'get',
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiEnvelope<ProductSearchListResult>) => res.data,
      providesTags: ['ProductSearch'],
    }),

    searchServices: builder.query<ServiceSearchListResult, SearchServicesParams | void>({
      query: (params) => ({
        endpoint: endpoints.serviceSearch,
        method: 'get',
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiEnvelope<ServiceSearchListResult>) => res.data,
      providesTags: ['ServiceSearch'],
    }),

    getProviderById: builder.query<Provider, { id: string; postalCode?: string }>({
      query: ({ id, postalCode }) => ({
        endpoint: endpoints.providerById(id),
        method: 'get',
        params: postalCode ? { postalCode } : undefined,
      }),
      transformResponse: (res: ApiEnvelope<Provider>) => res.data,
      providesTags: (_result, _error, { id }) => [{ type: 'Provider', id }],
    }),

    getProviderReviews: builder.query<Review[], string>({
      query: (id) => ({ endpoint: endpoints.providerReviews(id), method: 'get' }),
      transformResponse: (res: ApiEnvelope<Review[]>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Reviews', id }],
    }),

    getProductReviews: builder.query<Review[], string>({
      query: (id) => ({ endpoint: endpoints.productReviews(id), method: 'get' }),
      transformResponse: (res: ApiEnvelope<Review[]>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Reviews', id: `product-${id}` }],
    }),
  }),
});

export const {
  useGetProvidersQuery,
  useLazyGetProvidersQuery,
  useGetProviderByIdQuery,
  useGetProviderReviewsQuery,
  useGetProductReviewsQuery,
  useSearchProductsQuery,
  useSearchServicesQuery,
} = providerApi;
