import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
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
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  field: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
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
  flex: {
    flex: 1,
  },
  description: {
    minHeight: 80,
  },
});
