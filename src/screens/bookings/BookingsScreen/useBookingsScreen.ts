import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useGetMyBookingsQuery } from '@/redux/api/booking/bookingApi';
import { Booking } from '@/redux/api/booking/types';
import { ROUTES } from '@/navigation/routes';

import { BookingsNavigationProp } from './types';

/** The customer's bookings list; tapping one opens its detail. */
export function useBookingsScreen() {
  const navigation = useNavigation<BookingsNavigationProp>();
  // Refetch on mount so the list reflects current status/images (not a stale cache).
  const { data: bookings = [], isLoading } = useGetMyBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const onOpen = useCallback(
    (b: Booking) => navigation.navigate(ROUTES.BOOKING_DETAILS, { bookingId: b.id }),
    [navigation],
  );

  return { bookings, isLoading, onOpen };
}
