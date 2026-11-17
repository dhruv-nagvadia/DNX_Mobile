import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

import { ProductAmountControl } from '@/components/ProductAmountControl';
import { RemoteImage } from '@/components/RemoteImage';
import { Product } from '@/redux/api/provider/types';
import { baseIncrement, formatAmount, formatMoney, priceLabel } from '@/utils/units';

import { styles } from './styles';

interface StoreItemCardProps {
  product: Product;
  providerId: string;
  providerName: string;
  depositPercent?: number;
  width: number;
  /** Selling store, for lists that span several stores. */
  storeLabel?: string;
  onPress: () => void;
}

/**
 * The one product card used across the app (mockup "Grocery App Product States
 * Grid.png"): photo (or a neutral "No image" tile — never a category picture),
 * name, pack price, price (struck-through original when discounted), a
 * minimum-order note, then the shared g↔kg / ml↔L switch + Add / stepper with
 * the live line total (ProductAmountControl).
 */
export function StoreItemCard({
  product: p,
  providerId,
  providerName,
  depositPercent,
  width,
  storeLabel,
  onPress,
}: StoreItemCardProps) {
  const out = !p.unlimitedStock && p.stockQty <= 0;
  const discountPct =
    p.coupon && p.priceMinor > 0 ? Math.round((p.coupon.discountMinor / p.priceMinor) * 100) : 0;
  const hasMin = p.stepQty > baseIncrement(p.measure);

  return (
    <View style={[styles.card, { width }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={p.name}
      >
        <View style={[styles.imageWrap, { height: Math.round((width - 20) * 0.82) }]}>
          <RemoteImage
            uris={[p.imageUrl]}
            style={styles.image}
            resizeMode="cover"
            fallback={
              <View style={styles.placeholder}>
                <ImageIcon size={34} color="#94A3B8" strokeWidth={1.4} />
                <Text style={styles.placeholderText}>No image</Text>
              </View>
            }
          />
          {out ? (
            <View style={[styles.badge, styles.badgeOut]}>
              <Text style={styles.badgeOutText}>Out of stock</Text>
            </View>
          ) : discountPct > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{discountPct}% OFF</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {p.name}
          </Text>
          {!!storeLabel && (
            <Text style={styles.store} numberOfLines={1}>
              {storeLabel}
            </Text>
          )}
          <Text style={styles.pack}>
            {priceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}
          </Text>
          {hasMin && <Text style={styles.pack}>Min {formatAmount(p.stepQty, p.measure)}</Text>}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {formatMoney(p.coupon ? p.coupon.finalPriceMinor : p.priceMinor, p.currency)}
            </Text>
            {!!p.coupon && (
              <Text style={styles.strike}>{formatMoney(p.priceMinor, p.currency)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.control}>
        <ProductAmountControl
          product={p}
          providerId={providerId}
          providerName={providerName}
          depositPercent={depositPercent ?? 20}
          codEnabled={p.codEnabled}
          partialPayEnabled={p.partialPayEnabled}
        />
      </View>
    </View>
  );
}
