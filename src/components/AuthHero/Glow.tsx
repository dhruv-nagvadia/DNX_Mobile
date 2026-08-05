import React from 'react';
import { Image } from 'react-native';

import { Images } from '@/assets/images';

import { GlowProps } from './types';
import { styles } from './styles';

/**
 * A soft radial glow.
 *
 * RN 0.76 has no native gradient or blur, and react-native-linear-gradient
 * would force a native rebuild. Instead this scales up a 192px white PNG whose
 * alpha follows a (1 - r²)² falloff; `tintColor` recolors it, so one asset
 * serves every glow. Bilinear upscaling keeps it perfectly smooth — the
 * earlier stacked-circle approach banded visibly.
 */
export function Glow({ size, color, top, left, right, opacity = 0.55 }: GlowProps) {
  return (
    <Image
      source={Images.glow}
      resizeMode="stretch"
      tintColor={color}
      style={[styles.glow, { width: size, height: size, top, left, right, opacity }]}
    />
  );
}
