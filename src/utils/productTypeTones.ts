import { Color } from './Theme';

/**
 * Cycled per product-type tile for a colorful "shelf" look (the Blinkit/Zepto
 * category-grid pattern) — shared so Home's teaser grid and the full "Shop by
 * product" screen stay visually consistent. Deliberately 6 tones against a
 * 4-column grid (not a multiple of 4), so the color pattern actually varies
 * from row to row instead of forming plain vertical stripes.
 */
export const PRODUCT_TYPE_TONES = [
  { bg: Color.primarySoft, fg: Color.primary },
  { bg: Color.roseSoft, fg: Color.rose },
  { bg: Color.warningSoft, fg: Color.warning },
  { bg: Color.successSoft, fg: Color.success },
  { bg: Color.tealSoft, fg: Color.teal },
  { bg: Color.errorSoft, fg: Color.error },
];
