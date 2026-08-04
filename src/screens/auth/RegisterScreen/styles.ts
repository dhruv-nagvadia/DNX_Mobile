import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logoText: {
    color: Color.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
  },
  heading: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
    marginBottom: Spacing.xs,
  },
  subheading: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
    marginBottom: Spacing.lg,
  },
  serverError: {
    backgroundColor: '#FEECEC',
    borderColor: Color.error,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    color: Color.error,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  submit: {
    marginTop: Spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  switchText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  switchLink: {
    fontSize: FontSize.sm,
    color: Color.primary,
    fontWeight: FontWeight.semibold,
  },
});
