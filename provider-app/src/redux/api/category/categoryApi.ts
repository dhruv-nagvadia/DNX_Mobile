import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { ApiEnvelope } from '../types';
import { Category } from './types';

/** Shared/public category tree — same endpoint and shape as the web dashboard. */
export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({ endpoint: endpoints.categories, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Category[]>) => res.data,
      providesTags: ['Categories'],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
