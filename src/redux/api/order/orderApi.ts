import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  CreateOrderReviewRequest,
  CreateProductReviewRequest,
  Order,
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

    createProductReview: builder.mutation<{ id: string }, CreateProductReviewRequest>({
      query: ({ orderId, productId, rating, comment }) => ({
        endpoint: endpoints.orderProductReview(orderId, productId),
        method: 'post',
        data: { rating, comment },
      }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
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
} = orderApi;
