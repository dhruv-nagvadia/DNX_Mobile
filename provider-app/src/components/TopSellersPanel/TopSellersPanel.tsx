import React from 'react';
import { Image, Text, View } from 'react-native';
import { Award, CalendarDays, Package, Wrench } from 'lucide-react-native';

import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';

import { useTopSellers } from './useTopSellers';
import { TopSellersPanelProps } from './types';
import { styles } from './styles';

/** Ports `frontend/src/components/TopSellersPanel/TopSellersPanel.tsx` — top
 * services/products ranked by revenue, each row highlighting its order/
 * booking count (not a plain product-photo gallery), plus the business's
 * busiest weekday. No title here — the screen's own outside section label
 * already names this card ("Top products"/"Top services"). */
export function TopSellersPanel({ businessId, isStore }: TopSellersPanelProps) {
  const { data, isLoading } = useTopSellers(businessId, isStore);
  const Icon = isStore ? Package : Wrench;
  const countLabel = data.itemLabel === 'product' ? 'order' : 'booking';

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {!!data.busiestDay && (
        <View style={styles.busiestRow}>
          <CalendarDays size={12} color={Color.textSecondary} />
          <Text style={styles.busiestText}>Busiest day: {data.busiestDay}</Text>
        </View>
      )}

      {data.items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.empty}>
            No {data.itemLabel === 'product' ? 'orders' : 'bookings'} yet. Top {data.itemLabel}s will show up here
            once they come in.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {data.items.map((item, i) => (
            <View key={item.name} style={styles.row}>
              <View style={styles.rank}>
                {i === 0 ? <Award size={14} color={Color.warning} /> : <Text style={styles.rankText}>{i + 1}</Text>}
              </View>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              ) : (
                <View style={styles.itemImageFallback}>
                  <Icon size={16} color={Color.primary} />
                </View>
              )}
              <View style={styles.rowMain}>
                <Text style={styles.rowName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.rowRevenue}>{formatMoney(item.revenueMinor, data.currency)}</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {item.count} {countLabel}
                  {item.count === 1 ? '' : 's'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
