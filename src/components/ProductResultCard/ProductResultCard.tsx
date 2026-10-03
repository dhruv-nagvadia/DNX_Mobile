import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ShoppingBag, Star, BadgeCheck } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { unitPriceLabel } from '@/utils/units';
import { ProductSearchResult } from '@/redux/api/provider/types';

import { styles } from './styles';

/** A product result — name, selling store, price and rating. Shared between
 * free-text search and "shop by product type" browsing. */
export function ProductResultCard({
  product: p,
  onPress,
}: {
  product: ProductSearchResult;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.avatar}>
        {p.imageUrl ? (
          <Image source={{ uri: p.imageUrl }} style={styles.avatarImg} />
        ) : (
          <ShoppingBag size={22} color={Color.primary} />
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {p.name}
          </Text>
          {p.provider.isVerified && <BadgeCheck size={15} color={Color.success} />}
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {p.provider.businessName}
          {p.provider.city ? ` · ${p.provider.city}` : ''}
        </Text>
        <Text style={styles.price}>{unitPriceLabel(p.priceMinor, p.priceQty, p.measure, p.currency)}</Text>
        {!!p.ratingCount && (
          <View style={styles.ratingRow}>
            <Star size={13} color={Color.warning} fill={Color.warning} />
            <Text style={styles.ratingText}>
              {(p.ratingAvg ?? 0).toFixed(1)} ({p.ratingCount})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
