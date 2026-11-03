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
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 3,
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
