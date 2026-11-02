import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, PAGE_BG } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm + 4,
  },
  addBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: 12,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTION,
    marginBottom: Spacing.xs,
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
    paddingVertical: Spacing.md,
    gap: 4,
    ...CARD_SHADOW,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  code: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: ACTION,
    letterSpacing: 0.3,
  },
  codeOff: {
    color: INK,
  },
  iconBtn: {
    padding: 4,
  },

  discount: {
    fontSize: FontSize.sm,
    color: INK,
  },
  discountMain: {
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  discountMainOff: {
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  meta: {
    fontSize: FontSize.sm,
    color: INK,
  },
  metaGap: {
    marginTop: Spacing.xs,
  },
  expiryDate: {
    color: ACTION,
    fontWeight: FontWeight.medium,
  },
  expired: {
    color: Color.error,
    fontWeight: FontWeight.semibold,
  },
});
