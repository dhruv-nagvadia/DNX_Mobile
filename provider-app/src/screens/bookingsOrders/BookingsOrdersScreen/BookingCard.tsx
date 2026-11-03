import React from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  CalendarDays,
  CalendarX,
  Check,
  CircleCheck,
  CreditCard,
  IndianRupee,
  Phone,
  Play,
  User,
  X,
} from 'lucide-react-native';

import { BookingStatus, DashboardBooking } from '@/redux/api/business/types';
import { Color } from '@/utils/Theme';
import { INK, LINK, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { paymentBadge } from '@/utils/status';
import { serviceIcon } from '@/utils/serviceIcon';

import { bookingOutstanding, shortOrderId } from './useBookingsOrdersScreen';
import { COLLECT_GREEN, styles } from './styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

/** Status pill per the Bookings mockup. */
const STATUS_PILL: Record<BookingStatus, { label: string; colors: PillColors }> = {
  PENDING: { label: 'New request', colors: PILL.lavender },
  CONFIRMED: { label: 'Confirmed', colors: PILL.blue },
  IN_PROGRESS: { label: 'In progress', colors: PILL.teal },
  COMPLETED: { label: 'Completed', colors: PILL.green },
  CANCELLED: { label: 'Cancelled', colors: PILL.grey },
  NO_SHOW: { label: 'No-show', colors: PILL.red },
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** "10:00 AM". */
function formatTime(d: Date): string {
  const h = d.getHours();
  return `${h % 12 || 12}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "Today, 10:00 AM" / "Tomorrow, …" / "Yesterday, …" / "Nov 15, 10:00 AM". */
function formatBookingWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
  const day =
    diffDays === 0
      ? 'Today'
      : diffDays === 1
        ? 'Tomorrow'
        : diffDays === -1
          ? 'Yesterday'
          : `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return `${day}, ${formatTime(d)}`;
}

/** Service length — the service's duration, else the booked slot length. */
function durationMin(b: DashboardBooking): number | undefined {
  if (b.service.durationMin) {
    return b.service.durationMin;
  }
  const mins = Math.round((new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000);
  return Number.isFinite(mins) && mins > 0 ? mins : undefined;
}

/**
 * Payment pill — meaning from the shared `paymentBadge`, recoloured to the
 * mockup: Cash grey ("Cash · ₹699 due"), Paid green, Part-paid blue,
 * Refunded lavender.
 */
function bookingPaymentPill(b: DashboardBooking): {
  label: string;
  colors: PillColors;
  paid: boolean;
} {
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
      return { label: 'Refunded', colors: PILL.lavender, paid: false };
    case 'PAID':
      return { label: 'Paid', colors: PILL.green, paid: true };
    case 'PARTIAL':
      return { label: badge.label, colors: PILL.blue, paid: false };
    case 'FAILED':
      return { label: badge.label, colors: PILL.red, paid: false };
  }
  if (b.paymentMethod === 'CASH') {
    const due = bookingOutstanding(b);
    const live = b.status !== 'CANCELLED' && b.status !== 'NO_SHOW';
    return {
      label: live && due > 0 ? `Cash · ${formatMoney(due, b.currency)} due` : 'Cash',
      colors: PILL.grey,
      paid: false,
    };
  }
  return { label: badge.label, colors: PILL.yellow, paid: false };
}

function BookingPill({
  label,
  colors,
  icon,
  dot,
  style,
}: {
  label: string;
  colors: PillColors;
  icon?: React.ReactNode;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.oPill, styles.bPill, { backgroundColor: colors.bg }, style]}>
      {dot && <View style={[styles.bDot, { backgroundColor: colors.fg }]} />}
      {icon}
      <Text style={[styles.oPillText, styles.bPillText, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

type ButtonTone = 'primary' | 'danger' | 'neutral' | 'collect';

const BUTTON_LOOK: Record<
  ButtonTone,
  { box: StyleProp<ViewStyle>; text: StyleProp<TextStyle>; fg: string }
> = {
  primary: { box: styles.oBtnPrimary, text: styles.oBtnTextPrimary, fg: Color.white },
  danger: { box: styles.oBtnDanger, text: styles.oBtnTextDanger, fg: Color.error },
  neutral: { box: styles.bBtnNeutral, text: styles.bBtnTextNeutral, fg: INK },
  collect: { box: styles.oBtnCollect, text: styles.oBtnTextCollect, fg: COLLECT_GREEN },
};

function BookingButton({
  label,
  tone,
  Icon,
  busy,
  disabled,
  onPress,
}: {
  label: string;
  tone: ButtonTone;
  Icon: typeof Check;
  busy: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const look = BUTTON_LOOK[tone];
  return (
    <TouchableOpacity
      style={[styles.oBtn, look.box, busy && styles.btnBusy, disabled && styles.bBtnDisabled]}
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
          <Icon size={20} color={look.fg} strokeWidth={2.2} />
          <Text style={[styles.oBtnText, look.text]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function BookingCard({
  booking: b,
  showBusiness,
  busy,
  needsCollection,
  onOpen,
  onSetStatus,
  onCancel,
  onCollect,
}: {
  booking: DashboardBooking;
  /** Tab root (all businesses): show which business the booking belongs to. */
  showBusiness: boolean;
  busy: boolean;
  needsCollection: boolean;
  onOpen: () => void;
  onSetStatus: (status: BookingStatus) => void;
  onCancel: () => void;
  onCollect: () => void;
}) {
  const status = STATUS_PILL[b.status];
  const pay = bookingPaymentPill(b);
  const phone = b.user.phone?.trim();
  const ServiceIcon = serviceIcon(b.service.name);
  const mins = durationMin(b);
  const meta = [mins ? `${mins} min` : null, `#${shortOrderId(b.id)}`]
    .filter(Boolean)
    .join('  •  ');
  const startedAt = b.status === 'IN_PROGRESS' && b.startedAt ? new Date(b.startedAt) : null;
  // The server only accepts NO_SHOW once the slot's start time has passed.
  const startPassed = new Date(b.startTime).getTime() <= Date.now();
  const collectLabel = `Collect ${formatMoney(bookingOutstanding(b), b.currency)}`;
  const hasStatusActions =
    b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS';

  return (
    <View style={styles.oCard}>
      <TouchableOpacity activeOpacity={0.7} onPress={onOpen} accessibilityRole="button">
        <View style={styles.oTop}>
          <CalendarDays size={24} color={INK} strokeWidth={1.8} style={styles.bCalIcon} />
          <View style={styles.oTopText}>
            <Text style={styles.bWhen} numberOfLines={1}>
              {formatBookingWhen(b.startTime)}
            </Text>
            <Text style={styles.oWhen} numberOfLines={1}>
              {meta}
            </Text>
          </View>
          <View style={styles.bStatusCol}>
            <BookingPill
              label={status.label}
              colors={status.colors}
              dot={b.status === 'IN_PROGRESS'}
            />
            {startedAt && !Number.isNaN(startedAt.getTime()) && (
              <Text style={styles.bStarted} numberOfLines={1}>
                started {formatTime(startedAt)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.oDivider} />

        <View style={styles.oRow}>
          <View style={[styles.oAvatar, styles.bServiceBox]}>
            <ServiceIcon size={22} color={PILL.lavender.fg} strokeWidth={1.8} />
          </View>
          <Text style={[styles.oName, styles.oRowText]} numberOfLines={1}>
            {b.service.name}
          </Text>
          <Text style={styles.bPrice} numberOfLines={1}>
            {formatMoney(b.amountMinor, b.currency)}
          </Text>
        </View>

        <View style={styles.oDivider} />

        <View style={styles.oRow}>
          <View style={styles.oAvatar}>
            <User size={22} color={INK} strokeWidth={1.8} />
          </View>
          <View style={styles.oRowText}>
            <Text style={styles.oName} numberOfLines={1}>
              {b.user.fullName}
            </Text>
            {!!phone && (
              <Text style={styles.oMeta} numberOfLines={1}>
                {phone}
              </Text>
            )}
            {showBusiness && (
              <Text style={styles.oBusiness} numberOfLines={1}>
                {b.provider.businessName}
              </Text>
            )}
          </View>
          {!!phone && (
            <TouchableOpacity
              style={[styles.oCallBtn, styles.bCallBtn]}
              onPress={() => Linking.openURL(`tel:${phone}`).catch(() => undefined)}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`Call ${b.user.fullName}`}
            >
              <Phone size={20} color={LINK} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.oDivider} />

        <BookingPill
          label={pay.label}
          colors={pay.colors}
          style={styles.bPayPill}
          icon={
            pay.paid ? (
              <CircleCheck size={18} color={pay.colors.fg} strokeWidth={2} />
            ) : (
              <CreditCard size={18} color={pay.colors.fg} strokeWidth={1.8} />
            )
          }
        />
      </TouchableOpacity>

      {(hasStatusActions || needsCollection) && (
        <View style={styles.oActions}>
          {b.status === 'PENDING' && (
            <View style={styles.actionsRow}>
              <BookingButton
                label="Accept"
                tone="primary"
                Icon={Check}
                busy={busy}
                onPress={() => onSetStatus('CONFIRMED')}
              />
              <BookingButton label="Decline" tone="danger" Icon={X} busy={busy} onPress={onCancel} />
            </View>
          )}
          {b.status === 'CONFIRMED' && (
            <View style={styles.actionsRow}>
              <BookingButton
                label="Start service"
                tone="primary"
                Icon={Play}
                busy={busy}
                onPress={() => onSetStatus('IN_PROGRESS')}
              />
              <BookingButton
                label="No-show"
                tone="neutral"
                Icon={CalendarX}
                busy={busy}
                disabled={!startPassed}
                onPress={() => onSetStatus('NO_SHOW')}
              />
            </View>
          )}
          {b.status === 'IN_PROGRESS' && (
            <View style={styles.actionsRow}>
              <BookingButton
                label="Complete"
                tone="primary"
                Icon={Check}
                busy={busy}
                onPress={() => onSetStatus('COMPLETED')}
              />
            </View>
          )}
          {needsCollection && (
            <View style={styles.actionsRow}>
              <BookingButton
                label={collectLabel}
                tone="collect"
                Icon={IndianRupee}
                busy={busy}
                onPress={onCollect}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
