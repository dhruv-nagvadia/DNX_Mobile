import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarClock, CircleX, RotateCcw, Share2 } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { isUpcomingBooking } from '@/utils/bookingStatus';
import { Color } from '@/utils/Theme';
import { INK, LINK } from '@/utils/modernTheme';

import { bookingRef, useBookingDetail } from './useBookingDetail';
import {
  AddressCard,
  AppointmentCard,
  BookAgainCard,
  BusinessCard,
  InfoStrip,
  NoteCard,
  PaymentCard,
  RateCard,
  StatusHero,
  YourReviewCard,
} from './parts';
import { styles } from './styles';

const RED = '#DC2626';

/** Full detail of a single booking + its actions. */
export default function BookingDetailScreen() {
  const insets = useSafeAreaInsets();
  const {
    booking,
    business,
    isLoading,
    cancelling,
    onCancel,
    onReschedule,
    onBookAgain,
    onRemind,
    onCallProvider,
    onDirections,
    onShare,
    openProvider,
    onPay,
    paying,
    rating,
    setRating,
    comment,
    setComment,
    submitReview,
    submittingReview,
    reviewComment,
    providerReply,
  } = useBookingDetail();

  if (!booking) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Booking details" />
        <View style={styles.center}>
          {isLoading ? (
            <ActivityIndicator color={Color.primary} />
          ) : (
            <Text style={styles.notFound}>This booking is no longer available.</Text>
          )}
        </View>
      </View>
    );
  }

  const upcoming = isUpcomingBooking(booking.status, booking.endTime);
  const canReview = booking.status === 'COMPLETED' && !booking.review;
  const canPay =
    booking.paymentStatus === 'PENDING' &&
    booking.paymentMethod !== 'CASH' &&
    booking.status !== 'CANCELLED';
  // Not once the service has started (the server rejects both then).
  const canChange = upcoming && booking.status !== 'IN_PROGRESS';
  // Server rule (cancelByCustomer): cancelling before the start time refunds
  // whatever was paid; from the start time on, nothing is refunded.
  const beforeStart = new Date(booking.startTime).getTime() > Date.now();
  const cancelNote =
    canChange && beforeStart
      ? booking.amountPaidMinor > 0
        ? 'Free cancellation until your slot starts — what you paid online is refunded.'
        : 'Free cancellation until your slot starts.'
      : null;

  const noShowText =
    booking.paymentMethod === 'CASH'
      ? 'You were marked as a no-show. Repeated no-shows may lead to charges or your account being blocked.'
      : booking.amountPaidMinor > 0
        ? "You were marked as a no-show. Your payment isn't refundable — reschedule next time instead of risking a no-show."
        : 'You were marked as a no-show.';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title="Booking details"
        subtitle={`Booking #${bookingRef(booking.id)}`}
        right={
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={onShare}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Share booking"
          >
            <Share2 size={19} color={INK} strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StatusHero booking={booking} upcoming={upcoming} />

        <BusinessCard
          booking={booking}
          business={business}
          onCall={onCallProvider}
          onDirections={onDirections}
          onView={openProvider}
        />

        <AppointmentCard booking={booking} />

        {/* On-location service — where the provider is coming to */}
        {!!booking.serviceAddressLine && <AddressCard address={booking.serviceAddressLine} />}

        <PaymentCard booking={booking} canPay={canPay} paying={paying} onPay={onPay} />

        {!!cancelNote && <InfoStrip text={cancelNote} />}

        {/* No-show — no refund if paid, just a warning if it was cash */}
        {booking.status === 'NO_SHOW' && <NoteCard title="No-show" text={noShowText} />}

        {(booking.status === 'CANCELLED' || booking.status === 'NO_SHOW') &&
          !!booking.cancelReason && (
            <NoteCard title="Provider’s note" text={booking.cancelReason} />
          )}

        {canReview && (
          <RateCard
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onSubmit={submitReview}
            submitting={submittingReview}
          />
        )}

        {booking.review && (
          <YourReviewCard
            rating={booking.review.rating}
            comment={reviewComment}
            reply={providerReply}
            businessName={booking.provider.businessName}
          />
        )}

        {booking.status === 'COMPLETED' && (
          <BookAgainCard onRebook={onBookAgain} onRemind={onRemind} />
        )}
      </ScrollView>

      {canChange ? (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.85}
            onPress={onReschedule}
            accessibilityRole="button"
          >
            <CalendarClock size={18} color={LINK} strokeWidth={2} />
            <Text style={styles.outlineText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineBtn, styles.outlineDanger, cancelling && styles.disabled]}
            activeOpacity={0.85}
            onPress={onCancel}
            disabled={cancelling}
            accessibilityRole="button"
            accessibilityState={{ busy: cancelling, disabled: cancelling }}
          >
            {cancelling ? (
              <ActivityIndicator color={RED} />
            ) : (
              <>
                <CircleX size={18} color={RED} strokeWidth={2} />
                <Text style={[styles.outlineText, styles.dangerText]}>Cancel booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : !upcoming ? (
        // Rebook any booking that's finished — completed, cancelled, no-show or past.
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={[styles.primaryBtn, styles.flex]}
            activeOpacity={0.85}
            onPress={onBookAgain}
            accessibilityRole="button"
            accessibilityLabel={`Rebook ${booking.service.name}`}
          >
            <RotateCcw size={18} color={Color.white} strokeWidth={2} />
            <Text style={styles.primaryText}>Rebook this service</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}
