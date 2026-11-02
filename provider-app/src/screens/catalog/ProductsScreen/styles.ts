import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, TINT } from '@/utils/modernTheme';

// Mockup look ("Salon Business Management App UI Collage.png" → Products):
// light header, right-aligned filled "Add" button, one white rounded card
// listing every product with inset dividers, outlined "Manage Stock" footer.
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
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
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 6,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  dimmed: {
    opacity: 0.55,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: ModernRadius.box,
    backgroundColor: Color.divider,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TINT.blue.colors[0],
    borderWidth: 1,
    borderColor: TINT.blue.border,
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
  stockPill: {
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  iconBtn: {
    padding: 2,
  },

  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    backgroundColor: PAGE_BG,
  },
  stockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: ACTION,
    backgroundColor: Color.white,
  },
  stockBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: ACTION,
  },
});
