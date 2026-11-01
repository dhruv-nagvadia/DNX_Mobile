import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.white,
  },
  flex: {
    flex: 1,
  },

  stepper: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Color.divider,
  },
  stepDotActive: {
    backgroundColor: Color.primary,
  },
  stepMeta: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },

  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  stepTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  stepSubtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
    marginBottom: Spacing.xs,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
    marginBottom: 2,
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

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.border,
  },
  chipActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  chipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  chipTextActive: {
    color: Color.white,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  fieldError: {
    fontSize: FontSize.xs,
    color: Color.error,
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleMain: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  toggleHint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  example: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    backgroundColor: Color.divider,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },

  actionBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  actionButton: {
    flex: 1,
  },
});
