import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

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
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  todayBtn: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.blue.bg,
  },
  todayBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: PILL.blue.fg,
  },

  // ── Month | Week segment ───────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '86%',
    backgroundColor: SOFT_FILL,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: ModernRadius.pill,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: ACTION,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  segmentTextActive: {
    color: Color.white,
  },

  // ── Period nav (< Oct 2026 >) ──────────────────────────────────────────
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Month grid ─────────────────────────────────────────────────────────
  monthGrid: {
    ...card,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.xs,
  },
  gridRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: INK,
    paddingBottom: Spacing.sm,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: ACTION,
  },
  dayNum: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  dayNumMuted: {
    color: Color.placeholder,
    fontWeight: FontWeight.regular,
  },
  dayNumToday: {
    color: ACTION,
    fontWeight: FontWeight.bold,
  },
  dayNumSelected: {
    color: Color.white,
    fontWeight: FontWeight.bold,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'transparent',
  },
  dayDotOn: {
    backgroundColor: LINK,
  },
  dayDotMuted: {
    opacity: 0.4,
  },

  // ── Selected-day summary card ──────────────────────────────────────────
  selectedCard: {
    ...card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 6,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.md + 2,
  },
  selectedMain: {
    flex: 1,
    gap: 2,
  },
  selectedTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  selectedSubtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Week day chips ─────────────────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: 6,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    gap: 2,
  },
  chipActive: {
    backgroundColor: ACTION,
    borderColor: ACTION,
  },
  chipDay: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipDayActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  chipDate: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  chipDateActive: {
    color: Color.white,
  },
  // Marks a date with custom (override) hours.
  chipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  chipDotOn: {
    backgroundColor: Color.warning,
  },
  chipDotActive: {
    opacity: 0.9,
  },

  // ── Sections (bookings list / override hours) ──────────────────────────
  section: {
    ...card,
    padding: Spacing.md,
    gap: Spacing.sm + 4,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
  },
  itemRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Color.divider,
  },
  timeBox: {
    minWidth: 86,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: ModernRadius.box,
    backgroundColor: '#EEF4FF',
  },
  timeBoxText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  timeBoxEnd: {
    fontSize: 10,
    color: Color.textSecondary,
    marginTop: 1,
  },
  itemMain: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  itemSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  overrideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  overrideHeaderText: {
    flex: 1,
    gap: 2,
  },
  overrideHint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rangeDash: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  primaryButton: {
    backgroundColor: ACTION,
    borderRadius: ModernRadius.button,
  },
  outlineButton: {
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: ACTION,
    backgroundColor: Color.white,
  },
});
