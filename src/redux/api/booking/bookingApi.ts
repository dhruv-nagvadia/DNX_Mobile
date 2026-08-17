import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import {
  Booking,
  BookedSlot,
  CreateBookingRequest,
  CreateReviewRequest,
  PaymentLinkResponse,
} from './types';
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

    cancelBooking: builder.mutation<Booking, { id: string; providerId: string }>({
      query: ({ id }) => ({ endpoint: endpoints.cancelBooking(id), method: 'patch' }),
      transformResponse: (res: ApiEnvelope<Booking>) => res.data,
      invalidatesTags: (_r, _e, { providerId }) => [
        'MyBookings',
        { type: 'BookedSlots', id: providerId },
      ],
    }),

    rescheduleBooking: builder.mutation<
      Booking,
      { id: string; providerId: string; startTime: string }
    >({
      query: ({ id, startTime }) => ({
        endpoint: endpoints.rescheduleBooking(id),
        method: 'patch',
        data: { startTime },
      }),
      transformResponse: (res: ApiEnvelope<Booking>) => res.data,
      invalidatesTags: (_r, _e, { providerId }) => [
        'MyBookings',
        { type: 'BookedSlots', id: providerId },
      ],
    }),

    createReview: builder.mutation<{ id: string }, CreateReviewRequest>({
      query: ({ bookingId, rating, comment }) => ({
        endpoint: endpoints.bookingReview(bookingId),
        method: 'post',
        data: { rating, comment },
      }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
      invalidatesTags: ['MyBookings'],
    }),

    // Payments
    createPaymentLink: builder.mutation<PaymentLinkResponse, { bookingId: string }>({
      query: (data) => ({ endpoint: endpoints.paymentLink, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<PaymentLinkResponse>) => res.data,
    }),

    simulatePayment: builder.mutation<{ bookingId: string }, { bookingId: string }>({
      query: (data) => ({ endpoint: endpoints.paymentSimulate, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<{ bookingId: string }>) => res.data,
      invalidatesTags: ['MyBookings'],
    }),

    // Reconciles a payment's status with Razorpay (fallback when no webhook).
    syncPayment: builder.mutation<{ paymentStatus: string }, { bookingId: string }>({
      query: (data) => ({ endpoint: endpoints.paymentSync, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<{ paymentStatus: string }>) => res.data,
      invalidatesTags: ['MyBookings'],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetBookedSlotsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useCreateReviewMutation,
  useCreatePaymentLinkMutation,
  useSimulatePaymentMutation,
  useSyncPaymentMutation,
} = bookingApi;
