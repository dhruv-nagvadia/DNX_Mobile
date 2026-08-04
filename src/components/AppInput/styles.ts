import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
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
  },
  inputRowError: {
    borderColor: Color.error,
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
    color: Color.error,
  },
});
