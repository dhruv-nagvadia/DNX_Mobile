import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCancelBookingMutation,
  useCreatePaymentOrderMutation,
  useCreateReviewMutation,
  useGetMyBookingsQuery,
  useSimulatePaymentMutation,
  useSyncPaymentMutation,
  useVerifyPaymentMutation,
} from '@/redux/api/booking/bookingApi';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES } from '@/navigation/routes';

import { BookingDetailNavigationProp, BookingDetailRouteProp } from './types';

/** One booking's detail, read from the cached list, plus its actions. */
export function useBookingDetail() {
  const navigation = useNavigation<BookingDetailNavigationProp>();
  const { params } = useRoute<BookingDetailRouteProp>();

  const { data: bookings = [], isLoading, refetch } = useGetMyBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const booking = bookings.find((b) => b.id === params.bookingId) ?? null;

  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();
  const [createPaymentOrder, { isLoading: linking }] = useCreatePaymentOrderMutation();
  const [simulatePayment, { isLoading: simulating }] = useSimulatePaymentMutation();
  const [verifyPayment, { isLoading: verifying }] = useVerifyPaymentMutation();
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
      const order = await createPaymentOrder({ bookingId: booking.id }).unwrap();
      if (order.simulated) {
        await simulatePayment({ bookingId: booking.id }).unwrap();
        Alert.alert('Payment successful', 'Your booking is paid and confirmed.');
        return;
      }

      awaitingPayment.current = true;
      const result = await openRazorpayCheckout(order);
      if (!result) return; // user dismissed the checkout sheet

      await verifyPayment({
        bookingId: booking.id,
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      }).unwrap();
      Alert.alert('Payment successful', 'Your booking is paid and confirmed.');
    } catch {
      Alert.alert('Payment failed', 'Please try again.');
    }
  }, [booking, createPaymentOrder, simulatePayment, verifyPayment]);

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

  const onCallProvider = useCallback(() => {
    if (!booking?.provider.phone) return;
    Linking.openURL(`tel:${booking.provider.phone}`).catch(() => {
      Alert.alert('Could not call', 'Please dial the number manually.');
    });
  }, [booking]);

  const openProvider = useCallback(() => {
    if (!booking) return;
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: booking.provider.id,
      name: booking.provider.businessName,
    });
  }, [booking, navigation]);

  // Straight to booking the same service again — no reschedule of the old
  // booking involved, just pre-selects the service on a fresh visit.
  const onBookAgain = useCallback(() => {
    if (!booking) return;
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: booking.provider.id,
      name: booking.provider.businessName,
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
    onBookAgain,
    onRemind,
    onCallProvider,
    openProvider,
    onPay,
    paying: linking || simulating || verifying,
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
