import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_SHADOW, INK, PILL } from '@/utils/modernTheme';

const MUTED = Color.textSecondary;
const STAR_TEXT = '#334155';

/** Cards shared by Home and the "View all" screens, so they're identical in both. */
export const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },

  // ── Product-type card ("Shop by product") ───────────────────────────────
  productCard: {
    borderRadius: 14,
    backgroundColor: Color.white,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  productImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productCutout: {
    width: '84%',
    height: '88%',
  },
  // Always reserves two lines so cards in a row stay the same height.
  productName: {
    minHeight: 2 * 19 + 16,
    paddingHorizontal: 6,
    paddingVertical: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── Store-category card ("Shop by business") ────────────────────────────
  bizCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    ...CARD_SHADOW,
  },
  // Icon sits a little above centre so the name strip below stays clear.
  bizIconTile: {
    paddingBottom: 22,
  },
  bizName: {
    position: 'absolute',
    left: 10,
    right: 8,
    bottom: 10,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Service category tile ("What service do you need?") ─────────────────
  svcCatTile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    ...CARD_SHADOW,
  },
  // Icon sits a little above centre so the name strip below stays clear.
  svcCatIconTile: {
    paddingBottom: 16,
  },
  svcCatName: {
    position: 'absolute',
    left: 5,
    right: 5,
    bottom: 7,
    textAlign: 'center',
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.1,
    color: Color.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ── Order from stores ───────────────────────────────────────────────────
  storeCard: {
    borderRadius: 14,
    backgroundColor: Color.white,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  storeImage: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  storeBody: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 6,
  },
  storeName: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeMeta: {
    flexShrink: 1,
    fontSize: 12.5,
    color: STAR_TEXT,
  },
  openPill: {
    marginLeft: 'auto',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  // In a row the pill sits in the aside column, not pushed right.
  rowPill: {
    marginLeft: 0,
  },
  closedPill: {
    backgroundColor: PILL.grey.bg,
  },
  openPillText: {
    fontSize: 10.5,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  closedPillText: {
    color: MUTED,
  },

  // ── Popular services ────────────────────────────────────────────────────
  list: {
    gap: 8,
  },
  svcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 6,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  svcImage: {
    width: 100,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  svcInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  svcName: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  svcSub: {
    fontSize: 12,
    color: MUTED,
  },
  svcMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  svcMeta: {
    flexShrink: 1,
    fontSize: 11.5,
    color: STAR_TEXT,
  },
  svcAside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: Color.border,
  },
  svcPrice: {
    alignItems: 'flex-start',
  },
  fromLabel: {
    fontSize: 11,
    color: MUTED,
  },
  fromPrice: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bookBtn: {
    height: 28,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#1D4ED8',
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
