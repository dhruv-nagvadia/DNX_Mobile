import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { GradientBackground } from '@/components/GradientBackground';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import { Category } from '@/redux/api/category/types';
import { IMAGE_FADE } from '@/utils/homeTiles';

import { styles } from './styles';

interface StoreCategoryCardProps {
  category: Category;
  width: number;
  index?: number;
  onPress: (category: Category) => void;
}

/** "Shop by business" card: category photo with its name in white on a dark fade. */
export function StoreCategoryCard({
  category: c,
  width,
  index = 0,
  onPress,
}: StoreCategoryCardProps) {
  return (
    <TouchableOpacity
      style={[styles.bizCard, { width, height: Math.round(width * 0.8) }]}
      activeOpacity={0.85}
      onPress={() => onPress(c)}
    >
      <RemoteImage
        uris={[c.imageUrl, c.iconUrl]}
        style={styles.fill}
        resizeMode="cover"
        fallback={
          <IconTile
            index={index}
            style={styles.bizIconTile}
            icon={
              <CategoryIcon
                slug={c.slug}
                size={34}
                color={iconTileColor(index)}
                strokeWidth={1.6}
              />
            }
          />
        }
      />
      <GradientBackground colors={IMAGE_FADE} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} />
      <Text style={styles.bizName} numberOfLines={2}>
        {c.name}
      </Text>
    </TouchableOpacity>
  );
}
