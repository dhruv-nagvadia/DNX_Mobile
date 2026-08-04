import { moderateScale } from 'react-native-size-matters';

/**
 * The ONLY place colors, fonts, and font sizes are defined.
 * Never hardcode these values anywhere else in the app.
 */
export const Color = {
  // Brand — navy blue
  primary: '#1E3A8A',
  primaryDark: '#172554',
  primaryHover: '#24479C',
  primarySoft: '#EAF0FB',

  white: '#FFFFFF',
  black: '#000000',
  background: '#F4F7FB',
  surface: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  placeholder: '#94A3B8',

  border: '#E2E8F0',
  error: '#EF4444',
  success: '#16A34A',
  warning: '#F59E0B',
  overlay: 'rgba(15, 23, 42, 0.5)',
};

// Using the system font; weight is controlled per-style via fontWeight.
export const Font = {
  bold: 'System',
  semibold: 'System',
  medium: 'System',
  reg: 'System',
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const FontSize = {
  xs: moderateScale(11),
  sm: moderateScale(13),
  md: moderateScale(15),
  lg: moderateScale(17),
  xl: moderateScale(20),
  xxl: moderateScale(26),
  xxxl: moderateScale(32),
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};
