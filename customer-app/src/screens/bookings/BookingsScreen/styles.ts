import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, PAGE_BG } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const G = ModernSize.gutter;

/** Mockup "designs/customer/mobile/Bookings & Orders App Dashboard.png". */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  content: {
    paddingHorizontal: G,
    paddingBottom: 32,
    gap: 12,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  emptyTitle: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: MUTED,
  },

  // ── Header / search ─────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: G,
    paddingTop: 10,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.6,
    color: INK,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    marginHorizontal: G,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
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

  // ── Segment + chips ─────────────────────────────────────────────────────
  segmentBar: {
    flexDirection: 'row',
    marginHorizontal: G,
    padding: 4,
    borderRadius: 14,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 11,
  },
  segActive: {
    backgroundColor: BLUE,
  },
  segText: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  segTextActive: {
    color: Color.white,
  },
  segBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1F6',
  },
  segBadgeActive: {
    backgroundColor: Color.white,
  },
  segBadgeText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  segBadgeTextActive: {
    color: BLUE,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: G,
    paddingTop: 12,
    paddingBottom: 4,
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: '#1E3A8A',
    backgroundColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },
  section: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },

  // ── Shared bits ─────────────────────────────────────────────────────────
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: FontWeight.semibold,
  },
  meta: {
    fontSize: 13.5,
    color: MUTED,
  },
  payText: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: FontWeight.semibold,
  },
  linkText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  iconLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconLineText: {
    fontSize: 14,
    color: INK,
  },

  // ── Hero cards ──────────────────────────────────────────────────────────
  hero: {
    padding: 14,
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    ...CARD_SHADOW,
  },
  heroBlue: {
    borderColor: '#D5E2FA',
    backgroundColor: '#EEF4FF',
  },
  heroGreen: {
    borderColor: '#CDEBDB',
    backgroundColor: '#ECFAF2',
  },
  heroTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  heroTagBlue: {
    backgroundColor: '#DBE7FD',
  },
  heroTagGreen: {
    backgroundColor: '#D3F2E0',
  },
  heroTagText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  heroTagTextBlue: {
    color: BLUE,
  },
  heroTagTextGreen: {
    color: '#15803D',
  },
  inkText: {
    color: INK,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroPhoto: {
    width: 104,
    height: 116,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  heroInfo: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  heroName: {
    fontSize: 19,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  whenBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Color.white,
  },
  whenText: {
    fontSize: 13.5,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  flexText: {
    flex: 1,
  },
  whenSep: {
    width: 1,
    height: 18,
    marginHorizontal: 4,
    backgroundColor: CARD_BORDER,
  },
  heroPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: Color.white,
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  solidBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 42,
    borderRadius: 10,
    backgroundColor: BLUE,
  },
  solidBtnText: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },

  // ── Row cards ───────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  rowPhoto: {
    width: 92,
    height: 92,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  // Lines below the title stop short of the arrow; the title row (with the
  // status pill) runs to the card's right edge, above the arrow.
  rowInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    paddingRight: 22,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: -22,
  },
  chevron: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  rowName: {
    flex: 1,
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  thumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2F7',
  },
  thumbMore: {
    height: 40,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#F1F3F7',
  },
  thumbMoreText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  orderFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  footAmount: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  reorder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
