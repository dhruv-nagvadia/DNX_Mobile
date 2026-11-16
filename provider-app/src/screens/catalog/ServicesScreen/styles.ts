import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernRadius, ModernSize, ModernType, PAGE_BG, PILL, SOFT_FILL, TINT } from '@/utils/modernTheme';

/** Mockup "Salon Services Management Dashboard.png": light header with a round
 * add button, search, filter chips, three pastel summary tiles and rich
 * service cards. Header/search/chips mirror ProductsScreen. */
export const ICON_BOX = ModernSize.iconBox;
export const BRAND_BLUE = '#1D4ED8';
export const SWITCH_OFF = '#D5DAE3';
export const ICON_LAVENDER = '#4C1D95';
export const FLAME = '#7C3AED';
export const TAG = '#EA580C';
export const MUTED = Color.textSecondary;

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
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
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
    alignSelf: 'flex-start',
    paddingTop: 6,
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
    color: MUTED,
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
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm - 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md - 2,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tileWide: {
    flex: 1.25,
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
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
    fontSize: ModernType.stat,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  tileName: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  tileSub: {
    fontSize: ModernType.caption,
    color: MUTED,
  },

  // ── Service card ────────────────────────────────────────────────────────
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
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 4,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TINT.lavender.colors[0],
    borderWidth: 1,
    borderColor: TINT.lavender.border,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  desc: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  duration: {
    fontSize: ModernType.body,
    color: INK,
  },
  dot: {
    fontSize: ModernType.body,
    color: MUTED,
  },
  price: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // Right column: toggle over edit/delete
  side: {
    alignItems: 'flex-end',
    gap: Spacing.sm + 2,
  },
  switch: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
  },
  sideBtns: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editBtn: {
    width: ModernSize.controlSm,
    height: ModernSize.controlSm,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND_BLUE,
    backgroundColor: Color.white,
  },
  deleteBtn: {
    width: ModernSize.controlSm,
    height: ModernSize.controlSm,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F6C9C9',
    backgroundColor: '#FFF4F4',
  },

  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },

  // Bottom row: booking stats + feature chips
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  stats: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statsText: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: INK,
  },
  featureChips: {
    flexDirection: 'row',
    gap: 6,
  },
  homeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.blue.bg,
  },
  homeChipText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: PILL.blue.fg,
  },
  partialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
    backgroundColor: SOFT_FILL,
  },
  partialChipText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  noMatch: {
    paddingVertical: Spacing.lg,
    textAlign: 'center',
    fontSize: ModernType.body,
    color: MUTED,
  },
});
