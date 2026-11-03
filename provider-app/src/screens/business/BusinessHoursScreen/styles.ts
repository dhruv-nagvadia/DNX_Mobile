import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL, TINT } from '@/utils/modernTheme';

/**
 * Mockup "Salon Hours Mobile App Interface.png": light header, three pastel
 * summary tiles, daily-break card, weekly schedule card, calendar tip card and
 * a sticky Save bar. Header mirrors BusinessPhotosScreen / ProductsScreen.
 */
export const BRAND_BLUE = '#1D4ED8';
/** Switch track colours: blue on, grey off. */
export const TRACK = { true: BRAND_BLUE, false: '#CBD5E1' };
export const TODAY_BG = '#EEF4FF';
export const TIP_COLORS = ['#F6F2FF', '#EEE8FD'];
export const TIP_ICON = TINT.lavender.icon;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
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

  // ── Summary tiles ───────────────────────────────────────────────────────
  tiles: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    minHeight: 84,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm + 4,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tileMint: {
    borderColor: TINT.mint.border,
  },
  tileBlue: {
    borderColor: TINT.blue.border,
  },
  tileLavender: {
    borderColor: TINT.lavender.border,
  },
  tileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  tileText: {
    flex: 1,
    minWidth: 0,
  },
  tileLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: INK,
    letterSpacing: -0.2,
  },
  tileValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  tileDetail: {
    fontSize: 10,
    color: Color.textSecondary,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md,
    gap: Spacing.md,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  cardHint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rangeDash: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Weekly schedule ─────────────────────────────────────────────────────
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
  },
  copyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },
  scheduleList: {
    marginHorizontal: -Spacing.md,
    marginTop: -Spacing.xs,
    marginBottom: -Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  dayRowToday: {
    backgroundColor: TODAY_BG,
    borderLeftWidth: 3,
    borderLeftColor: BRAND_BLUE,
    paddingLeft: Spacing.md - 3,
  },
  dayDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
    backgroundColor: Color.divider,
  },
  dayLabel: {
    width: 40,
    alignItems: 'flex-start',
    gap: 3,
  },
  dayName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  todayTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: PILL.blue.bg,
  },
  todayTagText: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: PILL.blue.fg,
  },
  daySwitch: {
    transform: [{ scale: 0.8 }],
    marginHorizontal: -4,
  },
  dayTimes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rangeDashSmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  closedBar: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: 10,
    backgroundColor: '#E8ECF3',
  },
  closedText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  duration: {
    width: 34,
    textAlign: 'right',
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  // ── Tip card ────────────────────────────────────────────────────────────
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.md,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: TINT.lavender.border,
    overflow: 'hidden',
  },
  tipText: {
    flex: 1,
    gap: 3,
  },
  tipTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  tipLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipLink: {
    flexShrink: 1,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
    paddingHorizontal: Spacing.md + 4,
    paddingBottom: Spacing.sm,
  },

  // ── Sticky save bar ─────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.sm + 6,
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  footerStatus: {
    flex: 1,
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  saveBtnDisabled: {
    backgroundColor: Color.placeholder,
  },
  saveText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
