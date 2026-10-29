import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },

  header: {
    gap: 2,
  },
  greeting: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  businessCount: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
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
  statTileWide: {
    flexBasis: '100%',
  },
  statValue: {
    fontSize: FontSize.xxl,
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
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  rowBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Color.warningSoft,
  },
  rowBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.warning,
  },

  emptyBusinesses: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
    alignItems: 'center',
    ...Shadow.card,
  },
});
