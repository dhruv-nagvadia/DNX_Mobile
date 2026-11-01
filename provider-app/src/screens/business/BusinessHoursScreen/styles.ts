import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  dayCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  timesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeField: {
    flex: 1,
  },
  closedText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  breakCard: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  breakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  breakHint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
});
