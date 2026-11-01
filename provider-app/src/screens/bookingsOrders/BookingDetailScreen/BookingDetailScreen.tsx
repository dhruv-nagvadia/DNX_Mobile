import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CalendarClock } from 'lucide-react-native';

import { ActionModal } from '@/components/ActionModal';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { bookingStatusBadge, paymentBadge } from '@/utils/status';

import { useBookingDetailScreen } from './useBookingDetailScreen';
import { styles } from './styles';

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });

export default function BookingDetailScreen() {
  const {
    booking,
    isLoading,
    refreshing,
    refresh,
    actionLoading,
    confirm,
    complete,
    needsCollect,
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
    goBack,
  } = useBookingDetailScreen();

  if (!booking) {
    return (
      <View style={styles.root}>
        <AppHeader title="Booking" onBack={goBack} />
        {!isLoading && (
          <EmptyState icon={<CalendarClock size={48} color={Color.placeholder} strokeWidth={1.4} />} title="Booking not found" />
        )}
      </View>
    );
  }

  const statusInfo = bookingStatusBadge(booking.status);
  const payInfo = paymentBadge({
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    paymentMethod: booking.paymentMethod,
    amountMinor: booking.amountMinor,
    amountPaidMinor: booking.amountPaidMinor,
    currency: booking.currency,
  });
  const due = booking.amountMinor - (booking.amountPaidMinor ?? 0);

  return (
    <View style={styles.root}>
      <AppHeader title={booking.provider.businessName} onBack={goBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.main}>
              <Text style={styles.serviceName}>{booking.service.name}</Text>
              <Text style={styles.meta}>
                {booking.user.fullName}
                {booking.user.phone ? ` · ${booking.user.phone}` : ''}
              </Text>
              <Text style={styles.meta}>
                {dateFmt.format(new Date(booking.startTime))} – {timeFmt.format(new Date(booking.endTime))}
              </Text>
            </View>
            <View style={styles.statusStack}>
              <StatusBadge label={statusInfo.label} tone={statusInfo.tone} cutRight />
              <StatusBadge label={payInfo.label} tone={payInfo.tone} cutRight />
            </View>
          </View>
          {!!booking.cancelReason && <Text style={styles.note}>Cancelled: {booking.cancelReason}</Text>}
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.meta}>Amount</Text>
            <Text style={styles.summaryValue}>{formatMoney(booking.amountMinor, booking.currency)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.meta}>Paid</Text>
            <Text style={styles.summaryValue}>{formatMoney(booking.amountPaidMinor ?? 0, booking.currency)}</Text>
          </View>
          {due > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.meta}>Due</Text>
              <Text style={[styles.summaryValue, styles.summaryDue]}>{formatMoney(due, booking.currency)}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          {booking.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={actionLoading}
              onPress={confirm}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Confirm</Text>
            </TouchableOpacity>
          )}
          {booking.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={actionLoading}
              onPress={complete}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Complete</Text>
            </TouchableOpacity>
          )}
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              disabled={actionLoading}
              onPress={openCancel}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Cancel</Text>
            </TouchableOpacity>
          )}
          {needsCollect && (
            <TouchableOpacity style={styles.actionBtn} disabled={actionLoading} onPress={openCollect}>
              <Text style={styles.actionBtnText}>Collect {formatMoney(due, booking.currency)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <ActionModal
        visible={showCancel}
        title="Cancel this booking?"
        message="Let the customer know why, if you want to."
        reasonValue={reason}
        onReasonChange={setReason}
        confirmLabel="Confirm cancel"
        confirmTone="danger"
        loading={actionLoading}
        onConfirm={submitCancel}
        onCancel={closeCancel}
      />
      <ActionModal
        visible={showCollect}
        title="Mark as paid?"
        message="This marks the outstanding amount as collected in cash."
        confirmLabel="Mark paid"
        loading={actionLoading}
        onConfirm={submitCollect}
        onCancel={closeCollect}
      />
    </View>
  );
}
