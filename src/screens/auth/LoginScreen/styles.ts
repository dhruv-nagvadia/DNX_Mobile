import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Ink behind everything, so the status bar area matches the hero.
    backgroundColor: Color.ink,
  },
  flex: {
    flex: 1,
  },

  /**
   * Takes the remaining height and clips its scrolling child to the rounded
   * top corners — this is what keeps scrolling inside the sheet instead of
   * moving the whole screen.
   */
  sheet: {
    flex: 1,
    backgroundColor: Color.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Spacing.lg,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  formSection: {
    gap: Spacing.xs,
  },
  heading: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    color: Color.textPrimary,
  },
  subheading: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.5,
    color: Color.textSecondary,
    marginBottom: Spacing.lg,
  },
  submit: {
    marginTop: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  switchText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  switchLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
});
