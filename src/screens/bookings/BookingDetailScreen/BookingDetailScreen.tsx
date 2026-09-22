import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Star, BadgeCheck, ChevronRight, MapPin } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Color, FontWeight } from '@/utils/Theme';
import { STATUS_LABEL, statusColors, isUpcomingBooking, paymentSummary } from '@/utils/bookingStatus';

import { useBookingDetail } from './useBookingDetail';
import { styles } from './styles';

function formatPrice(minor: number | null, currency: string | null): string {
  if (minor == null) return '—';
  const amount = (minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** Full detail of a single booking + its actions. */
export default function BookingDetailScreen() {
  const {
    booking,
    isLoading,
    onCancel,
    onReschedule,
    onBookAgain,
    onRemind,
    openProvider,
    onPay,
    paying,
    reviewOpen,
    openReview,
    closeReview,
    rating,
    setRating,
    comment,
    setComment,
    submitReview,
    submittingReview,
  } = useBookingDetail();

  if (isLoading && !booking) {
    return (
      <View style={styles.container}>
        <AppHeader title="Booking" />
        <View style={styles.center}>
          <ActivityIndicator color={Color.primary} />
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <AppHeader title="Booking" />
        <View style={styles.center}>
          <Text style={styles.notFound}>This booking is no longer available.</Text>
        </View>
      </View>
    );
  }

  const [pillBg, pillColor] = statusColors(booking.status);
  const upcoming = isUpcomingBooking(booking.status, booking.endTime);
  const canReview = booking.status === 'COMPLETED' && !booking.review;
  const canPay =
    booking.paymentStatus === 'PENDING' &&
    booking.paymentMethod !== 'CASH' &&
    booking.status !== 'CANCELLED';
  const pay = paymentSummary(booking);

  return (
    <View style={styles.container}>
      <AppHeader title="Booking details" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary — tap to open the business */}
        <TouchableOpacity style={styles.summary} activeOpacity={0.85} onPress={openProvider}>
          <View style={styles.avatar}>
            {booking.provider.images && booking.provider.images.length > 0 ? (
              <Image source={{ uri: booking.provider.images[0] }} style={styles.avatarImg} />
            ) : (
              <CategoryIcon slug={booking.provider.category.slug} size={30} />
            )}
          </View>
          <Text style={styles.bizName}>{booking.provider.businessName}</Text>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <BadgeCheck size={13} color={Color.primaryDark} />
              <Text style={styles.chipText}>{booking.provider.category.name}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
              <Text style={[styles.statusText, { color: pillColor }]}>
                {STATUS_LABEL[booking.status]}
              </Text>
            </View>
          </View>
          <View style={styles.viewLink}>
            <Text style={styles.viewLinkText}>View business</Text>
            <ChevronRight size={14} color={Color.primary} />
          </View>
        </TouchableOpacity>

        {/* Details */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Service</Text>
            <Text style={styles.rowValue}>{booking.service.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>{formatDate(booking.startTime)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Duration</Text>
            <Text style={styles.rowValue}>{formatDuration(booking.service.durationMin)}</Text>
          </View>
        </View>

        {/* On-location service — where the provider is coming to */}
        {!!booking.serviceAddressLine && (
          <View>
            <Text style={styles.sectionTitle}>Address</Text>
            <View style={[styles.card, styles.addressCard]}>
              <View style={styles.addressIcon}>
                <MapPin size={18} color={Color.primary} />
              </View>
              <Text style={styles.addressText}>{booking.serviceAddressLine}</Text>
            </View>
          </View>
        )}

        {/* Payment receipt */}
        <View>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Method</Text>
              <Text style={styles.rowValue}>{pay.methodLabel}</Text>
            </View>
            {!!booking.travelFeeMinor && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Travel fee</Text>
                <Text style={styles.rowValue}>
                  {formatPrice(booking.travelFeeMinor, booking.currency)}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Total</Text>
              <Text style={styles.priceValue}>
                {formatPrice(booking.amountMinor, booking.currency)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Paid</Text>
              <Text style={styles.rowValue}>{formatPrice(pay.paid, booking.currency)}</Text>
            </View>
            {pay.due > 0 && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Due</Text>
                <Text style={[styles.rowValue, styles.dueValue]}>
                  {formatPrice(pay.due, booking.currency)}
                </Text>
              </View>
            )}
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.rowLabel}>Status</Text>
              <Text style={[styles.rowValue, { color: pay.color }]}>{pay.label}</Text>
            </View>
          </View>
        </View>

        {/* Pay now */}
        {canPay && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionPrimary]}
            activeOpacity={0.85}
            onPress={onPay}
            disabled={paying}
          >
            {paying ? (
              <ActivityIndicator color={Color.white} />
            ) : (
              <Text style={styles.actionPrimaryText}>
                {booking.paymentMethod === 'ONLINE'
                  ? `Pay ${formatPrice(booking.amountMinor, booking.currency)} now`
                  : 'Pay now'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Provider's cancel note */}
        {booking.status === 'CANCELLED' && !!booking.cancelReason && (
          <View>
            <Text style={styles.sectionTitle}>Provider’s note</Text>
            <View style={styles.reasonBox}>
              <Text style={styles.reasonText}>{booking.cancelReason}</Text>
            </View>
          </View>
        )}

        {/* Your review */}
        {booking.review && (
          <View>
            <Text style={styles.sectionTitle}>Your review</Text>
            <View style={[styles.reasonBox, styles.ratingRow]}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={18}
                  color={Color.warning}
                  fill={n <= (booking.review?.rating ?? 0) ? Color.warning : 'transparent'}
                />
              ))}
              <Text style={styles.ratingText}>{booking.review.rating}.0</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        {upcoming && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionGhost]}
              activeOpacity={0.85}
              onPress={onReschedule}
            >
              <Text style={styles.actionGhostText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionDanger]}
              activeOpacity={0.85}
              onPress={onCancel}
            >
              <Text style={styles.actionDangerText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {canReview && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionPrimary]}
            activeOpacity={0.85}
            onPress={openReview}
          >
            <Text style={styles.actionPrimaryText}>Leave a review</Text>
          </TouchableOpacity>
        )}

        {booking.status === 'COMPLETED' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionOutline]}
            activeOpacity={0.85}
            onPress={onBookAgain}
          >
            <Text style={styles.actionOutlineText}>Book again</Text>
          </TouchableOpacity>
        )}

        {booking.status === 'COMPLETED' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionPrimary]}
            activeOpacity={0.85}
            onPress={onRemind}
          >
            <Text style={styles.actionPrimaryText}>Remind me to book again later</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Review modal */}
      <Modal visible={reviewOpen} transparent animationType="fade" onRequestClose={closeReview}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rate your visit</Text>
            <Text style={styles.modalSub}>{booking.provider.businessName}</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
                  <Star
                    size={34}
                    color={Color.warning}
                    fill={n <= rating ? Color.warning : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share a few words (optional)"
              placeholderTextColor={Color.placeholder}
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={1000}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.actionGhost]}
                activeOpacity={0.85}
                onPress={closeReview}
                disabled={submittingReview}
              >
                <Text style={styles.actionGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.actionPrimary]}
                activeOpacity={0.85}
                onPress={submitReview}
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <ActivityIndicator color={Color.white} />
                ) : (
                  <Text style={[styles.actionPrimaryText, { fontWeight: FontWeight.bold }]}>
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
