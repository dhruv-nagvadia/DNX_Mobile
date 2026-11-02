import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarDays, Wallet } from 'lucide-react-native';

import { ActionModal } from '@/components/ActionModal';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { BadgeTone } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { ACTION, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { bookingStatusBadge, orderStatusBadge, paymentBadge } from '@/utils/status';
import { DashboardBooking, BusinessOrder } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useBookingsOrdersScreen } from './useBookingsOrdersScreen';
import { StatusFilter } from './types';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BookingsOrdersScreen'>;

const BOOKING_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'NO_SHOW', label: 'No-show' },
];

const ORDER_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'New' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'READY', label: 'Ready' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'NO_SHOW', label: 'No-show' },
];

/** Status pill colours — Pending orange, Confirmed blue, Completed green (per mockup). */
const TONE_PILL: Record<BadgeTone, PillColors> = {
  warning: PILL.orange,
  accent: PILL.blue,
  success: PILL.green,
  neutral: PILL.grey,
  error: PILL.red,
  brand: PILL.lavender,
};

/** Payment pills are secondary info — only flag the states that need attention. */
const PAYMENT_PILL: Record<BadgeTone, PillColors> = {
  ...TONE_PILL,
  warning: PILL.yellow,
};

function lineTotal(item: BusinessOrder['items'][number]) {
  return (item.quantity / item.priceQty) * item.priceMinor;
}

