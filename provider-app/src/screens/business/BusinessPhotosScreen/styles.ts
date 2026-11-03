import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  PAGE_BG,
  PILL,
  PillColors,
  SOFT_FILL,
} from '@/utils/modernTheme';

/** Mockup "Salon Photos Action Sheet.png": light header with a round add
 * button, usage card, cover card, 2-column gallery and a bottom action sheet.
 * Header mirrors CouponsScreen / ProductsScreen. */
export const BRAND_BLUE = '#1D4ED8';
/** Solid blue "★ Cover" tag (mockup), not the pastel PILL.blue. */
export const COVER_PILL: PillColors = { bg: BRAND_BLUE, fg: Color.white };
export const REMOVE_RED = PILL.red.fg;
export const DISABLED_ICON = Color.placeholder;
/** How far below its resting place the sheet starts its slide-up. */
export const SHEET_SLIDE = 480;

const PROGRESS_TRACK = '#E2E7EF';
const ADD_BG = '#F5F8FE';
const ADD_BORDER = '#BCD0F5';
const SELECT_SOFT = '#EAF0FC';
const REMOVE_SOFT = '#FDECEC';
const BUSY_VEIL = 'rgba(255, 255, 255, 0.7)';
const TILE_RATIO = 1.6; // ~16:10
const COVER_RATIO = 1.9;
const TILE_RADIUS = ModernRadius.box;

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
  addBtnDisabled: {
    backgroundColor: Color.placeholder,
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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  cardHint: {
    marginTop: -2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  reorderHint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  // ── Usage ───────────────────────────────────────────────────────────────
  usageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  usageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SELECT_SOFT,
  },
  usageBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  usageTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: PROGRESS_TRACK,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: BRAND_BLUE,
  },
  usageMeta: {
    fontSize: FontSize.xs + 1,
    color: Color.textSecondary,
  },

  // ── Cover ───────────────────────────────────────────────────────────────
  coverImage: {
    width: '100%',
    aspectRatio: COVER_RATIO,
    borderRadius: TILE_RADIUS,
    backgroundColor: Color.divider,
  },
  coverPill: {
    position: 'absolute',
    top: Spacing.sm + 2,
    left: Spacing.sm + 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coverPlaceholder: {
    width: '100%',
    aspectRatio: COVER_RATIO,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: TILE_RADIUS,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: ADD_BORDER,
    backgroundColor: ADD_BG,
  },
  placeholderHint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  addText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Gallery grid ────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.sm + 4,
  },
  tile: {
    width: '48.5%',
    aspectRatio: TILE_RATIO,
    borderRadius: TILE_RADIUS,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Color.divider,
  },
  tileSelected: {
    borderColor: BRAND_BLUE,
  },
  tileImage: {
    width: '100%',
    height: '100%',
    borderRadius: TILE_RADIUS - 2,
  },
  positionChip: {
    position: 'absolute',
    left: Spacing.sm,
    bottom: Spacing.sm,
    minWidth: 26,
    height: 26,
    paddingHorizontal: 6,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  positionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  menuBtn: {
    position: 'absolute',
    top: Spacing.sm - 2,
    right: Spacing.sm - 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  addTile: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: ADD_BORDER,
    backgroundColor: ADD_BG,
  },
  busyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: TILE_RADIUS,
    backgroundColor: BUSY_VEIL,
  },
  busyText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── Action sheet ────────────────────────────────────────────────────────
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Color.overlay,
  },
  sheet: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 2,
    gap: Spacing.xs,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: Color.white,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    marginBottom: Spacing.sm,
    backgroundColor: CARD_BORDER,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm + 4,
  },
  sheetThumb: {
    width: 76,
    height: 56,
    borderRadius: 10,
    backgroundColor: Color.divider,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  sheetSubtitle: {
    marginTop: 2,
    fontSize: FontSize.md,
    color: Color.textSecondary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md + 2,
    minHeight: 52,
    paddingHorizontal: Spacing.md + 2,
    borderRadius: ModernRadius.box,
  },
  optionCover: {
    backgroundColor: SELECT_SOFT,
  },
  optionRemove: {
    backgroundColor: REMOVE_SOFT,
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.md + 2,
    backgroundColor: CARD_BORDER,
  },
  optionText: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  optionTextBlue: {
    color: LINK,
  },
  optionTextRed: {
    color: REMOVE_RED,
  },
  optionTextDisabled: {
    color: DISABLED_ICON,
  },
  cancelBtn: {
    height: 52,
    marginTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  cancelText: {
    fontSize: FontSize.md + 1,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
});
