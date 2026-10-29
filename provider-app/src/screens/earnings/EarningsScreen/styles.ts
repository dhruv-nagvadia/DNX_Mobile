import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  presetRow: {
    gap: Spacing.xs,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
  },
  presetChipActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  presetText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  presetTextActive: {
    color: Color.white,
  },

  businessRow: {
    gap: Spacing.xs,
  },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statTile: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
    ...Shadow.card,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  statHint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  balanceCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 6,
    ...Shadow.card,
  },
  balanceTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  balanceValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  balanceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  balanceTotalLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  balanceTotalPositive: {
    color: Color.success,
  },
  balanceTotalNegative: {
    color: Color.error,
  },
  balanceFooter: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    marginTop: 2,
  },

  section: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  rowSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rowGross: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  rowEarning: {
    fontSize: FontSize.xs,
    color: Color.success,
  },
  rowCommission: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },

  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
});
