import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_SHADOW, INK, ModernSize, PAGE_BG } from '@/utils/modernTheme';

/** Same gap as Home's grids. */
export const GAP = 10;

/** Mirrors Home's "Shop by product" card (HomeScreen/styles.ts). */
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
  productCard: {
    borderRadius: 14,
    backgroundColor: Color.white,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cutout: {
    width: '84%',
    height: '88%',
  },
  name: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
});
