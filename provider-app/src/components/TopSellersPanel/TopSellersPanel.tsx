import React from 'react';
import { Image, Text, View } from 'react-native';
import { Calendar, Package, Scissors } from 'lucide-react-native';

import { formatMoney } from '@/utils/money';
import { INK } from '@/utils/modernTheme';

import { useTopSellers } from './useTopSellers';
import { TopSellersPanelProps } from './types';
import { RANK_COLORS, styles } from './styles';

const DEFAULT_LIMIT = 3;

/** Top services/products ranked by revenue (mockup: gold/silver/bronze rank
 * badge, thumbnail, "1,248 bookings • ₹6,23,400") plus a "Busiest Day" card.
 * The section title + "See All" are rendered by the screen. */
export function TopSellersPanel({ businessId, isStore, limit = DEFAULT_LIMIT }: TopSellersPanelProps) {
  const { data, isLoading } = useTopSellers(businessId, isStore);
  const Icon = isStore ? Package : Scissors;
  const countLabel = data.itemLabel === 'product' ? 'order' : 'booking';
  const items = data.items.slice(0, limit);

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {items.length === 0 ? (
        <Text style={styles.empty}>
          No {data.itemLabel === 'product' ? 'orders' : 'bookings'} yet. Top {data.itemLabel}s will show up here once
          they come in.
        </Text>
      ) : (
        items.map((item, i) => {
          const rank = RANK_COLORS[i] ?? RANK_COLORS[RANK_COLORS.length - 1];
          return (
            <View key={item.name} style={styles.row}>
              <View style={[styles.rank, { backgroundColor: rank.bg }]}>
                <Text style={[styles.rankText, { color: rank.fg }]}>{i + 1}</Text>
              </View>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbFallback]}>
                  <Icon size={20} color={INK} />
                </View>
              )}
              <View style={[styles.rowMain, i < items.length - 1 && styles.rowDivider]}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.rowMeta} numberOfLines={1}>
                  {item.count.toLocaleString('en-IN')} {countLabel}
                  {item.count === 1 ? '' : 's'} • {formatMoney(item.revenueMinor, data.currency)}
                </Text>
              </View>
            </View>
          );
        })
      )}

      {!!data.busiestDay && (
        <View style={styles.busiestCard}>
          <Calendar size={24} color="#3730A3" />
          <View style={styles.busiestMain}>
            <Text style={styles.busiestTitle}>Busiest Day: {data.busiestDay.day}</Text>
            <Text style={styles.busiestSub}>
              ({data.busiestDay.avg} {countLabel}
              {data.busiestDay.avg === 1 ? '' : 's'} on average)
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
