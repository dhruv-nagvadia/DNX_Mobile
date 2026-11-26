import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_SHADOW, INK, ModernSize, PAGE_BG } from '@/utils/modernTheme';

/** Same gap as Home's grids. */
export const GAP = 10;

/** Card styles mirror Home (HomeScreen/styles.ts) so both screens match. */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  fill: {
    width: '100%',
    height: '100%',
  },

  // Service tiles — Home's "What service do you need?"
  catTile: {
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    // Solid base under the gradient — Android only draws elevation for a filled view.
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  catName: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
    color: INK,
  },

  // Store-category photo cards — Home's "Shop by business"
  bizCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    ...CARD_SHADOW,
  },
  bizName: {
    position: 'absolute',
    left: 10,
    right: 8,
    bottom: 10,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
