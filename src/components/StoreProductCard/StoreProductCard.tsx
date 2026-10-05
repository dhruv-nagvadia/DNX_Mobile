import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { ProductAmountControl } from '@/components/ProductAmountControl';
import { Color } from '@/utils/Theme';
import { stockLabel, unitPriceLabel } from '@/utils/units';
import { Product } from '@/redux/api/provider/types';

import { styles } from './styles';

interface StoreProductCardProps {
  product: Product;
  providerId: string;
  providerName: string;
  depositPercent?: number;
  // Icon fallback when the product has no photo — omit when the caller has
  // no single business category to fall back to (e.g. cross-store browsing).
  categorySlug?: string;
  // Shown under the name — the selling store, for contexts spanning several
  // stores (e.g. "shop by category" from the home screen).
  storeLabel?: string;
  onPress: () => void;
}

/** One product card for a store's catalog — image, price, stock, and the
 * add/stepper control. Shared across every product grid in the app (a single
 * store's catalog or products pooled across stores) so they never drift apart. */
export function StoreProductCard({
  product: p,
  providerId,
  providerName,
  depositPercent,
  categorySlug,
  storeLabel,
  onPress,
}: StoreProductCardProps) {
  const out = p.stockQty <= 0;
  return (
    <View style={styles.card}>
      {/* Tap the image/details to open the full product page. */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={styles.imageWrap}>
          {p.imageUrl ? (
            <Image source={{ uri: p.imageUrl }} style={styles.image} />
          ) : categorySlug ? (
            <CategoryIcon slug={categorySlug} size={32} />
          ) : (
            <ShoppingBag size={28} color={Color.primary} />
          )}
          {out && (
            <View style={styles.outBadge}>
              <Text style={styles.outText}>Out of stock</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {p.name}
          </Text>
          {!!storeLabel && (
            <Text style={styles.store} numberOfLines={1}>
              {storeLabel}
            </Text>
          )}
          <Text style={styles.price}>{unitPriceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}</Text>
          <Text style={[styles.stock, out && styles.stockOut]}>{stockLabel(p.stockQty, p.measure)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.control}>
        <ProductAmountControl
          product={p}
          providerId={providerId}
          providerName={providerName}
          depositPercent={depositPercent ?? 20}
        />
      </View>
    </View>
  );
}
