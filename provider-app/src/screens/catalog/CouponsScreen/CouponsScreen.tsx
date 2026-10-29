import React from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { Coupon } from '@/redux/api/business/types';

import { useCouponsScreen } from './useCouponsScreen';
import { styles } from './styles';

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const isExpired = (iso?: string | null) => !!iso && new Date(iso).getTime() < Date.now();

function discountLabel(c: Coupon): string {
  if (c.discountType === 'PERCENT') {
    return `${c.discountValue}% off${c.maxDiscountMinor ? ` (max ${formatMoney(c.maxDiscountMinor)})` : ''}`;
  }
  return `${formatMoney(c.discountValue)} off`;
}

function scopeLabel(c: Coupon): string {
  if (c.scope === 'SERVICE') return c.service ? `On ${c.service.name}` : 'On a service';
  if (c.scope === 'PRODUCT') return c.product ? `On ${c.product.name}` : 'On a product';
  return c.minOrderMinor > 0 ? `Min. order ${formatMoney(c.minOrderMinor)}` : 'Any order';
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

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Coupons</Text>
        <TouchableOpacity style={styles.addBtn} onPress={addCoupon} accessibilityRole="button">
          <Plus size={18} color={Color.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        {coupons.length === 0 && !isLoading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No coupons yet. Create one to run a promo.</Text>
          </View>
        ) : (
          coupons.map((c) => (
            <View key={c.id} style={[styles.card, !c.isActive && styles.cardInactive]}>
              <View style={styles.cardTop}>
                <Text style={styles.code}>{c.code}</Text>
                <Switch
                  value={c.isActive}
                  onValueChange={() => toggleActive(c)}
                  trackColor={{ true: Color.primary, false: Color.border }}
                />
              </View>
              <Text style={styles.discount}>{discountLabel(c)}</Text>
              <Text style={styles.meta}>{scopeLabel(c)}</Text>
              <Text style={styles.meta}>
                {c.expiresAt ? (
                  <Text style={isExpired(c.expiresAt) && styles.expired}>
                    {isExpired(c.expiresAt) ? 'Expired' : `Expires ${dateFmt.format(new Date(c.expiresAt))}`}
                  </Text>
                ) : (
                  'No expiry'
                )}
                {' · '}
                {c.usedCount} used{c.usageLimit ? ` / ${c.usageLimit}` : ''}
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => editCoupon(c.id)}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  disabled={deleting}
                  onPress={() => confirmDelete(c.id, c.code)}
                >
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
