import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },

  // ── Daily break card ───────────────────────────────────────────────────
  breakCard: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md,
    gap: Spacing.sm + 4,
    ...CARD_SHADOW,
  },
  breakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  breakHeaderText: {
    flex: 1,
    gap: 2,
  },
  breakTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  breakHint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  breakLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rangeDash: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── Weekly hours card ──────────────────────────────────────────────────
  daysCard: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: Spacing.md,
    ...CARD_SHADOW,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  dayRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Color.divider,
  },
  dayName: {
    width: 40,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  dayNameClosed: {
    fontWeight: FontWeight.semibold,
  },
  daySwitch: {
    marginRight: 2,
  },
  dayTimes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rangeDashSmall: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  closedText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Color.placeholder,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  // ── Pinned save button ─────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
    backgroundColor: PAGE_BG,
  },
  saveButton: {
    backgroundColor: ACTION,
    borderRadius: ModernRadius.button,
  },
});
