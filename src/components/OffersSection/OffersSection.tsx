import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Tag, X, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Color } from '@/utils/Theme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAppliedCoupon, clearAppliedCoupon } from '@/redux/slices/couponSlice';
import { useGetStoreCouponsQuery, useValidateCouponMutation } from '@/redux/api/order/orderApi';
import { discountLabel } from '@/components/CouponSheet';
import { ROUTES, RootStackParamList } from '@/navigation/routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './styles';

function money(minor: number, currency: string): string {
  const amount = Math.round(minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

export interface OfferGroup {
  providerId: string;
  /** Shown when there's more than one group (a multi-store cart). */
  label?: string;
  subtotalMinor: number;
}

interface OfferGroupRowProps {
  group: OfferGroup;
  currency: string;
  /** Hide the quick-apply chip previews — just a "View all coupons" link until applied. */
  compact?: boolean;
}

/** One business's offers: a couple of quick-apply chips, or the applied one — "View all" opens the full list on its own screen. */
function OfferGroupRow({ group, currency, compact }: OfferGroupRowProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const applied = useAppSelector((s) => s.coupons.applied[group.providerId]);
  const { data: coupons = [], isFetching } = useGetStoreCouponsQuery(group.providerId);
  const [validateCoupon, { isLoading: applying }] = useValidateCouponMutation();
  const [error, setError] = useState<string | null>(null);

  const eligible = coupons.filter((c) => group.subtotalMinor >= c.minOrderMinor);
  const quick = compact ? [] : eligible.slice(0, 2);

  const viewAll = () =>
    navigation.navigate(ROUTES.COUPONS, {
      providerId: group.providerId,
      subtotalMinor: group.subtotalMinor,
      currency,
    });

  const quickApply = async (code: string) => {
    setError(null);
    try {
      const preview = await validateCoupon({
        providerId: group.providerId,
        code,
        subtotalMinor: group.subtotalMinor,
      }).unwrap();
      dispatch(setAppliedCoupon({ providerId: group.providerId, coupon: preview }));
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      setError(msg || 'That code didn’t work.');
    }
  };

  const remove = () => dispatch(clearAppliedCoupon(group.providerId));

  // Avoid a flicker between "loading" and "no offers" while the list fetches.
  if (!applied && isFetching) return null;

  // Nothing to offer here — say so rather than showing nothing at all.
  if (!applied && coupons.length === 0) {
    return (
      <View style={styles.group}>
        {!!group.label && <Text style={styles.groupLabel}>{group.label}</Text>}
        <Text style={styles.emptyText}>No offers available right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.group}>
      {!!group.label && <Text style={styles.groupLabel}>{group.label}</Text>}

      {applied ? (
        <View style={styles.appliedChip}>
          <Tag size={14} color={Color.success} />
          <Text style={styles.appliedText} numberOfLines={1}>
            {applied.code} · {money(applied.discountMinor, currency)} off
          </Text>
          <TouchableOpacity onPress={viewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={remove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={16} color={Color.textSecondary} />
          </TouchableOpacity>
        </View>
      ) : compact ? (
        <TouchableOpacity style={styles.compactRow} activeOpacity={0.85} onPress={viewAll}>
          <Tag size={15} color={Color.primary} />
          <Text style={styles.compactText}>View all coupons</Text>
          <ChevronRight size={15} color={Color.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.quickRow}>
          <Tag size={14} color={Color.primary} />
          {quick.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={styles.quickChip}
              activeOpacity={0.85}
              disabled={applying}
              onPress={() => quickApply(c.code)}
            >
              <Text style={styles.quickChipCode}>{c.code}</Text>
              <Text style={styles.quickChipDiscount}>{discountLabel(c)}</Text>
            </TouchableOpacity>
          ))}
          {coupons.length > 0 && (
            <TouchableOpacity style={styles.viewAll} activeOpacity={0.85} onPress={viewAll}>
              <Text style={styles.viewAllText}>View all coupons</Text>
              <ChevronRight size={14} color={Color.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

interface OffersSectionProps {
  groups: OfferGroup[];
  currency: string;
  /** Hide the quick-apply chip previews — just a "View all coupons" link until applied. */
  compact?: boolean;
}

/** Offers for one or more businesses — a coupon section for a booking/order summary screen. */
export function OffersSection({ groups, currency, compact }: OffersSectionProps) {
  if (groups.length === 0) return null;
  return (
    <View style={styles.container}>
      {groups.map((g) => (
        <OfferGroupRow key={g.providerId} group={g} currency={currency} compact={compact} />
      ))}
    </View>
  );
}
