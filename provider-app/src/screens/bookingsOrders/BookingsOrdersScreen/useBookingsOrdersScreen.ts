import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

import {
  useCollectBookingPaymentMutation,
  useCollectOrderPaymentMutation,
  useGetAllMyBookingsQuery,
  useGetMyBusinessQuery,
  useGetMyOrdersQuery,
  useUpdateBookingStatusMutation,
  useUpdateOrderStatusMutation,
} from '@/redux/api/business/businessApi';
import {
  BookingStatus,
  BusinessOrder,
  DashboardBooking,
  OrderStatus,
} from '@/redux/api/business/types';
import { bookingNeedsCollection, orderNeedsCollection, orderOutstanding } from '@/utils/status';

import {
  BookingChip,
  BookingStats,
  BookingsOrdersRouteProp,
  ListTab,
  OrderChip,
  OrderStats,
  PendingAction,
  StatusFilter,
} from './types';

/** Short order reference shown on cards: last 6 chars of the id, uppercased. */
export function shortOrderId(id: string): string {
  return id.slice(-6).toUpperCase();
}

/** Which orders-view chip an order status falls under (NO_SHOW → Cancelled). */
function orderChipOf(status: OrderStatus): OrderChip {
  return status === 'NO_SHOW' ? 'CANCELLED' : status;
}

/** Which bookings-view chip a booking status falls under (NO_SHOW → Cancelled). */
function bookingChipOf(status: BookingStatus): BookingChip {
  return status === 'NO_SHOW' ? 'CANCELLED' : status;
}

/** Outstanding (uncollected) amount on a booking, in minor units. */
export function bookingOutstanding(b: { amountMinor: number; amountPaidMinor?: number }): number {
  return b.amountMinor - (b.amountPaidMinor ?? 0);
}

