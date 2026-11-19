import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import {
  CalendarDays,
  Check,
  Home,
  MapPin,
  Navigation,
  Scissors,
  Store,
  TriangleAlert,
} from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import type { Booking } from '@/redux/api/booking/types';
import type { Provider } from '@/redux/api/provider/types';
import { STATUS_LABEL, statusColors } from '@/utils/bookingStatus';
import { INK } from '@/utils/modernTheme';
import { formatHour, isOpenNow } from '@/utils/openNow';
import { formatMoney } from '@/utils/units';

import { styles } from './styles';

const CONFETTI = [
  { top: 6, left: 30, color: '#3B82F6', rotate: '-30deg' },
  { top: 0, right: 34, color: '#F59E0B', rotate: '20deg' },
  { top: 40, left: 6, color: '#22C55E', rotate: '45deg' },
  { top: 34, right: 4, color: '#16A34A', rotate: '-40deg' },
  { bottom: 22, left: 18, color: '#F59E0B', rotate: '30deg' },
  { bottom: 14, right: 22, color: '#3B82F6', rotate: '-15deg' },
  { bottom: 40, right: 0, color: '#F59E0B', rotate: '10deg' },
];

/**
 * Green check in a soft glow with a scatter of small confetti marks (same as
 * OrderSuccessScreen). `warning` swaps it for a calm amber alert without the
 * confetti — used when the booking stands but its payment didn't go through.
 */
