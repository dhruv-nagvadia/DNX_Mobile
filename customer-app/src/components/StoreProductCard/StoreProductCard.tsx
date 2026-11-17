import React from 'react';
import { useWindowDimensions } from 'react-native';

import { StoreItemCard } from '@/components/StoreItemCard';
import { Product } from '@/redux/api/provider/types';

interface StoreProductCardProps {
  product: Product;
  providerId: string;
  providerName: string;
  depositPercent?: number;
  /** Kept for callers; the card no longer shows category art for products. */
  categorySlug?: string;
  // Shown under the name — the selling store, for contexts spanning several
  // stores (e.g. "shop by category" from the home screen).
  storeLabel?: string;
  /** Card width; defaults to two per row in a 24 pt-padded, 16 pt-gap grid. */
  width?: number;
  onPress: () => void;
}

const GRID_PADDING = 24;
const GRID_GAP = 16;

/** Product grids (store catalogue, shop by product) — the shared StoreItemCard. */
export function StoreProductCard({
  product,
  providerId,
  providerName,
  depositPercent,
  storeLabel,
  width,
  onPress,
}: StoreProductCardProps) {
  const { width: screenW } = useWindowDimensions();
  const cardW = width ?? Math.floor((screenW - GRID_PADDING * 2 - GRID_GAP) / 2);
  return (
    <StoreItemCard
      product={product}
      providerId={providerId}
      providerName={providerName}
      depositPercent={depositPercent}
      width={cardW}
      storeLabel={storeLabel}
      onPress={onPress}
    />
  );
}
