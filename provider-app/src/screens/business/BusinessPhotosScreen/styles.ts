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
  PillColors,
} from '@/utils/modernTheme';

/** Mockup "Salon Photos Action Sheet.png": light header with a round add
 * button, usage card, cover card, 2-column gallery and a bottom action sheet.
 * Header mirrors CouponsScreen / ProductsScreen. */
export const BRAND_BLUE = '#1D4ED8';
/** Solid blue "★ Cover" tag (mockup), not the pastel PILL.blue. */
export const COVER_PILL: PillColors = { bg: BRAND_BLUE, fg: Color.white };

const PROGRESS_TRACK = '#E2E7EF';
const ADD_BG = '#F5F8FE';
const ADD_BORDER = '#BCD0F5';
const SELECT_SOFT = '#EAF0FC';
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
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.sm,
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
  addBtn: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.iconBox / 2,
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
    padding: ModernSize.cardPad,
    gap: ModernSize.gap,
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
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  cardHint: {
    marginTop: -2,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  reorderHint: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  errorText: {
    fontSize: ModernType.secondary,
    color: Color.error,
  },

  // ── Usage ───────────────────────────────────────────────────────────────
  usageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  usageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SELECT_SOFT,
  },
  usageBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  usageTitle: {
    fontSize: ModernType.rowTitle,
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
    fontSize: ModernType.caption,
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
    fontSize: ModernType.caption,
    color: Color.textSecondary,
    textAlign: 'center',
  },
  addText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Gallery grid ────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: ModernSize.gap,
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
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  positionText: {
    fontSize: ModernType.caption,
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
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: TILE_RADIUS,
    backgroundColor: BUSY_VEIL,
  },
  busyText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── Action sheet (shared BottomSheet) ───────────────────────────────────
  sheetThumb: {
    width: 56,
    height: 44,
    borderRadius: 10,
    backgroundColor: Color.divider,
  },
});
