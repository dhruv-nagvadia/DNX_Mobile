import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';

/** Store-only styles; shared pieces use ProviderDetailScreen/styles. */
export const styles = StyleSheet.create({
  // Room for the sticky cart bar.
  contentWithBar: {
    paddingBottom: 110,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    marginTop: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 15,
    color: INK,
  },
  hRow: {
    paddingHorizontal: ModernSize.gutter,
    paddingBottom: 4,
    gap: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitleGroup: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionGroupTitle: {
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
  sectionLink: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  viewAllTypesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 44,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  viewAllTypesText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },

  // ── Sticky cart bar ─────────────────────────────────────────────────────
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
    fontSize: 13,
    color: '#64748B',
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
    backgroundColor: BLUE,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
