import { useCallback, useMemo, useState } from 'react';

import { useAppSelector } from '@/redux/hooks';
import {
  useGetAllCouponsQuery,
  useGetAllMyBookingsQuery,
  useGetMyBusinessesQuery,
  useGetMyOrdersQuery,
} from '@/redux/api/business/businessApi';
import { Business, DashboardBooking, BusinessOrder } from '@/redux/api/business/types';
import { stockLevel } from '@/utils/units';

import { AttentionItem, LowStockItem } from './types';

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

const productStockLevel = (stockQty: number, stepQty: number, unlimitedStock?: boolean) =>
  unlimitedStock ? (stockQty <= 0 ? 'out' : 'ok') : stockLevel(stockQty, stepQty);

function deriveLowStock(businesses: Business[]): LowStockItem[] {
  const items: LowStockItem[] = [];
  businesses.forEach((b) => {
    (b.products ?? []).forEach((p) => {
      if (p.isActive === false) return;
      const level = productStockLevel(p.stockQty, p.stepQty, p.unlimitedStock);
      if (level === 'ok') return;
      items.push({ product: p, businessId: b.id, businessName: b.businessName, level });
    });
  });
  return items
    .sort((a, b) => {
      if (a.level !== b.level) return a.level === 'out' ? -1 : 1;
      return a.product.stockQty - b.product.stockQty;
    })
    .slice(0, 6);
}

export function useHomeScreen() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [refreshing, setRefreshing] = useState(false);

  const businesses = useGetMyBusinessesQuery();
  const bookingsQuery = useGetAllMyBookingsQuery();
  const ordersQuery = useGetMyOrdersQuery();

  const bookingsData = bookingsQuery.data;
  const ordersData = ordersQuery.data;
  const businessesData = businesses.data;

  const hasStore = useMemo(() => (businessesData ?? []).some((b) => b.type === 'STORE'), [businessesData]);
  const lowStock = useMemo(() => deriveLowStock(businessesData ?? []), [businessesData]);

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
    const lastMonthStart = new Date(monthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

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
    const collectedThisMonth = bookingRevenue + orderRevenue;

    // Last calendar month's total, for the "vs last month" trend line.
    const bookingRevenueLastMonth = bookings
      .filter((b) => {
        const t = new Date(b.startTime).getTime();
        return t >= lastMonthStart.getTime() && t < monthStart.getTime();
      })
      .reduce((sum, b) => sum + (b.amountPaidMinor ?? 0), 0);
    const orderRevenueLastMonth = orders
      .filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= lastMonthStart.getTime() && t < monthStart.getTime();
      })
      .reduce((sum, o) => sum + (o.amountPaidMinor ?? 0), 0);
    const collectedLastMonth = bookingRevenueLastMonth + orderRevenueLastMonth;

    // null = nothing to compare (both months empty, or no prior-month data —
    // the UI shows no trend line rather than a misleading 0%/Infinity%).
    const monthTrendPct =
      collectedLastMonth > 0 ? ((collectedThisMonth - collectedLastMonth) / collectedLastMonth) * 100 : null;
    const isNewMonthTrend = collectedLastMonth === 0 && collectedThisMonth > 0;

    // Money collected in each of the last 4 calendar months (oldest → this
    // month), same rule as `collectedThisMonth` — drives the money card's bars.
    const monthlyCollected = [3, 2, 1, 0].map((back) => {
      const from = new Date(monthStart.getFullYear(), monthStart.getMonth() - back, 1).getTime();
      const to = new Date(monthStart.getFullYear(), monthStart.getMonth() - back + 1, 1).getTime();
      const inRange = (t: number) => t >= from && t < to;
      return (
        bookings
          .filter((b) => inRange(new Date(b.startTime).getTime()))
          .reduce((sum, b) => sum + (b.amountPaidMinor ?? 0), 0) +
        orders
          .filter((o) => inRange(new Date(o.createdAt).getTime()))
          .reduce((sum, o) => sum + (o.amountPaidMinor ?? 0), 0)
      );
    });

    return {
      todays,
      upcomingCount,
      monthlyCollected,
      attention,
      openOrders,
      openOrdersCount: openOrders.length,
      needsActionCount: attention.length + orderAttentionCount,
      collectedThisMonth,
      monthTrendPct,
      isNewMonthTrend,
      currency: bookings[0]?.currency ?? orders[0]?.currency ?? 'INR',
    };
  }, [bookingsData, ordersData]);

  // Offers quick card: live offers = switched on, not expired, not used up.
  const couponsQuery = useGetAllCouponsQuery();
  const couponsData = couponsQuery.data;
  const activeOffersCount = useMemo(() => {
    const now = Date.now();
    return (couponsData ?? []).filter(
      (c) =>
        c.isActive &&
        !(c.expiresAt && new Date(c.expiresAt).getTime() < now) &&
        !(c.usageLimit != null && c.usedCount >= c.usageLimit),
    ).length;
  }, [couponsData]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      businesses.refetch(),
      bookingsQuery.refetch(),
      ordersQuery.refetch(),
      couponsQuery.refetch(),
    ]).finally(() => setRefreshing(false));
  }, [businesses, bookingsQuery, ordersQuery, couponsQuery]);

  return {
    currentUser,
    businesses: businesses.data ?? [],
    hasBusinesses: (businesses.data?.length ?? 0) > 0,
    isLoading: businesses.isLoading || bookingsQuery.isLoading || ordersQuery.isLoading,
    hasStore,
    lowStock,
    activeOffersCount,
    totalOffersCount: couponsData?.length ?? 0,
    refreshing,
    refresh,
    ...derived,
  };
}
