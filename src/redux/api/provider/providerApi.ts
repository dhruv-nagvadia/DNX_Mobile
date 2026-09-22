import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { ListProvidersParams, Provider, ProviderListResult, Review } from './types';
import { ApiEnvelope } from '../types';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Providers', 'Provider', 'Reviews'],
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
} = providerApi;
