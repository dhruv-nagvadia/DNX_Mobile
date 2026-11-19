import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Bike, MapPin, Star } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import { Provider } from '@/redux/api/provider/types';
import { LINK } from '@/utils/modernTheme';
import { isOpenNow } from '@/utils/openNow';

import { km } from './format';
import { styles } from './styles';

interface StoreCardProps {
  store: Provider;
  width: number;
  index?: number;
  onPress: (store: Provider) => void;
}

/** Business card (Home "Order from stores" / "Open now near you"): photo, name, ★ rating • km + open pill, category. */
export function StoreCard({ store: s, width, index = 0, onPress }: StoreCardProps) {
  const open = isOpenNow(s.businessHours);
  const dist = km(s.distanceKm);
  return (
    <TouchableOpacity
      style={[styles.storeCard, { width }]}
      activeOpacity={0.85}
      onPress={() => onPress(s)}
    >
      {/* Store's own photo, else its category photo (both from the API), else an icon tile. */}
      <View style={[styles.storeImage, { height: Math.round(width * 0.56) }]}>
        <RemoteImage
          uris={[s.images[0], s.subcategory?.imageUrl, s.category.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={
            <IconTile
              index={index}
              icon={
                <CategoryIcon
                  slug={s.category.slug}
                  size={30}
                  color={iconTileColor(index)}
                  strokeWidth={1.7}
                />
              }
            />
          }
        />
      </View>
      <View style={styles.storeBody}>
        <Text style={styles.storeName} numberOfLines={1}>
          {s.businessName}
        </Text>
        <View style={styles.storeMetaRow}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.storeMeta} numberOfLines={1}>
            {s.ratingAvg.toFixed(1)}
            {dist ? `  •  ${dist}` : ''}
          </Text>
          {open != null && (
            <View style={[styles.openPill, !open && styles.closedPill]}>
              <Text style={[styles.openPillText, !open && styles.closedPillText]}>
                {open ? 'Open now' : 'Closed'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.storeMetaRow}>
          {/* Service businesses (Home "Open now near you") show where, not delivery. */}
          {s.type === 'SERVICE' ? (
            <MapPin size={15} color={LINK} strokeWidth={2} />
          ) : (
            <Bike size={16} color={LINK} strokeWidth={2} />
          )}
          <Text style={styles.storeMeta} numberOfLines={1}>
            {s.subcategory?.name ?? s.category.name}
            {s.type === 'SERVICE' && s.city ? `  •  ${s.city}` : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
