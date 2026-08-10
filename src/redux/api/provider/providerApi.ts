import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { ListProvidersParams, Provider, Review } from './types';
import { ApiEnvelope, Paginated } from '../types';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Providers', 'Provider', 'Reviews'],
  endpoints: (builder) => ({
    getProviders: builder.query<Paginated<Provider>, ListProvidersParams | void>({
      query: (params) => ({
        endpoint: endpoints.providers,
        method: 'get',
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiEnvelope<Paginated<Provider>>) => res.data,
      providesTags: ['Providers'],
    }),

    getProviderById: builder.query<Provider, string>({
      query: (id) => ({ endpoint: endpoints.providerById(id), method: 'get' }),
      transformResponse: (res: ApiEnvelope<Provider>) => res.data,
      providesTags: (_result, _error, id) => [{ type: 'Provider', id }],
    }),

    getProviderReviews: builder.query<Review[], string>({
      query: (id) => ({ endpoint: endpoints.providerReviews(id), method: 'get' }),
      transformResponse: (res: ApiEnvelope<Review[]>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Reviews', id }],
    }),
  }),
});

export const {
  useGetProvidersQuery,
  useLazyGetProvidersQuery,
  useGetProviderByIdQuery,
  useGetProviderReviewsQuery,
} = providerApi;
