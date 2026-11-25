import { useCallback } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const num = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined);

/**
 * Adds the bottom safe-area inset (iPhone home indicator, Android navigation
 * bar — Android draws edge-to-edge since targetSdk 36) on top of a scroll
 * view's own bottom padding, so its last item can scroll clear of the system UI.
 *
 *   const withBottomInset = useBottomInsetStyle();
 *   <ScrollView contentContainerStyle={withBottomInset(styles.content)} />
 */
export function useBottomInsetStyle() {
  const { bottom } = useSafeAreaInsets();
  return useCallback(
    (style: StyleProp<ViewStyle>): StyleProp<ViewStyle> => {
      const flat = StyleSheet.flatten(style) ?? {};
      const base = num(flat.paddingBottom) ?? num(flat.paddingVertical) ?? num(flat.padding) ?? 0;
      return [style, { paddingBottom: base + bottom }];
    },
    [bottom],
  );
}
