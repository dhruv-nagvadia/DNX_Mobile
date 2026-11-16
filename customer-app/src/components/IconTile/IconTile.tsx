import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { GradientBackground } from '@/components/GradientBackground';
import { TILE_CYCLE } from '@/utils/homeTiles';

interface IconTileProps {
  icon: ReactNode;
  /** Picks the pastel theme from TILE_CYCLE. */
  index?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pastel gradient tile with a centred icon — stands in when an API image is missing. */
export function IconTile({ icon, index = 0, style }: IconTileProps) {
  const tint = TILE_CYCLE[index % TILE_CYCLE.length];
  return (
    <View style={[styles.tile, style]}>
      <GradientBackground colors={tint.colors} />
      {icon}
    </View>
  );
}

/** Icon colour that matches IconTile's pastel for the same index. */
export function iconTileColor(index = 0): string {
  return TILE_CYCLE[index % TILE_CYCLE.length].icon;
}

const styles = StyleSheet.create({
  tile: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
