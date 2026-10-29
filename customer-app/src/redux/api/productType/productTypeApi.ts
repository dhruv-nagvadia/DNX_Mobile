import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { ProductType } from './types';
import { ApiEnvelope } from '../types';

export const productTypeApi = createApi({
  reducerPath: 'productTypeApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getProductTypes: builder.query<ProductType[], void>({
      query: () => ({ endpoint: endpoints.productTypes, method: 'get' }),
      transformResponse: (res: ApiEnvelope<ProductType[]>) => res.data,
      keepUnusedDataFor: 600, // product types rarely change — cache 10 min
    }),
  }),
});

export const { useGetProductTypesQuery } = productTypeApi;
