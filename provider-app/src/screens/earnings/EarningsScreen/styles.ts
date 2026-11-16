import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

/** Local look for "DNX Earnings Dashboard UI.png" — mirrors Home's navy
 * money card and the Businesses screen's header/chips/pastel tiles. */

/** Payout-balance card: deep navy. */
export const BALANCE_GRADIENT = ['#163A8F', '#0F2A6E', '#0A1E55'];
export const ACTIVE_BLUE = '#1D4ED8';
export const CASH_GREEN = '#4CC352';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  statusSpacer: {
    backgroundColor: PAGE_BG,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.xs,
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
  bellBtn: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },

  // ── Period chips + business select ──────────────────────────────────────
  chipsScroll: {
    flexGrow: 0,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md - 2,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: ACTIVE_BLUE,
    backgroundColor: ACTIVE_BLUE,
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
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    height: ModernSize.control,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  selectText: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Loading / error ─────────────────────────────────────────────────────
  stateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  stateText: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },
  retryBtn: {
    justifyContent: 'center',
    height: ModernSize.controlSm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 0,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTIVE_BLUE,
  },
  retryText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },

  // ── Payout balance card ─────────────────────────────────────────────────
  balanceCard: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ModernRadius.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm + 4,
    ...CARD_SHADOW,
  },
  balanceLeft: {
    flex: 1,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  balanceChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  balanceChipOwe: {
    backgroundColor: PILL.orange.bg,
  },
  balanceChipText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: Color.onDark,
  },
  balanceChipTextOwe: {
    color: PILL.orange.fg,
  },
  balanceValue: {
    alignSelf: 'stretch',
    fontSize: ModernType.hero,
    fontWeight: FontWeight.extrabold,
    color: Color.onDark,
  },
  manualPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.green.bg,
  },
  manualPillText: {
    flexShrink: 1,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  balanceDivider: {
    alignSelf: 'stretch',
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  balanceRight: {
    flex: 1.15,
    gap: 4,
  },
  breakdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  breakdownToggleText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.onDark,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  breakdownLabel: {
    flexShrink: 1,
    fontSize: ModernType.caption,
    color: 'rgba(248, 250, 252, 0.82)',
  },
  breakdownValue: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: Color.onDark,
  },
  breakdownTotal: {
    marginTop: 2,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
  },
  breakdownTotalText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.extrabold,
    color: Color.onDark,
  },

  // ── Tiles ───────────────────────────────────────────────────────────────
  tileGrid: {
    gap: ModernSize.gap,
  },
  tileRow: {
    flexDirection: 'row',
    gap: ModernSize.gap,
  },
  tile: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    overflow: 'hidden',
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.sm + 2,
  },
  tileIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  tileMain: {
    flex: 1,
    minWidth: 0,
    gap: 1,
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
  tileHint: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tileTrend: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: Spacing.md,
    paddingVertical: ModernSize.cardPad,
    gap: ModernSize.gap,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyText: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
    paddingVertical: Spacing.sm,
  },
  footNote: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // Segmented D | W | M
  segment: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  segmentItem: {
    minWidth: 34,
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: 6,
  },
  segmentItemActive: {
    backgroundColor: ACTIVE_BLUE,
  },
  segmentText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  segmentTextActive: {
    color: Color.white,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotBlue: {
    backgroundColor: ACTIVE_BLUE,
  },
  dotGreen: {
    backgroundColor: CASH_GREEN,
  },

  // How you were paid
  splitBar: {
    flexDirection: 'row',
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: SOFT_FILL,
  },
  splitEmpty: {
    flex: 1,
  },
  splitSeg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitOnline: {
    backgroundColor: ACTIVE_BLUE,
  },
  splitCash: {
    backgroundColor: CASH_GREEN,
  },
  splitText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
  },
  legendRowLabel: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  legendRowValue: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── List rows (business / sales / payouts) ──────────────────────────────
  listRow: {
    minHeight: ModernSize.rowMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm,
  },
  listRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Color.divider,
  },
  listRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  listMain: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  listTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  listMeta: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  listRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
    maxWidth: '45%',
  },

  bizThumb: {
    width: 56,
    height: 40,
    borderRadius: 8,
    backgroundColor: SOFT_FILL,
  },
  bizThumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizMain: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  bizAmount: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  saleIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleIconBooking: {
    backgroundColor: PILL.lavender.bg,
  },
  saleIconOrder: {
    backgroundColor: PILL.blue.bg,
  },
  saleAmount: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
  },
  amountPositive: {
    color: PILL.green.fg,
  },
  amountNegative: {
    color: Color.error,
  },

  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: ACTIVE_BLUE,
  },

  payoutRow: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  payoutIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutIconIn: {
    backgroundColor: PILL.green.bg,
  },
  payoutIconOut: {
    backgroundColor: PILL.orange.bg,
  },
  payoutDetail: {
    marginLeft: ModernSize.iconBox + Spacing.sm + 2,
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: SOFT_FILL,
    gap: 2,
  },
  payoutDetailText: {
    fontSize: ModernType.secondary,
    color: INK,
  },
});
