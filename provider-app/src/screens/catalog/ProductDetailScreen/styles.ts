import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

/** Mockup "Hair Serum Product Details App UI.png": light header with outlined
 * edit / pink delete buttons, a photo hero card, stock / sales / history /
 * reviews / details cards and a sticky filled "Edit Product" button.
 * Header mirrors ProductsScreen. */
export const BRAND_BLUE = '#1D4ED8';
export const STAR = '#F5B301';
export const STAR_EMPTY = '#D5DAE3';
export const SWITCH_OFF = '#D5DAE3';
const BAR_TRACK = '#E3E9F5';
const TICK = '#F59E0B';
const HERO_HEIGHT = 190;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    paddingVertical: 4,
  },
  title: {
    flex: 1,
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: INK,
    letterSpacing: -0.5,
  },
  headerBtns: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  editBtn: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
  },
  deleteBtn: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.red.bg,
  },

  // ── Cards (shared) ──────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    gap: Spacing.sm,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  cardHint: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  cardPill: {
    alignSelf: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  emptyText: {
    paddingVertical: Spacing.sm,
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    gap: Spacing.sm + 6,
    padding: Spacing.sm,
  },
  heroImageWrap: {
    width: '45%',
    height: HERO_HEIGHT,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  heroFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPill: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  heroSwitch: {
    position: 'absolute',
    top: Spacing.sm - 2,
    right: Spacing.sm - 2,
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  dotIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: PILL.green.fg,
  },
  dotInactive: {
    backgroundColor: Color.textSecondary,
  },
  heroInfo: {
    flex: 1,
    gap: 6,
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.xs,
  },
  name: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  price: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: BRAND_BLUE,
  },
  ratingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.sm,
    rowGap: 4,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  ratingCount: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  payChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  payChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.grey.bg,
  },
  payChipText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Stock ───────────────────────────────────────────────────────────────
  stockValue: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bar: {
    height: 10,
    marginTop: 2,
    borderRadius: 5,
    backgroundColor: BAR_TRACK,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: BRAND_BLUE,
  },
  barTick: {
    position: 'absolute',
    top: -5,
    width: 2,
    height: 20,
    marginLeft: -1,
    borderRadius: 1,
    backgroundColor: TICK,
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  barLabel: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  stockActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  addStockBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: BRAND_BLUE,
  },
  addStockText: {
    flexShrink: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  removeStockBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1.5,
    borderColor: INK,
    backgroundColor: Color.white,
  },
  removeStockText: {
    flexShrink: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  vDivider: {
    width: 1,
    height: 32,
    backgroundColor: CARD_BORDER,
  },
  madeToOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  madeToOrderText: {
    flex: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },

  // ── Sales ───────────────────────────────────────────────────────────────
  tiles: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValue: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  lastOrdered: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lastOrderedText: {
    fontSize: ModernType.secondary,
    color: INK,
  },

  // ── Recent stock changes ────────────────────────────────────────────────
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm,
  },
  changeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIconUp: {
    backgroundColor: PILL.green.bg,
  },
  changeIconDown: {
    backgroundColor: PILL.red.bg,
  },
  changeDelta: {
    minWidth: 64,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
  },
  deltaUp: {
    color: PILL.green.fg,
  },
  deltaDown: {
    color: Color.error,
  },
  changeMeta: {
    flex: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  changeAfter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeAfterText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Reviews ─────────────────────────────────────────────────────────────
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ratingBig: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  starHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ModernSize.gap,
    paddingVertical: Spacing.sm + 2,
  },
  avatar: {
    width: ModernSize.avatar,
    height: ModernSize.avatar,
    borderRadius: ModernSize.avatar / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
  },
  reviewBody: {
    flex: 1,
    gap: 4,
  },
  reviewHead: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: Spacing.sm,
    rowGap: 2,
  },
  reviewName: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewWhen: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  reviewComment: {
    fontSize: ModernType.body,
    color: INK,
    lineHeight: 20,
  },

  // ── Product details ─────────────────────────────────────────────────────
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
    minHeight: ModernSize.rowMinHeight,
  },
  detailIcon: {
    width: 24,
    alignItems: 'center',
  },
  detailLabel: {
    width: 110,
    fontSize: ModernType.body,
    color: INK,
  },
  detailValue: {
    flex: 1,
    fontSize: ModernType.body,
    color: INK,
  },
  descRow: {
    alignItems: 'flex-start',
  },
  descBody: {
    flex: 1,
    gap: 2,
  },
  descTitle: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  descText: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
    lineHeight: 18,
  },

  // ── Not found ───────────────────────────────────────────────────────────
  notFoundBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
    height: ModernSize.control,
    justifyContent: 'center',
  },
  notFoundBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Sticky footer ───────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
    ...CARD_SHADOW,
    height: ModernSize.control,
  },
  footerBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
