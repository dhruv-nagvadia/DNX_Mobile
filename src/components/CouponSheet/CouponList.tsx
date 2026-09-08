import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Tag, Check } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { useGetStoreCouponsQuery } from '@/redux/api/order/orderApi';
import { StoreCoupon } from '@/redux/api/order/types';

import { styles } from './styles';

interface CouponListProps {
  providerId: string;
  subtotalMinor: number;
  currency: string;
  /** Apply a code (typed or tapped); parent validates against the backend. */
  onApply: (code: string) => void;
  applying?: boolean;
  error?: string | null;
  /** Skip fetching until this section is actually visible (e.g. collapsed). */
  active?: boolean;
}

function money(minor: number, currency: string): string {
  const amount = Math.round(minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

export function discountLabel(c: StoreCoupon): string {
  if (c.discountType === 'PERCENT') {
    return `${c.discountValue}% off${c.maxDiscountMinor ? ` up to ${money(c.maxDiscountMinor, 'INR')}` : ''}`;
  }
  return `${money(c.discountValue, 'INR')} off`;
}

/**
 * Manual code entry + a list of a business's available coupons, each with a
 * one-tap Apply. Content only (no Modal chrome) so it can be embedded inline
 * (e.g. inside the payment method sheet) or wrapped in a standalone sheet.
 */
export function CouponList({
  providerId,
  subtotalMinor,
  currency,
  onApply,
  applying,
  error,
  active = true,
}: CouponListProps) {
  const { data: coupons = [], isFetching } = useGetStoreCouponsQuery(providerId, {
    skip: !active,
  });
  const [manualCode, setManualCode] = useState('');

  const eligible = (c: StoreCoupon) => subtotalMinor >= c.minOrderMinor;

  return (
    <View>
      {/* Manual code entry */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <Tag size={15} color={Color.placeholder} />
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            placeholderTextColor={Color.placeholder}
            autoCapitalize="characters"
            autoCorrect={false}
            value={manualCode}
            onChangeText={setManualCode}
          />
        </View>
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.85}
          disabled={applying || !manualCode.trim()}
          onPress={() => onApply(manualCode.trim())}
        >
          {applying ? (
            <ActivityIndicator color={Color.primary} size="small" />
          ) : (
            <Text style={styles.applyBtnText}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.sectionLabel}>Available offers</Text>

      {isFetching ? (
        <ActivityIndicator color={Color.primary} style={styles.loading} />
      ) : coupons.length === 0 ? (
        <Text style={styles.empty}>No offers available right now.</Text>
      ) : (
        <View style={styles.list}>
          {coupons.map((c) => {
            const ok = eligible(c);
            return (
              <View key={c.code} style={[styles.card, !ok && styles.cardDisabled]}>
                <View style={styles.cardIcon}>
                  <Tag size={16} color={ok ? Color.primary : Color.placeholder} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardCode}>{c.code}</Text>
                  <Text style={styles.cardDiscount}>{discountLabel(c)}</Text>
                  {!!c.description && <Text style={styles.cardDesc}>{c.description}</Text>}
                  {!ok && (
                    <Text style={styles.cardHint}>
                      Add {money(c.minOrderMinor - subtotalMinor, currency)} more to use this
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.tapApply, !ok && styles.tapApplyDisabled]}
                  activeOpacity={0.85}
                  disabled={!ok || applying}
                  onPress={() => onApply(c.code)}
                >
                  <Check size={14} color={ok ? Color.primary : Color.placeholder} />
                  <Text style={[styles.tapApplyText, !ok && styles.tapApplyTextDisabled]}>Apply</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
