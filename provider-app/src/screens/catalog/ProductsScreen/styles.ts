import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

/** Mockup "Product Inventory Management Screen.png": light header with a round
 * add button, search, section chips, pastel stock tiles, rich product cards
 * and a sticky outlined "Manage Stock" button. Mirrors BusinessesScreen. */
export const THUMB = 64;
export const BRAND_BLUE = '#1D4ED8';
export const STAR = '#F5B301';
export const SWITCH_OFF = '#D5DAE3';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  listContent: {
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
    alignSelf: 'flex-start',
    paddingTop: 6,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  addBtn: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_BLUE,
    ...CARD_SHADOW,
  },

  // ── Search + chips ──────────────────────────────────────────────────────
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: ModernType.body,
    color: INK,
  },
  // Bleed the chip row to the screen edges so chips scroll off-screen.
  chipsScroll: {
    marginHorizontal: -Spacing.md,
    flexGrow: 0,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  chip: {
    minWidth: 64,
    alignItems: 'center',
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: BRAND_BLUE,
    backgroundColor: BRAND_BLUE,
  },
  chipText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },

  // ── Summary tiles ───────────────────────────────────────────────────────
  tiles: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
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
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Product card ────────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    gap: Spacing.sm + 2,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  meta: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  dot: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  ratingValue: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // Right column: toggle over edit/delete
  side: {
    alignItems: 'flex-end',
    gap: Spacing.sm + 2,
  },
  switch: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
  },
  sideBtns: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  editBtn: {
    width: ModernSize.controlSm,
    height: ModernSize.controlSm,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  deleteBtn: {
    width: ModernSize.controlSm,
    height: ModernSize.controlSm,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F6C9C9',
    backgroundColor: '#FFF4F4',
  },

  divider: {
    height: 1,
    marginLeft: THUMB + Spacing.sm + 4,
    backgroundColor: CARD_BORDER,
  },

  // Bottom row: stock pill + payment chips
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  stockPill: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
  },
  stockPillText: {
    flexShrink: 1,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },
  payChips: {
    flexDirection: 'row',
    gap: 6,
  },
  payChip: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.grey.bg,
  },
  payChipText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  noMatch: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },

  // ── Sticky footer ───────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  stockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
    height: ModernSize.control,
  },
  stockBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: BRAND_BLUE,
  },
});
