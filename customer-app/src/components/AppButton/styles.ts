import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
  },
  primary: {
    backgroundColor: Color.primary,
  },
  secondary: {
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  // For dark surfaces — navy on ink has too little contrast.
  accent: {
    backgroundColor: Color.accent,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  primaryText: {
    color: Color.white,
  },
  secondaryText: {
    color: Color.primary,
  },
  accentText: {
    color: Color.ink,
    fontWeight: FontWeight.bold,
  },
});
