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

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const G = ModernSize.gutter;

/** Mockup "designs/customer/mobile/Mobile Booking Review and Payment UI.png" (left). */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: G,
    paddingTop: 12,
    paddingBottom: 140,
    gap: 12,
  },
  fill: {
    width: '100%',
    height: '100%',
  },

  // ── Progress ────────────────────────────────────────────────────────────
  progress: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: G,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: PAGE_BG,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: BLUE,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  link: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Business card ───────────────────────────────────────────────────────
  bizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
  },
  bizPhoto: {
    width: 96,
    height: 84,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
  },
  bizInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bizName: {
    flexShrink: 1,
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  bizMeta: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  ratingCount: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },

  // ── Appointment ─────────────────────────────────────────────────────────
  apptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
  },
  apptDivider: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  apptIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  apptText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  apptTitle: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  apptSub: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },

  // ── Address ─────────────────────────────────────────────────────────────
  addrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  addrIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  addrLabel: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  addrLine: {
    fontSize: ModernType.secondary,
    lineHeight: 18,
    color: META,
  },
  addrPlaceholder: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: LINK,
  },
  travelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  travelText: {
    fontSize: ModernType.secondary,
    color: META,
  },

  // ── Offers strip ────────────────────────────────────────────────────────
  offerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#F5A26F',
    backgroundColor: '#FFF2E8',
  },
  offerText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#C2410C',
  },
  offerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  offerSub: {
    fontSize: 12.5,
    color: META,
  },
  offerLink: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: BLUE,
    textDecorationLine: 'underline',
  },
  offerRemove: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: '#DC2626',
    textDecorationLine: 'underline',
  },

  // ── Bill details ────────────────────────────────────────────────────────
  billCard: {
    gap: 6,
  },
  billLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  billLabel: {
    flexShrink: 1,
    fontSize: 14,
    color: INK,
  },
  billValue: {
    fontSize: 14,
    color: INK,
  },
  discLabel: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
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
  totalLabel: {
    fontSize: 19,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  totalValue: {
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
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Sticky bar ──────────────────────────────────────────────────────────
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: G,
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
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Address sheet ───────────────────────────────────────────────────────
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Color.overlay,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Color.white,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginBottom: 14,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  sheetTitle: {
    marginBottom: 6,
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  addressScrollArea: {
    maxHeight: 420,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  addressLabel: {
    marginBottom: 2,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  addressRadio: {
    width: 20,
    height: 20,
    marginTop: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRadioSelected: {
    borderColor: BLUE,
  },
  addressRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  addNewAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BLUE,
  },
  addNewAddressBtnText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: BLUE,
  },
});
