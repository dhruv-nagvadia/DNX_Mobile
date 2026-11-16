import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL, TINT } from '@/utils/modernTheme';

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
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 2,
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
    minHeight: 80,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  tileText: {
    flex: 1,
    minWidth: 0,
  },
  tileLabel: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
    letterSpacing: -0.2,
  },
  tileValue: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  tileDetail: {
    fontSize: 11,
    color: Color.textSecondary,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
    letterSpacing: -0.3,
  },
  cardHint: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  rangeDash: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Weekly schedule ─────────────────────────────────────────────────────
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BRAND_BLUE,
    height: 32,
  },
  copyText: {
    fontSize: ModernType.caption,
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
    minHeight: ModernSize.rowMinHeight,
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
    fontSize: ModernType.body,
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
    fontSize: 11,
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
    fontSize: ModernType.secondary,
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
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  duration: {
    width: 34,
    textAlign: 'right',
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  // ── Tip card ────────────────────────────────────────────────────────────
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.cardPad,
    paddingVertical: ModernSize.cardPad,
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
    fontSize: ModernType.rowTitle,
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
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },

  errorText: {
    fontSize: ModernType.secondary,
    color: Color.error,
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: Spacing.sm,
  },

  // ── Sticky save bar ─────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: ModernSize.gap,
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  footerStatus: {
    flex: 1,
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ModernSize.control,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  saveBtnDisabled: {
    backgroundColor: Color.placeholder,
  },
  saveText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
