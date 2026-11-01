import { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCollectBookingPaymentMutation,
  useGetAllMyBookingsQuery,
  useUpdateBookingStatusMutation,
} from '@/redux/api/business/businessApi';
import { bookingNeedsCollection } from '@/utils/status';

import { BookingDetailNavigationProp, BookingDetailRouteProp } from './types';

/**
 * Single-booking view — same no-single-item-endpoint situation as orders,
 * same RTK Query dedupe against the list screen's `useGetAllMyBookingsQuery()`.
 */
export function useBookingDetailScreen() {
  const route = useRoute<BookingDetailRouteProp>();
  const navigation = useNavigation<BookingDetailNavigationProp>();
  const { bookingId } = route.params;

  const { data: bookings, isLoading, isFetching, refetch } = useGetAllMyBookingsQuery();
  const booking = bookings?.find((b) => b.id === bookingId);

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [collectBookingPayment] = useCollectBookingPaymentMutation();
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showCollect, setShowCollect] = useState(false);

  const confirm = useCallback(async () => {
    if (!booking) {
      return;
    }
    setActionLoading(true);
    await updateBookingStatus({ id: booking.provider.id, bookingId: booking.id, status: 'CONFIRMED' })
      .unwrap()
      .catch(() => undefined);
    setActionLoading(false);
  }, [booking, updateBookingStatus]);

  const complete = useCallback(async () => {
    if (!booking) {
      return;
    }
    setActionLoading(true);
    await updateBookingStatus({ id: booking.provider.id, bookingId: booking.id, status: 'COMPLETED' })
      .unwrap()
      .catch(() => undefined);
    setActionLoading(false);
  }, [booking, updateBookingStatus]);

  const openCancel = useCallback(() => {
    setReason('');
    setShowCancel(true);
  }, []);
  const closeCancel = useCallback(() => setShowCancel(false), []);

  const submitCancel = useCallback(async () => {
    if (!booking) {
      return;
    }
    setActionLoading(true);
    await updateBookingStatus({
      id: booking.provider.id,
      bookingId: booking.id,
      status: 'CANCELLED',
      reason: reason.trim() || undefined,
    })
      .unwrap()
      .catch(() => undefined);
    setActionLoading(false);
    setShowCancel(false);
  }, [booking, reason, updateBookingStatus]);

  const openCollect = useCallback(() => setShowCollect(true), []);
  const closeCollect = useCallback(() => setShowCollect(false), []);
  const submitCollect = useCallback(async () => {
    if (!booking) {
      return;
    }
    setActionLoading(true);
    await collectBookingPayment({ id: booking.provider.id, bookingId: booking.id }).unwrap().catch(() => undefined);
    setActionLoading(false);
    setShowCollect(false);
  }, [booking, collectBookingPayment]);

  return {
    booking,
    isLoading,
    refreshing: isFetching,
    refresh: refetch,
    actionLoading,
    confirm,
    complete,
    needsCollect: booking ? bookingNeedsCollection(booking) : false,
    showCancel,
    reason,
    setReason,
    openCancel,
    closeCancel,
    submitCancel,
    showCollect,
    openCollect,
    closeCollect,
    submitCollect,
    goBack: () => navigation.goBack(),
  };
}
