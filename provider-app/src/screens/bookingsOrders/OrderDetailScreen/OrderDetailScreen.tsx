import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  IndianRupee,
  MessageSquare,
  Package,
  Phone,
  ReceiptText,
  Wallet,
  X,
} from 'lucide-react-native';

import { ActionModal } from '@/components/ActionModal';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { BusinessOrder, BusinessOrderItem, OrderStatus } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { INK, LINK, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { orderNeedsCollection, orderOutstanding, orderStatusBadge, paymentBadge } from '@/utils/status';
import { formatAmount, priceLabel } from '@/utils/units';

import { useOrderDetailScreen } from './useOrderDetailScreen';
import { COLLECT_GREEN, styles } from './styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const STEPS = ['New', 'Confirmed', 'Ready', 'Completed'];

/** Status pill colours per the mockup. */
const STATUS_PILL: Record<OrderStatus, PillColors> = {
  PENDING: PILL.lavender,
  CONFIRMED: PILL.blue,
  READY: PILL.green,
  COMPLETED: PILL.grey,
  CANCELLED: PILL.grey,
  NO_SHOW: PILL.red,
};

/** Index of the live step in the New → Confirmed → Ready → Completed stepper. */
const STEP_INDEX: Partial<Record<OrderStatus, number>> = {
  PENDING: 0,
  CONFIRMED: 1,
  READY: 2,
  COMPLETED: 3,
};

const STEP_CAPTION: Partial<Record<OrderStatus, string>> = {
  PENDING: 'Confirm the order to start preparing it.',
  CONFIRMED: "Mark it ready when it's packed.",
  READY: 'Waiting for the customer to pick it up.',
};

const PAYMENT_METHOD: Record<BusinessOrder['paymentMethod'], { label: string; chip: string }> = {
  CASH: { label: 'Cash on pickup', chip: 'COD' },
  ONLINE: { label: 'Paid online', chip: 'Online' },
  PARTIAL: { label: 'Partial – deposit online', chip: 'Partial' },
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function parseDate(iso?: string | null): Date | null {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function timeOf(d: Date): string {
  const h = d.getHours();
  return `${h % 12 || 12}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

/** 0 = today, -1 = yesterday, … */
function dayOffset(d: Date): number {
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  return Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
}

/** "today at 10:42 AM" / "yesterday at 9:30 AM" / "on Oct 29 at 7:20 PM". */
function placedPhrase(d: Date): string {
  const off = dayOffset(d);
  const day = off === 0 ? 'today' : off === -1 ? 'yesterday' : `on ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return `${day} at ${timeOf(d)}`;
}

/** "Today 10:42 AM" / "Yesterday 9:30 AM" / "Oct 29, 7:20 PM". */
function stamp(iso?: string | null): string | undefined {
  const d = parseDate(iso);
  if (!d) {
    return undefined;
  }
  const off = dayOffset(d);
  if (off === 0) {
    return `Today ${timeOf(d)}`;
  }
  if (off === -1) {
    return `Yesterday ${timeOf(d)}`;
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${timeOf(d)}`;
}

function lineTotal(item: BusinessOrderItem): number {
  return Math.round((item.quantity / item.priceQty) * item.priceMinor);
}

/** "2 × ₹599 / 1 pc" for per-piece prices, "500 g × ₹200 / 100 g" otherwise. */
function quantityLabel(item: BusinessOrderItem, currency: string): string {
  const qty =
    item.measure === 'count' && item.priceQty === 1 ? `${item.quantity}` : formatAmount(item.quantity, item.measure);
  return `${qty} × ${priceLabel(item.priceMinor, item.priceQty, item.measure, currency)}`;
}

/** Payment pill — COD grey, Paid green, Part-paid blue, Refunded lavender. */
function paymentPill(o: BusinessOrder): { label: string; colors: PillColors } {
  const badge = paymentBadge({
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    amountMinor: o.amountMinor,
    amountPaidMinor: o.amountPaidMinor,
    refundedMinor: o.refundedMinor,
    currency: o.currency,
  });
  const due = orderOutstanding(o);
  const live = o.status !== 'CANCELLED' && o.status !== 'NO_SHOW';
  if (o.paymentStatus === 'REFUNDED' || (o.refundedMinor ?? 0) > 0) {
    return { label: badge.label, colors: PILL.lavender };
  }
  switch (o.paymentStatus) {
    case 'PAID':
      return { label: 'Paid', colors: PILL.green };
    case 'PARTIAL':
      return {
        label: live && due > 0 ? `Part-paid · ${formatMoney(due, o.currency)} due` : 'Part-paid',
        colors: PILL.blue,
      };
    case 'FAILED':
      return { label: badge.label, colors: PILL.red };
  }
  if (o.paymentMethod === 'CASH') {
    return {
      label: live && due > 0 ? `COD · ${formatMoney(due, o.currency)} due` : 'COD',
      colors: PILL.grey,
    };
  }
  return { label: badge.label, colors: PILL.yellow };
}

function Stepper({ order }: { order: BusinessOrder }) {
  const current = STEP_INDEX[order.status] ?? 0;
  const completed = order.status === 'COMPLETED';
  const pickedUp = parseDate(order.settledAt);
  const caption = completed
    ? pickedUp
      ? `Picked up ${placedPhrase(pickedUp)}.`
      : 'Picked up by the customer.'
    : STEP_CAPTION[order.status];

  return (
    <View style={styles.card}>
      <View style={styles.stepRow}>
        {STEPS.map((label, i) => {
          const done = i < current || completed;
          const active = i === current && !completed;
          return (
            <View key={label} style={styles.stepCol}>
              <View style={styles.stepTrack}>
                <View style={[styles.stepLine, i === 0 && styles.stepLineHidden, i <= current && styles.stepLineDone]} />
                {done ? (
                  <View style={[styles.stepDot, styles.stepDotFilled]}>
                    <Check size={16} color={Color.white} strokeWidth={3} />
                  </View>
                ) : active ? (
                  <View style={[styles.stepDot, styles.stepDotFilled]}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>
                ) : (
                  <View style={styles.stepDot} />
                )}
                <View
                  style={[
                    styles.stepLine,
                    i === STEPS.length - 1 && styles.stepLineHidden,
                    i < current && styles.stepLineDone,
                  ]}
                />
              </View>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]} numberOfLines={1}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>
      {!!caption && <Text style={styles.stepCaption}>{caption}</Text>}
    </View>
  );
}

interface ActivityItem {
  key: string;
  title: string;
  time?: string;
  state: 'done' | 'pending' | 'failed';
}

function activityFor(o: BusinessOrder): ActivityItem[] {
  const idx = STEP_INDEX[o.status];
  const items: ActivityItem[] = [{ key: 'placed', title: 'Order placed', time: stamp(o.createdAt), state: 'done' }];

  if (idx === undefined) {
    // Cancelled / no-show: show only the steps that actually happened, then the outcome.
    if (o.confirmedAt) {
      items.push({ key: 'confirmed', title: 'Confirmed', time: stamp(o.confirmedAt), state: 'done' });
    }
    if (o.readyAt) {
      items.push({ key: 'ready', title: 'Ready for pickup', time: stamp(o.readyAt), state: 'done' });
    }
    const outcome = o.status === 'NO_SHOW' ? 'No-show' : 'Cancelled';
    const when = stamp(o.settledAt);
    items.push({
      key: 'ended',
      title: o.cancelReason ? `${outcome} — ${o.cancelReason}` : outcome,
      time: when,
      state: 'failed',
    });
    return items;
  }

  items.push({
    key: 'confirmed',
    title: 'Confirmed',
    time: idx >= 1 ? stamp(o.confirmedAt) : undefined,
    state: idx >= 1 ? 'done' : 'pending',
  });
  items.push({
    key: 'ready',
    title: 'Ready for pickup',
    time: idx >= 2 ? stamp(o.readyAt) : undefined,
    state: idx >= 2 ? 'done' : 'pending',
  });
  items.push({
    key: 'picked',
    title: 'Picked up',
    time: idx >= 3 ? stamp(o.settledAt) : undefined,
    state: idx >= 3 ? 'done' : 'pending',
  });
  return items;
}

function Activity({ order }: { order: BusinessOrder }) {
  const items = activityFor(order);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeadRow}>
        <Clock size={24} color={INK} strokeWidth={2} />
        <Text style={styles.cardTitle}>Activity</Text>
      </View>
      <View style={styles.timeline}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <View key={it.key} style={styles.tlRow}>
              <View style={styles.tlRail}>
                {it.state === 'done' ? (
                  <View style={[styles.tlDot, styles.tlDotDone]}>
                    <Check size={13} color={Color.white} strokeWidth={3.2} />
                  </View>
                ) : it.state === 'failed' ? (
                  <View style={[styles.tlDot, styles.tlDotFailed]}>
                    <X size={13} color={Color.white} strokeWidth={3.2} />
                  </View>
                ) : (
                  <View style={styles.tlDotPending} />
                )}
                {!last && <View style={styles.tlLine} />}
              </View>
              <View style={[styles.tlBody, last && styles.tlBodyLast]}>
                <Text
                  style={[
                    styles.tlTitle,
                    it.state === 'pending' && styles.tlTitlePending,
                    it.state === 'failed' && styles.tlTitleFailed,
                  ]}
                >
                  {it.title}
                </Text>
                {!!it.time && <Text style={styles.tlTime}>{it.time}</Text>}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const {
    order,
    isLoading,
    refreshing,
    refresh,
    actionLoading,
    advance,
    collectNow,
    showCollect,
    openCollect,
    closeCollect,
    showCancel,
    reason,
    setReason,
    openCancel,
    closeCancel,
    submitCancel,
    goBack,
  } = useOrderDetailScreen();

  const backButton = (
    <TouchableOpacity
      style={styles.backBtn}
      onPress={goBack}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
    </TouchableOpacity>
  );

  if (!order) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          {backButton}
          <View style={styles.headerText}>
            <Text style={styles.title}>Order</Text>
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={LINK} />
        ) : (
          <EmptyState icon={<ReceiptText size={48} color={Color.placeholder} strokeWidth={1.4} />} title="Order not found" />
        )}
      </View>
    );
  }

  const statusLabel = orderStatusBadge(order.status).label;
  const placedAt = parseDate(order.createdAt);
  const isOver = order.status === 'CANCELLED' || order.status === 'NO_SHOW';
  const itemTotal = order.items.reduce((sum, i) => sum + lineTotal(i), 0);
  const discount = order.discountMinor ?? 0;
  const refunded = order.refundedMinor ?? 0;
  const due = orderOutstanding(order);
  const showDue = due > 0 && !isOver && order.paymentStatus !== 'REFUNDED';
  const needsCollect = orderNeedsCollection(order);
  const cancellable = order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'READY';
  const method = PAYMENT_METHOD[order.paymentMethod];
  const payPill = paymentPill(order);
  const phone = order.user.phone;
  const initial = order.user.fullName.trim().charAt(0).toUpperCase() || '?';

  const primary =
    order.status === 'PENDING'
      ? { label: 'Confirm order', next: 'CONFIRMED' as const, icon: Check }
      : order.status === 'CONFIRMED'
        ? { label: 'Mark ready', next: 'READY' as const, icon: Package }
        : order.status === 'READY'
          ? { label: 'Complete order', next: 'COMPLETED' as const, icon: Check }
          : null;
  const hasActions = !!primary || needsCollect || cancellable;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        {backButton}
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            #{order.id.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {placedAt ? `Placed ${placedPhrase(placedAt)}  •  Pickup` : 'Pickup'}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: STATUS_PILL[order.status].bg }]}>
          <Text style={[styles.statusPillText, { color: STATUS_PILL[order.status].fg }]} numberOfLines={1}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, !hasActions && { paddingBottom: insets.bottom + Spacing.lg }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {isOver ? (
          <View style={[styles.card, order.status === 'CANCELLED' ? styles.endedCardRed : styles.endedCardGrey]}>
            <Text style={[styles.endedTitle, order.status === 'CANCELLED' && styles.endedTitleRed]}>
              {order.status === 'CANCELLED' ? 'This order was cancelled' : "The customer didn't show up"}
            </Text>
            <Text style={styles.endedText}>{order.cancelReason || 'No reason given.'}</Text>
          </View>
        ) : (
          <Stepper order={order} />
        )}

        <View style={[styles.card, styles.customerCard]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.customerMain}>
            <Text style={styles.customerName} numberOfLines={1}>
              {order.user.fullName}
            </Text>
            {!!phone && <Text style={styles.customerPhone}>{phone}</Text>}
          </View>
          {!!phone && (
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Linking.openURL(`tel:${phone}`)}
              accessibilityRole="button"
              accessibilityLabel={`Call ${order.user.fullName}`}
            >
              <Phone size={22} color={LINK} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items ({order.items.length})</Text>
          {order.items.map((item, i) => (
            <View key={item.id} style={[styles.itemRow, i > 0 && styles.itemRowDivided]}>
              {item.product?.imageUrl ? (
                <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.itemImageFallback]}>
                  <Package size={22} color={Color.placeholder} />
                </View>
              )}
              <View style={styles.itemMain}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemMeta} numberOfLines={1}>
                  {quantityLabel(item, order.currency)}
                </Text>
              </View>
              <Text style={styles.itemTotal}>{formatMoney(lineTotal(item), order.currency)}</Text>
            </View>
          ))}

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Item total</Text>
              <Text style={styles.totalValue}>{formatMoney(itemTotal, order.currency)}</Text>
            </View>
            {discount > 0 && (
              <View style={[styles.totalRow, styles.totalRowDivided]}>
                <Text style={styles.totalLabel}>{order.couponCode ? `Discount (${order.couponCode})` : 'Discount'}</Text>
                <Text style={[styles.totalValue, styles.totalDiscount]}>
                  −{formatMoney(discount, order.currency)}
                </Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.totalRowDivided]}>
              <Text style={styles.totalLabel}>
                {order.paymentMethod === 'CASH' && order.amountPaidMinor > 0 ? 'Paid' : 'Paid online'}
              </Text>
              <Text style={styles.totalValue}>{formatMoney(order.amountPaidMinor, order.currency)}</Text>
            </View>
            {refunded > 0 && (
              <View style={[styles.totalRow, styles.totalRowDivided]}>
                <Text style={styles.totalLabel}>Refunded</Text>
                <Text style={styles.totalValue}>{formatMoney(refunded, order.currency)}</Text>
              </View>
            )}
            {showDue ? (
              <View style={styles.dueRow}>
                <Text style={styles.dueText}>Due at pickup</Text>
                <Text style={styles.dueText}>{formatMoney(due, order.currency)}</Text>
              </View>
            ) : (
              <View style={[styles.totalRow, styles.totalRowDivided]}>
                <Text style={styles.grandLabel}>Total</Text>
                <Text style={styles.grandLabel}>{formatMoney(order.amountMinor, order.currency)}</Text>
              </View>
            )}
          </View>
        </View>

        {!!order.note && (
          <View style={styles.card}>
            <View style={styles.noteBox}>
              <MessageSquare size={24} color={INK} strokeWidth={1.8} />
              <View style={styles.noteMain}>
                <Text style={styles.noteTitle}>Customer note</Text>
                <Text style={styles.noteText}>{order.note}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeadRow}>
            <Wallet size={24} color={INK} strokeWidth={1.8} />
            <Text style={styles.payMethod}>{method.label}</Text>
            <Pill label={method.chip} colors={PILL.grey} style={styles.methodChip} />
          </View>
          <Pill
            label={payPill.label}
            colors={payPill.colors}
            style={styles.payPill}
            icon={<CreditCard size={18} color={payPill.colors.fg} strokeWidth={1.8} />}
          />
        </View>

        <Activity order={order} />
      </ScrollView>

      {hasActions && (
        <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
          {primary && (
            <TouchableOpacity
              style={styles.primaryBtn}
              disabled={actionLoading}
              onPress={() => advance(primary.next)}
              accessibilityRole="button"
            >
              {actionLoading && !showCancel && !showCollect ? (
                <ActivityIndicator color={Color.white} />
              ) : (
                <>
                  <primary.icon size={22} color={Color.white} strokeWidth={2.4} />
                  <Text style={styles.primaryBtnText}>{primary.label}</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          {(needsCollect || cancellable) && (
            <View style={styles.secondaryRow}>
              {needsCollect && (
                <TouchableOpacity
                  style={[styles.outlineBtn, styles.outlineBtnCollect]}
                  disabled={actionLoading}
                  onPress={openCollect}
                  accessibilityRole="button"
                >
                  <IndianRupee size={20} color={COLLECT_GREEN} strokeWidth={2.4} />
                  <Text style={[styles.outlineBtnText, styles.outlineBtnTextCollect]} numberOfLines={1}>
                    Collect {formatMoney(due, order.currency)}
                  </Text>
                </TouchableOpacity>
              )}
              {cancellable && (
                <TouchableOpacity
                  style={[styles.outlineBtn, styles.outlineBtnDanger]}
                  disabled={actionLoading}
                  onPress={openCancel}
                  accessibilityRole="button"
                >
                  <X size={20} color={Color.error} strokeWidth={2.4} />
                  <Text style={[styles.outlineBtnText, styles.outlineBtnTextDanger]} numberOfLines={1}>
                    Cancel order
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      <ActionModal
        visible={showCancel}
        title="Cancel this order?"
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
        message={`This marks ${formatMoney(due, order.currency)} as collected in cash.`}
        confirmLabel="Mark paid"
        loading={actionLoading}
        onConfirm={collectNow}
        onCancel={closeCollect}
      />
    </View>
  );
}
