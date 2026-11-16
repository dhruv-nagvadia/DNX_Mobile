import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { iconTileColor } from '@/components/IconTile';
import { ProductTypeIcon } from '@/components/ProductTypeIcon';
import { RemoteImage } from '@/components/RemoteImage';
import { ProductType } from '@/redux/api/productType/types';
import { PRODUCT_BG } from '@/utils/homeTiles';

import { styles } from './styles';

interface ProductTypeCardProps {
  type: ProductType;
  width: number;
  index?: number;
  onPress: (type: ProductType) => void;
}

/** "Shop by product" card: pastel backdrop + cut-out image, name underneath. */
export function ProductTypeCard({ type: t, width, index = 0, onPress }: ProductTypeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.productCard, { width }]}
      activeOpacity={0.85}
      onPress={() => onPress(t)}
    >
      <View style={[styles.productImageWrap, { height: Math.round(width * 0.72) }]}>
        {/* Real type images are transparent cut-outs → contained on a pastel
            backdrop; the dummy is a full photo → cover. */}
        {/* Type images (API) are transparent cut-outs → contained on a pastel backdrop. */}
        <GradientBackground colors={PRODUCT_BG[index % PRODUCT_BG.length]} />
        <RemoteImage
          uris={[t.iconUrl]}
          style={styles.productCutout}
          resizeMode="contain"
          fallback={
            <ProductTypeIcon
              slug={t.slug}
              size={34}
              color={iconTileColor(index)}
              strokeWidth={1.7}
            />
          }
        />
      </View>
      <Text
        style={styles.productName}
        // Full-size name; long names wrap to a second line instead of shrinking.
        numberOfLines={2}
      >
        {t.name}
      </Text>
    </TouchableOpacity>
  );
}
