import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  PillColors,
  SOFT_FILL,
  TINT,
} from '@/utils/modernTheme';

import { NotificationCategory } from './helpers';

/** Pale circle + icon colour for the empty state. */
export const EMPTY_TINT = PILL.blue;
const CHIP_ACTIVE = '#1D4ED8';
/** Very soft blue wash behind unread cards. */
const UNREAD_BG = '#F3F7FF';
const UNREAD_BORDER = '#DCE7FD';

/** Pastel icon-box colours per notification category. */
export const ICON_COLORS: Record<NotificationCategory, PillColors> = {
  booking: PILL.blue,
  order: { bg: TINT.peach.colors[1], fg: TINT.peach.icon },
  review: PILL.lavender,
  payment: { bg: TINT.mint.colors[1], fg: TINT.mint.icon },
  stock: PILL.orange,
  cancelled: PILL.red,
  reminder: PILL.yellow,
  generic: PILL.grey,
};

export const iconBoxStyles = StyleSheet.create({
  booking: { backgroundColor: ICON_COLORS.booking.bg },
  order: { backgroundColor: ICON_COLORS.order.bg },
  review: { backgroundColor: ICON_COLORS.review.bg },
  payment: { backgroundColor: ICON_COLORS.payment.bg },
  stock: { backgroundColor: ICON_COLORS.stock.bg },
  cancelled: { backgroundColor: ICON_COLORS.cancelled.bg },
  reminder: { backgroundColor: ICON_COLORS.reminder.bg },
  generic: { backgroundColor: ICON_COLORS.generic.bg },
});

export const styles = StyleSheet.create({
  // ── Page + light header ─────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: ModernSize.gap,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  markAll: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  markAllDisabled: {
    opacity: 0.5,
  },

  // ── Filter chips ────────────────────────────────────────────────────────
  chipsScroll: {
    flexGrow: 0,
    // ScrollView shrinks by default, so the list below squashed this row and
    // clipped the chips top and bottom — keep it at its full height.
    flexShrink: 0,
    marginBottom: Spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: Spacing.sm,
  },
  chip: {
    // Never squeeze a chip inside the horizontal row — that cut the labels off.
    flexShrink: 0,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md - 2,
    paddingVertical: 7,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: CHIP_ACTIVE,
    backgroundColor: CHIP_ACTIVE,
  },
  chipText: {
    fontSize: ModernType.secondary,
    lineHeight: 18,
    // Same weight in both states: switching to bold on select made the label
    // wider than the chip that was measured for it, so it got cut off.
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
  },

  // ── List + cards ────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm + 2,
    flexGrow: 1,
  },
  sectionLabel: {
    marginTop: Spacing.sm,
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ModernSize.gap,
    minHeight: ModernSize.rowMinHeight,
    padding: ModernSize.cardPad - 2,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: Color.white,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardUnread: {
    backgroundColor: UNREAD_BG,
    borderColor: UNREAD_BORDER,
  },
  iconBox: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  rowTitle: {
    flex: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  time: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  body: {
    fontSize: ModernType.body,
    lineHeight: 19,
    color: Color.textSecondary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    backgroundColor: LINK,
  },

  // ── Empty state ─────────────────────────────────────────────────────────
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 64,
    gap: Spacing.sm,
  },
  emptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: EMPTY_TINT.bg,
  },
  emptyTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // ── Loading skeleton ────────────────────────────────────────────────────
  skelCircle: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
    backgroundColor: SOFT_FILL,
  },
  skelLineLong: {
    width: '70%',
    height: 12,
    borderRadius: 6,
    backgroundColor: SOFT_FILL,
  },
  skelLineShort: {
    width: '45%',
    height: 10,
    borderRadius: 5,
    backgroundColor: SOFT_FILL,
  },
});
