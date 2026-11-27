import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigationRef } from '@/navigation/NavigationService';
import { ROUTES } from '@/navigation/routes';
import { Color } from '@/utils/Theme';

/**
 * Solid strip behind Android's navigation buttons. Since Android 15/16 the app draws edge to
 * edge, and the system only tints the navigation bar with a translucent scrim — so page content
 * (text, cards) scrolling past shows through behind the three buttons. This opaque strip, the
 * height of the navigation bar, sits under the buttons on every screen so nothing shows through.
 * Render it once, on top of the navigator. It never blocks touches.
 */
/** Screens with a dark full-bleed background, where the strip is black instead of white. */
const DARK_ROUTES: string[] = [ROUTES.GALLERY];

export function NavigationBarBackdrop() {
  const { bottom } = useSafeAreaInsets();
  const [route, setRoute] = useState<string | undefined>();

  // Follow the visible screen so the strip can match a dark one (the photo gallery).
  useEffect(() => {
    const update = () => setRoute(navigationRef.getCurrentRoute()?.name);
    update();
    return navigationRef.addListener('state', update);
  }, []);

  if (Platform.OS !== 'android' || bottom <= 0) {
    return null;
  }
  const dark = !!route && DARK_ROUTES.includes(route);
  return (
    <View
      pointerEvents="none"
      style={[styles.bar, { height: bottom }, dark && styles.barDark]}
    />
  );
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
  barDark: {
    backgroundColor: '#000000',
  },
});
