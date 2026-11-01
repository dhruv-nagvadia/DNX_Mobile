import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statTile: {
    flexBasis: '48%',
    flexGrow: 1,
    position: 'relative',
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
    paddingRight: 48,
    gap: Spacing.xs,
    ...Shadow.card,
  },
  statTileWide: {
    flexBasis: '100%',
    paddingRight: Spacing.md,
  },
  statIcon: {
    position: 'absolute',
    top: Spacing.sm + 2,
    right: Spacing.sm + 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  statHint: {
    fontSize: FontSize.xs,
    color: Color.placeholder,
  },

  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
    ...Shadow.card,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  sectionGroup: {
    gap: Spacing.xs,
  },
  sectionHeaderOuter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  sectionCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  sectionCountText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  ctaLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.primary,
    marginTop: Spacing.xs,
  },
  emptyCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.sm + 2,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  rowTime: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
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
  edgeBadge: {
    marginRight: -(Spacing.sm + 2),
  },

  orderRowRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  collectText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.success,
  },
});
