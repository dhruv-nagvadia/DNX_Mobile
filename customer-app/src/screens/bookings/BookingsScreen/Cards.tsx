import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import {
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  Image as ImageIcon,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  Star,
} from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { RemoteImage } from '@/components/RemoteImage';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import type { Booking } from '@/redux/api/booking/types';
import type { Order } from '@/redux/api/order/types';
import { STATUS_LABEL, statusColors, paymentSummary } from '@/utils/bookingStatus';
import { ORDER_STATUS_LABEL, orderStatusColors, orderPayLabel } from '@/utils/orderStatus';
import { formatHour, isOpenNow } from '@/utils/openNow';
import { formatMoney } from '@/utils/units';

import { styles } from './styles';

const BLUE = '#1D4ED8';
const INK = '#0F1E4A';

// ── Formatting ──────────────────────────────────────────────────────────────
export function dayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
export function timeLabel(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase();
}
function inDays(iso: string): string {
  const start = new Date(iso);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const d = Math.round((start.getTime() - today.getTime()) / 86_400_000);
  return d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
}
/** Short, readable order reference from the id ("#A1B2C3"). */
export function orderRef(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
function duration(min: number): string {
  if (min < 60) {
    return `${min} min`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
function money(minor: number, currency: string | null): string {
  return formatMoney(minor, currency ?? 'INR');
}

/** Booking payment line: "Paid ₹799", "₹210 due at venue", "Pay at venue". */
function bookingPay(b: Booking): { text: string; color: string } {
  const pay = paymentSummary(b);
  if (b.paymentStatus === 'PAID') {
    return { text: `Paid ${money(pay.total, b.currency)}`, color: '#15803D' };
  }
  if (b.paymentStatus === 'PARTIAL' && pay.due > 0) {
    return { text: `${money(pay.due, b.currency)} due at venue`, color: '#EA580C' };
  }
  if (b.paymentStatus === 'REFUNDED') {
    return { text: 'Refunded', color: '#64748B' };
  }
  return b.paymentMethod === 'CASH'
    ? { text: 'Pay at venue', color: '#64748B' }
    : { text: pay.label, color: pay.color };
}

function StatusPill({ label, colors }: { label: string; colors: [string, string] }) {
  return (
    <View style={[styles.pill, { backgroundColor: colors[0] }]}>
      <Text style={[styles.pillText, { color: colors[1] }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Photo({ uri, slug, style }: { uri?: string; slug: string; style: object }) {
  return (
    <View style={style}>
      <RemoteImage
        uris={[uri]}
        style={styles.fill}
        resizeMode="cover"
        fallback={<CategoryIcon slug={slug} size={26} />}
      />
    </View>
  );
}

function openMaps(query: string) {
  Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`).catch(
    () => undefined,
  );
}

// ── Bookings ────────────────────────────────────────────────────────────────
export function NextUpCard({
  booking: b,
  onOpen,
  onReschedule,
}: {
  booking: Booking;
  onOpen: () => void;
  onReschedule: () => void;
}) {
  // Full business record for the address/coordinates behind "Directions".
  const { data: provider } = useGetProviderByIdQuery({ id: b.provider.id });
  const pay = bookingPay(b);
  const onDirections = () => {
    const dest =
      provider?.latitude != null && provider?.longitude != null
        ? `${provider.latitude},${provider.longitude}`
        : encodeURIComponent(
            [b.provider.businessName, provider?.addressLine, provider?.city]
              .filter(Boolean)
              .join(', '),
          );
    openMaps(dest);
  };
  return (
    <TouchableOpacity style={[styles.hero, styles.heroBlue]} activeOpacity={0.92} onPress={onOpen}>
      <View style={[styles.heroTag, styles.heroTagBlue]}>
        <CalendarDays size={15} color={BLUE} strokeWidth={2} />
        <Text style={[styles.heroTagText, styles.heroTagTextBlue]}>NEXT UP • {inDays(b.startTime)}</Text>
      </View>
      <View style={styles.heroRow}>
        <Photo
          uri={b.provider.images?.[0]}
          slug={b.provider.category.slug}
          style={styles.heroPhoto}
        />
        <View style={styles.heroInfo}>
          <Text style={styles.heroName} numberOfLines={1}>
            {b.provider.businessName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {b.service.name} • {duration(b.service.durationMin)}
          </Text>
          <View style={styles.whenBox}>
            <CalendarDays size={15} color={INK} strokeWidth={1.9} />
            <Text style={styles.whenText}>{dayLabel(b.startTime)}</Text>
            <View style={styles.whenSep} />
            <Clock size={15} color={INK} strokeWidth={1.9} />
            <Text style={styles.whenText}>{timeLabel(b.startTime)}</Text>
          </View>
          <View style={styles.heroPayRow}>
            <StatusPill label={STATUS_LABEL[b.status]} colors={statusColors(b.status)} />
            <Text style={[styles.payText, { color: pay.color }]} numberOfLines={1}>
              {pay.text}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.heroActions}>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={onDirections}
          accessibilityRole="button"
        >
          <MapPin size={17} color={BLUE} strokeWidth={2} />
          <Text style={styles.outlineBtnText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={onReschedule}
          accessibilityRole="button"
        >
          <CalendarDays size={17} color={BLUE} strokeWidth={2} />
          <Text style={styles.outlineBtnText}>Reschedule</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function BookingRow({ booking: b, onOpen }: { booking: Booking; onOpen: () => void }) {
  const pay = bookingPay(b);
  const done = b.status === 'COMPLETED';
  const showPay = b.status !== 'CANCELLED' && b.status !== 'NO_SHOW' && !done;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onOpen}>
      <Photo uri={b.provider.images?.[0]} slug={b.provider.category.slug} style={styles.rowPhoto} />
      <View style={styles.rowInfo}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>
            {b.provider.businessName}
          </Text>
          <StatusPill label={STATUS_LABEL[b.status]} colors={statusColors(b.status)} />
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {b.service.name} • {duration(b.service.durationMin)}
        </Text>
        <View style={styles.iconLine}>
          <CalendarDays size={15} color={INK} strokeWidth={1.9} />
          <Text style={styles.iconLineText}>
            {dayLabel(b.startTime)} • {timeLabel(b.startTime)}
          </Text>
        </View>
        {showPay && <Text style={[styles.payText, { color: pay.color }]}>{pay.text}</Text>}
        {done && !b.review && (
          <View style={styles.iconLine}>
            <Star size={15} color={BLUE} fill={BLUE} />
            <Text style={styles.linkText}>Rate your visit</Text>
          </View>
        )}
        {done && !!b.review && (
          <View style={styles.iconLine}>
            <Star size={15} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.meta}>You rated {b.review.rating}/5</Text>
          </View>
        )}
      </View>
      <View style={styles.chevron} pointerEvents="none">
        <ChevronRight size={20} color="#64748B" />
      </View>
    </TouchableOpacity>
  );
}

// ── Orders ──────────────────────────────────────────────────────────────────
function orderPay(o: Order): { text: string; color: string } {
  const p = orderPayLabel(o);
  if (o.paymentStatus === 'PARTIAL') {
    return {
      text: `${money(Math.max(0, o.amountMinor - o.amountPaidMinor), o.currency)} due`,
      color: '#EA580C',
    };
  }
  if (o.paymentMethod === 'CASH' && o.paymentStatus !== 'PAID' && o.paymentStatus !== 'REFUNDED') {
    return { text: 'Pay at pickup', color: '#64748B' };
  }
  return p;
}

function Thumbs({ order: o }: { order: Order }) {
  const shown = o.items.slice(0, 3);
  const more = o.items.length - shown.length;
  return (
    <View style={styles.thumbs}>
      {shown.map((it) => (
        <View key={it.id} style={styles.thumb}>
          <RemoteImage
            uris={[it.product?.imageUrl]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<ImageIcon size={16} color="#94A3B8" strokeWidth={1.6} />}
          />
        </View>
      ))}
      {more > 0 && (
        <View style={styles.thumbMore}>
          <Text style={styles.thumbMoreText}>+{more} more</Text>
        </View>
      )}
    </View>
  );
}

export function ReadyCard({ order: o, onOpen }: { order: Order; onOpen: () => void }) {
  const { data: provider } = useGetProviderByIdQuery({ id: o.provider.id });
  const today = provider?.businessHours.find((h) => h.dayOfWeek === new Date().getDay());
  const open = provider ? isOpenNow(provider.businessHours) : null;
  const pay = orderPay(o);
  const address = [provider?.addressLine, provider?.city].filter(Boolean).join(', ');
  const onDirections = () =>
    openMaps(
      provider?.latitude != null && provider?.longitude != null
        ? `${provider.latitude},${provider.longitude}`
        : encodeURIComponent([o.provider.businessName, address].filter(Boolean).join(', ')),
    );
  return (
    <View style={[styles.hero, styles.heroGreen]}>
      <View style={[styles.heroTag, styles.heroTagGreen]}>
        <ShoppingBag size={15} color="#15803D" strokeWidth={2} />
        <Text style={[styles.heroTagText, styles.heroTagTextGreen]}>READY FOR PICKUP</Text>
      </View>
      <TouchableOpacity style={styles.heroRow} activeOpacity={0.9} onPress={onOpen}>
        <Photo
          uri={o.provider.images?.[0]}
          slug={o.provider.category.slug}
          style={styles.heroPhoto}
        />
        <View style={styles.heroInfo}>
          <Text style={styles.heroName} numberOfLines={1}>
            {o.provider.businessName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            Order {orderRef(o.id)} • {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
          </Text>
          {(!!address || !!today) && (
            <View style={styles.whenBox}>
              {!!address && (
                <>
                  <MapPin size={15} color={INK} strokeWidth={1.9} />
                  <Text style={[styles.whenText, styles.flexText]} numberOfLines={2}>
                    {address}
                  </Text>
                </>
              )}
              {!!address && !!today?.isOpen && <View style={styles.whenSep} />}
              {!!today?.isOpen && (
                <>
                  <Clock size={15} color={INK} strokeWidth={1.9} />
                  <Text style={styles.whenText} numberOfLines={2}>
                    {open
                      ? `Open till ${formatHour(today.closeTime)}`
                      : `Opens ${formatHour(today.openTime)}`}
                  </Text>
                </>
              )}
            </View>
          )}
          <View style={styles.heroPayRow}>
            <StatusPill label={ORDER_STATUS_LABEL[o.status]} colors={orderStatusColors(o.status)} />
            <Text style={[styles.payText, styles.inkText]} numberOfLines={1}>
              {money(o.amountMinor, o.currency)} •{' '}
              <Text style={{ color: pay.color }}>{pay.text}</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.heroActions}>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={onDirections}
          accessibilityRole="button"
        >
          <MapPin size={17} color={BLUE} strokeWidth={2} />
          <Text style={styles.outlineBtnText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.solidBtn} onPress={onOpen} accessibilityRole="button">
          <FileText size={17} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.solidBtnText}>View order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function OrderRow({
  order: o,
  onOpen,
  onReorder,
}: {
  order: Order;
  onOpen: () => void;
  onReorder?: () => void;
}) {
  const pay = orderPay(o);
  const placed = new Date(o.createdAt);
  const when = `${placed.getDate()} ${placed.toLocaleDateString('en-IN', { month: 'short' })}, ${timeLabel(o.createdAt)}`;
  const done = o.status === 'COMPLETED';
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onOpen}>
      <Photo uri={o.provider.images?.[0]} slug={o.provider.category.slug} style={styles.rowPhoto} />
      <View style={styles.rowInfo}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>
            {o.provider.businessName}
          </Text>
          <StatusPill label={ORDER_STATUS_LABEL[o.status]} colors={orderStatusColors(o.status)} />
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          Order {orderRef(o.id)} • {when}
        </Text>
        {!done && <Thumbs order={o} />}
        <View style={styles.orderFoot}>
          <Text style={[styles.payText, { color: pay.color }]} numberOfLines={1}>
            {done ? (
              <>
                <Text style={styles.footAmount}>{money(o.amountMinor, o.currency)}</Text>
                {` • ${pay.text}`}
              </>
            ) : (
              pay.text
            )}
          </Text>
          {done && onReorder ? (
            <TouchableOpacity
              style={styles.reorder}
              onPress={onReorder}
              hitSlop={8}
              accessibilityRole="button"
            >
              <ShoppingCart size={16} color={BLUE} strokeWidth={2} />
              <Text style={styles.linkText}>Reorder</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.footAmount}>{money(o.amountMinor, o.currency)}</Text>
          )}
        </View>
      </View>
      <View style={styles.chevron} pointerEvents="none">
        <ChevronRight size={20} color="#64748B" />
      </View>
    </TouchableOpacity>
  );
}
