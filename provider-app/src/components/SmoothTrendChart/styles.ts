import { StyleSheet } from 'react-native';

import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK } from '@/utils/modernTheme';

export const SERIES_BLUE = '#1D4ED8';
export const SECONDARY_ORANGE = '#F97316';

export const styles = StyleSheet.create({
  root: {
    gap: Spacing.sm,
  },
  wrap: {
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  bubbleText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  caption: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: SERIES_BLUE,
  },
  legendDash: {
    flexDirection: 'row',
    gap: 2,
  },
  legendDashSeg: {
    width: 6,
    height: 2,
    backgroundColor: SECONDARY_ORANGE,
  },
  legendText: {
    fontSize: FontSize.sm,
    color: INK,
  },
});
