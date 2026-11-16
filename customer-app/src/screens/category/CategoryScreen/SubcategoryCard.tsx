import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import { Subcategory } from '@/redux/api/category/types';
import { useGetProvidersQuery } from '@/redux/api/provider/providerApi';

import { styles } from './styles';

interface SubcategoryCardProps {
  sub: Subcategory;
  categorySlug: string;
  width: number;
  index: number;
  locationFilter: Record<string, string>;
  onPress: (sub: Subcategory) => void;
}

/** "Choose a service" card: photo on top, name + "N places nearby" underneath. */
export function SubcategoryCard({
  sub,
  categorySlug,
  width,
  index,
  locationFilter,
  onPress,
}: SubcategoryCardProps) {
  // limit=1: only the total is needed for the "places nearby" line.
  const { data } = useGetProvidersQuery({ subcategorySlug: sub.slug, limit: 1, ...locationFilter });
  const count = data?.pagination.total;

  return (
    <TouchableOpacity
      style={[styles.subCard, { width }]}
      activeOpacity={0.85}
      onPress={() => onPress(sub)}
    >
      <View style={[styles.subImage, { height: Math.round(width * 0.56) }]}>
        {/* Sub-category photo from the API; pastel icon tile until one is added. */}
        <RemoteImage
          uris={[sub.imageUrl]}
          style={styles.fill}
          resizeMode="cover"
          fallback={
            <IconTile
              index={index}
              icon={
                <CategoryIcon
                  slug={categorySlug}
                  size={34}
                  color={iconTileColor(index)}
                  strokeWidth={1.6}
                />
              }
            />
          }
        />
      </View>
      <View style={styles.subBody}>
        <Text style={styles.subName} numberOfLines={2}>
          {sub.name}
        </Text>
        <Text style={styles.subCount}>
          {count == null
            ? ' '
            : count === 0
              ? 'Coming soon'
              : `${count} ${count === 1 ? 'place' : 'places'} nearby`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
