import { useCallback, useMemo, useState } from 'react';

import { useGetAllMyBookingsQuery } from '@/redux/api/business/businessApi';
import { DashboardBooking } from '@/redux/api/business/types';

import { AttentionItem } from './types';

const outstanding = (b: DashboardBooking) => b.amountMinor - (b.amountPaidMinor ?? 0);
const needsCollection = (b: DashboardBooking) =>
  b.status !== 'CANCELLED' &&
  (b.paymentMethod === 'CASH' || b.paymentMethod === 'PARTIAL') &&
  b.paymentStatus !== 'PAID' &&
  b.paymentStatus !== 'REFUNDED' &&
  outstanding(b) > 0;

/** The full (unsliced) version of Home's "Needs Your Attention" preview. */
export function useAttentionListScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const bookingsQuery = useGetAllMyBookingsQuery();

  const attention = useMemo(() => {
    const bookings = bookingsQuery.data ?? [];
    const active = bookings.filter((b) => b.status !== 'CANCELLED');
    const items: AttentionItem[] = active
      .map((b) => ({ booking: b, confirm: b.status === 'PENDING', collect: needsCollection(b), due: outstanding(b) }))
      .filter((i) => i.confirm || i.collect);
    return items.sort(
      (a, b) => new Date(a.booking.startTime).getTime() - new Date(b.booking.startTime).getTime(),
    );
  }, [bookingsQuery.data]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await bookingsQuery.refetch().finally(() => setRefreshing(false));
  }, [bookingsQuery]);

  return {
    attention,
    isLoading: bookingsQuery.isLoading,
    refreshing,
    refresh,
  };
}
