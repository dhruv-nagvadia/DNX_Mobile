import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCancelBookingMutation,
  useCreateReviewMutation,
  useGetMyBookingsQuery,
} from '@/redux/api/booking/bookingApi';
import { ROUTES } from '@/navigation/routes';

import { BookingDetailNavigationProp, BookingDetailRouteProp } from './types';

/** One booking's detail, read from the cached list, plus its actions. */
export function useBookingDetail() {
  const navigation = useNavigation<BookingDetailNavigationProp>();
  const { params } = useRoute<BookingDetailRouteProp>();

  const { data: bookings = [], isLoading } = useGetMyBookingsQuery();
  const booking = bookings.find((b) => b.id === params.bookingId) ?? null;

  const [cancelBooking, { isLoading: cancelling }] = useCancelBookingMutation();
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();

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
