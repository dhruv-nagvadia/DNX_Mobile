import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import type { CartItem } from '@/redux/slices/cartSlice';
import { ApiEnvelope } from '../types';

// The server returns a superset of CartItem (extra unit); map to CartItem.
interface ServerCartItem extends CartItem {
  unit?: string;
}

function toCartItem(s: ServerCartItem): CartItem {
  return {
    productId: s.productId,
    providerId: s.providerId,
    providerName: s.providerName,
    name: s.name,
    measure: s.measure,
    priceMinor: s.priceMinor,
    priceQty: s.priceQty,
    currency: s.currency,
    stockQty: s.stockQty,
    stepQty: s.stepQty,
    quantity: s.quantity,
    imageUrl: s.imageUrl,
    depositPercent: s.depositPercent,
  };
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => ({ endpoint: endpoints.cart, method: 'get' }),
      transformResponse: (res: ApiEnvelope<ServerCartItem[]>) => res.data.map(toCartItem),
    }),
    syncCart: builder.mutation<CartItem[], { productId: string; quantity: number }[]>({
      query: (items) => ({ endpoint: endpoints.cart, method: 'put', data: { items } }),
      transformResponse: (res: ApiEnvelope<ServerCartItem[]>) => res.data.map(toCartItem),
    }),
  }),
});

export const { useLazyGetCartQuery, useSyncCartMutation } = cartApi;
