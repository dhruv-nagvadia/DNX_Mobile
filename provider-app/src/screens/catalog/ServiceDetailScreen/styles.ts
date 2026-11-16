import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, LINK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL, TINT } from '@/utils/modernTheme';

/** Mockup "Salon Service Details App Screen.png": light header with
 * edit/delete, hero card, pastel stat tiles, performance, upcoming bookings,
 * offers, payment settings and a sticky "Edit Service" button. Header mirrors
 * ServicesScreen. */
export const BRAND_BLUE = '#1D4ED8';
export const SWITCH_OFF = '#D5DAE3';
export const ICON_LAVENDER = '#4C1D95';
export const MUTED = Color.textSecondary;
export const ORANGE = '#EA580C';
export const HERO_ICON = 56;

const box = {
  borderRadius: ModernRadius.box,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
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
    paddingBottom: Spacing.lg,
    gap: ModernSize.gap,
  },

  // ── Header (mirrors ServicesScreen) ─────────────────────────────────────
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
    ...box,
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderWidth: 1,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
  },
  deleteBtn: {
    ...box,
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderWidth: 1,
    borderColor: '#F6C9C9',
    backgroundColor: PILL.red.bg,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  cardHint: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ModernSize.gap,
  },
  heroIcon: {
    ...box,
    width: HERO_ICON,
    height: HERO_ICON,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: TINT.lavender.border,
    backgroundColor: TINT.lavender.colors[0],
  },
  heroInfo: {
    flex: 1,
    gap: 2,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  heroName: {
    flex: 1,
    fontSize: ModernType.title,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  heroBusiness: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  switch: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
  },

  // ── Pastel tiles ────────────────────────────────────────────────────────
  tiles: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm - 2,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  tileValue: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  tileValueMuted: {
    color: MUTED,
  },

  // ── About ───────────────────────────────────────────────────────────────
  about: {
    gap: Spacing.xs,
  },
  aboutText: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: MUTED,
  },
  more: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Performance ─────────────────────────────────────────────────────────
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: ModernType.caption,
    color: INK,
  },
  legendSep: {
    fontSize: ModernType.caption,
    color: MUTED,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PILL.green.fg,
  },
  dotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
  },
  dotGrey: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Color.placeholder,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PILL.red.fg,
  },

  // ── Upcoming ────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    minHeight: ModernSize.rowMinHeight,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
  },
  timeBox: {
    width: 92,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: TINT.blue.colors[0],
    borderWidth: 1,
    borderColor: TINT.blue.border,
  },
  timeText: {
    fontSize: ModernType.secondary,
    color: INK,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  customer: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payText: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  rowPill: {
    alignSelf: 'center',
  },
  empty: {
    paddingVertical: Spacing.sm,
    fontSize: ModernType.body,
    color: MUTED,
  },

  // ── Offers ──────────────────────────────────────────────────────────────
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingRight: Spacing.sm + 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: TINT.lavender.border,
    backgroundColor: TINT.lavender.colors[0],
    overflow: 'hidden',
  },
  offerIcon: {
    ...box,
    width: 44,
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: 0,
    borderRightWidth: 1,
    borderRightColor: TINT.lavender.border,
    backgroundColor: TINT.lavender.colors[1],
  },
  offerBody: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
  },
  codeChip: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: ICON_LAVENDER,
    backgroundColor: Color.white,
  },
  codeText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
    letterSpacing: 0.3,
  },
  offerValue: {
    fontSize: ModernType.secondary,
    color: INK,
  },
  emptyOffers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: ModernRadius.button,
    backgroundColor: PILL.blue.bg,
    height: ModernSize.controlSm,
  },
  createText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },

  // ── Payment settings ────────────────────────────────────────────────────
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    paddingVertical: Spacing.sm,
    minHeight: ModernSize.rowMinHeight,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  settingSub: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },

  // ── Sticky footer ───────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    backgroundColor: PAGE_BG,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    height: ModernSize.control,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  primaryText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Loading / not found ─────────────────────────────────────────────────
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  notFoundTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  notFoundBody: {
    fontSize: ModernType.body,
    color: MUTED,
    textAlign: 'center',
  },
  notFoundBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
    height: ModernSize.control,
    justifyContent: 'center',
  },
});
