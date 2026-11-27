import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Color } from '@/utils/Theme';

/**
 * Solid strip behind Android's navigation buttons. Since Android 15/16 the app draws edge to
 * edge, and the system only tints the navigation bar with a translucent scrim — so page content
 * (text, cards) scrolling past shows through behind the three buttons. This opaque strip, the
 * height of the navigation bar, sits under the buttons on every screen so nothing shows through.
 * Render it once, on top of the navigator. It never blocks touches.
 */
export function NavigationBarBackdrop() {
  const { bottom } = useSafeAreaInsets();
  if (Platform.OS !== 'android' || bottom <= 0) {
    return null;
  }
  return <View pointerEvents="none" style={[styles.bar, { height: bottom }]} />;
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    // Android orders overlapping views by elevation as well as zIndex; no visible shadow.
    elevation: 100,
    shadowColor: 'transparent',
    backgroundColor: Color.surface,
  },
});
