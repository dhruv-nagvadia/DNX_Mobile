import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const ORANGE = '#EA580C';

/** Mockups "designs/customer/mobile/Cart Screen.png" + "Cart Empty State.png". */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 4,
    paddingBottom: 130,
    gap: 12,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  disabled: {
    opacity: 0.45,
  },

  // ── Info strip ──────────────────────────────────────────────────────────
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#E6EEFC',
  },
  infoText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: FontWeight.semibold,
    color: INK,
  },

  // ── Store card ──────────────────────────────────────────────────────────
  shopCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  shopHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  shopTap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  shopAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
  },
  shopText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  shopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shopName: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  shopMeta: {
    fontSize: 13,
    color: MUTED,
  },
  clearShop: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: '#DC2626',
  },

  // ── Item row ────────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  thumb: {
    width: 72,
    height: 66,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2F7',
  },
  itemMain: {
    flex: 1,
    gap: 6,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemNameTap: {
    flex: 1,
    gap: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  itemUnit: {
    fontSize: 13,
    color: MUTED,
  },
  itemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: BLUE,
  },
  stepBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  lineTotal: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  warnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  warnText: {
    flex: 1,
    fontSize: 12.5,
    color: ORANGE,
  },

  // ── Offer strips ────────────────────────────────────────────────────────
  offerApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: PILL.green.bg,
  },
  offerAppliedCode: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  offerSep: {
    width: 1,
    height: 18,
    backgroundColor: '#86EFAC',
  },
  offerSave: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  offerAvail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#F5A26F',
    backgroundColor: '#FFF2E8',
  },
  offerAvailText: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: '#C2410C',
  },
  offerLink: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
    textDecorationLine: 'underline',
  },

  // ── Totals ──────────────────────────────────────────────────────────────
  totals: {
    marginTop: 10,
    gap: 4,
  },
  totalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  subLabel: {
    fontSize: 14,
    color: MUTED,
  },
  subValue: {
    fontSize: 14,
    color: META,
  },
  discLabel: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    color: PILL.green.fg,
  },
  storeTotalLabel: {
    fontSize: 17,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  storeTotalValue: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },

  // ── Bill / pay cards ────────────────────────────────────────────────────
  card: {
    padding: 16,
    gap: 6,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTitle: {
    marginBottom: 4,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  billLabel: {
    fontSize: 14,
    color: INK,
  },
  billValue: {
    fontSize: 14,
    color: INK,
  },
  dashed: {
    flexDirection: 'row',
    gap: 3,
    height: 1.5,
    marginVertical: 6,
    overflow: 'hidden',
  },
  dash: {
    width: 5,
    height: 1.5,
    backgroundColor: '#CBD5E1',
  },
  toPayLabel: {
    fontSize: 19,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  toPayValue: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: PILL.green.bg,
  },
  saveText: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  payTitle: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: META,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 11,
  },
  payRowDivider: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  payLabel: {
    flex: 1,
    fontSize: 15,
    color: INK,
  },
  payLabelOff: {
    color: '#94A3B8',
  },

  // ── Checkout bar ────────────────────────────────────────────────────────
  bar: {
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
  barInfo: {
    flex: 1,
  },
  barLabel: {
    fontSize: 13,
    color: MUTED,
  },
  barTotal: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  barSaved: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  payBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Empty state ─────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 12,
  },
  emptyCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    borderRadius: 20,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  emptyArt: {
    width: 220,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBlob: {
    position: 'absolute',
    width: 190,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#EEF3FD',
  },
  emptyBag: {
    width: 120,
    height: 120,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  emptyBadge: {
    position: 'absolute',
    bottom: 22,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  emptyBadgeLeft: {
    left: 12,
  },
  emptyBadgeRight: {
    right: 12,
  },
  emptyTitle: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: INK,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: META,
  },
  emptyBtn: {
    alignSelf: 'stretch',
    height: 52,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  emptyBtnText: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  emptyNote: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#EEF3FD',
  },
  emptyNoteSep: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#C7D7F5',
  },
  emptyNoteText: {
    flex: 1,
    fontSize: 14,
    color: META,
  },
});
