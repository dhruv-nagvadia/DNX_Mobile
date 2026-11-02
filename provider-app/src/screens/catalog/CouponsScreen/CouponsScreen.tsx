import React from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Plus, Ticket, Trash2 } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { PILL } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { Coupon } from '@/redux/api/business/types';

import { useCouponsScreen } from './useCouponsScreen';
import { styles } from './styles';

const dateFmt = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const isExpired = (iso?: string | null) => !!iso && new Date(iso).getTime() < Date.now();

/** Main discount ("10% off") and an optional cap suffix (" (up to ₹200)"). */
function discountParts(c: Coupon): { main: string; cap: string } {
  if (c.discountType === 'PERCENT') {
    return {
      main: `${c.discountValue}% off`,
      cap: c.maxDiscountMinor ? ` (up to ${formatMoney(c.maxDiscountMinor)})` : '',
    };
  }
  return { main: `${formatMoney(c.discountValue)} off`, cap: '' };
}

function scopeLabel(c: Coupon): string {
  if (c.scope === 'SERVICE') {
    return c.service ? `On ${c.service.name}` : 'On a service';
  }
  if (c.scope === 'PRODUCT') {
    return c.product ? `On ${c.product.name}` : 'On a product';
  }
  return c.minOrderMinor > 0 ? `On orders above ${formatMoney(c.minOrderMinor)}` : 'On any order';
}

export default function CouponsScreen() {
  const { coupons, isLoading, refreshing, refresh, deleting, toggleActive, remove, addCoupon, editCoupon } =
    useCouponsScreen();

  const confirmDelete = (couponId: string, code: string) => {
    Alert.alert('Delete coupon?', `"${code}" will stop working immediately.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(couponId) },
    ]);
  };

  const renderCoupon = (c: Coupon) => {
    const { main, cap } = discountParts(c);
    const expired = isExpired(c.expiresAt);

    return (
      <View key={c.id} style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={[styles.code, !c.isActive && styles.codeOff]} numberOfLines={1}>
            {c.code}
          </Text>
          <TouchableOpacity
            onPress={() => toggleActive(c)}
            accessibilityRole="switch"
            accessibilityState={{ checked: c.isActive }}
            accessibilityLabel={c.isActive ? 'Active, tap to turn off' : 'Off, tap to activate'}
            hitSlop={6}
          >
            <Pill label={c.isActive ? 'Active' : 'Off'} colors={c.isActive ? PILL.green : PILL.grey} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => editCoupon(c.id)}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${c.code}`}
            hitSlop={6}
          >
            <Pencil size={20} color={Color.info} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            disabled={deleting}
            onPress={() => confirmDelete(c.id, c.code)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${c.code}`}
            hitSlop={6}
          >
            <Trash2 size={20} color={Color.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.discount}>
          <Text style={c.isActive ? styles.discountMain : styles.discountMainOff}>{main}</Text>
          {cap}
        </Text>
        <Text style={styles.meta}>{scopeLabel(c)}</Text>
        <Text style={[styles.meta, styles.metaGap]}>
          Used: {c.usedCount}
          {c.usageLimit ? ` / ${c.usageLimit}` : ''}
        </Text>
        {!!c.expiresAt && (
          <Text style={styles.meta}>
            {expired ? 'Expired: ' : 'Expires: '}
            <Text style={expired ? styles.expired : styles.expiryDate}>
              {dateFmt.format(new Date(c.expiresAt))}
            </Text>
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Coupons" variant="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <TouchableOpacity style={styles.addBtn} onPress={addCoupon} accessibilityRole="button" activeOpacity={0.85}>
          <Plus size={18} color={Color.white} strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Add Coupon</Text>
        </TouchableOpacity>

        {coupons.length === 0 && !isLoading ? (
          <EmptyState
            icon={<Ticket size={48} color={Color.placeholder} strokeWidth={1.4} />}
            title="No coupons yet"
            body="Create one to run a promo."
          />
        ) : (
          coupons.map(renderCoupon)
        )}
      </ScrollView>
    </View>
  );
}
