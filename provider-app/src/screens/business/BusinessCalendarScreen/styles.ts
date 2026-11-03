import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

/**
 * Mockup "Salon Calendar and Bookings UI.png": light header with a Today
 * pill, Month | Week segment, a month card of compact rounded day cells with
 * status dots + count badges, a selected-day card (hours editor) and that
 * day's bookings/orders card. Header mirrors BusinessHoursScreen.
 */
export const BRAND_BLUE = '#1D4ED8';
/** Switch track colours: blue on, grey off. */
export const TRACK = { true: BRAND_BLUE, false: '#CBD5E1' };

/** Day-cell tints. */
const TODAY_BG = '#EEF4FF';
const CLOSED_BG = SOFT_FILL;
const PINK_BG = '#FDE8EC';
const PINK_BORDER = '#F8D0D8';
const PEACH_BG = '#FFF1E2';
const PEACH_BORDER = '#F9DDBF';
const MUTED_TEXT = '#B6BFCC';

/** Status dot colours (pending / confirmed / completed). */
export const DOT = {
  pending: '#F59E0B',
  confirmed: '#2563EB',
  completed: '#22C55E',
  custom: '#EA580C',
};

/** Legend swatches. */
export const LEGEND = {
  bookings: '#2563EB',
  closed: '#F7B6C4',
  custom: '#FBD3A6',
};

const card = {
  backgroundColor: Color.white,
  borderRadius: ModernRadius.card,
  borderWidth: 1,
  borderColor: CARD_BORDER,
  ...CARD_SHADOW,
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingHorizontal: Spacing.md + 4,
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
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  todayBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
  },
  todayBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },

  // ── Month | Week segment ────────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    backgroundColor: Color.white,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: BRAND_BLUE,
  },
  segmentText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  segmentTextActive: {
    color: Color.white,
  },

  // ── Calendar card ───────────────────────────────────────────────────────
  calendarCard: {
    ...card,
    paddingHorizontal: Spacing.sm + 2,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.md,
    gap: 6,
  },
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodLabel: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 5,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
    paddingBottom: 2,
  },

  // ── Day cell ────────────────────────────────────────────────────────────
  dayCell: {
    flex: 1,
    minHeight: 62,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 5,
    gap: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  dayCellTall: {
    minHeight: 74,
  },
  dayCellOutside: {
    backgroundColor: Color.white,
    borderColor: Color.divider,
  },
  dayCellClosed: {
    backgroundColor: CLOSED_BG,
    borderColor: CLOSED_BG,
  },
  dayCellClosedOverride: {
    backgroundColor: PINK_BG,
    borderColor: PINK_BORDER,
  },
  dayCellCustom: {
    backgroundColor: PEACH_BG,
    borderColor: PEACH_BORDER,
  },
  dayCellToday: {
    backgroundColor: TODAY_BG,
    borderColor: '#D5E2FA',
  },
  dayCellSelected: {
    backgroundColor: BRAND_BLUE,
    borderColor: BRAND_BLUE,
  },
  weekdayInCell: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  weekdayInCellSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  dayNumWrap: {
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumRing: {
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
  },
  dayNum: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  dayNumOutside: {
    fontWeight: FontWeight.regular,
    color: MUTED_TEXT,
  },
  dayNumToday: {
    color: BRAND_BLUE,
  },
  dayNumClosedOverride: {
    color: Color.error,
  },
  dayNumSelected: {
    color: Color.white,
  },
  dots: {
    position: 'absolute',
    top: 5,
    right: 4,
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotPending: {
    backgroundColor: DOT.pending,
  },
  dotConfirmed: {
    backgroundColor: DOT.confirmed,
  },
  dotCompleted: {
    backgroundColor: DOT.completed,
  },
  dotCustom: {
    backgroundColor: DOT.custom,
  },
  countBadge: {
    minWidth: 22,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.blue.bg,
  },
  countBadgeSelected: {
    backgroundColor: Color.white,
  },
  countText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: PILL.blue.fg,
  },
  closedLabel: {
    fontSize: 11,
    color: Color.textSecondary,
  },
  closedLabelOverride: {
    color: Color.error,
  },
  closedLabelSelected: {
    color: Color.white,
  },

  // ── Legend ──────────────────────────────────────────────────────────────
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.divider,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendBookings: {
    backgroundColor: LEGEND.bookings,
  },
  legendClosed: {
    backgroundColor: LEGEND.closed,
  },
  legendCustom: {
    backgroundColor: LEGEND.custom,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: INK,
  },

  // ── Cards (selected day / bookings) ─────────────────────────────────────
  section: {
    ...card,
    padding: Spacing.md,
    gap: Spacing.sm + 4,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 6,
  },
  dayHeaderText: {
    flex: 1,
    gap: 2,
  },
  dayTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  daySubtitle: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Color.border,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  hoursLabel: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  sourcePill: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 5,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  switchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minWidth: 104,
  },
  switchLabel: {
    fontSize: FontSize.md,
    color: INK,
  },
  rangeDash: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  primaryBtn: {
    flex: 1.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    minHeight: 50,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  primaryBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 50,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  outlineBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },

  // ── Bookings / orders list ──────────────────────────────────────────────
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  listTitle: {
    flex: 1,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: BRAND_BLUE,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  timeBox: {
    minWidth: 92,
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 10,
    backgroundColor: '#EDF1F8',
  },
  timeBoxText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  itemMain: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  itemSubtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  statusPill: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    paddingTop: Spacing.xs,
  },
});
