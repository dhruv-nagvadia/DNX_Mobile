import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { Booking } from './types';
import { ApiEnvelope } from '../types';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MyBookings'],
  endpoints: (builder) => ({
    getMyBookings: builder.query<Booking[], void>({
      query: () => ({ endpoint: endpoints.myBookings, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Booking[]>) => res.data,
      providesTags: ['MyBookings'],
    }),
  }),
});

export const { useGetMyBookingsQuery } = bookingApi;
