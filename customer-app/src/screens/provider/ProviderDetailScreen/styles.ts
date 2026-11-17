import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const G = ModernSize.gutter;

/** Mockup "designs/customer/mobile/Aura Salon Booking App Interface.png". */
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
    paddingBottom: 24,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  muted: {
    fontSize: 14,
    color: MUTED,
  },
  bleed: {
    marginHorizontal: -G,
  },

  // ── Hero (photo + header card share one rounded, inset card) ───────────
  topCard: {
    marginHorizontal: G,
    borderRadius: 18,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  hero: {
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
  },
  heroBtn: {
    position: 'absolute',
    top: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...CARD_SHADOW,
  },
  heroBtnLeft: {
    left: 12,
  },
  heroBtnRight: {
    right: 12,
  },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  counterText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#3B82F6',
  },

  // ── Header card ─────────────────────────────────────────────────────────
  headerCard: {
    padding: 16,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nameWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  name: {
    flexShrink: 1,
    fontSize: 24,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: INK,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
  },
  ratingPillText: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  subline: {
    fontSize: 14,
    color: META,
  },
  infoChips: {
    gap: 8,
    paddingTop: 6,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  infoChipOpen: {
    borderColor: PILL.green.bg,
    backgroundColor: PILL.green.bg,
  },
  infoChipClosed: {
    backgroundColor: '#F1F5F9',
  },
  infoChipText: {
    fontSize: 13,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  infoChipOpenText: {
    color: PILL.green.fg,
    fontWeight: FontWeight.semibold,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOpen: {
    backgroundColor: '#22C55E',
  },
  dotClosed: {
    backgroundColor: '#94A3B8',
  },
  areaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#EAF1FF',
  },
  areaText: {
    flex: 1,
    fontSize: 14,
    color: INK,
  },

  body: {
    paddingHorizontal: G,
  },

  // ── Quick actions ───────────────────────────────────────────────────────
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 66,
    borderRadius: 14,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  actionText: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Offer ───────────────────────────────────────────────────────────────
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE2CC',
    backgroundColor: '#FFF2E8',
  },
  offerText: {
    flex: 1,
    gap: 6,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  offerCode: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FDDCC6',
  },
  offerCodeText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: '#C2410C',
  },
  offerDivider: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  offerDash: {
    width: 1.5,
    height: 4,
    borderRadius: 1,
    backgroundColor: '#F5A26F',
  },
  offerApply: {
    paddingHorizontal: 4,
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: BLUE,
    textDecorationLine: 'underline',
  },

  // ── Section titles / cards ──────────────────────────────────────────────
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Services ────────────────────────────────────────────────────────────
  serviceCard: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  serviceRowDivider: {
    borderTopColor: Color.border,
    borderTopWidth: 1,
    borderRadius: 0,
    marginHorizontal: 0,
  },
  serviceRowActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EEF4FF',
  },
  serviceInfo: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  serviceMeta: {
    fontSize: 13,
    color: META,
  },
  servicePriceCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  servicePrice: {
    fontSize: 17,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  payPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  payPillText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: BLUE,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: BLUE,
  },

  // ── Dates ───────────────────────────────────────────────────────────────
  dayRow: {
    paddingHorizontal: G,
    gap: 8,
  },
  dayPill: {
    width: 64,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 12,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  dayPillActive: {
    backgroundColor: BLUE,
  },
  dayPillClosed: {
    backgroundColor: '#F1F5F9',
  },
  dayWeek: {
    fontSize: 13,
    color: INK,
  },
  dayNum: {
    fontSize: 21,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  dayClosed: {
    fontSize: 11,
    color: MUTED,
  },
  dayTextActive: {
    color: Color.white,
  },
  dayTextClosed: {
    color: MUTED,
  },

  // ── Slots ───────────────────────────────────────────────────────────────
  slotGroup: {
    marginBottom: 10,
  },
  periodLabel: {
    marginBottom: 6,
    fontSize: 13,
    color: META,
  },
  slotWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slot: {
    minWidth: 92,
    height: 34,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  slotActive: {
    borderColor: BLUE,
    backgroundColor: BLUE,
  },
  slotBooked: {
    backgroundColor: '#EEF1F6',
    borderColor: '#EEF1F6',
  },
  slotText: {
    fontSize: 13.5,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  slotTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },
  slotTextBooked: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  moreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  moreText: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },

  // ── About ───────────────────────────────────────────────────────────────
  about: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: META,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },

  // ── Location & hours ────────────────────────────────────────────────────
  locRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  locLeft: {
    flex: 1,
    gap: 10,
  },
  mapTile: {
    height: 92,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#E8EEF5',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: Color.white,
  },
  mapRoadH: {
    left: 0,
    right: 0,
    top: '58%',
    height: 8,
  },
  mapRoadV: {
    top: 0,
    bottom: 0,
    left: '34%',
    width: 7,
  },
  mapRoadD: {
    width: 220,
    height: 5,
    top: '30%',
    left: -40,
    transform: [{ rotate: '-24deg' }],
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: PILL.green.bg,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  address: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: INK,
  },
  hoursCol: {
    flex: 1.15,
    paddingLeft: 12,
    gap: 4,
    borderLeftWidth: 1,
    borderLeftColor: Color.border,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  hoursDay: {
    width: 30,
    fontSize: 12.5,
    color: META,
  },
  hoursTime: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12.5,
    color: META,
  },
  hoursToday: {
    color: BLUE,
    fontWeight: FontWeight.bold,
  },
  hoursClosed: {
    color: '#DC2626',
    fontWeight: FontWeight.semibold,
  },

  // ── Reviews ─────────────────────────────────────────────────────────────
  reviewsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  summaryLeft: {
    alignItems: 'center',
    gap: 4,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: Color.border,
  },
  summaryAvg: {
    fontSize: 38,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  summaryCount: {
    fontSize: 12,
    color: MUTED,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  bars: {
    flex: 1,
    gap: 5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 26,
    fontSize: 12,
    color: INK,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5EAF2',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: BLUE,
  },
  barPct: {
    width: 34,
    textAlign: 'right',
    fontSize: 12,
    color: MUTED,
  },
  reviewCard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
  reviewBody: {
    flex: 1,
    gap: 3,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewAgo: {
    fontSize: 12,
    color: MUTED,
  },
  reviewText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: INK,
  },
  reply: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    borderRadius: 8,
    backgroundColor: '#F1F5FB',
    gap: 2,
  },
  replyTitle: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  replyText: {
    fontSize: 13,
    lineHeight: 18,
    color: META,
  },

  // ── Sticky book bar ─────────────────────────────────────────────────────
  bookBar: {
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
  bookInfo: {
    flex: 1,
    gap: 2,
  },
  bookHint: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: META,
  },
  bookService: {
    fontSize: 13,
    color: MUTED,
  },
  bookSummary: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bookBtn: {
    height: 50,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  bookBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
