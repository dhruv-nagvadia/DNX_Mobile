import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { GradientBackground } from '@/components/GradientBackground';
import { IconTile, iconTileColor } from '@/components/IconTile';
import { RemoteImage } from '@/components/RemoteImage';
import { Category } from '@/redux/api/category/types';
import { styles } from './styles';

/**
 * Height of a service category tile as a fraction of its width: 1 = square. Raise it
 * for taller tiles, lower it for shorter ones. (The category photos are landscape 4:3,
 * so the taller the tile, the more of the photo's sides get cropped.)
 */
const TILE_HEIGHT_RATIO = 1;
/** How much of the full 3-across width each tile uses (below 1 = smaller tiles). */
const TILE_SIZE_SCALE = 0.98;

/**
 * Tile width and the gap between tiles for a 3-per-row grid. Tiles are a bit smaller
 * than "fill the row", and the gap grows to take up the slack, so each row still spans
 * the full width.
 */
export function categoryGridMetrics(contentWidth: number, baseGap: number) {
  const full = Math.floor((contentWidth - baseGap * 2) / 3);
  const width = Math.floor(full * TILE_SIZE_SCALE);
  const gap = Math.floor((contentWidth - width * 3) / 2);
  return { width, gap };
}

export function categoryTileHeight(width: number): number {
  return Math.round(width * TILE_HEIGHT_RATIO);
}

// Dark shadow rising from the bottom edge and fading out at the middle of the tile:
// the top half of the photo stays fully clear; the shadow sits behind the name.
const NAME_FADE = [
  'rgba(6, 11, 24, 0)',
  'rgba(6, 11, 24, 0)',
  'rgba(6, 11, 24, 0.62)',
  'rgba(6, 11, 24, 0.95)',
];
const NAME_FADE_AT = [0, 0.4, 0.7, 1];

interface ServiceCategoryTileProps {
  category: Category;
  width: number;
  index?: number;
  onPress: (category: Category) => void;
}

/**
 * Service category tile (Home's "What service do you need?" grid and its
 * "View all" screen): the category's own photo with a dark fade at the bottom
 * and its name in white on top. Without a photo it falls back to the pastel
 * icon tile.
 */
export function ServiceCategoryTile({
  category: c,
  width,
  index = 0,
  onPress,
}: ServiceCategoryTileProps) {
  return (
    <TouchableOpacity
      style={[styles.svcCatTile, { width, height: categoryTileHeight(width) }]}
      activeOpacity={0.85}
      onPress={() => onPress(c)}
      accessibilityRole="button"
      accessibilityLabel={c.name}
    >
      <RemoteImage
        uris={[c.imageUrl]}
        style={styles.fill}
        resizeMode="cover"
        fallback={
          <IconTile
            index={index}
            style={styles.svcCatIconTile}
            icon={
              <CategoryIcon
                slug={c.slug}
                size={26}
                color={iconTileColor(index)}
                strokeWidth={1.7}
              />
            }
          />
        }
      />
      <GradientBackground
        colors={NAME_FADE}
        locations={NAME_FADE_AT}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Text style={styles.svcCatName} numberOfLines={2}>
        {c.name}
      </Text>
    </TouchableOpacity>
  );
}
