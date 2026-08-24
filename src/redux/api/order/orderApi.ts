import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { CreateOrderRequest, CreateOrderResponse, Order } from './types';
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
  }),
});

export const { useGetMyOrdersQuery, useCreateOrderMutation, useCancelOrderMutation } = orderApi;
