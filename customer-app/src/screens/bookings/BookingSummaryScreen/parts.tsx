import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BadgeCheck, Star, TicketPercent } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { RemoteImage } from '@/components/RemoteImage';
import { Color } from '@/utils/Theme';
import { LINK } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/units';
import {
  useGetApplicablePlatformCouponsQuery,
  useGetStoreCouponsQuery,
} from '@/redux/api/order/orderApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import type { Provider } from '@/redux/api/provider/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { styles } from './styles';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDuration(min: number): string {
  if (min < 60) {
    return `${min} min`;
  }
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/** "Tue, 18 Nov 2026" */
export function formatDay(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "10:30 AM" */
export function formatClock(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "2.4" / "12" */
export function formatKm(km: number): string {
  return km < 10 ? km.toFixed(1) : String(Math.round(km));
}

/** Dashed rule drawn with small Views — single-side dashed borders don't render on iOS. */
export function DashedLine() {
  return (
    <View
      style={styles.dashed}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: 70 }, (_, i) => (
        <View key={i} style={styles.dash} />
      ))}
    </View>
  );
}

/** Photo + name/verified + "Subcategory • City" + rating. */
export function BusinessCard({ provider }: { provider: Provider }) {
  const meta = [provider.subcategory?.name ?? provider.category.name, provider.city]
    .filter(Boolean)
    .join(' • ');
  return (
    <View style={[styles.card, styles.bizCard]}>
      <View style={styles.bizPhoto}>
        <RemoteImage
          uris={[provider.images[0], provider.subcategory?.imageUrl, provider.category.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={<CategoryIcon slug={provider.category.slug} size={32} color={LINK} />}
        />
      </View>
      <View style={styles.bizInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.bizName} numberOfLines={2}>
            {provider.businessName}
          </Text>
          {provider.isVerified && (
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
        {provider.ratingCount > 0 && (
          <View
            style={styles.ratingRow}
            accessible
            accessibilityLabel={`Rated ${provider.ratingAvg.toFixed(1)} from ${provider.ratingCount} reviews`}
          >
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingValue}>{provider.ratingAvg.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({provider.ratingCount})</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Peach dashed offers strip: "CODE applied • You save ₹X · Remove" when a
 * coupon is applied, otherwise "N offers available · View offers" (→ Coupons
 * screen). Hidden when nothing is applied and there are no offers.
 */
export function OffersStrip({
  providerId,
  serviceId,
  subtotalMinor,
  currency,
}: {
  providerId: string;
  serviceId: string;
  subtotalMinor: number;
  currency: string;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const applied = useAppSelector((s) => s.coupons.applied[providerId]);
  const { data: storeCoupons = [] } = useGetStoreCouponsQuery(providerId);
  const { data: platformCoupons = [] } = useGetApplicablePlatformCouponsQuery({
    providerId,
    usage: 'BOOKING',
  });
  // Store coupons scoped to another service or to products can't apply to this booking.
  const storeCount = storeCoupons.filter(
    (c) => c.scope !== 'PRODUCT' && (c.scope !== 'SERVICE' || c.serviceId === serviceId),
  ).length;
  const count = storeCount + platformCoupons.length;
  const countText = `${count} ${count === 1 ? 'offer' : 'offers'} available`;

  const viewOffers = () =>
    navigation.navigate(ROUTES.COUPONS, { providerId, subtotalMinor, currency, serviceId });

  if (!applied && count === 0) {
    return null;
  }

  const viewLink = (
    <TouchableOpacity
      onPress={viewOffers}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="View offers"
    >
      <Text style={styles.offerLink}>View offers</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.offerStrip}>
      <TicketPercent size={24} color="#EA580C" strokeWidth={1.8} />
      {applied ? (
        <>
          <View style={styles.offerText}>
            <Text style={styles.offerTitle} numberOfLines={1}>
              {applied.code} applied • You save {formatMoney(applied.discountMinor, currency)}
            </Text>
            <View style={styles.offerSubRow}>
              {count > 0 && <Text style={styles.offerSub}>{countText} • </Text>}
              {viewLink}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => dispatch(clearAppliedCoupon(providerId))}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Remove coupon ${applied.code}`}
          >
            <Text style={styles.offerRemove}>Remove</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.offerText, styles.offerTitle]} numberOfLines={1}>
            {countText}
          </Text>
          {viewLink}
        </>
      )}
    </View>
  );
}
