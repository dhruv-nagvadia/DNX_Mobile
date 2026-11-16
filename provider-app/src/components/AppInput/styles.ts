import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { ModernSize, ModernType } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  // Forms that space their own fields opt out of the margin.
  dense: {
    marginBottom: 0,
  },
  label: {
    fontSize: ModernType.body,
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
    borderRadius: ModernSize.controlRadius,
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
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  input: {
    flex: 1,
    // The row's 1px border (2px focused, with padding compensating) wraps
    // this, so the field's outer height lands on ModernSize.control.
    height: ModernSize.control - 2,
    fontSize: ModernType.rowTitle,
    color: Color.textPrimary,
    padding: 0,
  },
  toggle: {
    paddingLeft: Spacing.sm,
  },
  toggleText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
  error: {
    marginTop: 5,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: Color.error,
  },
  hint: {
    marginTop: 5,
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
});
