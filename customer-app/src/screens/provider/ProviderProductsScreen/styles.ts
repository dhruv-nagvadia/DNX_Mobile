import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

export const MUTED = '#64748B';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 4,
    paddingBottom: 32,
  },
  // Room for the sticky cart bar.
  contentWithBar: {
    paddingBottom: 110,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  hint: {
    fontSize: ModernType.body,
    color: MUTED,
    textAlign: 'center',
  },
  muted: {
    fontSize: ModernType.body,
    color: MUTED,
  },

  // ── Search ──────────────────────────────────────────────────────────────
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: ModernSize.control,
    marginTop: 4,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: ModernType.rowTitle,
    color: INK,
  },

  // ── Chips ───────────────────────────────────────────────────────────────
  chipsBleed: {
    marginHorizontal: -ModernSize.gutter,
    marginTop: 14,
  },
  chips: {
    paddingHorizontal: ModernSize.gutter,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    maxWidth: 220,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: LINK,
    backgroundColor: LINK,
  },
  chipText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
  },

  // ── Groups / grid ───────────────────────────────────────────────────────
  resultsTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  group: {
    marginTop: 20,
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  groupTitle: {
    flexShrink: 1,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  dealTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#EA580C',
  },
  dealTagText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  groupCount: {
    marginLeft: 'auto',
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: PILL.grey.fg,
    backgroundColor: PILL.grey.bg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // ── Sticky cart bar (same look as the store page) ───────────────────────
  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 12,
    backgroundColor: Color.white,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  cartInfo: {
    flex: 1,
    gap: 2,
  },
  cartCount: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 50,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: LINK,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