export default function BookingsOrdersScreen() {
  const {
    tab,
    setTab,
    statusFilter,
    setStatusFilter,
    scoped,
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
    formatWhen,
  } = useBookingsOrdersScreen();
  const navigation = useNavigation<Nav>();

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
    const canCancel = b.status === 'PENDING' || b.status === 'CONFIRMED';

    return (
      <View key={b.id} style={styles.card}>
        <TouchableOpacity
          style={styles.cardBody}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: b.id })}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {b.user.fullName}
            </Text>
            <View style={styles.pillCol}>
              <Pill
                label={statusInfo.label}
                colors={TONE_PILL[statusInfo.tone]}
                style={styles.pillRight}
              />
              <Pill
                label={payInfo.label}
                colors={PAYMENT_PILL[payInfo.tone]}
                style={styles.pillRight}
              />
            </View>
          </View>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {b.service.name}
            {scoped ? '' : ` · ${b.provider.businessName}`}
          </Text>
          <Text style={styles.cardMeta}>
            {formatWhen(b.startTime)} • {formatMoney(b.amountMinor, b.currency)}
          </Text>
        </TouchableOpacity>

        {(canCancel || dueCollect) && (
          <View style={styles.actions}>
            {canCancel && (
              <View style={styles.actionsRow}>
                {b.status === 'PENDING' && (
                  <ActionButton
                    label="Confirm"
                    tone="primary"
                    busy={busy}
                    onPress={() => confirmBooking(b)}
                  />
                )}
                {b.status === 'CONFIRMED' && (
                  <ActionButton
                    label="Complete"
                    tone="primary"
                    busy={busy}
                    onPress={() => completeBooking(b)}
                  />
                )}
                <ActionButton
                  label="Cancel"
                  tone="danger"
                  busy={busy}
                  onPress={() => openCancelBooking(b)}
                />
              </View>
            )}
            {dueCollect && (
              <View style={styles.actionsRow}>
                <ActionButton
                  label={`Collect Payment · ${formatMoney(b.amountMinor - (b.amountPaidMinor ?? 0), b.currency)}`}
                  tone="outline"
                  icon={<Wallet size={18} color={ACTION} />}
                  busy={busy}
                  onPress={() => openCollectBooking(b)}
                />
              </View>
            )}
          </View>
        )}
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
    const preview = o.items
      .slice(0, 2)
      .map((i) => i.name)
      .join(', ');
    const more = o.items.length > 2 ? ` +${o.items.length - 2} more` : '';
    const total = o.items.reduce((sum, i) => sum + lineTotal(i), 0) || o.amountMinor;
    const canCancel = o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'READY';
    const dueCollect = orderNeedsCollection(o);

    return (
      <View key={o.id} style={styles.card}>
        <TouchableOpacity
          style={styles.cardBody}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: o.id })}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {scoped ? o.user.fullName : o.provider.businessName}
            </Text>
            <View style={styles.pillCol}>
              <Pill
                label={statusInfo.label}
                colors={TONE_PILL[statusInfo.tone]}
                style={styles.pillRight}
              />
              <Pill
                label={payInfo.label}
                colors={PAYMENT_PILL[payInfo.tone]}
                style={styles.pillRight}
              />
            </View>
          </View>
          {!scoped && (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {o.user.fullName}
            </Text>
          )}
          {!!preview && (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {preview}
              {more}
            </Text>
          )}
          <Text style={styles.cardMeta}>
            {formatWhen(o.createdAt)} • {formatMoney(total, o.currency)}
          </Text>
        </TouchableOpacity>

        {(canCancel || dueCollect) && (
          <View style={styles.actions}>
            {canCancel && (
              <View style={styles.actionsRow}>
                {o.status === 'PENDING' && (
                  <ActionButton
                    label="Confirm"
                    tone="primary"
                    busy={busy}
                    onPress={() => advanceOrder(o, 'CONFIRMED')}
                  />
                )}
                {o.status === 'CONFIRMED' && (
                  <ActionButton
                    label="Mark ready"
                    tone="primary"
                    busy={busy}
                    onPress={() => advanceOrder(o, 'READY')}
                  />
                )}
                {o.status === 'READY' && (
                  <ActionButton
                    label="Complete"
                    tone="primary"
                    busy={busy}
                    onPress={() => advanceOrder(o, 'COMPLETED')}
                  />
                )}
                <ActionButton
                  label="Cancel"
                  tone="danger"
                  busy={busy}
                  onPress={() => openCancelOrder(o)}
                />
              </View>
            )}
            {dueCollect && (
              <View style={styles.actionsRow}>
                <ActionButton
                  label={`Collect Payment · ${formatMoney(o.amountMinor - o.amountPaidMinor, o.currency)}`}
                  tone="outline"
                  icon={<Wallet size={18} color={ACTION} />}
                  busy={busy}
                  onPress={() => collectOrderNow(o)}
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const loading = tab === 'bookings' ? bookingsLoading : ordersLoading;
  const list = tab === 'bookings' ? bookings : orders;
  const filters = tab === 'bookings' ? BOOKING_FILTERS : ORDER_FILTERS;
  const activeFilterLabel = filters.find((f) => f.key === statusFilter)?.label;
  const noun = tab === 'bookings' ? 'bookings' : 'orders';
  const emptyTitle =
    statusFilter === 'ALL'
      ? `No ${noun} yet`
      : `No ${activeFilterLabel?.toLowerCase() ?? ''} ${noun}`;

  return (
    <View style={styles.root}>
      {scoped ? (
        <AppHeader variant="light" title={tab === 'bookings' ? 'Bookings' : 'Orders'} />
      ) : (
        <AppHeader variant="light" logo title="Bookings & Orders" />
      )}
      {!scoped && (
        <View style={styles.header}>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, tab === 'bookings' && styles.segmentBtnActive]}
              onPress={() => setTab('bookings')}
            >
              <Text style={[styles.segmentText, tab === 'bookings' && styles.segmentTextActive]}>
                Bookings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, tab === 'orders' && styles.segmentBtnActive]}
              onPress={() => setTab('orders')}
            >
              <Text style={[styles.segmentText, tab === 'orders' && styles.segmentTextActive]}>
                Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        {filters.map((f) => {
          const active = f.key === statusFilter;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setStatusFilter(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={refresh} />}
      >
        {list.length === 0 && !loading ? (
          <EmptyState
            icon={<CalendarDays size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title={emptyTitle}
          />
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
    </View>
  );
}

function ActionButton({
  label,
  tone,
  icon,
  busy,
  onPress,
}: {
  label: string;
  tone: 'primary' | 'danger' | 'outline';
  icon?: React.ReactNode;
  busy: boolean;
  onPress: () => void;
}) {
  const boxStyle =
    tone === 'primary'
      ? styles.btnPrimary
      : tone === 'danger'
        ? styles.btnDanger
        : styles.btnOutline;
  const textStyle =
    tone === 'primary'
      ? styles.btnTextPrimary
      : tone === 'danger'
        ? styles.btnTextDanger
        : styles.btnTextOutline;
  return (
    <TouchableOpacity
      style={[styles.btn, boxStyle, busy && styles.btnBusy]}
      disabled={busy}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      {busy && tone === 'primary' ? (
        <ActivityIndicator size="small" color={Color.white} />
      ) : (
        <>
          {icon}
          <Text style={[styles.btnText, textStyle]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
