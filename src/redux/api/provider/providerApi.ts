import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { ListProvidersParams, Provider } from './types';
import { ApiEnvelope, Paginated } from '../types';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Providers', 'Provider'],
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
  }),
});

export const { useGetProvidersQuery, useLazyGetProvidersQuery, useGetProviderByIdQuery } =
  providerApi;
