import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: Spacing.xs,
  },

  resultCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.card,
  },
  resultName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  resultMeta: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  selectedCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  changeLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },

  segment: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Color.primarySoft,
    borderColor: Color.primary,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: Color.primary,
  },

  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  field: {
    flex: 1,
  },

  reasonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  reasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.border,
  },
  reasonChipActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  reasonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  reasonTextActive: {
    color: Color.white,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  outOfStockLink: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  outOfStockText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.error,
  },
});
