import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  busiestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  busiestText: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  emptyCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
  },
  empty: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.sm + 2,
  },
  rank: {
    width: 18,
    alignItems: 'center',
  },
  rankText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  itemImage: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Color.divider,
  },
  itemImageFallback: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  rowMain: {
    flex: 1,
    gap: 1,
  },
  rowName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  rowRevenue: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  countBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
});
