import React, { ReactNode } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarX,
  Check,
  Clock,
  Hourglass,
  Info,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  Star,
  Store,
  Timer,
  Wallet,
  X,
} from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { GradientBackground } from '@/components/GradientBackground';
import { RemoteImage } from '@/components/RemoteImage';
import { Booking, BookingStatus } from '@/redux/api/booking/types';
import { Provider } from '@/redux/api/provider/types';
import { STATUS_LABEL, paymentSummary, statusColors } from '@/utils/bookingStatus';
import { Color } from '@/utils/Theme';
import { INK, LINK, TINT } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';

import { styles } from './styles';

const AMBER = '#F59E0B';
const RING = '#94A3B8';
export const REVIEW_MAX = 250;

// ── Formatting ──────────────────────────────────────────────────────────────
export function money(minor: number, currency: string | null): string {
  return formatMoney(minor, currency ?? 'INR');
}
function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
export function time(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase();
}
function duration(min: number): string {
  if (min < 60) {
    return `${min} min`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
function daysUntil(iso: string): number {
  const start = new Date(iso);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((start.getTime() - today.getTime()) / 86_400_000);
}

// ── Status hero ─────────────────────────────────────────────────────────────
type Tone = 'blue' | 'green' | 'red';
type StepState = 'done' | 'todo' | 'stopped';

const TONE = {
  blue: TINT.blue,
  green: TINT.mint,
  red: TINT.pink,
} as const;

function toneFor(status: BookingStatus): Tone {
  if (status === 'COMPLETED') {
    return 'green';
  }
  return status === 'CANCELLED' || status === 'NO_SHOW' ? 'red' : 'blue';
}

function headlineFor(b: Booking, upcoming: boolean): string {
  switch (b.status) {
    case 'PENDING':
      return upcoming ? 'Waiting for confirmation' : 'Never confirmed';
    case 'CONFIRMED': {
      if (!upcoming) {
        return 'Appointment time has passed';
      }
      const d = daysUntil(b.startTime);
      return d <= 0 ? 'See you today' : d === 1 ? 'See you tomorrow' : `See you in ${d} days`;
    }
    case 'IN_PROGRESS':
      return 'Your service is underway';
    case 'COMPLETED':
      return 'Hope you loved it!';
    case 'CANCELLED':
      return 'Booking cancelled';
    case 'NO_SHOW':
      return 'Marked as a no-show';
  }
}

const FLOW: { status: BookingStatus; label: string }[] = [
  { status: 'PENDING', label: 'Booked' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'IN_PROGRESS', label: 'In progress' },
  { status: 'COMPLETED', label: 'Completed' },
];

/**
 * The 4-step journey. A cancelled / no-show booking never finished it and we
 * don't know how far it got, so it shows just "Booked → Cancelled".
 */
function stepsFor(status: BookingStatus): { label: string; state: StepState }[] {
  if (status === 'CANCELLED' || status === 'NO_SHOW') {
    return [
      { label: 'Booked', state: 'done' },
      { label: STATUS_LABEL[status], state: 'stopped' },
    ];
  }
  const at = FLOW.findIndex((s) => s.status === status);
  return FLOW.map((s, i) => ({ label: s.label, state: i <= at ? 'done' : 'todo' }));
}

function Tracker({ status }: { status: BookingStatus }) {
  const steps = stepsFor(status);
  return (
    <View style={styles.tracker} accessibilityRole="progressbar" accessibilityLabel={`Booking ${STATUS_LABEL[status]}`}>
      {steps.map((s, i) => {
        const prevLit = s.state !== 'todo';
        const nextLit = i < steps.length - 1 && steps[i + 1].state !== 'todo';
        return (
          <View key={s.label} style={styles.step}>
            <View style={styles.stepDotRow}>
              {i > 0 && (
                <View style={[styles.stepLine, styles.stepLineLeft, prevLit && styles.stepLineDone]} />
              )}
              {i < steps.length - 1 && (
                <View style={[styles.stepLine, styles.stepLineRight, nextLit && styles.stepLineDone]} />
              )}
              {s.state === 'todo' ? (
                <View style={styles.stepTodo} />
              ) : (
                <View style={[styles.stepDone, s.state === 'stopped' && styles.stepStopped]}>
                  {s.state === 'stopped' ? (
                    <X size={14} color={Color.white} strokeWidth={3} />
                  ) : (
                    <Check size={14} color={Color.white} strokeWidth={3} />
                  )}
                </View>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                s.state === 'done' && styles.stepLabelDone,
                s.state === 'stopped' && styles.stepLabelStopped,
              ]}
              numberOfLines={1}
            >
              {s.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function StatusHero({ booking, upcoming }: { booking: Booking; upcoming: boolean }) {
  const tone = TONE[toneFor(booking.status)];
  const [, pillColor] = statusColors(booking.status);
  const stopped = booking.status === 'CANCELLED' || booking.status === 'NO_SHOW';
  const pillBg = stopped ? '#DC2626' : booking.status === 'CONFIRMED' ? LINK : pillColor;
  const PillIcon = stopped ? X : booking.status === 'PENDING' ? Clock : Check;
  const BigIcon =
    booking.status === 'COMPLETED'
      ? BadgeCheck
      : stopped
        ? CalendarX
        : booking.status === 'IN_PROGRESS'
          ? Hourglass
          : CalendarCheck;
  const when = `${shortDate(booking.startTime)} • ${time(booking.startTime)} – ${time(booking.endTime)}`;

  return (
    <View style={[styles.hero, { borderColor: tone.border }]}>
      <GradientBackground colors={[...tone.colors]} />
      <View style={styles.heroTop}>
        <View style={styles.heroText}>
          <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
            <PillIcon size={14} color={Color.white} strokeWidth={3} />
            <Text style={styles.statusPillText}>{STATUS_LABEL[booking.status]}</Text>
          </View>
          <Text style={styles.headline} accessibilityRole="header">
            {headlineFor(booking, upcoming)}
          </Text>
          <Text style={styles.whenLine}>{when}</Text>
        </View>
        <View style={styles.heroIcon} importantForAccessibility="no-hide-descendants">
          <BigIcon size={38} color={tone.icon} strokeWidth={1.8} />
        </View>
      </View>
      <Tracker status={booking.status} />
    </View>
  );
}

// ── Business card ───────────────────────────────────────────────────────────
interface BusinessCardProps {
  booking: Booking;
  business: Provider | undefined;
  onCall: () => void;
  onDirections: () => void;
  onView: () => void;
}

export function BusinessCard({ booking, business, onCall, onDirections, onView }: BusinessCardProps) {
  const p = booking.provider;
  const kind = business?.subcategory?.name ?? business?.category.name ?? p.category.name;
  const meta = [kind, business?.city].filter(Boolean).join(' • ');
  const actions = [
    { label: 'Call', Icon: Phone, onPress: onCall, hint: `Call ${p.businessName}` },
    { label: 'Directions', Icon: Navigation, onPress: onDirections, hint: 'Open directions in maps' },
    { label: 'View business', Icon: Store, onPress: onView, hint: `Open ${p.businessName}` },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.bizRow}>
        <View style={styles.bizPhoto}>
          <RemoteImage
            uris={[
              business?.images[0],
              p.images?.[0],
              business?.subcategory?.imageUrl,
              business?.category.imageUrl,
            ]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<CategoryIcon slug={p.category.slug} size={30} color={LINK} />}
          />
        </View>
        <View style={styles.bizInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.bizName} numberOfLines={1}>
              {p.businessName}
            </Text>
            {business?.isVerified && (
              <BadgeCheck
                size={18}
                color={Color.white}
                fill="#2563EB"
                strokeWidth={2}
                accessibilityLabel="Verified"
              />
            )}
          </View>
          {!!meta && (
            <Text style={styles.bizMeta} numberOfLines={1}>
              {meta}
            </Text>
          )}
          {!!business && business.ratingCount > 0 && (
            <View
              style={styles.ratingRow}
              accessible
              accessibilityLabel={`Rated ${business.ratingAvg.toFixed(1)} from ${business.ratingCount} reviews`}
            >
              <Star size={15} color={AMBER} fill={AMBER} />
              <Text style={styles.ratingValue}>{business.ratingAvg.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>
                ({business.ratingCount.toLocaleString('en-IN')})
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.quickRow}>
        {actions.map(({ label, Icon, onPress, hint }) => (
          <TouchableOpacity
            key={label}
            style={styles.quickBtn}
            onPress={onPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={hint}
          >
            <Icon size={19} color={LINK} strokeWidth={1.9} />
            <Text style={styles.quickText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Appointment ─────────────────────────────────────────────────────────────
export function AppointmentCard({ booking }: { booking: Booking }) {
  const rows: { label: string; value: string; icon: ReactNode }[] = [
    { label: 'Service', value: booking.service.name, icon: <Sparkles size={18} color={INK} strokeWidth={1.8} /> },
    { label: 'Duration', value: duration(booking.service.durationMin), icon: <Timer size={18} color={INK} strokeWidth={1.8} /> },
    { label: 'Date', value: longDate(booking.startTime), icon: <CalendarDays size={18} color={INK} strokeWidth={1.8} /> },
    { label: 'Time', value: time(booking.startTime), icon: <Clock size={18} color={INK} strokeWidth={1.8} /> },
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Appointment</Text>
      <View>
        {rows.map((r, i) => (
          <View
            key={r.label}
            style={[styles.infoRow, i > 0 && styles.infoRowDivider]}
            accessible
            accessibilityLabel={`${r.label}: ${r.value}`}
          >
            {r.icon}
            <Text style={styles.infoLabel}>{r.label}:</Text>
            <Text style={styles.infoValue}>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Visit address ───────────────────────────────────────────────────────────
export function AddressCard({ address }: { address: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.addressRow}>
        <MapPin size={20} color={INK} strokeWidth={1.9} />
        <View style={styles.addressBody}>
          <Text style={styles.cardTitle}>Visit address</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Payment ─────────────────────────────────────────────────────────────────
function Dashes() {
  return (
    <View style={styles.dashes}>
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.dash} />
      ))}
    </View>
  );
}

function methodName(b: Booking): string {
  switch (b.paymentMethod) {
    case 'PARTIAL':
      return 'Partial pay • Online deposit';
    case 'CASH':
      return 'Pay at venue • Cash';
    default:
      return 'Full payment • Online';
  }
}

interface PaymentCardProps {
  booking: Booking;
  canPay: boolean;
  paying: boolean;
  onPay: () => void;
}

export function PaymentCard({ booking, canPay, paying, onPay }: PaymentCardProps) {
  const pay = paymentSummary(booking);
  const cur = booking.currency;
  const discount = booking.discountMinor ?? 0;
  const travel = booking.travelFeeMinor ?? 0;
  // amountMinor = service price − coupon discount + travel fee (server-side).
  const servicePrice = booking.amountMinor == null ? null : booking.amountMinor + discount - travel;
  const fullyPaid = booking.paymentStatus === 'PAID';
  const refunded = booking.paymentStatus === 'REFUNDED';
  // Online bookings settle in-app; partial / cash leave the rest for the venue.
  const dueLabel = booking.paymentMethod === 'ONLINE' ? 'Due' : 'Due at venue';
  const showDue = pay.due > 0 && !refunded && booking.status !== 'CANCELLED';

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Payment</Text>

      <View style={styles.payRow}>
        <Text style={styles.payLabel}>Service price</Text>
        <Text style={styles.payValue}>
          {servicePrice == null ? '—' : money(servicePrice, cur)}
        </Text>
      </View>
      {discount > 0 && (
        <View style={styles.payRow}>
          <View style={styles.payLabelWrap}>
            <Text style={styles.payLabel}>Coupon</Text>
            {!!booking.couponCode && (
              <View style={styles.couponPill}>
                <Text style={styles.couponText}>{booking.couponCode}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.payValue, styles.green]}>−{money(discount, cur)}</Text>
        </View>
      )}
      {travel > 0 && (
        <View style={styles.payRow}>
          <Text style={styles.payLabel}>Travel fee</Text>
          <Text style={styles.payValue}>{money(travel, cur)}</Text>
        </View>
      )}

      <Dashes />

      {fullyPaid ? (
        <View style={styles.payRow}>
          <Text style={[styles.totalLabel, styles.green]}>Paid</Text>
          <Text style={[styles.totalValue, styles.green]}>{money(pay.total, cur)}</Text>
        </View>
      ) : (
        <>
          <View style={styles.payRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {booking.amountMinor == null ? '—' : money(pay.total, cur)}
            </Text>
          </View>
          {pay.paid > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{refunded ? 'Paid online (refunded)' : 'Paid online'}</Text>
              <Text style={[styles.payValue, styles.green]}>{money(pay.paid, cur)}</Text>
            </View>
          )}
          {showDue && (
            <View style={[styles.payRow, styles.dueRow]}>
              <Text style={styles.dueText}>{dueLabel}</Text>
              <Text style={styles.dueText}>{money(pay.due, cur)}</Text>
            </View>
          )}
        </>
      )}

      <View style={styles.methodRow}>
        <View style={styles.methodChip}>
          <Wallet size={15} color={INK} strokeWidth={1.9} />
          <Text style={styles.methodText}>{methodName(booking)}</Text>
        </View>
        <Text style={[styles.payStatus, { color: pay.color }]}>{pay.label}</Text>
      </View>

      {canPay && (
        <TouchableOpacity
          style={[styles.primaryBtn, paying && styles.disabled]}
          activeOpacity={0.85}
          onPress={onPay}
          disabled={paying}
          accessibilityRole="button"
          accessibilityState={{ busy: paying, disabled: paying }}
        >
          {paying ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <Text style={styles.primaryText}>
              {booking.paymentMethod === 'ONLINE' && booking.amountMinor != null
                ? `Pay ${money(booking.amountMinor, cur)} now`
                : 'Pay now'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Info strip / notes ──────────────────────────────────────────────────────
export function InfoStrip({ text }: { text: string }) {
  return (
    <View style={styles.strip} accessible accessibilityRole="text">
      <Info size={18} color="#C2410C" strokeWidth={2} />
      <Text style={styles.stripText}>{text}</Text>
    </View>
  );
}

export function NoteCard({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>{text}</Text>
      </View>
    </View>
  );
}

// ── Rate your visit ─────────────────────────────────────────────────────────
interface RateCardProps {
  rating: number;
  setRating: (n: number) => void;
  comment: string;
  setComment: (s: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function RateCard({ rating, setRating, comment, setComment, onSubmit, submitting }: RateCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Rate your visit</Text>
      <View style={styles.starsRow} accessibilityRole="adjustable" accessibilityLabel="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setRating(n)}
            activeOpacity={0.7}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
            accessibilityState={{ selected: n <= rating }}
          >
            <Star
              size={32}
              color={n <= rating ? AMBER : RING}
              fill={n <= rating ? AMBER : 'transparent'}
              strokeWidth={1.6}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.tapHint}>{rating > 0 ? `${rating} out of 5` : 'Tap to rate'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Tell others about your experience (optional)"
        placeholderTextColor={Color.placeholder}
        value={comment}
        onChangeText={setComment}
        multiline
        maxLength={REVIEW_MAX}
        accessibilityLabel="Review comment, optional"
      />
      <Text style={styles.counter}>
        {comment.length}/{REVIEW_MAX}
      </Text>
      {rating > 0 && (
        <TouchableOpacity
          style={[styles.primaryBtn, styles.primaryBtnSm, submitting && styles.disabled]}
          activeOpacity={0.85}
          onPress={onSubmit}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="Submit review"
          accessibilityState={{ busy: submitting, disabled: submitting }}
        >
          {submitting ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <Text style={styles.primaryText}>Submit review</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

interface YourReviewProps {
  rating: number;
  comment: string | null;
  reply: string | null;
  businessName: string;
}

export function YourReviewCard({ rating, comment, reply, businessName }: YourReviewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Your review</Text>
      <View
        style={[styles.starsRow, styles.starsRowLeft]}
        accessible
        accessibilityLabel={`You rated ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={24}
            color={n <= rating ? AMBER : RING}
            fill={n <= rating ? AMBER : 'transparent'}
            strokeWidth={1.6}
          />
        ))}
      </View>
      {!!comment && <Text style={styles.reviewText}>{comment}</Text>}
      {!!reply && (
        <View style={styles.reply}>
          <Text style={styles.replyTitle}>Reply from {businessName}</Text>
          <Text style={styles.replyText}>{reply}</Text>
        </View>
      )}
    </View>
  );
}

// ── Book again ──────────────────────────────────────────────────────────────
export function BookAgainCard({ onRebook, onRemind }: { onRebook: () => void; onRemind: () => void }) {
  return (
    <View style={styles.againCard}>
      <View style={styles.againHead}>
        <CalendarPlus size={26} color={LINK} strokeWidth={1.8} />
        <View style={styles.againText}>
          <Text style={styles.cardTitle}>Book again?</Text>
          <Text style={styles.againSub}>Loved the service? Book it again easily.</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.primaryBtn, styles.primaryBtnSm]}
        activeOpacity={0.85}
        onPress={onRebook}
        accessibilityRole="button"
      >
        <Text style={styles.primaryText}>Rebook this service</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemind} hitSlop={8} accessibilityRole="link">
        <Text style={styles.link}>Remind me to book again later</Text>
      </TouchableOpacity>
    </View>
  );
}
