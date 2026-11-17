import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Check, MapPin, Navigation, Store } from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import { useGetMyOrdersQuery } from '@/redux/api/order/orderApi';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { ORDER_STATUS_LABEL, orderStatusColors } from '@/utils/orderStatus';
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

/** Green check in a soft glow with a scatter of small confetti marks. */
export function Celebration({ size }: { size: number }) {
  const box = size + 90;
  return (
    <View style={[styles.celebration, { width: box, height: box }]}>
      <View style={[styles.glow, { width: box, height: box, borderRadius: box / 2 }]} />
      {CONFETTI.map(({ color, rotate, ...pos }, i) => (
        <View
          key={i}
          style={[styles.confetti, pos, { backgroundColor: color, transform: [{ rotate }] }]}
        />
      ))}
      <View style={[styles.check, { width: size, height: size, borderRadius: size / 2 }]}>
        <Check size={size * 0.55} color="#FFFFFF" strokeWidth={3.2} />
      </View>
    </View>
  );
}

function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

/**
 * One placed order. Looks the order up in "my orders" for item count, status
 * and the paid/due split; falls back to the checkout's store name + amount
 * until that loads.
 */
export function PlacedOrderCard({
  placed,
  currency,
  detailed,
}: {
  placed: { orderId: string; providerName: string; amountMinor: number };
  currency: string;
  detailed: boolean;
}) {
  const { data: orders = [] } = useGetMyOrdersQuery();
  const order = orders.find((o) => o.id === placed.orderId);
  const status = order?.status ?? 'PENDING';
  const [pillBg, pillFg] = orderStatusColors(status);
  const total = order?.amountMinor ?? placed.amountMinor;
  const paid = order?.amountPaidMinor ?? 0;
  const due = Math.max(0, total - paid);
  const items = order?.items.length;
  const photo = order?.provider.images?.[0];

  return (
    <View style={styles.card}>
      <View style={styles.orderHead}>
        <View style={styles.avatar}>
          <RemoteImage
            uris={[photo]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<Store size={20} color="#1D4ED8" strokeWidth={2} />}
          />
        </View>
        <View style={styles.orderHeadText}>
          <Text style={styles.storeName} numberOfLines={1}>
            {placed.providerName}
          </Text>
          <Text style={styles.orderMeta} numberOfLines={1}>
            Order {orderRef(placed.orderId)}
            {items != null ? ` • ${items} ${items === 1 ? 'item' : 'items'}` : ''}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: pillBg }]}>
          <Text style={[styles.pillText, { color: pillFg }]}>{ORDER_STATUS_LABEL[status]}</Text>
        </View>
      </View>

      {detailed ? (
        <View style={styles.amounts}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amountTotal}>{formatMoney(total, currency)}</Text>
          </View>
          {paid > 0 && (
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Paid online</Text>
              <Text style={styles.amountPaid}>{formatMoney(paid, currency)}</Text>
            </View>
          )}
          {due > 0 && (
            <View style={[styles.amountRow, styles.dueRow]}>
              <Text style={styles.dueText}>Pay at pickup</Text>
              <Text style={styles.dueText}>{formatMoney(due, currency)}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.compactFoot}>
          <Text style={styles.compactTotal}>{formatMoney(total, currency)}</Text>
          <Text style={due > 0 ? styles.compactDue : styles.compactPaid}>
            {' • '}
            {due === 0
              ? 'Paid online'
              : paid > 0
                ? `${formatMoney(due, currency)} at pickup`
                : 'Pay at pickup'}
          </Text>
        </View>
      )}
    </View>
  );
}

const STEPS = [
  'Store confirms your order',
  'We’ll notify you when it’s ready for pickup',
  'Show your order at the counter and collect it',
];

export function NextSteps() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>What happens next</Text>
      {STEPS.map((step, i) => (
        <View key={step} style={styles.stepRow}>
          <View style={styles.stepRail}>
            <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
              {i === 0 && <Check size={13} color="#FFFFFF" strokeWidth={3.2} />}
            </View>
            {i < STEPS.length - 1 && <View style={styles.stepLine} />}
          </View>
          <Text style={[styles.stepText, i === 0 && styles.stepTextActive]}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

/** Pickup address with today's hours and a Directions shortcut. */
export function PickupCard({ orderId }: { orderId: string }) {
  const { data: orders = [] } = useGetMyOrdersQuery();
  const providerId = orders.find((o) => o.id === orderId)?.provider.id;
  const { data: provider } = useGetProviderByIdQuery(
    { id: providerId ?? '' },
    { skip: !providerId },
  );
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
    <View style={[styles.card, styles.pickup]}>
      <MapPin size={22} color="#0F1E4A" strokeWidth={1.9} />
      <View style={styles.pickupBody}>
        <Text style={styles.cardTitle}>Pickup from</Text>
        {!!address && <Text style={styles.pickupAddress}>{address}</Text>}
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
      <TouchableOpacity style={styles.dirBtn} onPress={onDirections} accessibilityRole="button">
        <Navigation size={16} color="#1D4ED8" strokeWidth={2} />
        <Text style={styles.dirText}>Directions</Text>
      </TouchableOpacity>
    </View>
  );
}
