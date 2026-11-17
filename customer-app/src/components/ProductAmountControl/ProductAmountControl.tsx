import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, INK } from '@/utils/modernTheme';
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
  codEnabled?: boolean;
  partialPayEnabled?: boolean;
}

/**
 * Add/adjust a product in the cart with a unit switcher (e.g. g ↔ kg).
 * Amounts are kept in base units; the toggle only changes how the buyer
 * enters and reads the amount. Shared by the store card and product detail.
 */
export function ProductAmountControl({
  product: p,
  providerId,
  providerName,
  depositPercent,
  codEnabled,
  partialPayEnabled,
}: Props) {
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
          unlimitedStock: p.unlimitedStock,
          stepQty: p.stepQty,
          imageUrl: p.imageUrl,
          depositPercent,
          codEnabled,
          partialPayEnabled,
        },
        quantity: p.unlimitedStock
          ? Math.max(0, amount)
          : Math.max(0, Math.min(amount, p.stockQty)),
      }),
    );

  return (
    <View style={styles.wrap}>
      {units.length > 1 && (
        <View style={styles.toggle}>
          {units.map((u, i) => (
            <TouchableOpacity
              key={u.label}
              style={[styles.seg, i === unitIdx && styles.segActive]}
              activeOpacity={0.85}
              disabled={out}
              onPress={() => setUnitIdx(i)}
              accessibilityRole="button"
              accessibilityState={{ selected: i === unitIdx, disabled: out }}
            >
              <Text style={[styles.segText, i === unitIdx && styles.segTextActive]}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {qty === 0 ? (
        <TouchableOpacity
          style={[styles.addBtn, out && styles.addBtnOut]}
          activeOpacity={0.85}
          disabled={out}
          onPress={() => set(step)}
          accessibilityRole="button"
        >
          <Text style={[styles.addText, out && styles.addTextOut]}>
            {out ? 'Out of stock' : `Add ${formatAmountIn(step, unit)}`}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              activeOpacity={0.8}
              onPress={() => set(qty - step)}
            >
              <Minus size={18} color={Color.white} strokeWidth={2.6} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{formatAmountIn(qty, unit)}</Text>
            <TouchableOpacity
              style={[
                styles.stepBtn,
                !p.unlimitedStock && qty + step > p.stockQty && styles.disabled,
              ]}
              activeOpacity={0.8}
              disabled={!p.unlimitedStock && qty + step > p.stockQty}
              onPress={() => set(qty + step)}
            >
              <Plus size={18} color={Color.white} strokeWidth={2.6} />
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

const BLUE = '#1D4ED8';

/** Mockup "designs/customer/mobile/Grocery App Product States Grid.png". */
const styles = StyleSheet.create({
  wrap: { gap: 8 },
  toggle: {
    flexDirection: 'row',
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    overflow: 'hidden',
  },
  seg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  segActive: { backgroundColor: BLUE },
  segText: { fontSize: 14, fontWeight: FontWeight.semibold, color: INK },
  segTextActive: { color: Color.white },

  addBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: Color.white,
  },
  addBtnOut: { borderColor: '#E2E8F0', backgroundColor: '#E2E8F0' },
  addText: { fontSize: 15, fontWeight: FontWeight.bold, color: BLUE },
  addTextOut: { color: '#94A3B8', fontWeight: FontWeight.semibold },
  disabled: { opacity: 0.45 },

  stepper: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: BLUE,
    overflow: 'hidden',
  },
  stepBtn: { width: 44, height: 40, alignItems: 'center', justifyContent: 'center' },
  qtyText: { flexShrink: 1, fontSize: 15, fontWeight: FontWeight.bold, color: Color.white },
  linePrice: { textAlign: 'center', fontSize: 13, color: '#64748B' },
  minMsg: { textAlign: 'center', fontSize: 13, fontWeight: FontWeight.semibold, color: '#EA580C' },
});
