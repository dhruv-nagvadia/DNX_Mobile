import { Color } from './Theme';

/**
 * Tokens for the "modern" mockup look — Home + the Business Detail flow
 * ("Modern Provider Dashboard App Interface.png" and "Salon Business
 * Management App UI Collage.png"): light headers, deep-navy ink text, soft
 * shadows, 16px rounded cards and pastel pills/tiles.
 *
 * Screens outside those mockups keep the flat/no-shadow/navy-header
 * convention from Theme.ts — only reach for these on a screen that has been
 * redesigned to the mockups.
 */

/** Deep navy used for headings, values and icons on light surfaces. */
export const INK = '#0F1E4A';
export const PAGE_BG = Color.background; // #F4F7FC
export const CARD_BORDER = '#DCE2EB';
export const SOFT_FILL = '#F1F3F7';
/** Primary call-to-action blue (buttons, active segment, links). */
export const ACTION = '#1E40AF';
export const LINK = Color.info; // #1D4ED8

export const ModernRadius = {
  card: 16,
  box: 12,
  button: 12,
  pill: 999,
};

export const CARD_SHADOW = {
  shadowColor: '#1E293B',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 1,
};

export type PillColors = { bg: string; fg: string };

/** Pill colour pairs, as used across the mockups. */
export const PILL = {
  orange: { bg: '#FDEBD8', fg: '#C2410C' },
  green: { bg: '#DCFCE7', fg: '#15803D' },
  lavender: { bg: '#EDE9FE', fg: '#5B21B6' },
  blue: { bg: '#DBEAFE', fg: '#1D4ED8' },
  grey: { bg: SOFT_FILL, fg: INK },
  red: { bg: '#FDE2E2', fg: '#DC2626' },
  yellow: { bg: '#FEF3C7', fg: '#B45309' },
  teal: { bg: '#CCFBF1', fg: '#0F766E' },
} satisfies Record<string, PillColors>;

/** Pastel tile themes (Manage grid / stat tiles): gradient, border, icon colour. */
export const TINT = {
  blue: { colors: ['#EEF4FF', '#DDE8FC'], border: '#D5E2FA', icon: '#2563EB' },
  lavender: { colors: ['#F4F1FF', '#E7E2FB'], border: '#E0DAF7', icon: '#4F46E5' },
  peach: { colors: ['#FFF9EE', '#FCEFDA'], border: '#F7E6C8', icon: '#C2410C' },
  mint: { colors: ['#EEFBF4', '#DDF3E7'], border: '#CDEBDB', icon: '#15803D' },
  pink: { colors: ['#FFF3F3', '#FCE1E1'], border: '#F8D4D4', icon: '#DC2626' },
};

/**
 * Standard sizing scale — every redesigned screen uses these so text,
 * controls and icons are the same size everywhere.
 */
export const ModernType = {
  /** Tab-root large title ("Profile", "Bookings & Orders"). */
  largeTitle: 26,
  /** Pushed-screen header title. */
  title: 20,
  /** Card / section title. */
  cardTitle: 17,
  /** List row title. */
  rowTitle: 15,
  body: 14,
  secondary: 13,
  /** Captions, pills, labels. */
  caption: 12,
  /** Stat tile value. */
  stat: 22,
  /** One hero figure per screen (Home revenue, Earnings balance, Reviews average). */
  hero: 30,
  /** Auth hero title ("DNX Provider"). */
  authHero: 30,
  /** Auth card heading ("Welcome back"). */
  authHeading: 26,
} as const;

export const ModernSize = {
  /** Input / primary button height. */
  control: 48,
  /** Compact button height. */
  controlSm: 36,
  controlRadius: 12,
  icon: 20,
  iconSm: 16,
  /** Round/square icon chip. */
  iconBox: 40,
  avatar: 40,
  gutter: 16,
  cardPad: 16,
  gap: 12,
  rowMinHeight: 56,
} as const;
