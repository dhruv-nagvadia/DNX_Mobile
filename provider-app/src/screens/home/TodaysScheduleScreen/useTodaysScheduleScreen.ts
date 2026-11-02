import { useCallback, useMemo, useState } from 'react';

import { useGetAllMyBookingsQuery } from '@/redux/api/business/businessApi';

/** The full (unsliced) version of Home's "Today's Schedule" preview — same
 * cross-business endpoint, same today-only + not-cancelled filter. */
export function useTodaysScheduleScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const bookingsQuery = useGetAllMyBookingsQuery();

  const todays = useMemo(() => {
    const bookings = bookingsQuery.data ?? [];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    return bookings
      .filter((b) => b.status !== 'CANCELLED')
      .filter((b) => {
        const t = new Date(b.startTime).getTime();
        return t >= todayStart.getTime() && t < todayEnd.getTime();
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [bookingsQuery.data]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await bookingsQuery.refetch().finally(() => setRefreshing(false));
  }, [bookingsQuery]);

  return {
    todays,
    isLoading: bookingsQuery.isLoading,
    refreshing,
    refresh,
  };
}
