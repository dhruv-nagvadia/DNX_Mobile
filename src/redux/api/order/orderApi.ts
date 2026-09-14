import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { PaymentOrderResponse, VerifyPaymentResult } from '@/redux/api/booking/types';
import {
  CheckoutConfirmResult,
  CheckoutSyncResult,
  CouponPreview,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateOrderReviewRequest,
  CreateProductReviewRequest,
  Order,
  StoreCoupon,
  ValidateCouponRequest,
} from './types';
import { ApiEnvelope } from '../types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['MyOrders'],
  endpoints: (builder) => ({
    getMyOrders: builder.query<Order[], void>({
      query: () => ({ endpoint: endpoints.myOrders, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Order[]>) => res.data,
      providesTags: ['MyOrders'],
    }),

    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({ endpoint: endpoints.orders, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<CreateOrderResponse>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    cancelOrder: builder.mutation<Order, string>({
      query: (id) => ({ endpoint: endpoints.cancelOrder(id), method: 'patch' }),
      transformResponse: (res: ApiEnvelope<Order>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    createOrderReview: builder.mutation<{ id: string }, CreateOrderReviewRequest>({
      query: ({ orderId, rating, comment }) => ({
        endpoint: endpoints.orderReview(orderId),
        method: 'post',
        data: { rating, comment },
      }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    validateCoupon: builder.mutation<CouponPreview, ValidateCouponRequest>({
      query: (data) => ({ endpoint: endpoints.validateCoupon, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<CouponPreview>) => res.data,
    }),

    getStoreCoupons: builder.query<StoreCoupon[], string>({
      query: (providerId) => ({ endpoint: endpoints.storeCoupons(providerId), method: 'get' }),
      transformResponse: (res: ApiEnvelope<StoreCoupon[]>) => res.data,
    }),

    createProductReview: builder.mutation<{ id: string }, CreateProductReviewRequest>({
      query: ({ orderId, productId, rating, comment }) => ({
        endpoint: endpoints.orderProductReview(orderId, productId),
        method: 'post',
        data: { rating, comment },
      }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    // Real (or simulated) in-app payment for a store order — mirrors bookings.
    // Creates a Razorpay Order for the native Checkout SDK (no browser).
    createOrderPaymentOrder: builder.mutation<PaymentOrderResponse, { orderId: string }>({
      query: (data) => ({ endpoint: endpoints.orderPaymentLink, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<PaymentOrderResponse>) => res.data,
    }),

    simulateOrderPayment: builder.mutation<{ orderId: string }, { orderId: string }>({
      query: (data) => ({ endpoint: endpoints.orderPaymentSimulate, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<{ orderId: string }>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    // Verifies the signature the native SDK returns right after a successful charge.
    verifyOrderPayment: builder.mutation<
      VerifyPaymentResult,
      { orderId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
    >({
      query: (data) => ({ endpoint: endpoints.orderPaymentVerify, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<VerifyPaymentResult>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    // Reconciles an order's payment with Razorpay (fallback when the SDK's
    // success callback never ran, e.g. the app was killed mid-payment).
    syncOrderPayment: builder.mutation<{ paymentStatus: string }, { orderId: string }>({
      query: (data) => ({ endpoint: endpoints.orderPaymentSync, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<{ paymentStatus: string }>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    // Pay-then-place cart checkout — validates the cart and opens a Razorpay
    // Order, but does NOT place the order yet (or, in test mode, places it
    // immediately since there's no real payment to wait on).
    startOrderCheckout: builder.mutation<PaymentOrderResponse, CreateOrderRequest>({
      query: (data) => ({ endpoint: endpoints.orderCheckoutStart, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<PaymentOrderResponse>) => res.data,
    }),

    // Verifies the checkout signature and only now actually places the order.
    confirmOrderCheckout: builder.mutation<
      CheckoutConfirmResult,
      { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
    >({
      query: (data) => ({ endpoint: endpoints.orderCheckoutConfirm, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<CheckoutConfirmResult>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    // Reconciliation fallback: asks Razorpay directly whether a checkout's
    // payment landed, for when the native SDK's own callback never reached
    // the app (closed mid-payment, a slow bank redirect, a dropped confirm
    // call after a successful charge).
    syncOrderCheckout: builder.mutation<CheckoutSyncResult, { razorpayOrderId: string }>({
      query: (data) => ({ endpoint: endpoints.orderCheckoutSync, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<CheckoutSyncResult>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useCreateOrderReviewMutation,
  useCreateProductReviewMutation,
  useValidateCouponMutation,
  useGetStoreCouponsQuery,
  useCreateOrderPaymentOrderMutation,
  useSimulateOrderPaymentMutation,
  useVerifyOrderPaymentMutation,
  useSyncOrderPaymentMutation,
  useStartOrderCheckoutMutation,
  useConfirmOrderCheckoutMutation,
  useSyncOrderCheckoutMutation,
} = orderApi;
