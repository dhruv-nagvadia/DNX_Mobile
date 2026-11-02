import { moderateScale } from 'react-native-size-matters';

/**
 * The ONLY place colors, fonts, and font sizes are defined.
 * Never hardcode these values anywhere else in the app.
 *
 * Mirrors the customer app's and the web provider dashboard's tokens so the
 * provider app reads as the same product family.
 */
export const Color = {
  // Brand — navy blue (shared palette spec, see frontend/src/styles/theme.css)
  primary: '#1E3A8A',
  primaryDark: '#14264E',
  primaryHover: '#24479C',
  primarySoft: '#DBEAFE',

  white: '#FFFFFF',
  black: '#000000',
  background: '#F4F7FC',
  // Soft neutral fill for dividers, placeholder boxes and "neutral" chips —
  // background is plain white now, so these need their own distinct value.
  divider: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',

  textPrimary: '#0F172A',
  // Mirrors the shared spec's "muted" text tier (labels, timestamps). The
  // app only has one secondary-text tier today, so this keeps its existing
  // value rather than adopting the spec's separate, darker "secondary" tier.
  textSecondary: '#64748B',
  textMuted: '#64748B',
  placeholder: '#94A3B8',

  border: '#E2E8F0',
  error: '#DC2626',
  errorSoft: '#FEE2E2',
  errorBorder: 'rgba(220, 38, 38, 0.35)',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  successBorder: 'rgba(22, 163, 74, 0.35)',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  warningBorder: 'rgba(217, 119, 6, 0.35)',
  info: '#1D4ED8',
  infoSoft: '#DBEAFE',
  infoBorder: 'rgba(29, 78, 216, 0.35)',
  special: '#6B21A8',
  specialSoft: '#F3E8FF',
  specialBorder: 'rgba(107, 33, 168, 0.35)',
  overlay: 'rgba(15, 23, 42, 0.5)',
  primaryBorder: 'rgba(30, 58, 138, 0.3)',

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

  // Accent — reserved for live/status signals. Never body text.
  accent: '#38BDF8',
  accent2: '#818CF8',
  accentSoft: 'rgba(56, 189, 248, 0.16)',
  accentBorder: 'rgba(56, 189, 248, 0.35)',

  // Light-blue hero gradient — used only by the login/auth heroes.
  heroBlue1: '#38BDF8',
  heroBlue2: '#5AA9FF',
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

/**
 * Mirrors iOS's own Human Interface Guidelines type scale (Caption → Footnote
 * → Body → Headline → Title3/2/1), so every screen should pick its text sizes
 * by ROLE, not by eyeballing what "looks right" on that one screen:
 *
 *   xxxl (34) — hero numbers only (e.g. a big currency amount)
 *   xxl  (27) — large stat/summary figures (e.g. a stat tile's count)
 *   xl   (21) — screen titles (e.g. a nav bar / page header)
 *   lg   (18) — top-of-screen greeting/header text
 *   md   (16) — section headers (e.g. a list section's title)
 *   sm   (14) — item/row names, button labels — the "thing itself"
 *   xs   (12) — secondary/description text, meta, captions, timestamps —
 *               always a step below whatever name/title it sits under
 *
 * Keeping every screen on this same role → size mapping (rather than each
 * screen inventing its own) is what makes text sizes feel consistent across
 * the whole app.
 */
export const FontSize = {
  xs: moderateScale(12),
  sm: moderateScale(14),
  md: moderateScale(16),
  lg: moderateScale(18),
  xl: moderateScale(21),
  xxl: moderateScale(27),
  xxxl: moderateScale(34),
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Radius = {
  sm: 3,
  md: 5,
  lg: 6,
  xl: 8,
  pill: 999,
};

/** No shadows — sections are separated by a light border only. */
export const Shadow = {
  card: {},
};
