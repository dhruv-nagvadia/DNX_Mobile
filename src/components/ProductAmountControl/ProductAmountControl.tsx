import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

import { Color, FontSize, FontWeight, Radius } from '@/utils/Theme';
import {
  amountUnits,
  formatAmount,
  formatAmountIn,
  incrementFor,
  amountPrice,
  formatMoney,
} from '@/utils/units';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartQty } from '@/redux/slices/cartSlice';
import { Product } from '@/redux/api/provider/types';

interface Props {
  product: Product;
  providerId: string;
  providerName: string;
  depositPercent?: number;
}

/**
 * Add/adjust a product in the cart with a unit switcher (e.g. g ↔ kg).
 * Amounts are kept in base units; the toggle only changes how the buyer
 * enters and reads the amount. Shared by the store card and product detail.
 */
export function ProductAmountControl({ product: p, providerId, providerName, depositPercent }: Props) {
  const dispatch = useAppDispatch();
  const qty = useAppSelector((s) => s.cart.items.find((i) => i.productId === p.id)?.quantity ?? 0);

  const units = amountUnits(p.measure);
  // Default to the bigger unit when the minimum is already a whole kg/L.
  const [unitIdx, setUnitIdx] = useState(units.length > 1 && p.stepQty >= 1000 ? 1 : 0);
  const unit = units[unitIdx];
  const step = incrementFor(p.measure, unit); // +/- increment (e.g. 100 g/ml)
  const out = p.stockQty <= 0;
  const belowMin = qty > 0 && qty < p.stepQty; // p.stepQty is the required minimum

  const set = (amount: number) =>
    dispatch(
      setCartQty({
        item: {
          productId: p.id,
          providerId,
          providerName,
          name: p.name,
          measure: p.measure,
          priceMinor: p.priceMinor,
          priceQty: p.priceQty,
          currency: p.currency,
          stockQty: p.stockQty,
          stepQty: p.stepQty,
          imageUrl: p.imageUrl,
          depositPercent,
        },
        quantity: Math.max(0, Math.min(amount, p.stockQty)),
      }),
    );

  return (
    <View style={styles.wrap}>
      {units.length > 1 && !out && (
        <View style={styles.toggle}>
          {units.map((u, i) => (
            <TouchableOpacity
              key={u.label}
              style={[styles.seg, i === unitIdx && styles.segActive]}
              activeOpacity={0.85}
              onPress={() => setUnitIdx(i)}
            >
              <Text style={[styles.segText, i === unitIdx && styles.segTextActive]}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {qty === 0 ? (
        <TouchableOpacity
          style={[styles.addBtn, out && styles.disabled]}
          activeOpacity={0.85}
          disabled={out}
          onPress={() => set(step)}
        >
          {!out && <Plus size={14} color={Color.white} />}
          <Text style={styles.addText}>{out ? 'Out of stock' : `Add ${formatAmountIn(step, unit)}`}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} activeOpacity={0.8} onPress={() => set(qty - step)}>
              <Minus size={16} color={Color.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{formatAmountIn(qty, unit)}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, qty + step > p.stockQty && styles.disabled]}
              activeOpacity={0.8}
              disabled={qty + step > p.stockQty}
              onPress={() => set(qty + step)}
            >
              <Plus size={16} color={Color.primary} />
            </TouchableOpacity>
          </View>
          {belowMin ? (
            <Text style={styles.minMsg}>Minimum order is {formatAmount(p.stepQty, p.measure)}</Text>
          ) : (
            <Text style={styles.linePrice}>
              {formatAmountIn(qty, unit)} ·{' '}
              {formatMoney(amountPrice(qty, p.priceQty, p.priceMinor), p.currency)}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginTop: 6 },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Color.background,
    borderRadius: Radius.md,
    padding: 2,
    borderWidth: 1,
    borderColor: Color.border,
  },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 5, borderRadius: Radius.sm },
  segActive: { backgroundColor: Color.primary },
  segText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.textSecondary },
  segTextActive: { color: Color.white },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
  },
  addText: { color: Color.white, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  disabled: { opacity: 0.45 },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Color.primary,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  stepBtn: { width: 42, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.primarySoft },
  qtyText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  linePrice: { textAlign: 'center', fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.primary },
  minMsg: { textAlign: 'center', fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.error },
});