/** Server error message from an RTK Query rejection, if any. */
function serverMessage(err: unknown): string | undefined {
  return (err as { data?: { message?: string } } | undefined)?.data?.message;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/**
 * Ports the web dashboard's OrdersManager + BusinessBookings status machine:
 *   Orders:   PENDING → CONFIRMED → READY → COMPLETED, cancel from any non-terminal state
 *   Bookings: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED (CONFIRMED may also
 *             complete directly or be marked NO_SHOW), cancel from PENDING/CONFIRMED
 * Cancel always goes through a reason modal; collecting a booking payment
 * and an order payment ask for a second confirm tap.
 */
export function useBookingsOrdersScreen() {
  const route = useRoute<BookingsOrdersRouteProp>();
  const businessId = route.params?.businessId;
  const scoped = !!businessId;
  const [tab, setTabState] = useState<ListTab>(route.params?.tab ?? 'bookings');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const setTab = useCallback((next: ListTab) => {
    setTabState(next);
    // Bookings and orders have different status sets — start each tab on "All".
    setStatusFilter('ALL');
    setSearch('');
  }, []);
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState<PendingAction>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const bookingsQuery = useGetAllMyBookingsQuery();
  const ordersQuery = useGetMyOrdersQuery();
  const { data: business } = useGetMyBusinessQuery(businessId ?? '', { skip: !businessId });
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [collectBookingPayment] = useCollectBookingPaymentMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [collectOrderPayment] = useCollectOrderPaymentMutation();

  const bookings = useMemo(
    () =>
      (bookingsQuery.data ?? [])
        .filter((b) => !businessId || b.provider.id === businessId)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [bookingsQuery.data, businessId],
  );
  const orders = useMemo(
    () =>
      (ordersQuery.data ?? [])
        .filter((o) => !businessId || o.provider.id === businessId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [ordersQuery.data, businessId],
  );

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    return bookings.filter((b) => {
      if (statusFilter !== 'ALL' && bookingChipOf(b.status) !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        shortOrderId(b.id).toLowerCase().includes(q.replace(/^#/, '')) ||
        b.user.fullName.toLowerCase().includes(q) ||
        b.service.name.toLowerCase().includes(q) ||
        (!!qDigits && !!b.user.phone && b.user.phone.replace(/\D/g, '').includes(qDigits))
      );
    });
  }, [bookings, statusFilter, search]);
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    return orders.filter((o) => {
      if (statusFilter !== 'ALL' && orderChipOf(o.status) !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        shortOrderId(o.id).toLowerCase().includes(q.replace(/^#/, '')) ||
        o.user.fullName.toLowerCase().includes(q) ||
        (!!qDigits && !!o.user.phone && o.user.phone.replace(/\D/g, '').includes(qDigits))
      );
    });
  }, [orders, statusFilter, search]);

  /** Chip counts + tiles — over every order in scope, ignoring search/filter. */
  const orderStats = useMemo<OrderStats>(() => {
    const counts: Record<OrderChip, number> = {
      ALL: orders.length,
      PENDING: 0,
      CONFIRMED: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    let toCollectMinor = 0;
    for (const o of orders) {
      counts[orderChipOf(o.status)] += 1;
      if (orderNeedsCollection(o)) {
        toCollectMinor += orderOutstanding(o);
      }
    }
    return { counts, toCollectMinor, currency: orders[0]?.currency ?? 'INR' };
  }, [orders]);

  /** Chip counts + tiles + "N today" — over every booking in scope, ignoring search/filter. */
  const bookingStats = useMemo<BookingStats>(() => {
    const counts: Record<BookingChip, number> = {
      ALL: bookings.length,
      PENDING: 0,
      CONFIRMED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    let toCollectMinor = 0;
    let today = 0;
    const todayStart = startOfDay(new Date());
    for (const b of bookings) {
      counts[bookingChipOf(b.status)] += 1;
      if (bookingNeedsCollection(b)) {
        toCollectMinor += bookingOutstanding(b);
      }
      if (
        b.status !== 'CANCELLED' &&
        b.status !== 'NO_SHOW' &&
        startOfDay(new Date(b.startTime)) === todayStart
      ) {
        today += 1;
      }
    }
    return { counts, toCollectMinor, today, currency: bookings[0]?.currency ?? 'INR' };
  }, [bookings]);

  /** PATCH a booking's status; surfaces the server's reason when it refuses. */
  const setBookingStatus = useCallback(
    async (b: DashboardBooking, status: BookingStatus) => {
      setActingId(b.id);
      try {
        await updateBookingStatus({ id: b.provider.id, bookingId: b.id, status }).unwrap();
      } catch (err) {
        Alert.alert(
          'Could not update booking',
          serverMessage(err) ?? 'Something went wrong. Please try again.',
        );
      }
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

  const openModal = useCallback((action: PendingAction) => {
    setReason('');
    setPending(action);
  }, []);
  const closeModal = useCallback(() => setPending(null), []);

  const submitModal = useCallback(async () => {
    if (!pending) {
      return;
    }
    setActingId(
      pending.kind === 'cancelBooking' || pending.kind === 'collectBooking'
        ? pending.booking.id
        : pending.order.id,
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
      await collectBookingPayment({
        id: pending.booking.provider.id,
        bookingId: pending.booking.id,
      })
        .unwrap()
        .catch(() => undefined);
    } else if (pending.kind === 'collectOrder') {
      await collectOrderPayment({ orderId: pending.order.id })
        .unwrap()
        .catch(() => undefined);
    }
    setActingId(null);
    setPending(null);
  }, [
    pending,
    reason,
    updateBookingStatus,
    updateOrderStatus,
    collectBookingPayment,
    collectOrderPayment,
  ]);

  return {
    tab,
    setTab,
    scoped,
    statusFilter,
    setStatusFilter,
    bookings: filteredBookings,
    orders: filteredOrders,
    allBookingsCount: bookings.length,
    allOrdersCount: orders.length,
    orderStats,
    search,
    setSearch,
    businessName: business?.businessName,
    bookingsLoading: bookingsQuery.isLoading,
    ordersLoading: ordersQuery.isLoading,
    refreshing: bookingsQuery.isFetching || ordersQuery.isFetching,
    refresh: () => {
      bookingsQuery.refetch();
      ordersQuery.refetch();
    },
    actingId,
    bookingStats,
    setBookingStatus,
    bookingNeedsCollection,
    openCancelBooking: (b: DashboardBooking) => openModal({ kind: 'cancelBooking', booking: b }),
    openCollectBooking: (b: DashboardBooking) => openModal({ kind: 'collectBooking', booking: b }),
    advanceOrder,
    orderNeedsCollection,
    openCancelOrder: (o: BusinessOrder) => openModal({ kind: 'cancelOrder', order: o }),
    openCollectOrder: (o: BusinessOrder) => openModal({ kind: 'collectOrder', order: o }),
    pending,
    reason,
    setReason,
    closeModal,
    submitModal,
  };
}
