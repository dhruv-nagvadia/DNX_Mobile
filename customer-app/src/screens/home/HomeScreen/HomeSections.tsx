import React from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CalendarDays, Clock, MapPin, Navigation, RotateCcw, Star } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import type { Booking } from '@/redux/api/booking/types';
import type { ServiceSearchResult } from '@/redux/api/provider/types';
import { STATUS_LABEL, statusColors } from '@/utils/bookingStatus';
import { LINK } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';
import { km } from '@/components/BusinessCards/format';

import { sectionStyles as styles } from './sectionStyles';

// ── Formatting ──────────────────────────────────────────────────────────────
/** "Today" / "Tomorrow" / "Sat, 22 Nov", plus "4:30 pm". */
function whenLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const day = same(d, today)
    ? 'Today'
    : same(d, tomorrow)
      ? 'Tomorrow'
      : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${day}  •  ${time}`;
}

function durationLabel(min: number): string {
  if (min < 60) {
    return `${min} min`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function price(minor: number, currency: string): string {
  return formatMoney(minor, currency).replace(/\.00$/, '');
}

function Thumb({
  uris,
  slug,
  index = 0,
  style,
  iconSize = 24,
}: {
  uris: (string | null | undefined)[];
  slug: string;
  index?: number;
  style: StyleProp<ViewStyle>;
  iconSize?: number;
}) {
  return (
    <View style={style}>
      <RemoteImage
        uris={uris}
        style={styles.fill}
        resizeMode="cover"
        fallback={
          <IconTile
            index={index}
            icon={
              <CategoryIcon
                slug={slug}
                size={iconSize}
                color={iconTileColor(index)}
                strokeWidth={1.7}
              />
            }
          />
        }
      />
    </View>
  );
}

// ── Upcoming booking ────────────────────────────────────────────────────────
interface UpcomingBookingCardProps {
  booking: Booking;
  onView: (b: Booking) => void;
  onDirections: (b: Booking) => void;
}

/** Home's "Your next booking": what, where, when + status, with Directions / View. */
export function UpcomingBookingCard({
  booking: b,
  onView,
  onDirections,
}: UpcomingBookingCardProps) {
  const [bg, fg] = statusColors(b.status);
  const canDirect =
    (b.provider.latitude != null && b.provider.longitude != null) || !!b.provider.addressLine;
  return (
    <TouchableOpacity style={styles.nextCard} activeOpacity={0.9} onPress={() => onView(b)}>
      <View style={styles.nextTop}>
        <Thumb
          uris={[b.service.imageUrl, b.provider.images?.[0]]}
          slug={b.provider.category.slug}
          style={styles.nextThumb}
        />
        <View style={styles.nextInfo}>
          <Text style={styles.nextService} numberOfLines={1}>
            {b.service.name}
          </Text>
          <Text style={styles.nextBusiness} numberOfLines={1}>
            {b.provider.businessName}
          </Text>
          <View style={styles.metaRow}>
            <CalendarDays size={14} color={LINK} strokeWidth={2} />
            <Text style={styles.nextWhen} numberOfLines={1}>
              {whenLabel(b.startTime)}
            </Text>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: bg }]}>
          <Text style={[styles.statusText, { color: fg }]}>{STATUS_LABEL[b.status]}</Text>
        </View>
      </View>
      <View style={styles.nextActions}>
        {canDirect && (
          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.85}
            onPress={() => onDirections(b)}
            accessibilityRole="button"
            accessibilityLabel={`Directions to ${b.provider.businessName}`}
          >
            <Navigation size={16} color={LINK} strokeWidth={2.2} />
            <Text style={styles.outlineBtnText}>Directions</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.solidBtn}
          activeOpacity={0.85}
          onPress={() => onView(b)}
          accessibilityRole="button"
        >
          <Text style={styles.solidBtnText}>View booking</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Book again ──────────────────────────────────────────────────────────────
interface BookAgainCardProps {
  booking: Booking; // the latest completed booking of this service at this business
  width: number;
  index?: number;
  onPress: (b: Booking) => void;
}

/** A service the customer has had before — one tap back to that business's booking page. */
export function BookAgainCard({ booking: b, width, index = 0, onPress }: BookAgainCardProps) {
  return (
    <TouchableOpacity
      style={[styles.againCard, { width }]}
      activeOpacity={0.85}
      onPress={() => onPress(b)}
    >
      <Thumb
        uris={[b.service.imageUrl, b.provider.images?.[0]]}
        slug={b.provider.category.slug}
        index={index}
        iconSize={28}
        style={[styles.againImage, { height: Math.round(width * 0.6) }]}
      />
      <View style={styles.againBody}>
        {/* The service they booked leads; the business comes second. */}
        <Text style={styles.againName} numberOfLines={1}>
          {b.service.name}
        </Text>
        <Text style={styles.againLast} numberOfLines={1}>
          {b.provider.businessName}
        </Text>
        <View style={styles.againBtn}>
          <RotateCcw size={14} color={LINK} strokeWidth={2.4} />
          <Text style={styles.againBtnText}>Book again</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Popular services ────────────────────────────────────────────────────────
interface PopularServiceRowProps {
  service: ServiceSearchResult;
  index?: number;
  onPress: (s: ServiceSearchResult) => void;
}

/** A service (not a business) — its name leads, the business offering it comes second. */
export function PopularServiceRow({ service: s, index = 0, onPress }: PopularServiceRowProps) {
  const p = s.provider;
  return (
    <TouchableOpacity style={styles.svcCard} activeOpacity={0.85} onPress={() => onPress(s)}>
      <Thumb
        uris={[s.imageUrl, p.images?.[0], p.subcategory?.imageUrl, s.category.imageUrl]}
        slug={s.category.slug}
        index={index}
        iconSize={26}
        style={styles.svcImage}
      />
      <View style={styles.svcInfo}>
        <Text style={styles.svcName} numberOfLines={1}>
          {s.name}
        </Text>
        <View style={styles.metaRow}>
          <MapPin size={12} color="#64748B" strokeWidth={2} />
          <Text style={styles.svcSub} numberOfLines={1}>
            {p.businessName}
            {s.distanceKm != null ? `  •  ${km(s.distanceKm)}` : p.city ? `, ${p.city}` : ''}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.svcMeta} numberOfLines={1}>
            {p.ratingAvg.toFixed(1)}
          </Text>
          <Clock size={12} color="#64748B" strokeWidth={2} style={styles.metaGap} />
          <Text style={styles.svcMeta} numberOfLines={1}>
            {durationLabel(s.durationMin)}
          </Text>
        </View>
      </View>
      <View style={styles.svcAside}>
        <Text style={styles.svcPrice} numberOfLines={1}>
          {price(s.priceMinor, s.currency)}
        </Text>
        <View style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
