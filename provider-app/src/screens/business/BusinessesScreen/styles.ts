import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  SOFT_FILL,
} from '@/utils/modernTheme';

/** Mockup "My Businesses Marketplace Dashboard.png": light header, search,
 * filter chips, pastel status tiles and rich business cards. */
export const THUMB_W = 64;
export const THUMB_H = 56;
export const PROGRESS_BLUE = '#1D4ED8';
export const STAR = '#F5B301';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  listContent: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: PAGE_BG,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.largeTitle,
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
    backgroundColor: PROGRESS_BLUE,
    ...CARD_SHADOW,
  },

  // ── Search + chips ──────────────────────────────────────────────────────
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: ModernType.body,
    color: INK,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
  },
  chip: {
    minWidth: 64,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: ModernRadius.button,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: PROGRESS_BLUE,
    backgroundColor: PROGRESS_BLUE,
  },
  chipText: {
    fontSize: ModernType.secondary,
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
    paddingVertical: Spacing.sm + 4,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 76,
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileValue: {
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Business card ───────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    gap: Spacing.sm + 2,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  thumbFallback: {
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  info: {
    flex: 1,
    gap: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  dot: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },
  ratingValue: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  dividerInset: {
    marginLeft: THUMB_W + Spacing.sm + 4,
  },

  // Profile progress
  progress: {
    gap: Spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  progressText: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: INK,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#DCE1EA',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: PROGRESS_BLUE,
  },

  // Bottom pills
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
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
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },

  // ── Add-business card ───────────────────────────────────────────────────
  addCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: ModernRadius.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#B9C3D3',
  },
  addCardText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: PROGRESS_BLUE,
  },

  noMatch: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: Color.textSecondary,
  },
});
