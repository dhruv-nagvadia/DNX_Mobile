import { moderateScale } from 'react-native-size-matters';

/**
 * The ONLY place colors, fonts, and font sizes are defined.
 * Never hardcode these values anywhere else in the app.
 */
export const Color = {
  primary: '#2BA6A0',
  primaryDark: '#238A85',
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  error: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  border: '#E7ECF0',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Using system fonts by default. When you add DM Sans .ttf files to
// src/assets/fonts and link them, swap the values below to the font names.
export const Font = {
  bold: 'System',
  semibold: 'System',
  medium: 'System',
  reg: 'System',
  light: 'System',
};

export const FontSize = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  md: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(18),
  xxl: moderateScale(24),
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
