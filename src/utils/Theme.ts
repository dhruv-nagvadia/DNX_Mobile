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
  errorSoft: '#FEF0F0',
  success: '#16A34A',
  warning: '#F59E0B',
  overlay: 'rgba(15, 23, 42, 0.5)',

  // ── Dark "ink" surfaces — the auth hero and any dark hero strip ──────
  ink: '#060B18',
  ink2: '#0D1730',
  onDark: '#F8FAFC',
  onDarkMuted: 'rgba(248, 250, 252, 0.66)',
  onDarkFaint: 'rgba(248, 250, 252, 0.42)',

  // Glass layers that sit on top of ink.
  glass: 'rgba(255, 255, 255, 0.06)',
  glassStrong: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',

  // Accent — reserved for live/AI signals. Never body text.
  accent: '#38BDF8',
  accent2: '#818CF8',
  accentSoft: 'rgba(56, 189, 248, 0.16)',
};

/** Animation durations, in ms. Mirrors --dur-* on the web app. */
export const Duration = {
  fast: 140,
  mid: 260,
  slow: 560,
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
  xl: 28,
  pill: 999,
};

/** Soft card shadow (iOS) + elevation (Android). */
export const Shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
};