export function Celebration({ size, warning }: { size: number; warning?: boolean }) {
  const box = size + 90;
  return (
    <View style={[styles.celebration, { width: box, height: box }]}>
      <View
        style={[
          styles.glow,
          warning && styles.glowWarning,
          { width: box, height: box, borderRadius: box / 2 },
        ]}
      />
      {!warning &&
        CONFETTI.map(({ color, rotate, ...pos }, i) => (
          <View
            key={i}
            style={[styles.confetti, pos, { backgroundColor: color, transform: [{ rotate }] }]}
          />
        ))}
      <View
        style={[
          styles.check,
          warning && styles.checkWarning,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {warning ? (
          <TriangleAlert size={size * 0.5} color="#FFFFFF" strokeWidth={2.6} />
        ) : (
          <Check size={size * 0.55} color="#FFFFFF" strokeWidth={3.2} />
        )}
      </View>
    </View>
  );
}

function bookingRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function time(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase();
}

/**
 * The booking summary: business photo + name, status pill, service, date and
 * time range, then the payment split. Booking/business details come from the
 * cached lists when available; the screen's params are the fallback.
 */
export function BookingCard({
  bookingId,
  providerName,
  serviceName,
  startTime,
  booking,
  photo,
  total,
  paid,
  due,
  currency,
  outcome,
}: {
  bookingId: string;
  providerName: string;
  serviceName: string;
  startTime: string;
  booking: Booking | null;
  photo?: string;
  total: number;
  paid: number;
  due: number;
  currency: string;
  outcome: 'paid' | 'partial' | 'cash' | 'pending';
}) {
  const status = booking?.status ?? 'PENDING';
  const [pillBg, pillFg] = statusColors(status);
  const timeRange = booking
    ? `${time(booking.startTime)} – ${time(booking.endTime)}`
    : time(startTime);
  const dueLabel = outcome === 'cash' ? 'Pay at venue' : 'Due at visit';

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <RemoteImage
            uris={[photo]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<Store size={20} color="#1D4ED8" strokeWidth={2} />}
          />
        </View>
        <View style={styles.headText}>
          <Text style={styles.storeName} numberOfLines={1}>
            {providerName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            Booking {bookingRef(bookingId)}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: pillBg }]}>
          <Text style={[styles.pillText, { color: pillFg }]}>{STATUS_LABEL[status]}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Scissors size={17} color={INK} strokeWidth={1.8} />
          </View>
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{serviceName}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <CalendarDays size={17} color={INK} strokeWidth={1.8} />
          </View>
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>{longDate(startTime)}</Text>
            <Text style={styles.detailValue}>{timeRange}</Text>
          </View>
        </View>
      </View>

      <View style={styles.amounts}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total</Text>
          <Text style={styles.amountTotal}>{formatMoney(total, currency)}</Text>
        </View>
        {outcome === 'pending' && (
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Payment</Text>
            <Text style={styles.amountPending}>Not paid yet</Text>
          </View>
        )}
        {outcome !== 'pending' && outcome !== 'cash' && (
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Paid online</Text>
            <Text style={styles.amountPaid}>{formatMoney(paid, currency)}</Text>
          </View>
        )}
        {(outcome === 'cash' || (outcome === 'partial' && due > 0)) && (
          <View style={[styles.amountRow, styles.dueRow]}>
            <Text style={styles.dueText}>{dueLabel}</Text>
            <Text style={styles.dueText}>{formatMoney(due, currency)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/** Amber note when the booking stands but the online payment didn't land. */
export function PaymentPendingCard() {
  return (
    <View style={styles.warnCard}>
      <TriangleAlert size={24} color="#EA580C" strokeWidth={1.9} />
      <View style={styles.warnBody}>
        <Text style={styles.warnTitle}>Payment not completed</Text>
        <Text style={styles.warnText}>
          Your booking is still saved. You can pay from the booking’s details page.
        </Text>
      </View>
    </View>
  );
}

export function NextSteps({ providerName, atHome }: { providerName: string; atHome: boolean }) {
  const steps = [
    `${providerName} confirms your booking`,
    'We’ll remind you before your slot',
    atHome
      ? 'Be home on time — they’ll come to you'
      : 'Show up a few minutes early for your appointment',
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>What happens next</Text>
      {steps.map((step, i) => (
        <View key={step} style={styles.stepRow}>
          <View style={styles.stepRail}>
            <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
              {i === 0 && <Check size={13} color="#FFFFFF" strokeWidth={3.2} />}
            </View>
            {i < steps.length - 1 && <View style={styles.stepLine} />}
          </View>
          <Text style={[styles.stepText, i === 0 && styles.stepTextActive]}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Where the appointment happens: the customer's own address for an at-home
 * service, otherwise the business's address with today's hours and a
 * Directions shortcut.
 */
export function WhereCard({
  homeAddress,
  provider,
}: {
  homeAddress?: string | null;
  provider?: Provider;
}) {
  if (homeAddress) {
    return (
      <View style={[styles.card, styles.where]}>
        <Home size={22} color={INK} strokeWidth={1.9} />
        <View style={styles.whereBody}>
          <Text style={styles.cardTitle}>At your address</Text>
          <Text style={styles.whereAddress}>{homeAddress}</Text>
        </View>
      </View>
    );
  }
  if (!provider) {
    return null;
  }
  const address = [provider.addressLine, provider.city].filter(Boolean).join(', ');
  const today = provider.businessHours.find((h) => h.dayOfWeek === new Date().getDay());
  const open = isOpenNow(provider.businessHours);
  const onDirections = () => {
    const dest =
      provider.latitude != null && provider.longitude != null
        ? `${provider.latitude},${provider.longitude}`
        : encodeURIComponent(address || provider.businessName);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${dest}`).catch(
      () => undefined,
    );
  };
  return (
    <View style={[styles.card, styles.where]}>
      <MapPin size={22} color={INK} strokeWidth={1.9} />
      <View style={styles.whereBody}>
        <Text style={styles.cardTitle}>Where</Text>
        {!!address && <Text style={styles.whereAddress}>{address}</Text>}
        {open != null && today?.isOpen && (
          <View style={[styles.openPill, !open && styles.closedPill]}>
            <View style={[styles.openDot, !open && styles.closedDot]} />
            <Text style={[styles.openText, !open && styles.closedText]}>
              {open
                ? `Open till ${formatHour(today.closeTime)}`
                : `Opens ${formatHour(today.openTime)}`}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.dirBtn}
        onPress={onDirections}
        accessibilityRole="button"
        accessibilityLabel={`Directions to ${provider.businessName}`}
      >
        <Navigation size={16} color="#1D4ED8" strokeWidth={2} />
        <Text style={styles.dirText}>Directions</Text>
      </TouchableOpacity>
    </View>
  );
}
