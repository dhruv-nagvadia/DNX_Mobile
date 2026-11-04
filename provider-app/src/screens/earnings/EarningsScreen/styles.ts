import { StyleSheet } from 'react-native';

import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

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
    gap: Spacing.sm + 4,
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
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  bellBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    paddingHorizontal: Spacing.md + 2,
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
    fontSize: FontSize.md,
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
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernRadius.box + 2,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  selectText: {
    flex: 1,
    fontSize: FontSize.md,
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
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  retryBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTIVE_BLUE,
  },
  retryText: {
    fontSize: FontSize.sm,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.onDark,
  },
  balanceChipTextOwe: {
    color: PILL.orange.fg,
  },
  balanceValue: {
    alignSelf: 'stretch',
    fontSize: FontSize.xxxl,
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
    fontSize: FontSize.xs,
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
    fontSize: FontSize.sm,
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
    fontSize: FontSize.xs,
    color: 'rgba(248, 250, 252, 0.82)',
  },
  breakdownValue: {
    fontSize: FontSize.xs,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    color: Color.onDark,
  },

  // ── Tiles ───────────────────────────────────────────────────────────────
  tileGrid: {
    gap: Spacing.sm + 2,
  },
  tileRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  tileHint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tileTrend: {
    fontSize: FontSize.sm,
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
    paddingVertical: Spacing.sm + 6,
    gap: Spacing.sm,
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    paddingVertical: Spacing.sm,
  },
  footNote: {
    fontSize: FontSize.xs,
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
    fontSize: FontSize.xs,
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
    fontSize: FontSize.xs,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  legendRowValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── List rows (business / sales / payouts) ──────────────────────────────
  listRow: {
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  listMeta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  listRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
    maxWidth: '45%',
  },

  bizThumb: {
    width: 64,
    height: 46,
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  saleIcon: {
    width: 46,
    height: 46,
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
    fontSize: FontSize.md,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: ACTIVE_BLUE,
  },

  payoutRow: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  payoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginLeft: 40 + Spacing.sm + 2,
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: SOFT_FILL,
    gap: 2,
  },
  payoutDetailText: {
    fontSize: FontSize.sm,
    color: INK,
  },
});
