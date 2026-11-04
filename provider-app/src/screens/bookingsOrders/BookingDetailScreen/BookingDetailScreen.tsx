import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CalendarX,
  Check,
  Clock,
  CreditCard,
  IndianRupee,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Store,
  Wallet,
  X,
} from 'lucide-react-native';

import { ActionModal } from '@/components/ActionModal';
import { EmptyState } from '@/components/EmptyState';
import { BookingStatus, PaymentMethod } from '@/redux/api/business/types';
import { Color, Spacing } from '@/utils/Theme';
import { INK, LINK, PAGE_BG, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { serviceIcon } from '@/utils/serviceIcon';
import { paymentBadge } from '@/utils/status';

import { useBookingDetailScreen } from './useBookingDetailScreen';
import { BookingDetail } from './types';
import { styles } from './styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const COLLECT_GREEN = PILL.green.fg;

/** Status pill colours/labels — same mapping as the Bookings list. */
const STATUS_PILL: Record<BookingStatus, { label: string; colors: PillColors }> = {
  PENDING: { label: 'New request', colors: PILL.lavender },
  CONFIRMED: { label: 'Confirmed', colors: PILL.blue },
  IN_PROGRESS: { label: 'In progress', colors: PILL.teal },
  COMPLETED: { label: 'Completed', colors: PILL.green },
  CANCELLED: { label: 'Cancelled', colors: PILL.grey },
  NO_SHOW: { label: 'No-show', colors: PILL.red },
};

const STEPS = ['New', 'Confirmed', 'In progress', 'Completed'];
const STEP_INDEX: Partial<Record<BookingStatus, number>> = {
  PENDING: 0,
  CONFIRMED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
};

const METHOD_COPY: Record<PaymentMethod, { title: string; chip: string }> = {
  CASH: { title: 'Cash at the salon', chip: 'COD' },
  ONLINE: { title: 'Paid online', chip: 'Online' },
  PARTIAL: { title: 'Partial – deposit online', chip: 'Partial' },
};

// ── Date helpers ────────────────────────────────────────────────────────

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function toDate(iso?: string | null): Date | null {
  if (!iso) {
    return null;
  }
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "10:00 AM". */
function formatTime(d: Date): string {
  const h = d.getHours();
  return `${h % 12 || 12}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "Today" / "Tomorrow" / "Yesterday" / "Nov 15" (+ year when not this year). */
function dayLabel(d: Date): string {
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
  if (diff === 0) {
    return 'Today';
  }
  if (diff === 1) {
    return 'Tomorrow';
  }
  if (diff === -1) {
    return 'Yesterday';
  }
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return d.getFullYear() === new Date().getFullYear() ? base : `${base}, ${d.getFullYear()}`;
}

/** "today at 8:12 AM" / "on Nov 15 at 8:12 AM". */
function atPhrase(d: Date): string {
  const day = dayLabel(d);
  const relative = day === 'Today' || day === 'Tomorrow' || day === 'Yesterday';
  return `${relative ? day.toLowerCase() : `on ${day}`} at ${formatTime(d)}`;
}

/** "Today 8:12 AM" — activity timestamps. */
function stampLabel(d: Date): string {
  return `${dayLabel(d)} ${formatTime(d)}`;
}

/** "Today, 10:00 – 10:45 AM" (meridiem shown once when both share it). */
function slotLabel(startIso: string, endIso: string): string {
  const s = toDate(startIso);
  const e = toDate(endIso);
  if (!s) {
    return '';
  }
  if (!e) {
    return `${dayLabel(s)}, ${formatTime(s)}`;
  }
  const sameMeridiem = s.getHours() < 12 === e.getHours() < 12;
  const startText = sameMeridiem ? formatTime(s).replace(/ (AM|PM)$/, '') : formatTime(s);
  return `${dayLabel(s)}, ${startText} – ${formatTime(e)}`;
}

/** Service length — the service's duration, else the booked slot length. */
function durationMin(b: BookingDetail): number | undefined {
  if (b.service.durationMin) {
    return b.service.durationMin;
  }
  const mins = Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000);
  return Number.isFinite(mins) && mins > 0 ? mins : undefined;
}

// ── Payment helpers ─────────────────────────────────────────────────────

/** Payment pill — meaning from the shared `paymentBadge`, recoloured like the Bookings list. */
function paymentPill(b: BookingDetail, due: number): { label: string; colors: PillColors } {
  const badge = paymentBadge({
    status: b.status,
    paymentStatus: b.paymentStatus,
    paymentMethod: b.paymentMethod,
    amountMinor: b.amountMinor,
    amountPaidMinor: b.amountPaidMinor,
    currency: b.currency,
  });
  switch (b.paymentStatus) {
    case 'REFUNDED':
      return { label: badge.label, colors: PILL.lavender };
    case 'PAID':
      return { label: badge.label, colors: PILL.green };
    case 'PARTIAL':
      return { label: badge.label, colors: PILL.blue };
    case 'FAILED':
      return { label: 'Payment failed', colors: PILL.red };
  }
  if (b.paymentMethod === 'CASH') {
    const live = b.status !== 'CANCELLED' && b.status !== 'NO_SHOW';
    return {
      label: live && due > 0 ? `Cash · ${formatMoney(due, b.currency)} due` : 'Cash',
      colors: PILL.grey,
    };
  }
  return { label: badge.label, colors: PILL.yellow };
}

function openMaps(b: BookingDetail) {
  const hasCoords = b.serviceLat != null && b.serviceLng != null;
  const coords = `${b.serviceLat},${b.serviceLng}`;
  const query = hasCoords ? coords : encodeURIComponent(b.serviceAddressLine ?? '');
  let url: string;
  if (Platform.OS === 'ios') {
    url = `maps:?q=${query}`;
  } else {
    url = hasCoords ? `geo:${coords}?q=${coords}` : `geo:0,0?q=${query}`;
  }
  Linking.openURL(url).catch(() => Alert.alert('Could not open Maps', 'No maps app is available.'));
}

// ── Small pieces ────────────────────────────────────────────────────────

function StatusPill({ status }: { status: BookingStatus }) {
  const { label, colors } = STATUS_PILL[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: colors.bg }]}>
      {status === 'IN_PROGRESS' && <View style={[styles.statusDot, { backgroundColor: colors.fg }]} />}
      <Text style={[styles.statusPillText, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Stepper({ booking: b }: { booking: BookingDetail }) {
  const current = STEP_INDEX[b.status] ?? 0;
  let caption: string;
  if (b.status === 'PENDING') {
    caption = 'Accept the booking to confirm the slot.';
  } else if (b.status === 'CONFIRMED') {
    caption = 'Next: start the service when the customer arrives.';
  } else if (b.status === 'IN_PROGRESS') {
    const started = toDate(b.startedAt);
    caption = started
      ? `Started at ${formatTime(started)} — complete it when you're done.`
      : "Service in progress — complete it when you're done.";
  } else {
    const settled = toDate(b.settledAt);
    caption = settled ? `Completed ${atPhrase(settled)}.` : 'Completed.';
  }

  return (
    <View style={[styles.card, styles.stepperCard]}>
      <View style={styles.stepsRow}>
        {STEPS.map((label, i) => {
          const done = i <= current;
          const isCurrent = i === current;
          return (
            <View key={label} style={styles.step}>
              <View style={styles.stepTrack}>
                <View
                  style={[
                    styles.stepLine,
                    i === 0 && styles.stepLineHidden,
                    i > 0 && i <= current && styles.stepLineDone,
                  ]}
                />
                <View style={[styles.stepCircle, done && styles.stepCircleDone]}>
                  {done && <Check size={16} color={Color.white} strokeWidth={3} />}
                </View>
                <View
                  style={[
                    styles.stepLine,
                    i === STEPS.length - 1 && styles.stepLineHidden,
                    i < current && styles.stepLineDone,
                  ]}
                />
              </View>
              <Text
                style={[styles.stepLabel, done && styles.stepLabelDone, isCurrent && styles.stepLabelCurrent]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.stepCaption}>{caption}</Text>
    </View>
  );
}

function ClosedNote({ booking: b }: { booking: BookingDetail }) {
  const noShow = b.status === 'NO_SHOW';
  return (
    <View style={[styles.closedNote, noShow ? styles.closedNoteRed : styles.closedNoteGrey]}>
      {noShow ? (
        <CalendarX size={22} color={PILL.red.fg} strokeWidth={2} />
      ) : (
        <X size={22} color={INK} strokeWidth={2.2} />
      )}
      <View style={styles.flex}>
        <Text style={[styles.closedTitle, noShow && styles.closedTitleRed]}>
          {noShow ? 'Customer marked as no-show' : 'This booking was cancelled'}
        </Text>
        {!!b.cancelReason && <Text style={styles.closedReason}>Reason: {b.cancelReason}</Text>}
      </View>
    </View>
  );
}

type ActivityItem = { key: string; title: string; time?: string; state: 'done' | 'pending' | 'closed' };

function activityItems(b: BookingDetail): ActivityItem[] {
  const stamp = (iso?: string | null) => {
    const d = toDate(iso);
    return d ? stampLabel(d) : undefined;
  };
  const items: ActivityItem[] = [
    { key: 'booked', title: 'Booked', time: stamp(b.createdAt), state: 'done' },
  ];
  const closed = b.status === 'CANCELLED' || b.status === 'NO_SHOW';
  const confirmed =
    b.status === 'CONFIRMED' ||
    b.status === 'IN_PROGRESS' ||
    b.status === 'COMPLETED' ||
    b.status === 'NO_SHOW' ||
    !!b.confirmedAt;
  const started = b.status === 'IN_PROGRESS' || !!b.startedAt;

  if (closed) {
    if (confirmed) {
      items.push({ key: 'confirmed', title: 'Confirmed by you', time: stamp(b.confirmedAt), state: 'done' });
    }
    if (started) {
      items.push({ key: 'started', title: 'Service started', time: stamp(b.startedAt), state: 'done' });
    }
    items.push({
      key: 'closed',
      title: b.status === 'NO_SHOW' ? 'Marked no-show' : `Cancelled${b.cancelReason ? ` — ${b.cancelReason}` : ''}`,
      time: stamp(b.settledAt),
      state: 'closed',
    });
    return items;
  }

  items.push({
    key: 'confirmed',
    title: 'Confirmed by you',
    time: confirmed ? stamp(b.confirmedAt) : undefined,
    state: confirmed ? 'done' : 'pending',
  });
  // A confirmed booking may be completed directly — skip "started" if it never was.
  if (!(b.status === 'COMPLETED' && !started)) {
    items.push({
      key: 'started',
      title: 'Service started',
      time: started ? stamp(b.startedAt) : undefined,
      state: started ? 'done' : 'pending',
    });
  }
  const completed = b.status === 'COMPLETED';
  items.push({
    key: 'completed',
    title: 'Completed',
    time: completed ? stamp(b.settledAt) : undefined,
    state: completed ? 'done' : 'pending',
  });
  return items;
}

function Activity({ booking }: { booking: BookingDetail }) {
  const items = activityItems(booking);
  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Clock size={24} color={INK} strokeWidth={1.8} />
        <Text style={styles.cardTitle}>Activity</Text>
      </View>
      <View style={styles.timeline}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <View key={it.key} style={styles.tlRow}>
              <View style={styles.tlRail}>
                <View
                  style={[
                    styles.tlDot,
                    it.state === 'done' && styles.tlDotDone,
                    it.state === 'closed' && styles.tlDotClosed,
                  ]}
                >
                  {it.state === 'done' && <Check size={13} color={Color.white} strokeWidth={3} />}
                  {it.state === 'closed' && <X size={13} color={Color.white} strokeWidth={3} />}
                </View>
                {!last && <View style={styles.tlLine} />}
              </View>
              <View style={[styles.tlBody, last && styles.tlBodyLast]}>
                <Text
                  style={[
                    styles.tlTitle,
                    it.state === 'pending' && styles.tlTitlePending,
                    it.state === 'closed' && styles.tlTitleClosed,
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

function PayRow({ label, value, valueStyle }: { label: string; value: string; valueStyle?: StyleProp<TextStyle> }) {
  return (
    <View style={styles.payRow}>
      <Text style={styles.payLabel}>{label}</Text>
      <Text style={[styles.payValue, valueStyle]}>{value}</Text>
    </View>
  );
}

type BtnTone = 'primary' | 'danger' | 'neutral' | 'collect';

const BTN_FG: Record<BtnTone, string> = {
  primary: Color.white,
  danger: Color.error,
  neutral: INK,
  collect: COLLECT_GREEN,
};

function ActionButton({
  label,
  tone,
  Icon,
  busy,
  disabled,
  half,
  onPress,
}: {
  label: string;
  tone: BtnTone;
  Icon: typeof Check;
  busy: boolean;
  disabled?: boolean;
  half?: boolean;
  onPress: () => void;
}) {
  const fg = disabled ? Color.placeholder : BTN_FG[tone];
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        tone === 'primary' && styles.btnPrimary,
        tone === 'danger' && styles.btnDanger,
        tone === 'neutral' && styles.btnNeutral,
        tone === 'collect' && styles.btnCollect,
        disabled && styles.btnDisabled,
        half && styles.flex,
      ]}
      disabled={busy || disabled}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: busy || disabled }}
    >
      {busy && tone === 'primary' ? (
        <ActivityIndicator size="small" color={Color.white} />
      ) : (
        <>
          <Icon size={20} color={fg} strokeWidth={2.2} />
          <Text style={[styles.btnText, { color: fg }]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────

export default function BookingDetailScreen() {
  const {
    booking,
    isLoading,
    refreshing,
    refresh,
    actionLoading,
    confirm,
    start,
    complete,
    markNoShow,
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
  const insets = useSafeAreaInsets();

  const backButton = (
    <TouchableOpacity
      style={styles.backBtn}
      onPress={goBack}
      hitSlop={BACK_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
    </TouchableOpacity>
  );

  if (!booking) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          {backButton}
          <View style={styles.headerText}>
            <Text style={styles.title}>Booking</Text>
          </View>
        </View>
        {!isLoading && (
          <EmptyState icon={<CalendarClock size={48} color={Color.placeholder} strokeWidth={1.4} />} title="Booking not found" />
        )}
      </View>
    );
  }

  const b = booking;
  const created = toDate(b.createdAt);
  const closed = b.status === 'CANCELLED' || b.status === 'NO_SHOW';
  const paid = b.amountPaidMinor ?? 0;
  const due = b.amountMinor - paid;
  const discount = b.discountMinor ?? 0;
  const travelFee = b.travelFeeMinor ?? 0;
  const servicePrice = b.amountMinor + discount - travelFee;
  const refunded = b.paymentStatus === 'REFUNDED';
  const showDue = due > 0 && !closed && !refunded;
  const method = METHOD_COPY[b.paymentMethod ?? 'ONLINE'];
  const pay = paymentPill(b, due);

  const ServiceIcon = serviceIcon(b.service.name);
  const mins = durationMin(b);
  const phone = b.user.phone?.trim();
  const initial = b.user.fullName.trim().charAt(0).toUpperCase() || '?';
  const hasLocation = !!b.serviceAddressLine || (b.serviceLat != null && b.serviceLng != null);

  // The server only accepts NO_SHOW on a confirmed booking whose start time has passed.
  const startPassed = new Date(b.startTime).getTime() <= Date.now();
  const canNoShow = b.status === 'CONFIRMED' && startPassed;
  const showNoShow = b.status === 'PENDING' || b.status === 'CONFIRMED';
  let noShowCaption: string | null = null;
  if (showNoShow && !startPassed) {
    noShowCaption = 'No-show is available after the start time.';
  } else if (b.status === 'PENDING' && startPassed) {
    noShowCaption = 'Accept the booking to be able to mark a no-show.';
  }
  const hasStatusActions = b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS';
  const showBar = hasStatusActions || needsCollect;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        {backButton}
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            #{b.id.slice(-6).toUpperCase()}
          </Text>
          {created && (
            <Text style={styles.subtitle} numberOfLines={1}>
              Booked {atPhrase(created)}
            </Text>
          )}
        </View>
        <StatusPill status={b.status} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          !showBar && { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {closed ? <ClosedNote booking={b} /> : <Stepper booking={b} />}

        {/* Appointment */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <CalendarDays size={24} color={INK} strokeWidth={1.8} />
            <Text style={styles.cardTitle} numberOfLines={1}>
              {slotLabel(b.startTime, b.endTime)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconBox}>
              <ServiceIcon size={30} color={PILL.lavender.fg} strokeWidth={1.8} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.serviceName} numberOfLines={2}>
                {b.service.name}
              </Text>
              {!!mins && <Text style={styles.muted}>{mins} min</Text>}
              {!!b.provider?.businessName && (
                <View style={styles.inlineRow}>
                  <Store size={16} color={Color.textSecondary} strokeWidth={1.8} />
                  <Text style={styles.muted} numberOfLines={1}>
                    {b.provider.businessName}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.servicePrice}>{formatMoney(servicePrice, b.currency)}</Text>
          </View>
        </View>

        {/* Home visit */}
        {hasLocation && (
          <View style={styles.card}>
            <View style={styles.visitRow}>
              <MapPin size={24} color={INK} strokeWidth={1.8} />
              <View style={styles.flex}>
                <Text style={styles.cardTitleSm}>Home visit</Text>
                <Text style={styles.body}>{b.serviceAddressLine || 'Pinned location'}</Text>
                {travelFee > 0 && (
                  <Text style={styles.muted}>Travel fee {formatMoney(travelFee, b.currency)}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.mapsBtn}
                onPress={() => openMaps(b)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <MapIcon size={18} color={LINK} strokeWidth={2} />
                <Text style={styles.mapsBtnText}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Customer */}
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.customerName} numberOfLines={1}>
                {b.user.fullName}
              </Text>
              {!!phone && <Text style={styles.customerPhone}>{phone}</Text>}
            </View>
            {!!phone && (
              <>
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => Linking.openURL(`tel:${phone}`).catch(() => undefined)}
                  accessibilityRole="button"
                  accessibilityLabel="Call customer"
                >
                  <Phone size={22} color={INK} strokeWidth={1.9} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => Linking.openURL(`sms:${phone}`).catch(() => undefined)}
                  accessibilityRole="button"
                  accessibilityLabel="Message customer"
                >
                  <MessageSquare size={22} color={INK} strokeWidth={1.9} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Wallet size={24} color={INK} strokeWidth={1.8} />
            <Text style={styles.cardTitleSm} numberOfLines={1}>
              {method.title}
            </Text>
            <View style={styles.methodChip}>
              <Text style={styles.methodChipText}>{method.chip}</Text>
            </View>
          </View>
          <View style={styles.payRows}>
            <PayRow label="Service price" value={formatMoney(servicePrice, b.currency)} />
            {discount > 0 && (
              <PayRow
                label={b.couponCode ? `Discount (${b.couponCode})` : 'Discount'}
                value={`−${formatMoney(discount, b.currency)}`}
                valueStyle={styles.payValueGreen}
              />
            )}
            {travelFee > 0 && <PayRow label="Travel fee" value={formatMoney(travelFee, b.currency)} />}
            <PayRow label="Paid" value={formatMoney(paid, b.currency)} />
            {refunded && <PayRow label="Refunded" value={formatMoney(paid, b.currency)} />}
            {showDue && (
              <View style={styles.dueRow}>
                <Text style={styles.dueText}>Due</Text>
                <Text style={styles.dueText}>{formatMoney(due, b.currency)}</Text>
              </View>
            )}
          </View>
          <View style={[styles.payPill, { backgroundColor: pay.colors.bg }]}>
            <CreditCard size={18} color={pay.colors.fg} strokeWidth={1.8} />
            <Text style={[styles.payPillText, { color: pay.colors.fg }]} numberOfLines={1}>
              {pay.label}
            </Text>
          </View>
        </View>

        <Activity booking={b} />
      </ScrollView>

      {showBar && (
        <View style={[styles.bar, { paddingBottom: insets.bottom + Spacing.sm }]}>
          {b.status === 'PENDING' && (
            <ActionButton label="Accept booking" tone="primary" Icon={Check} busy={actionLoading} onPress={confirm} />
          )}
          {b.status === 'CONFIRMED' && (
            <ActionButton label="Start service" tone="primary" Icon={Play} busy={actionLoading} onPress={start} />
          )}
          {b.status === 'IN_PROGRESS' && (
            <ActionButton label="Complete service" tone="primary" Icon={Check} busy={actionLoading} onPress={complete} />
          )}
          {showNoShow && (
            <View style={styles.barRow}>
              <ActionButton
                label={b.status === 'PENDING' ? 'Decline' : 'Cancel booking'}
                tone="danger"
                Icon={X}
                busy={actionLoading}
                half
                onPress={openCancel}
              />
              <ActionButton
                label="Mark no-show"
                tone="neutral"
                Icon={CalendarX}
                busy={actionLoading}
                disabled={!canNoShow}
                half
                onPress={markNoShow}
              />
            </View>
          )}
          {needsCollect && (
            <ActionButton
              label={`Collect ${formatMoney(due, b.currency)}`}
              tone="collect"
              Icon={IndianRupee}
              busy={actionLoading}
              onPress={openCollect}
            />
          )}
          {!!noShowCaption && <Text style={styles.barCaption}>{noShowCaption}</Text>}
        </View>
      )}

      <ActionModal
        visible={showCancel}
        title={b.status === 'PENDING' ? 'Decline this booking?' : 'Cancel this booking?'}
        message="Let the customer know why, if you want to."
        reasonValue={reason}
        onReasonChange={setReason}
        confirmLabel={b.status === 'PENDING' ? 'Confirm decline' : 'Confirm cancel'}
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
