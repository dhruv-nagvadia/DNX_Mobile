import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  // Forms that space their own fields opt out of the margin.
  dense: {
    marginBottom: 0,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  inputRowFocused: {
    borderColor: Color.primary,
    // Stands in for the web's focus ring; RN has no box-shadow on Android.
    borderWidth: 2,
    paddingHorizontal: Spacing.md - 1,
  },
  inputRowError: {
    borderColor: Color.error,
    backgroundColor: Color.errorSoft,
  },
  prefix: {
    paddingRight: Spacing.sm + 2,
    marginRight: Spacing.sm + 2,
    borderRightWidth: 1,
    borderRightColor: Color.border,
    // Matches the input height so the divider spans the full field.
    height: 28,
    justifyContent: 'center',
  },
  prefixText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: FontSize.md,
    color: Color.textPrimary,
    padding: 0,
  },
  toggle: {
    paddingLeft: Spacing.sm,
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
  error: {
    marginTop: 5,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Color.error,
  },
  hint: {
    marginTop: 5,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
});
