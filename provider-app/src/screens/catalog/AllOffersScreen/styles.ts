import { StyleSheet } from 'react-native';

import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL, SOFT_FILL, TINT } from '@/utils/modernTheme';

/** Mockup "Modern Offers Management UI Mockup.png": light header with a round
 * add button, search, business + status chips, pastel tiles, two-column
 * ticket cards, and a "Choose business" bottom sheet. */
export const BRAND_BLUE = '#1D4ED8';
export const SWITCH_OFF = '#D5DAE3';
export const META_ICON = '#334155';
export const BACKDROP = 'rgba(15,30,74,0.45)';
const PROGRESS_TRACK = '#E2E7EF';
const CODE_BORDER = '#A5B4FC';
const STUB_BG = '#F1EEFD';
const NOTCH = 20;
const STUB_NOTCH = 12;
const CARD_PAD = Spacing.sm + 4;
const DOT = 8;

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
  // Bleed chip rows to the screen edges so chips scroll off-screen.
  chipsScroll: {
    marginHorizontal: -Spacing.md,
    flexGrow: 0,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chip: {
    minWidth: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md - 2,
    paddingVertical: Spacing.sm - 1,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  dotOnActive: {
    borderWidth: 1,
    borderColor: Color.white,
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

  // ── Offer ticket card ───────────────────────────────────────────────────
  card: {
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    padding: CARD_PAD,
  },
  // Left "stub": soft-lavender block with the headline discount.
  stub: {
    width: '38%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    backgroundColor: STUB_BG,
    overflow: 'hidden',
  },
  stubText: {
    alignItems: 'center',
  },
  stubNotch: {
    position: 'absolute',
    top: '50%',
    marginTop: -STUB_NOTCH / 2,
    width: STUB_NOTCH,
    height: STUB_NOTCH,
    borderRadius: STUB_NOTCH / 2,
    backgroundColor: Color.white,
  },
  stubNotchLeft: {
    left: -STUB_NOTCH / 2,
  },
  stubNotchRight: {
    right: -STUB_NOTCH / 2,
  },
  discount: {
    fontSize: FontSize.xl + 2,
    fontWeight: FontWeight.extrabold,
    color: BRAND_BLUE,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  cap: {
    fontSize: FontSize.sm + 1,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  businessPill: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  businessPillText: {
    flexShrink: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  details: {
    flex: 1,
    gap: 6,
  },
  detailsTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  pills: {
    flexShrink: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  codeChip: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: CODE_BORDER,
    backgroundColor: '#F7F8FF',
  },
  code: {
    flexShrink: 1,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: 0.3,
  },
  copiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  copiedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  description: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  metaList: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: INK,
  },
  usageText: {
    fontSize: FontSize.sm,
    color: INK,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    marginLeft: 4,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: PROGRESS_TRACK,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: BRAND_BLUE,
  },

  // Dashed rule + half-circle notches in the page colour (tear-off ticket).
  perforation: {
    height: 1,
    justifyContent: 'center',
  },
  // iOS can't dash a single border side: dash a full box, clip to its top edge.
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
    paddingHorizontal: CARD_PAD + 4,
    paddingVertical: Spacing.sm + 2,
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
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
  },
  deleteBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.red.bg,
  },

  // ── Empty states ────────────────────────────────────────────────────────
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: TINT.lavender.colors[0],
    borderWidth: 1,
    borderColor: TINT.lavender.border,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  primaryBtn: {
    height: 50,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  noMatch: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Choose-business sheet ───────────────────────────────────────────────
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP,
  },
  sheet: {
    maxHeight: '85%',
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.sm + 2,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: PAGE_BG,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: Spacing.md + 4,
    backgroundColor: '#C9CFDA',
  },
  sheetTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    marginTop: 2,
    marginBottom: Spacing.md,
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  sheetList: {
    gap: Spacing.sm + 4,
    paddingBottom: Spacing.sm,
  },
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm + 4,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  bizRowSelected: {
    borderWidth: 2,
    borderColor: BRAND_BLUE,
    padding: Spacing.sm + 3,
  },
  bizPhoto: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: SOFT_FILL,
  },
  bizPhotoFallback: {
    width: 64,
    height: 64,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  bizText: {
    flex: 1,
    gap: 6,
  },
  bizName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  typePill: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 5,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#B6BECC',
  },
  radioSelected: {
    borderColor: BRAND_BLUE,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BRAND_BLUE,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md - 2,
  },
  cancelText: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.medium,
    color: Color.textSecondary,
  },
});
