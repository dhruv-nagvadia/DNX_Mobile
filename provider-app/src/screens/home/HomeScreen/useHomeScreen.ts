import { useCallback, useMemo, useState } from 'react';

import { useAppSelector } from '@/redux/hooks';
import {
  useGetAllMyBookingsQuery,
  useGetMyBusinessesQuery,
  useGetMyOrdersQuery,
} from '@/redux/api/business/businessApi';
import { DashboardBooking, BusinessOrder } from '@/redux/api/business/types';

import { AttentionItem } from './types';

/**
 * Ports `frontend/src/pages/provider/DashboardPage/useDashboard.ts` 1:1 — same
 * aggregation logic, same two cross-business endpoints (no per-business
 * filtering; the web dashboard has no "active business" concept either, it
 * always shows everything across every business at once).
 */
const outstanding = (b: DashboardBooking) => b.amountMinor - (b.amountPaidMinor ?? 0);
const needsCollection = (b: DashboardBooking) =>
  b.status !== 'CANCELLED' &&
  (b.paymentMethod === 'CASH' || b.paymentMethod === 'PARTIAL') &&
  b.paymentStatus !== 'PAID' &&
  b.paymentStatus !== 'REFUNDED' &&
  outstanding(b) > 0;

const orderOutstanding = (o: BusinessOrder) => o.amountMinor - (o.amountPaidMinor ?? 0);
const orderNeedsCollection = (o: BusinessOrder) =>
  o.status !== 'CANCELLED' &&
  (o.paymentMethod === 'CASH' || o.paymentMethod === 'PARTIAL') &&
  o.paymentStatus !== 'PAID' &&
  o.paymentStatus !== 'REFUNDED' &&
  orderOutstanding(o) > 0;

const isOpenOrder = (o: BusinessOrder) =>
  o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'READY';

export function useHomeScreen() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [refreshing, setRefreshing] = useState(false);

  const businesses = useGetMyBusinessesQuery();
  const bookingsQuery = useGetAllMyBookingsQuery();
  const ordersQuery = useGetMyOrdersQuery();

  const bookingsData = bookingsQuery.data;
  const ordersData = ordersQuery.data;

  const derived = useMemo(() => {
    const bookings = bookingsData ?? [];
    const orders = ordersData ?? [];
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const active = bookings.filter((b) => b.status !== 'CANCELLED');

    const todays = active
      .filter((b) => {
        const t = new Date(b.startTime).getTime();
        return t >= todayStart.getTime() && t < todayEnd.getTime();
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const upcomingCount = active.filter((b) => new Date(b.endTime).getTime() >= now).length;

    const attention: AttentionItem[] = active
      .map((b) => ({ booking: b, confirm: b.status === 'PENDING', collect: needsCollection(b), due: outstanding(b) }))
      .filter((i) => i.confirm || i.collect)
      .sort((a, b) => new Date(a.booking.startTime).getTime() - new Date(b.booking.startTime).getTime());

    const openOrders = orders
      .filter(isOpenOrder)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const orderAttentionCount = orders.filter((o) => o.status === 'PENDING' || orderNeedsCollection(o)).length;

    const bookingRevenue = bookings
      .filter((b) => new Date(b.startTime).getTime() >= monthStart.getTime())
      .reduce((sum, b) => sum + (b.amountPaidMinor ?? 0), 0);
    const orderRevenue = orders
      .filter((o) => new Date(o.createdAt).getTime() >= monthStart.getTime())
      .reduce((sum, o) => sum + (o.amountPaidMinor ?? 0), 0);

    return {
      todays,
      upcomingCount,
      attention,
      openOrders,
      openOrdersCount: openOrders.length,
      needsActionCount: attention.length + orderAttentionCount,
      collectedThisMonth: bookingRevenue + orderRevenue,
      currency: bookings[0]?.currency ?? orders[0]?.currency ?? 'INR',
    };
  }, [bookingsData, ordersData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([businesses.refetch(), bookingsQuery.refetch(), ordersQuery.refetch()]).finally(() =>
      setRefreshing(false),
    );
  }, [businesses, bookingsQuery, ordersQuery]);

  return {
    currentUser,
    businesses: businesses.data ?? [],
    hasBusinesses: (businesses.data?.length ?? 0) > 0,
    isLoading: businesses.isLoading || bookingsQuery.isLoading || ordersQuery.isLoading,
    refreshing,
    refresh,
    ...derived,
  };
}
