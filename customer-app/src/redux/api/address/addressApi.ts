import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { Address, AddressInput } from './types';
import { ApiEnvelope } from '../types';

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Addresses'],
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => ({ endpoint: endpoints.addresses, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Address[]>) => res.data,
      providesTags: ['Addresses'],
    }),

    createAddress: builder.mutation<Address, AddressInput>({
      query: (data) => ({ endpoint: endpoints.addresses, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<Address>) => res.data,
      invalidatesTags: ['Addresses'],
    }),

    updateAddress: builder.mutation<Address, { id: string; data: Partial<AddressInput> }>({
      query: ({ id, data }) => ({ endpoint: endpoints.address(id), method: 'patch', data }),
      transformResponse: (res: ApiEnvelope<Address>) => res.data,
      invalidatesTags: ['Addresses'],
    }),

    deleteAddress: builder.mutation<{ id: string }, string>({
      query: (id) => ({ endpoint: endpoints.address(id), method: 'delete' }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
      invalidatesTags: ['Addresses'],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
