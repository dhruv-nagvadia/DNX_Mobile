import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Color.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  message: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    lineHeight: FontSize.sm * 1.5,
  },
  input: {
    marginTop: Spacing.xs,
    minHeight: 90,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    fontSize: FontSize.sm,
    color: Color.textPrimary,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
