import { StyleSheet } from 'react-native';

import { FontWeight, Spacing } from '@/utils/Theme';
import { ModernSize, ModernType, PILL } from '@/utils/modernTheme';

// Shared form look lives in ServiceFormScreen/formKitStyles.ts — only the
// product-specific bits are here.
export const styles = StyleSheet.create({
  preview: {
    paddingHorizontal: ModernSize.gap,
    paddingVertical: Spacing.sm + 2,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: PILL.green.bg,
  },
  previewText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
});
