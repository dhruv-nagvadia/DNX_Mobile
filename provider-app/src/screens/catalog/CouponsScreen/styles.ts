import { StyleSheet } from 'react-native';

import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL } from '@/utils/modernTheme';

/** Mockup "Polished Salon Offers Management App.png": light header with a
 * round add button, search, status chips, pastel summary tiles and coupon
 * "ticket" cards. Header/search/chips/tiles mirror ProductsScreen. */
export const BRAND_BLUE = '#1D4ED8';
export const SWITCH_OFF = '#D5DAE3';
export const META_ICON = '#334155';
const PROGRESS_TRACK = '#E2E7EF';
const CODE_BORDER = '#93B4F5';
const NOTCH = 20;
const CARD_PAD = Spacing.md;

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
    paddingBottom: Spacing.xl,
    gap: Spacing.md - 2,
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
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    height: 46,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: FontSize.md,
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
    fontSize: FontSize.md,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Coupon ticket card ──────────────────────────────────────────────────
  card: {
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardBody: {
    paddingHorizontal: CARD_PAD,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.md - 2,
    gap: Spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  discountCol: {
    flex: 1,
  },
  discount: {
    fontSize: FontSize.xxl + 2,
    fontWeight: FontWeight.extrabold,
    color: BRAND_BLUE,
    letterSpacing: -0.5,
  },
  cap: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  pills: {
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: Spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
  },
  pillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  codeChip: {
    alignSelf: 'flex-start',
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: CODE_BORDER,
    backgroundColor: '#F7F9FF',
  },
  copiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  copiedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  code: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },

  metaList: {
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  metaText: {
    flex: 1,
    fontSize: FontSize.md,
    color: INK,
  },
  usageText: {
    fontSize: FontSize.md,
    color: INK,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    marginLeft: Spacing.sm,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: PROGRESS_TRACK,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: BRAND_BLUE,
  },

  // Dashed rule + half-circle notches in the page colour, so the card reads
  // as a tear-off ticket.
  perforation: {
    height: 1,
    justifyContent: 'center',
  },
  // iOS can't dash a single border side, so dash a full box and clip it to
  // its top edge.
  dashClip: {
    height: 1,
    marginHorizontal: CARD_PAD,
    overflow: 'hidden',
  },
  dash: {
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: CARD_BORDER,
  },
  notch: {
    position: 'absolute',
    top: -NOTCH / 2,
    width: NOTCH,
    height: NOTCH,
    borderRadius: NOTCH / 2,
    backgroundColor: PAGE_BG,
  },
  notchLeft: {
    left: -NOTCH / 2 - 1,
  },
  notchRight: {
    right: -NOTCH / 2 - 1,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: CARD_PAD,
    paddingVertical: Spacing.sm + 4,
  },
  toggleRow: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  toggleLabel: {
    flexShrink: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F6C9C9',
    backgroundColor: '#FFF4F4',
  },

  noMatch: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
});
