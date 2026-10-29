import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ActionModal } from '@/components/ActionModal';
import { StatusBadge } from '@/components/StatusBadge';
import { formatMoney } from '@/utils/money';
import { bookingStatusBadge, orderStatusBadge, paymentBadge } from '@/utils/status';
import { DashboardBooking, BusinessOrder } from '@/redux/api/business/types';

import { useBookingsOrdersScreen } from './useBookingsOrdersScreen';
import { styles } from './styles';

function lineTotal(item: BusinessOrder['items'][number]) {
  return (item.quantity / item.priceQty) * item.priceMinor;
}

export default function BookingsOrdersScreen() {
  const {
    tab,
    setTab,
    bookings,
    orders,
    bookingsLoading,
    ordersLoading,
    refreshing,
    refresh,
    actingId,
    confirmBooking,
    completeBooking,
    collectBookingDue,
    openCancelBooking,
    openCollectBooking,
    advanceOrder,
    collectOrderNow,
    orderNeedsCollection,
    openCancelOrder,
    pending,
    reason,
    setReason,
    closeModal,
    submitModal,
    dateFmt,
  } = useBookingsOrdersScreen();

  const renderBooking = (b: DashboardBooking) => {
    const statusInfo = bookingStatusBadge(b.status);
    const payInfo = paymentBadge({
      status: b.status,
      paymentStatus: b.paymentStatus,
      paymentMethod: b.paymentMethod,
      amountMinor: b.amountMinor,
      amountPaidMinor: b.amountPaidMinor,
      currency: b.currency,
    });
    const busy = actingId === b.id;
    const dueCollect = collectBookingDue(b);

    return (
      <View key={b.id} style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardMain}>
            <Text style={styles.cardTitle}>{b.service.name}</Text>
            <Text style={styles.cardSubtitle}>
              {b.user.fullName} · {b.provider.businessName}
            </Text>
            <Text style={styles.cardSubtitle}>{dateFmt.format(new Date(b.startTime))}</Text>
          </View>
          <View style={styles.badgeRow}>
            <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amount}>{formatMoney(b.amountMinor, b.currency)}</Text>
          <StatusBadge label={payInfo.label} tone={payInfo.tone} />
        </View>

        <View style={styles.actionsRow}>
          {b.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={busy}
              onPress={() => confirmBooking(b)}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Confirm</Text>
            </TouchableOpacity>
          )}
          {b.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={busy}
              onPress={() => completeBooking(b)}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Complete</Text>
            </TouchableOpacity>
          )}
          {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              disabled={busy}
              onPress={() => openCancelBooking(b)}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Cancel</Text>
            </TouchableOpacity>
          )}
          {dueCollect && (
            <TouchableOpacity style={styles.actionBtn} disabled={busy} onPress={() => openCollectBooking(b)}>
              <Text style={styles.actionBtnText}>
                Collect {formatMoney(b.amountMinor - (b.amountPaidMinor ?? 0), b.currency)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderOrder = (o: BusinessOrder) => {
    const statusInfo = orderStatusBadge(o.status);
    const payInfo = paymentBadge({
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      amountMinor: o.amountMinor,
      amountPaidMinor: o.amountPaidMinor,
      refundedMinor: o.refundedMinor,
      currency: o.currency,
    });
    const busy = actingId === o.id;
    const preview = o.items.slice(0, 2).map((i) => i.name).join(', ');
    const more = o.items.length > 2 ? ` +${o.items.length - 2} more` : '';
    const total = o.items.reduce((sum, i) => sum + lineTotal(i), 0) || o.amountMinor;

    return (
      <View key={o.id} style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardMain}>
            <Text style={styles.cardTitle}>{o.provider.businessName}</Text>
            <Text style={styles.cardSubtitle}>{o.user.fullName}</Text>
            <Text style={styles.cardSubtitle}>{dateFmt.format(new Date(o.createdAt))}</Text>
          </View>
          <View style={styles.badgeRow}>
            <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
          </View>
        </View>

        {!!preview && (
          <Text style={styles.itemsPreview}>
            {preview}
            {more}
          </Text>
        )}

        <View style={styles.amountRow}>
          <Text style={styles.amount}>{formatMoney(total, o.currency)}</Text>
          <StatusBadge label={payInfo.label} tone={payInfo.tone} />
        </View>

        <View style={styles.actionsRow}>
          {o.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={busy}
              onPress={() => advanceOrder(o, 'CONFIRMED')}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Confirm</Text>
            </TouchableOpacity>
          )}
          {o.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={busy}
              onPress={() => advanceOrder(o, 'READY')}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Mark ready</Text>
            </TouchableOpacity>
          )}
          {o.status === 'READY' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={busy}
              onPress={() => advanceOrder(o, 'COMPLETED')}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Complete</Text>
            </TouchableOpacity>
          )}
          {(o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'READY') && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              disabled={busy}
              onPress={() => openCancelOrder(o)}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Cancel</Text>
            </TouchableOpacity>
          )}
          {orderNeedsCollection(o) && (
            <TouchableOpacity style={styles.actionBtn} disabled={busy} onPress={() => collectOrderNow(o)}>
              <Text style={styles.actionBtnText}>
                Collect {formatMoney(o.amountMinor - o.amountPaidMinor, o.currency)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const loading = tab === 'bookings' ? bookingsLoading : ordersLoading;
  const list = tab === 'bookings' ? bookings : orders;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings & Orders</Text>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, tab === 'bookings' && styles.segmentBtnActive]}
            onPress={() => setTab('bookings')}
          >
            <Text style={[styles.segmentText, tab === 'bookings' && styles.segmentTextActive]}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, tab === 'orders' && styles.segmentBtnActive]}
            onPress={() => setTab('orders')}
          >
            <Text style={[styles.segmentText, tab === 'orders' && styles.segmentTextActive]}>Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={refresh} />}
      >
        {list.length === 0 && !loading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              {tab === 'bookings' ? 'No bookings yet.' : 'No orders yet.'}
            </Text>
          </View>
        ) : tab === 'bookings' ? (
          bookings.map(renderBooking)
        ) : (
          orders.map(renderOrder)
        )}
      </ScrollView>

      <ActionModal
        visible={!!pending}
        title={pending?.kind === 'collectBooking' ? 'Mark as paid?' : 'Cancel this?'}
        message={
          pending?.kind === 'collectBooking'
            ? 'This marks the outstanding amount as collected in cash.'
            : 'Let the customer know why, if you want to.'
        }
        reasonValue={pending?.kind === 'collectBooking' ? undefined : reason}
        onReasonChange={pending?.kind === 'collectBooking' ? undefined : setReason}
        confirmLabel={pending?.kind === 'collectBooking' ? 'Mark paid' : 'Confirm cancel'}
        confirmTone={pending?.kind === 'collectBooking' ? 'default' : 'danger'}
        onConfirm={submitModal}
        onCancel={closeModal}
      />
    </SafeAreaView>
  );
}
