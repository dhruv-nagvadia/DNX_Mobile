import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, TINT } from '@/utils/modernTheme';

// Mockup look ("Salon Business Management App UI Collage.png" → Services):
// light header, right-aligned filled "Add" button, one white rounded card
// listing every service with inset dividers.
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTION,
  },
  addBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: Spacing.md,
    ...CARD_SHADOW,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm + 6,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TINT.blue.colors[0],
    borderWidth: 1,
    borderColor: TINT.blue.border,
  },
  dimmed: {
    opacity: 0.55,
  },
  rowMain: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  iconBtn: {
    padding: 2,
  },
});
