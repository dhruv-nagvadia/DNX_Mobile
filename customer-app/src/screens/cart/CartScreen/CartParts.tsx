import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, Store, TicketPercent } from 'lucide-react-native';

import { RemoteImage } from '@/components/RemoteImage';
import {
  useGetApplicablePlatformCouponsQuery,
  useGetStoreCouponsQuery,
} from '@/redux/api/order/orderApi';
import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import { formatMoney } from '@/utils/units';

import { styles } from './styles';

/** Store header in a cart card: photo, name (tap → store), "Pickup • area", Clear. */
export function StoreHeader({
  providerId,
  providerName,
  onOpen,
  onClear,
}: {
  providerId: string;
  providerName: string;
  onOpen: () => void;
  onClear: () => void;
}) {
  // Cached from the store page in most cases; gives the photo and pickup area.
  const { data: provider } = useGetProviderByIdQuery({ id: providerId });
  const photo =
    provider?.images[0] ?? provider?.subcategory?.imageUrl ?? provider?.category.imageUrl;
  const area = provider?.city ?? provider?.addressLine;
  const dist =
    provider?.distanceKm == null
      ? null
      : `${provider.distanceKm < 10 ? provider.distanceKm.toFixed(1) : Math.round(provider.distanceKm)} km`;
  const meta = ['Pickup', area, dist].filter(Boolean).join(' • ');

  return (
    <View style={styles.shopHead}>
      <TouchableOpacity
        style={styles.shopTap}
        activeOpacity={0.7}
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Open ${providerName}`}
      >
        <View style={styles.shopAvatar}>
          <RemoteImage
            uris={[photo]}
            style={styles.fill}
            resizeMode="cover"
            fallback={<Store size={18} color="#1D4ED8" strokeWidth={2} />}
          />
        </View>
        <View style={styles.shopText}>
          <View style={styles.shopNameRow}>
            <Text style={styles.shopName} numberOfLines={1}>
              {providerName}
            </Text>
            <ChevronRight size={18} color="#0F1E4A" strokeWidth={2.4} />
          </View>
          <Text style={styles.shopMeta} numberOfLines={1}>
            {meta}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onClear}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Clear ${providerName}`}
      >
        <Text style={styles.clearShop}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Per-store offer strip: green "CODE applied · You save ₹X · Remove" when a
 * coupon is applied, otherwise a peach dashed "N offers available · View
 * offers" that opens the Coupons screen. Hidden when the store has no offers.
 */
export function StoreOfferRow({
  providerId,
  subtotalMinor,
  items,
  currency,
}: {
  providerId: string;
  subtotalMinor: number;
  items: { productId: string; lineTotalMinor: number }[];
  currency: string;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const applied = useAppSelector((s) => s.coupons.applied[providerId]);
  const { data: storeCoupons = [] } = useGetStoreCouponsQuery(providerId);
  const { data: platformCoupons = [] } = useGetApplicablePlatformCouponsQuery({
    providerId,
    usage: 'ORDER',
  });
  const count = storeCoupons.length + platformCoupons.length;

  const viewOffers = () =>
    navigation.navigate(ROUTES.COUPONS, { providerId, subtotalMinor, currency, items });

  if (applied) {
    return (
      <View style={styles.offerApplied}>
        <TicketPercent size={22} color="#15803D" strokeWidth={1.8} />
        <Text style={styles.offerAppliedCode} numberOfLines={1}>
          {applied.code} applied
        </Text>
        <View style={styles.offerSep} />
        <Text style={styles.offerSave} numberOfLines={1}>
          You save {formatMoney(applied.discountMinor, currency)}
        </Text>
        <TouchableOpacity
          onPress={() => dispatch(clearAppliedCoupon(providerId))}
          hitSlop={10}
          accessibilityRole="button"
        >
          <Text style={styles.offerLink}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (count === 0) {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.offerAvail}
      onPress={viewOffers}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <TicketPercent size={22} color="#EA580C" strokeWidth={1.8} />
      <Text style={styles.offerAvailText} numberOfLines={1}>
        {count} {count === 1 ? 'offer' : 'offers'} available for this store
      </Text>
      <Text style={styles.offerLink}>View offers</Text>
    </TouchableOpacity>
  );
}
