import { StyleSheet } from 'react-native';
import { Color, Font, FontSize, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  heading: {
    marginBottom: Spacing.xl,
  },
  field: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.md,
    fontFamily: Font.reg,
    color: Color.textPrimary,
  },
  inputError: {
    borderColor: Color.error,
  },
  errorText: {
    color: Color.error,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  button: {
    backgroundColor: Color.primary,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Color.white,
    fontFamily: Font.semibold,
    fontSize: FontSize.lg,
  },
});
