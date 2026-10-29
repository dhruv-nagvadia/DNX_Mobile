import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Tag, X } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CouponList } from '@/components/CouponSheet';
import { Color } from '@/utils/Theme';

import { useCouponsScreen } from './useCouponsScreen';
import { styles } from './styles';

function money(minor: number, currency: string): string {
  const amount = Math.round(minor / 100).toLocaleString('en-IN');
  return currency === 'INR' || !currency ? `₹${amount}` : `${amount} ${currency}`;
}

/** Full list of a business's coupons, in its own screen (not a stretchy inline sheet). */
export default function CouponsScreen() {
  const {
    providerId,
    subtotalMinor,
    currency,
    serviceId,
    items,
    applied,
    applying,
    error,
    applyCoupon,
    removeCoupon,
  } = useCouponsScreen();

  return (
    <View style={styles.container}>
      <AppHeader title="Coupons" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {applied && (
          <View style={styles.appliedCard}>
            <Tag size={16} color={Color.success} />
            <Text style={styles.appliedText}>
              {applied.code} applied · {money(applied.discountMinor, currency)} off
            </Text>
            <TouchableOpacity
              onPress={removeCoupon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={Color.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        <CouponList
          providerId={providerId}
          subtotalMinor={subtotalMinor}
          serviceId={serviceId}
          items={items}
          currency={currency}
          onApply={applyCoupon}
          applying={applying}
          error={error}
        />
      </ScrollView>
    </View>
  );
}
