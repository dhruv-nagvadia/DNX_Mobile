import { useCallback, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import {
  useCollectBookingPaymentMutation,
  useCollectOrderPaymentMutation,
  useGetAllMyBookingsQuery,
  useGetMyOrdersQuery,
  useUpdateBookingStatusMutation,
  useUpdateOrderStatusMutation,
} from '@/redux/api/business/businessApi';
import { BusinessOrder, DashboardBooking, OrderStatus } from '@/redux/api/business/types';
import { bookingNeedsCollection, orderNeedsCollection } from '@/utils/status';

import { BookingsOrdersRouteProp, ListTab, PendingAction } from './types';

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * Ports the web dashboard's OrdersManager + BusinessBookings status machine:
 *   Orders:   PENDING → CONFIRMED → READY → COMPLETED, cancel from any non-terminal state
 *   Bookings: PENDING → CONFIRMED → COMPLETED, cancel from PENDING/CONFIRMED
 * Cancel always goes through a reason modal; collecting a booking payment
 * asks for a second confirm tap, collecting an order payment does not.
 */
export function useBookingsOrdersScreen() {
  const route = useRoute<BookingsOrdersRouteProp>();
  const [tab, setTab] = useState<ListTab>(route.params?.tab ?? 'bookings');
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState<PendingAction>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const bookingsQuery = useGetAllMyBookingsQuery();
  const ordersQuery = useGetMyOrdersQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [collectBookingPayment] = useCollectBookingPaymentMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [collectOrderPayment] = useCollectOrderPaymentMutation();

  const bookings = useMemo(
    () => [...(bookingsQuery.data ?? [])].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [bookingsQuery.data],
  );
  const orders = useMemo(
    () => [...(ordersQuery.data ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [ordersQuery.data],
  );

  const confirmBooking = useCallback(
    async (b: DashboardBooking) => {
      setActingId(b.id);
      await updateBookingStatus({ id: b.provider.id, bookingId: b.id, status: 'CONFIRMED' })
        .unwrap()
        .catch(() => undefined);
      setActingId(null);
    },
    [updateBookingStatus],
  );

  const completeBooking = useCallback(
    async (b: DashboardBooking) => {
      setActingId(b.id);
      await updateBookingStatus({ id: b.provider.id, bookingId: b.id, status: 'COMPLETED' })
        .unwrap()
        .catch(() => undefined);
      setActingId(null);
    },
    [updateBookingStatus],
  );

  const advanceOrder = useCallback(
    async (o: BusinessOrder, status: OrderStatus) => {
      setActingId(o.id);
      await updateOrderStatus({ orderId: o.id, businessId: o.provider.id, status })
        .unwrap()
        .catch(() => undefined);
      setActingId(null);
    },
    [updateOrderStatus],
  );

  const collectOrderNow = useCallback(
    async (o: BusinessOrder) => {
      setActingId(o.id);
      await collectOrderPayment({ orderId: o.id }).unwrap().catch(() => undefined);
      setActingId(null);
    },
    [collectOrderPayment],
  );

  const openModal = useCallback((action: PendingAction) => {
    setReason('');
    setPending(action);
  }, []);
  const closeModal = useCallback(() => setPending(null), []);

  const submitModal = useCallback(async () => {
    if (!pending) return;
    setActingId(
      pending.kind === 'cancelBooking' || pending.kind === 'collectBooking' ? pending.booking.id : pending.order.id,
    );
    if (pending.kind === 'cancelBooking') {
      await updateBookingStatus({
        id: pending.booking.provider.id,
        bookingId: pending.booking.id,
        status: 'CANCELLED',
        reason: reason.trim() || undefined,
      })
        .unwrap()
        .catch(() => undefined);
    } else if (pending.kind === 'cancelOrder') {
      await updateOrderStatus({
        orderId: pending.order.id,
        businessId: pending.order.provider.id,
        status: 'CANCELLED',
        reason: reason.trim() || undefined,
      })
        .unwrap()
        .catch(() => undefined);
    } else if (pending.kind === 'collectBooking') {
      await collectBookingPayment({ id: pending.booking.provider.id, bookingId: pending.booking.id })
        .unwrap()
        .catch(() => undefined);
    }
    setActingId(null);
    setPending(null);
  }, [pending, reason, updateBookingStatus, updateOrderStatus, collectBookingPayment]);

  return {
    tab,
    setTab,
    bookings,
    orders,
    bookingsLoading: bookingsQuery.isLoading,
    ordersLoading: ordersQuery.isLoading,
    refreshing: bookingsQuery.isFetching || ordersQuery.isFetching,
    refresh: () => {
      bookingsQuery.refetch();
      ordersQuery.refetch();
    },
    actingId,
    confirmBooking,
    completeBooking,
    collectBookingDue: (b: DashboardBooking) => bookingNeedsCollection(b),
    openCancelBooking: (b: DashboardBooking) => openModal({ kind: 'cancelBooking', booking: b }),
    openCollectBooking: (b: DashboardBooking) => openModal({ kind: 'collectBooking', booking: b }),
    advanceOrder,
    collectOrderNow,
    orderNeedsCollection,
    openCancelOrder: (o: BusinessOrder) => openModal({ kind: 'cancelOrder', order: o }),
    pending,
    reason,
    setReason,
    closeModal,
    submitModal,
    dateFmt,
  };
}
