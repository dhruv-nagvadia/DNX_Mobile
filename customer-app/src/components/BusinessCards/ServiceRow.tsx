import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import { Provider } from '@/redux/api/provider/types';

import { isOpenNow } from '@/utils/openNow';

import { fromPrice, km } from './format';
import { styles } from './styles';

interface ServiceRowProps {
  provider: Provider;
  /** Store rows show open/closed + "Shop" instead of From-price + "Book". Defaults from provider.type. */
  variant?: 'service' | 'store';
  index?: number;
  onPress: (provider: Provider) => void;
}

/** Business row (Home's "Popular services to book"; also stores in a category): photo, name, category • services, rating, From ₹ + Book. */
export function ServiceRow({ provider: p, index = 0, variant, onPress }: ServiceRowProps) {
  const isStore = (variant ?? (p.type === 'STORE' ? 'store' : 'service')) === 'store';
  const price = isStore ? null : fromPrice(p);
  const open = isStore ? isOpenNow(p.businessHours) : null;
  const dist = km(p.distanceKm);
  const services = (isStore ? [] : p.services)
    ?.slice(0, 3)
    .map((s) => s.name)
    .join(', ');
  return (
    <TouchableOpacity style={styles.svcCard} activeOpacity={0.85} onPress={() => onPress(p)}>
      {/* Business photo, else its sub-category / category photo (API), else an icon tile. */}
      <View style={styles.svcImage}>
        <RemoteImage
          uris={[p.images[0], p.subcategory?.imageUrl, p.category.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={
            <IconTile
              index={index}
              icon={
                <CategoryIcon
                  slug={p.category.slug}
                  size={26}
                  color={iconTileColor(index)}
                  strokeWidth={1.7}
                />
              }
            />
          }
        />
      </View>
      <View style={styles.svcInfo}>
        <Text style={styles.svcName} numberOfLines={1}>
          {p.businessName}
        </Text>
        <Text style={styles.svcSub} numberOfLines={1}>
          {p.subcategory?.name ?? p.category.name}
          {services ? `  •  ${services}` : ''}
        </Text>
        <View style={styles.svcMetaRow}>
          <Star size={13} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.svcMeta} numberOfLines={1}>
            {p.ratingAvg.toFixed(1)} ({p.ratingCount.toLocaleString('en-IN')} reviews)
            {dist ? `  •  ${dist}` : ''}
          </Text>
        </View>
      </View>
      <View style={styles.svcAside}>
        {open != null && (
          <View style={[styles.openPill, styles.rowPill, !open && styles.closedPill]}>
            <Text style={[styles.openPillText, !open && styles.closedPillText]}>
              {open ? 'Open now' : 'Closed'}
            </Text>
          </View>
        )}
        {!!price && (
          <View style={styles.svcPrice}>
            <Text style={styles.fromLabel}>From</Text>
            <Text style={styles.fromPrice} numberOfLines={1}>
              {price}
            </Text>
          </View>
        )}
        <View style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>{isStore ? 'Shop' : 'Book'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
