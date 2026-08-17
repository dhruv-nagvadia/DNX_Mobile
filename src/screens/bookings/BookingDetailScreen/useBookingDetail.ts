import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCancelBookingMutation,
  useCreatePaymentLinkMutation,
  useCreateReviewMutation,
  useGetMyBookingsQuery,
  useSimulatePaymentMutation,
  useSyncPaymentMutation,
} from '@/redux/api/booking/bookingApi';
import { ROUTES } from '@/navigation/routes';

import { BookingDetailNavigationProp, BookingDetailRouteProp } from './types';

/** One booking's detail, read from the cached list, plus its actions. */
export function useBookingDetail() {
  const navigation = useNavigation<BookingDetailNavigationProp>();
  const { params } = useRoute<BookingDetailRouteProp>();

  const { data: bookings = [], isLoading, refetch } = useGetMyBookingsQuery();
  const booking = bookings.find((b) => b.id === params.bookingId) ?? null;

  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();
  const [createPaymentLink, { isLoading: linking }] = useCreatePaymentLinkMutation();
  const [simulatePayment, { isLoading: simulating }] = useSimulatePaymentMutation();
  const [syncPayment] = useSyncPaymentMutation();
  const awaitingPayment = useRef(false);

  // On returning to the app (e.g. from the Razorpay page), reconcile the payment.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') return;
      if (awaitingPayment.current) {
        syncPayment({ bookingId: params.bookingId }).catch(() => {});
      }
      refetch();
    });
    return () => sub.remove();
  }, [refetch, syncPayment, params.bookingId]);

  // Stop reconciling once it's paid.
  useEffect(() => {
    if (booking?.paymentStatus === 'PAID') awaitingPayment.current = false;
  }, [booking?.paymentStatus]);

  const onPay = useCallback(async () => {
    if (!booking) return;
    try {
      const res = await createPaymentLink({ bookingId: booking.id }).unwrap();
      if (res.simulated) {
        await simulatePayment({ bookingId: booking.id }).unwrap();
        Alert.alert('Payment successful', 'Your booking is paid and confirmed.');
      } else if (res.url) {
        awaitingPayment.current = true;
        await Linking.openURL(res.url);
        Alert.alert('Complete your payment', 'Finish paying in your browser — it updates here once confirmed.');
      }
    } catch {
      Alert.alert('Payment failed', 'Please try again.');
    }
  }, [booking, createPaymentLink, simulatePayment]);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const onCancel = useCallback(() => {
    if (!booking) return;
    Alert.alert('Cancel booking?', `Cancel your appointment at ${booking.provider.businessName}?`, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelBooking({ id: booking.id, providerId: booking.provider.id }).unwrap();
          } catch {
            Alert.alert('Could not cancel', 'Please try again.');
          }
        },
      },
    ]);
  }, [booking, cancelBooking]);

  const onReschedule = useCallback(() => {
    if (!booking) return;
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: booking.provider.id,
      name: booking.provider.businessName,
      rescheduleBookingId: booking.id,
      rescheduleServiceId: booking.service.id,
    });
  }, [booking, navigation]);

  const onRemind = useCallback(() => {
    if (!booking) return;
    navigation.navigate(ROUTES.ADD_REMINDER, {
      prefillTitle: `${booking.provider.businessName} — next ${booking.service.name}`,
      prefillType: 'appointment',
      providerId: booking.provider.id,
    });
  }, [booking, navigation]);

  const openReview = useCallback(() => {
    setRating(5);
    setComment('');
    setReviewOpen(true);
  }, []);
  const closeReview = useCallback(() => setReviewOpen(false), []);

  const submitReview = useCallback(async () => {
    if (!booking) return;
    try {
      await createReview({
        bookingId: booking.id,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();
      setReviewOpen(false);
    } catch {
      Alert.alert('Could not submit', 'Please try again.');
    }
  }, [booking, rating, comment, createReview]);

  return {
    booking,
    isLoading,
    cancelling,
    onCancel,
    onReschedule,
    onRemind,
    onPay,
    paying: linking || simulating,
    reviewOpen,
    openReview,
    closeReview,
    rating,
    setRating,
    comment,
    setComment,
    submitReview,
    submittingReview,
  };
}
