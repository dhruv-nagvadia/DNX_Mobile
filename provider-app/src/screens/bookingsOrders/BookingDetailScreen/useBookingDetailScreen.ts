import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCollectBookingPaymentMutation,
  useGetAllMyBookingsQuery,
  useUpdateBookingStatusMutation,
} from '@/redux/api/business/businessApi';
import { BookingStatus } from '@/redux/api/business/types';
import { bookingNeedsCollection } from '@/utils/status';

import { BookingDetail, BookingDetailNavigationProp, BookingDetailRouteProp } from './types';

/** Server error message from an RTK Query rejection, if any. */
function serverMessage(err: unknown): string | undefined {
  return (err as { data?: { message?: string } } | undefined)?.data?.message;
}

function alertFailure(title: string, err: unknown) {
  Alert.alert(title, serverMessage(err) ?? 'Something went wrong. Please try again.');
}

/**
 * Single-booking view — same no-single-item-endpoint situation as orders,
 * same RTK Query dedupe against the list screen's `useGetAllMyBookingsQuery()`.
 *
 * Status machine (mirrors the backend's PROVIDER_TRANSITIONS):
 *   PENDING → CONFIRMED | CANCELLED
 *   CONFIRMED → IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW (no-show only after start)
 *   IN_PROGRESS → COMPLETED
 */
export function useBookingDetailScreen() {
  const route = useRoute<BookingDetailRouteProp>();
  const navigation = useNavigation<BookingDetailNavigationProp>();
  const { bookingId } = route.params;

  const { data: bookings, isLoading, isFetching, refetch } = useGetAllMyBookingsQuery();
  const booking = bookings?.find((b) => b.id === bookingId) as BookingDetail | undefined;

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [collectBookingPayment] = useCollectBookingPaymentMutation();
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showCollect, setShowCollect] = useState(false);

  /** PATCH the booking's status; surfaces the server's reason when it refuses. */
  const setStatus = useCallback(
    async (status: BookingStatus) => {
      if (!booking) {
        return;
      }
      setActionLoading(true);
      try {
        await updateBookingStatus({ id: booking.provider.id, bookingId: booking.id, status }).unwrap();
      } catch (err) {
        alertFailure('Could not update booking', err);
      }
      setActionLoading(false);
    },
    [booking, updateBookingStatus],
  );

  const confirm = useCallback(() => setStatus('CONFIRMED'), [setStatus]);
  const start = useCallback(() => setStatus('IN_PROGRESS'), [setStatus]);
  const complete = useCallback(() => setStatus('COMPLETED'), [setStatus]);
  const markNoShow = useCallback(() => setStatus('NO_SHOW'), [setStatus]);

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
    try {
      await updateBookingStatus({
        id: booking.provider.id,
        bookingId: booking.id,
        status: 'CANCELLED',
        reason: reason.trim() || undefined,
      }).unwrap();
    } catch (err) {
      alertFailure('Could not cancel booking', err);
    }
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
    try {
      await collectBookingPayment({ id: booking.provider.id, bookingId: booking.id }).unwrap();
    } catch (err) {
      alertFailure('Could not record payment', err);
    }
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
    start,
    complete,
    markNoShow,
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
