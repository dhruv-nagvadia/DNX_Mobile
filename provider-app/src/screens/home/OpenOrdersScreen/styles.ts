import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
import {
  CARD_SHADOW,
  INK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

/** Pale circle + icon colour for the empty state. */
export const EMPTY_TINT = PILL.blue;

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

  // ── List + cards ────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: ModernSize.gap,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    minHeight: ModernSize.rowMinHeight,
    padding: ModernSize.cardPad,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  main: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    flexShrink: 1,
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
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
  skelBox: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernRadius.box,
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

  // ── Row: bag box + stacked pills ────────────────────────────────────────
  iconBox: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernRadius.box,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.blue.bg,
  },
  orderRef: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  itemsText: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
    maxWidth: '42%',
  },
  smallPill: {
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
