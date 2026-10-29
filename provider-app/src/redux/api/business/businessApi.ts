import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { ApiEnvelope } from '../types';
import {
  Business,
  BusinessBooking,
  BusinessOrder,
  BookingStatus,
  DashboardBooking,
  DateHour,
  DateHourInput,
  BusinessHour,
  OrderStatus,
  PaymentStatus,
  UpdateBusinessRequest,
  Service,
  ServiceInput,
  Product,
  ProductInput,
  AdjustStockInput,
  Coupon,
  CouponInput,
  BusinessReview,
  Earnings,
  EarningsParams,
} from './types';

/**
 * My businesses, bookings, and orders — mirrors
 * `frontend/src/redux/api/provider/providerApi.ts` (same backend, same
 * endpoints). Catalog (services/products/stock), coupons, reviews, and
 * earnings get their own domain files in later phases.
 */
export const businessApi = createApi({
  reducerPath: 'businessApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'MyBusinesses',
    'MyBusiness',
    'MyBusinessBookings',
    'AllBookings',
    'MyOrders',
    'DateHours',
    'Coupons',
    'BusinessReviews',
    'MyEarnings',
  ],
  endpoints: (builder) => ({
    getMyBusinesses: builder.query<Business[], void>({
      query: () => ({ endpoint: endpoints.myBusinesses, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Business[]>) => res.data,
      providesTags: ['MyBusinesses'],
    }),

    getMyBusiness: builder.query<Business, string>({
      query: (id) => ({ endpoint: endpoints.myBusinessById(id), method: 'get' }),
      transformResponse: (res: ApiEnvelope<Business>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'MyBusiness', id }],
    }),

    updateBusiness: builder.mutation<Business, { id: string; data: UpdateBusinessRequest }>({
      query: ({ id, data }) => ({ endpoint: endpoints.myBusinessById(id), method: 'patch', data }),
      transformResponse: (res: ApiEnvelope<Business>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'MyBusiness', id }, 'MyBusinesses'],
    }),

    getBusinessBookings: builder.query<BusinessBooking[], string>({
      query: (id) => ({ endpoint: endpoints.myBusinessBookings(id), method: 'get' }),
      transformResponse: (res: ApiEnvelope<BusinessBooking[]>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'MyBusinessBookings', id }],
    }),

    /** Cross-business — every booking across every one of my businesses, in one call. */
    getAllMyBookings: builder.query<DashboardBooking[], void>({
      query: () => ({ endpoint: endpoints.myAllBookings, method: 'get' }),
      transformResponse: (res: ApiEnvelope<DashboardBooking[]>) => res.data,
      providesTags: ['AllBookings'],
    }),

    /** Cross-business — every order across every one of my STORE businesses. */
    getMyOrders: builder.query<BusinessOrder[], void>({
      query: () => ({ endpoint: endpoints.myOrders, method: 'get' }),
      transformResponse: (res: ApiEnvelope<BusinessOrder[]>) => res.data,
      providesTags: ['MyOrders'],
    }),

    updateOrderStatus: builder.mutation<
      BusinessOrder,
      { orderId: string; businessId: string; status: OrderStatus; reason?: string }
    >({
      query: ({ orderId, status, reason }) => ({
        endpoint: endpoints.myOrder(orderId),
        method: 'patch',
        data: { status, reason },
      }),
      transformResponse: (res: ApiEnvelope<BusinessOrder>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => ['MyOrders', { type: 'MyBusiness', id: businessId }],
    }),

    collectOrderPayment: builder.mutation<BusinessOrder, { orderId: string }>({
      query: ({ orderId }) => ({ endpoint: endpoints.myOrderCollect(orderId), method: 'post' }),
      transformResponse: (res: ApiEnvelope<BusinessOrder>) => res.data,
      invalidatesTags: ['MyOrders'],
    }),

    updateBookingStatus: builder.mutation<
      BusinessBooking,
      { id: string; bookingId: string; status: BookingStatus; reason?: string }
    >({
      query: ({ id, bookingId, status, reason }) => ({
        endpoint: endpoints.myBusinessBooking(id, bookingId),
        method: 'patch',
        data: { status, reason },
      }),
      transformResponse: (res: ApiEnvelope<BusinessBooking>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'MyBusinessBookings', id }, 'AllBookings'],
    }),

    collectBookingPayment: builder.mutation<
      { bookingId: string; paymentStatus: PaymentStatus; amountPaidMinor: number },
      { id: string; bookingId: string }
    >({
      query: ({ id, bookingId }) => ({
        endpoint: endpoints.myBusinessBookingCollect(id, bookingId),
        method: 'post',
      }),
      transformResponse: (
        res: ApiEnvelope<{ bookingId: string; paymentStatus: PaymentStatus; amountPaidMinor: number }>,
      ) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'MyBusinessBookings', id }, 'AllBookings'],
    }),

    setBusinessHours: builder.mutation<Business, { id: string; hours: BusinessHour[] }>({
      query: ({ id, hours }) => ({ endpoint: endpoints.myBusinessHours(id), method: 'put', data: { hours } }),
      transformResponse: (res: ApiEnvelope<Business>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'MyBusiness', id }, 'MyBusinesses'],
    }),

    getDateHours: builder.query<DateHour[], { id: string; from: string; to: string }>({
      query: ({ id, from, to }) => ({
        endpoint: endpoints.myBusinessDateHours(id),
        method: 'get',
        params: { from, to },
      }),
      transformResponse: (res: ApiEnvelope<DateHour[]>) => res.data,
      providesTags: (_r, _e, { id }) => [{ type: 'DateHours', id }],
    }),

    setDateHour: builder.mutation<DateHour, { id: string; data: DateHourInput }>({
      query: ({ id, data }) => ({ endpoint: endpoints.myBusinessDateHours(id), method: 'put', data }),
      transformResponse: (res: ApiEnvelope<DateHour>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'DateHours', id }],
    }),

    deleteDateHour: builder.mutation<{ date: string }, { id: string; date: string }>({
      query: ({ id, date }) => ({ endpoint: `${endpoints.myBusinessDateHours(id)}/${date}`, method: 'delete' }),
      transformResponse: (res: ApiEnvelope<{ date: string }>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'DateHours', id }],
    }),

    // ── Services (SERVICE businesses) — Service[] is embedded on Business,
    // so invalidating MyBusiness/MyBusinesses is enough to refresh the list. ──
    createService: builder.mutation<Service, { businessId: string; data: ServiceInput }>({
      query: ({ businessId, data }) => ({ endpoint: endpoints.businessServices(businessId), method: 'post', data }),
      transformResponse: (res: ApiEnvelope<Service>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    updateService: builder.mutation<
      Service,
      { businessId: string; serviceId: string; data: Partial<ServiceInput> & { isActive?: boolean } }
    >({
      query: ({ businessId, serviceId, data }) => ({
        endpoint: endpoints.businessService(businessId, serviceId),
        method: 'patch',
        data,
      }),
      transformResponse: (res: ApiEnvelope<Service>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    deleteService: builder.mutation<null, { businessId: string; serviceId: string }>({
      query: ({ businessId, serviceId }) => ({
        endpoint: endpoints.businessService(businessId, serviceId),
        method: 'delete',
      }),
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    // ── Products & stock (STORE businesses) ──────────────────────────────
    createProduct: builder.mutation<Product, { businessId: string; data: ProductInput }>({
      query: ({ businessId, data }) => ({ endpoint: endpoints.businessProducts(businessId), method: 'post', data }),
      transformResponse: (res: ApiEnvelope<Product>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    updateProduct: builder.mutation<
      Product,
      { businessId: string; productId: string; data: Partial<ProductInput> & { isActive?: boolean } }
    >({
      query: ({ businessId, productId, data }) => ({
        endpoint: endpoints.businessProduct(businessId, productId),
        method: 'patch',
        data,
      }),
      transformResponse: (res: ApiEnvelope<Product>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    deleteProduct: builder.mutation<null, { businessId: string; productId: string }>({
      query: ({ businessId, productId }) => ({
        endpoint: endpoints.businessProduct(businessId, productId),
        method: 'delete',
      }),
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    adjustProductStock: builder.mutation<Product, { businessId: string; productId: string; data: AdjustStockInput }>({
      query: ({ businessId, productId, data }) => ({
        endpoint: endpoints.businessProductStock(businessId, productId),
        method: 'patch',
        data,
      }),
      transformResponse: (res: ApiEnvelope<Product>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    setProductStockStatus: builder.mutation<Product, { businessId: string; productId: string; inStock: boolean }>({
      query: ({ businessId, productId, inStock }) => ({
        endpoint: endpoints.businessProductAvailability(businessId, productId),
        method: 'patch',
        data: { inStock },
      }),
      transformResponse: (res: ApiEnvelope<Product>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'MyBusiness', id: businessId }, 'MyBusinesses'],
    }),

    // ── Coupons — their own tag; unlike services/products they aren't
    // embedded on Business, so they don't invalidate MyBusiness. ──────────
    getCoupons: builder.query<Coupon[], string>({
      query: (businessId) => ({ endpoint: endpoints.businessCoupons(businessId), method: 'get' }),
      transformResponse: (res: ApiEnvelope<Coupon[]>) => res.data,
      providesTags: (_r, _e, businessId) => [{ type: 'Coupons', id: businessId }],
    }),

    createCoupon: builder.mutation<Coupon, { businessId: string; data: CouponInput }>({
      query: ({ businessId, data }) => ({ endpoint: endpoints.businessCoupons(businessId), method: 'post', data }),
      transformResponse: (res: ApiEnvelope<Coupon>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'Coupons', id: businessId }],
    }),

    updateCoupon: builder.mutation<Coupon, { businessId: string; couponId: string; data: Partial<CouponInput> }>({
      query: ({ businessId, couponId, data }) => ({
        endpoint: endpoints.businessCoupon(businessId, couponId),
        method: 'patch',
        data,
      }),
      transformResponse: (res: ApiEnvelope<Coupon>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'Coupons', id: businessId }],
    }),

    deleteCoupon: builder.mutation<{ id: string }, { businessId: string; couponId: string }>({
      query: ({ businessId, couponId }) => ({
        endpoint: endpoints.businessCoupon(businessId, couponId),
        method: 'delete',
      }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'Coupons', id: businessId }],
    }),

    // ── Reviews — product-review replies aren't wired on the web either
    // (dead endpoint there), so only business-level reviews are ported. ────
    getBusinessReviews: builder.query<BusinessReview[], string>({
      query: (businessId) => ({ endpoint: endpoints.businessReviews(businessId), method: 'get' }),
      transformResponse: (res: ApiEnvelope<BusinessReview[]>) => res.data,
      providesTags: (_r, _e, businessId) => [{ type: 'BusinessReviews', id: businessId }],
    }),

    replyToReview: builder.mutation<BusinessReview, { businessId: string; reviewId: string; reply: string | null }>({
      query: ({ businessId, reviewId, reply }) => ({
        endpoint: endpoints.businessReviewReply(businessId, reviewId),
        method: 'patch',
        data: { reply },
      }),
      transformResponse: (res: ApiEnvelope<BusinessReview>) => res.data,
      invalidatesTags: (_r, _e, { businessId }) => [{ type: 'BusinessReviews', id: businessId }],
    }),

    getMyEarnings: builder.query<Earnings, EarningsParams | void>({
      query: (params) => ({ endpoint: endpoints.myEarnings, method: 'get', params: params ?? undefined }),
      transformResponse: (res: ApiEnvelope<Earnings>) => res.data,
      providesTags: ['MyEarnings'],
    }),
  }),
});

export const {
  useGetMyBusinessesQuery,
  useGetMyBusinessQuery,
  useUpdateBusinessMutation,
  useGetBusinessBookingsQuery,
  useGetAllMyBookingsQuery,
  useGetMyOrdersQuery,
  useUpdateOrderStatusMutation,
  useCollectOrderPaymentMutation,
  useUpdateBookingStatusMutation,
  useCollectBookingPaymentMutation,
  useSetBusinessHoursMutation,
  useGetDateHoursQuery,
  useSetDateHourMutation,
  useDeleteDateHourMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAdjustProductStockMutation,
  useSetProductStockStatusMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetBusinessReviewsQuery,
  useReplyToReviewMutation,
  useGetMyEarningsQuery,
} = businessApi;
