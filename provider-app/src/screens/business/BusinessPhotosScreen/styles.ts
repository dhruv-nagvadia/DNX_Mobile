import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_SHADOW, LINK, ModernRadius, PAGE_BG, PillColors } from '@/utils/modernTheme';

/** Solid blue "Cover" tag on the first tile (mockup), not the pastel PILL.blue. */
export const COVER_PILL: PillColors = { bg: LINK, fg: Color.white };

const ADD_BG = '#E8F0FD';
const ADD_BORDER = '#BCD0F5';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    height: 64,
    borderRadius: ModernRadius.box,
    borderWidth: 1.5,
    borderColor: ADD_BORDER,
    backgroundColor: ADD_BG,
  },
  addBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md,
  },
  tile: {
    position: 'relative',
    width: '48%',
    aspectRatio: 0.92,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.surface,
    ...CARD_SHADOW,
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: ModernRadius.card,
    backgroundColor: Color.divider,
  },
  coverPill: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  menuBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
});
