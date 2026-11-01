import { useMemo } from 'react';

import { useGetBusinessBookingsQuery, useGetMyOrdersQuery } from '@/redux/api/business/businessApi';
import { BusinessOrderItem } from '@/redux/api/business/types';

import { TopItem, TopSellersData } from './types';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MAX_ITEMS = 5;

const lineTotal = (it: BusinessOrderItem) => Math.round((it.quantity / it.priceQty) * it.priceMinor);

/** Weekday label with the most activity, or null if there's nothing to rank. */
function busiestWeekday(dates: Date[]): string | null {
  if (dates.length === 0) {
    return null;
  }
  const counts = new Array(7).fill(0);
  for (const d of dates) {
    counts[d.getDay()] += 1;
  }
  const max = Math.max(...counts);
  if (max === 0) {
    return null;
  }
  return WEEKDAYS[counts.indexOf(max)];
}

/**
 * Ports `frontend/src/components/TopSellersPanel/useTopSellers.ts` — top
 * services (by booking revenue) or top products (by order revenue), fully
 * client-side from the same list queries the rest of this app already uses
 * (no dedicated backend endpoint, same as the web version).
 */
export function useTopSellers(businessId: string, isStore: boolean) {
  const { data: bookings = [], isLoading: loadingBookings } = useGetBusinessBookingsQuery(businessId, {
    skip: isStore,
  });
  const { data: orders = [], isLoading: loadingOrders } = useGetMyOrdersQuery(undefined, { skip: !isStore });
  const isLoading = isStore ? loadingOrders : loadingBookings;

  const data: TopSellersData = useMemo(() => {
    if (isStore) {
      const myOrders = orders.filter((o) => o.provider.id === businessId && o.status !== 'CANCELLED');
      const byProduct = new Map<string, TopItem>();
      for (const o of myOrders) {
        for (const it of o.items) {
          const cur = byProduct.get(it.name) ?? { name: it.name, revenueMinor: 0, count: 0, imageUrl: null };
          cur.revenueMinor += lineTotal(it);
          cur.count += 1;
          cur.imageUrl ||= it.product?.imageUrl;
          byProduct.set(it.name, cur);
        }
      }
      const items = [...byProduct.values()].sort((a, b) => b.revenueMinor - a.revenueMinor).slice(0, MAX_ITEMS);
      return {
        items,
        currency: myOrders[0]?.currency ?? 'INR',
        busiestDay: busiestWeekday(myOrders.map((o) => new Date(o.createdAt))),
        itemLabel: 'product' as const,
      };
    }

    const active = bookings.filter((b) => b.status !== 'CANCELLED');
    const byService = new Map<string, TopItem>();
    for (const b of active) {
      const cur = byService.get(b.service.name) ?? { name: b.service.name, revenueMinor: 0, count: 0 };
      cur.revenueMinor += b.amountMinor;
      cur.count += 1;
      byService.set(b.service.name, cur);
    }
    const items = [...byService.values()].sort((a, b) => b.revenueMinor - a.revenueMinor).slice(0, MAX_ITEMS);
    return {
      items,
      currency: active[0]?.currency ?? 'INR',
      busiestDay: busiestWeekday(active.map((b) => new Date(b.startTime))),
      itemLabel: 'service' as const,
    };
  }, [isStore, orders, bookings, businessId]);

  return { data, isLoading };
}
