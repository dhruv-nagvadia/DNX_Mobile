import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { Booking, BookedSlot, CreateBookingRequest } from './types';
import { ApiEnvelope } from '../types';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MyBookings', 'BookedSlots'],
  endpoints: (builder) => ({
    getMyBookings: builder.query<Booking[], void>({
      query: () => ({ endpoint: endpoints.myBookings, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Booking[]>) => res.data,
      providesTags: ['MyBookings'],
    }),

    // Upcoming booked intervals for a provider, so we can hide taken slots.
    getBookedSlots: builder.query<BookedSlot[], string>({
      query: (providerId) => ({
        endpoint: endpoints.providerBookedSlots(providerId),
        method: 'get',
      }),
      transformResponse: (res: ApiEnvelope<BookedSlot[]>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'BookedSlots', id }],
    }),

    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (data) => ({ endpoint: endpoints.bookings, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<Booking>) => res.data,
      invalidatesTags: (_r, _e, { providerId }) => [
        'MyBookings',
        { type: 'BookedSlots', id: providerId },
      ],
    }),
  }),
});

export const { useGetMyBookingsQuery, useGetBookedSlotsQuery, useCreateBookingMutation } =
  bookingApi;
