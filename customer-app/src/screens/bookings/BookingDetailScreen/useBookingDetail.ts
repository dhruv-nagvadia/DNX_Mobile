import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking, Share } from 'react-native';
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
import {
  useGetProviderByIdQuery,
  useGetProviderReviewsQuery,
} from '@/redux/api/provider/providerApi';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';
import { ROUTES } from '@/navigation/routes';

import { BookingDetailNavigationProp, BookingDetailRouteProp } from './types';

/** Short reference shown for a booking — there's no booking number, so the id's tail. */
export function bookingRef(id: string): string {
  return id.slice(-6).toUpperCase();
}

/** One booking's detail, read from the cached list, plus its actions. */
export function useBookingDetail() {
  const navigation = useNavigation<BookingDetailNavigationProp>();
  const { params } = useRoute<BookingDetailRouteProp>();

  const { data: bookings = [], isLoading, refetch } = useGetMyBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const booking = bookings.find((b) => b.id === params.bookingId) ?? null;

  // The booking only carries a slim provider; the full business adds the
  // photo, rating, city, verified tick and coordinates for the business card.
  const providerId = booking?.provider.id ?? '';
  const { data: business } = useGetProviderByIdQuery({ id: providerId }, { skip: !providerId });
  // The booking's review is just { id, rating } — its comment and the
  // business's reply come from the business's review list.
  const reviewId = booking?.review?.id;
  const { data: reviews } = useGetProviderReviewsQuery(providerId, {
    skip: !providerId || !reviewId,
    refetchOnMountOrArgChange: true,
  });
  const fullReview = reviewId ? reviews?.find((r) => r.id === reviewId) ?? null : null;

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
      if (s !== 'active') {return;}
      if (awaitingPayment.current) {
        syncPayment({ bookingId: params.bookingId }).catch(() => {});
      }
      refetch();
    });
    return () => sub.remove();
  }, [refetch, syncPayment, params.bookingId]);

  // Stop reconciling once it's paid.
  useEffect(() => {
    if (booking?.paymentStatus === 'PAID') {awaitingPayment.current = false;}
  }, [booking?.paymentStatus]);

  const onPay = useCallback(async () => {
    if (!booking) {return;}
    try {
      const order = await createPaymentOrder({ bookingId: booking.id }).unwrap();
      if (order.simulated) {
        await simulatePayment({ bookingId: booking.id }).unwrap();
        Alert.alert('Payment successful', 'Your booking is paid. The provider will confirm it shortly.');
        return;
      }

      awaitingPayment.current = true;
      const result = await openRazorpayCheckout(order);
      if (!result) {return;} // user dismissed the checkout sheet

      await verifyPayment({
        bookingId: booking.id,
        razorpayOrderId: result.razorpay_order_id,
        razorpayPaymentId: result.razorpay_payment_id,
        razorpaySignature: result.razorpay_signature,
      }).unwrap();
      Alert.alert('Payment successful', 'Your booking is paid. The provider will confirm it shortly.');
    } catch {
      Alert.alert('Payment failed', 'Please try again.');
    }
  }, [booking, createPaymentOrder, simulatePayment, verifyPayment]);

  // Inline "Rate your visit" form: no star picked until the customer taps one.
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // What was just submitted, shown until the business's review list catches up.
  const [submittedComment, setSubmittedComment] = useState<string | null>(null);

  const onCancel = useCallback(() => {
    if (!booking) {return;}
    // Cancelling after the appointment's own start time forfeits the
    // payment, same as a no-show — warn before they confirm, not after.
    const isPastStart = new Date(booking.startTime).getTime() <= Date.now();
    const message =
      isPastStart && booking.amountPaidMinor > 0
        ? `Your appointment at ${booking.provider.businessName} has already started. Cancelling now won't be refunded — are you sure?`
        : `Cancel your appointment at ${booking.provider.businessName}?`;
    Alert.alert('Cancel booking?', message, [
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
    if (!booking) {return;}
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: booking.provider.id,
      name: booking.provider.businessName,
      rescheduleBookingId: booking.id,
      rescheduleServiceId: booking.service.id,
    });
  }, [booking, navigation]);

  const onDirections = useCallback(() => {
    if (!booking) {return;}
    const address = business
      ? [business.addressLine, business.city, [business.state, business.postalCode].filter(Boolean).join(' ')]
          .filter(Boolean)
          .join(', ')
      : '';
    const destination =
      business?.latitude != null && business.longitude != null
        ? `${business.latitude},${business.longitude}`
        : encodeURIComponent(address || booking.provider.businessName);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination}`).catch(() => {
      Alert.alert('Could not open maps', 'Please try again.');
    });
  }, [booking, business]);

  const onShare = useCallback(() => {
    if (!booking) {return;}
    const when = new Date(booking.startTime).toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    Share.share({
      message: `${booking.service.name} at ${booking.provider.businessName} — ${when}\nBooking #${bookingRef(booking.id)} on DNX.`,
    }).catch(() => undefined);
  }, [booking]);

  const onCallProvider = useCallback(() => {
    if (!booking?.provider.phone) {return;}
    Linking.openURL(`tel:${booking.provider.phone}`).catch(() => {
      Alert.alert('Could not call', 'Please dial the number manually.');
    });
  }, [booking]);

  const openProvider = useCallback(() => {
    if (!booking) {return;}
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: booking.provider.id,
      name: booking.provider.businessName,
    });
  }, [booking, navigation]);

  // Straight to booking the same service again — no reschedule of the old
  // booking involved, just pre-selects the service on a fresh visit.
  const onBookAgain = useCallback(() => {
    if (!booking) {return;}
    navigation.navigate(ROUTES.PROVIDER_DETAILS, {
      providerId: booking.provider.id,
      name: booking.provider.businessName,
      rescheduleServiceId: booking.service.id,
    });
  }, [booking, navigation]);

  const onRemind = useCallback(() => {
    if (!booking) {return;}
    navigation.navigate(ROUTES.ADD_REMINDER, {
      prefillTitle: `${booking.provider.businessName} — next ${booking.service.name}`,
      prefillType: 'appointment',
      providerId: booking.provider.id,
    });
  }, [booking, navigation]);

  const submitReview = useCallback(async () => {
    if (!booking || rating < 1) {return;}
    const text = comment.trim();
    try {
      await createReview({
        bookingId: booking.id,
        rating,
        comment: text || undefined,
      }).unwrap();
      setSubmittedComment(text);
      setComment('');
      // The refetched booking now carries the review's id, which starts a
      // fresh load of the business's reviews (comment + any reply).
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
    business,
    reviewComment: fullReview?.comment ?? submittedComment,
    providerReply: fullReview?.providerReply ?? null,
    onDirections,
    onShare,
    rating,
    setRating,
    comment,
    setComment,
    submitReview,
    submittingReview,
  };
}
