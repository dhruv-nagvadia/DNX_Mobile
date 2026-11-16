import { TINT } from './modernTheme';

/**
 * Card colours shared by Home and its "View all" screens, so a category or
 * product looks the same in both places.
 */

/** Service-category tiles cycle through these pastel themes. */
export const TILE_CYCLE = [
  TINT.blue,
  TINT.lavender,
  TINT.mint,
  TINT.peach,
  TINT.pink,
  TINT.mint,
  TINT.peach,
  TINT.blue,
];

/** Warm/cool pastel backdrops behind "Shop by product" cut-out images. */
export const PRODUCT_BG = [
  ['#FFF4E5', '#FFE3C2'],
  ['#FDEBF3', '#F9D3E4'],
  ['#E7F6EE', '#CDEEDB'],
  ['#EAF1FF', '#D4E2FF'],
  ['#F2ECFF', '#E0D4FB'],
];

/** Bottom-up dark fade so white labels read on photos. */
export const IMAGE_FADE = ['rgba(6, 11, 24, 0)', 'rgba(6, 11, 24, 0.7)'];
