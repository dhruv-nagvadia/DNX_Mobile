import { StyleSheet } from 'react-native';

import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, PILL, SOFT_FILL } from '@/utils/modernTheme';

/** Mockup "Manage Stock Inventory Dashboard.png": light header, pastel stock
 * tiles, "Select Product" / "Adjust Stock" / "Recent changes" cards and a
 * sticky filled + outlined-red footer. Mirrors ProductsScreen. */
export const BRAND_BLUE = '#1D4ED8';
export const SWITCH_OFF = '#D5DAE3';
const FIELD_BORDER = '#D5DBE5';
const SEGMENT_TRACK = '#E9EDF3';
const THUMB_LARGE = 80;
const THUMB = 44;

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
    gap: Spacing.md - 2,
  },
  loading: {
    paddingVertical: Spacing.xl,
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

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    padding: Spacing.md,
    gap: Spacing.sm + 4,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
    letterSpacing: -0.3,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: BRAND_BLUE,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  mutedText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
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
    borderColor: FIELD_BORDER,
    backgroundColor: SOFT_FILL,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: FontSize.md,
    color: INK,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },

  // ── Product list / selected product ─────────────────────────────────────
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
  },
  resultMain: {
    flex: 1,
    gap: 4,
  },
  resultName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: ModernRadius.box - 2,
    backgroundColor: SOFT_FILL,
  },
  thumbLarge: {
    width: THUMB_LARGE,
    height: THUMB_LARGE,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    padding: Spacing.sm + 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  selectedMain: {
    flex: 1,
    gap: 4,
  },
  selectedName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  stockPill: {
    marginTop: 2,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  // ── Add / Remove segment ───────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: SEGMENT_TRACK,
    overflow: 'hidden',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 11,
  },
  segmentBtnActive: {
    backgroundColor: BRAND_BLUE,
    borderRadius: ModernRadius.box - 2,
  },
  segmentText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  segmentTextActive: {
    color: Color.white,
    fontWeight: FontWeight.bold,
  },

  // ── Form fields ────────────────────────────────────────────────────────
  field: {
    gap: Spacing.sm - 2,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  required: {
    color: Color.error,
  },
  optional: {
    fontWeight: FontWeight.regular,
    color: INK,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md + 4,
  },
  stepper: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInput: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: FIELD_BORDER,
    paddingVertical: 0,
  },
  unitSelect: {
    width: 108,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
  },
  unitSelectDisabled: {
    justifyContent: 'center',
  },
  unitMenu: {
    alignSelf: 'flex-end',
    width: 108,
  },
  helperOk: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  helperWarn: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
  },
  selectText: {
    fontSize: FontSize.md,
    color: INK,
  },
  dropdown: {
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
    paddingHorizontal: Spacing.md,
    ...CARD_SHADOW,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 4,
  },
  optionText: {
    fontSize: FontSize.md,
    color: INK,
  },
  optionTextActive: {
    fontWeight: FontWeight.bold,
    color: BRAND_BLUE,
  },
  noteInput: {
    minHeight: 76,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.sm + 2,
    borderRadius: ModernRadius.box - 2,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
    fontSize: FontSize.md,
    color: INK,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  // ── Made-to-order availability ─────────────────────────────────────────
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  availText: {
    flex: 1,
    gap: 2,
  },

  // ── Recent changes ─────────────────────────────────────────────────────
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
  },
  changeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeIconUp: {
    backgroundColor: PILL.green.bg,
  },
  changeIconDown: {
    backgroundColor: PILL.red.bg,
  },
  changeMain: {
    flex: 1,
    gap: 2,
  },
  changeName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  changeSide: {
    alignItems: 'flex-end',
    gap: 2,
  },
  deltaUp: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: PILL.green.fg,
  },
  deltaDown: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.error,
  },

  // ── Sticky footer ──────────────────────────────────────────────────────
  footer: {
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    backgroundColor: PAGE_BG,
  },
  primaryBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ModernRadius.button,
    backgroundColor: BRAND_BLUE,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  dangerBtn: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: Color.error,
    backgroundColor: Color.white,
  },
  dangerBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },
});
