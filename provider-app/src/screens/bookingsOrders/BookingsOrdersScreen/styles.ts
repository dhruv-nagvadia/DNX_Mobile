import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import {
  ACTION,
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  ModernRadius,
  PAGE_BG,
  SOFT_FILL,
} from '@/utils/modernTheme';

/**
 * Mockup look ("Salon Business Management App UI Collage.png" → Bookings):
 * light header, pill filter chips, white 16px cards with the customer name,
 * a status pill and inline 12px-radius action buttons.
 */
export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },

  // Bookings / Orders segment (tab root only)
  segment: {
    flexDirection: 'row',
    backgroundColor: SOFT_FILL,
    borderRadius: ModernRadius.box,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: ModernRadius.box - 2,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Color.white,
    ...CARD_SHADOW,
    shadowOpacity: 0.05,
    elevation: 1,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: INK,
  },

  // Status filter chips
  chipsScroll: {
    flexGrow: 0,
  },
  chipsContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: ModernRadius.pill,
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  chipActive: {
    backgroundColor: ACTION,
    borderColor: ACTION,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
  },

  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // Card
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  cardBody: {
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  pillCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pillRight: {
    alignSelf: 'flex-end',
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  cardMeta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // Inline actions
  actions: {
    gap: Spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
  },
  btnPrimary: {
    backgroundColor: ACTION,
    borderColor: ACTION,
  },
  btnDanger: {
    backgroundColor: Color.white,
    borderColor: Color.error,
  },
  btnOutline: {
    backgroundColor: Color.white,
    borderColor: ACTION,
  },
  btnBusy: {
    opacity: 0.6,
  },
  btnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  btnTextPrimary: {
    color: Color.white,
  },
  btnTextDanger: {
    color: Color.error,
  },
  btnTextOutline: {
    color: ACTION,
  },
});
