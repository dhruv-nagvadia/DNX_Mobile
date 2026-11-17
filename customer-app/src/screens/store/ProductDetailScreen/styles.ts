import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const G = ModernSize.gutter;

/** Mockup "designs/customer/mobile/Tomato Product Pages_ Add or View Cart.png". */
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
  notFound: {
    fontSize: 15,
    color: MUTED,
  },
  content: {
    paddingBottom: 120,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  bleed: {
    marginHorizontal: -G,
  },

  // ── Photo card ──────────────────────────────────────────────────────────
  imageCard: {
    height: 300,
    marginHorizontal: G,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1F6',
  },
  image: {
    width: '78%',
    height: '82%',
  },
  noImage: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  noImageText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  roundBtn: {
    position: 'absolute',
    top: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  roundLeft: {
    left: 12,
  },
  roundRight: {
    right: 12,
  },
  offBadge: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: PILL.green.bg,
  },
  offBadgeText: {
    fontSize: 14,
    fontWeight: FontWeight.extrabold,
    color: PILL.green.fg,
  },
  outBadge: {
    backgroundColor: '#1E293B',
  },
  outBadgeText: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },

  // ── Identity / price ────────────────────────────────────────────────────
  body: {
    paddingHorizontal: G,
    paddingTop: 14,
    gap: 6,
  },
  storeChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
  },
  storeName: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  name: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: INK,
  },
  iconLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: MUTED,
  },
  metaSmall: {
    fontSize: 12,
    color: MUTED,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 30,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  strike: {
    fontSize: 18,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  stockLow: {
    backgroundColor: '#FFEDD5',
  },
  stockOut: {
    backgroundColor: '#FDE2E2',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  stockDotLow: {
    backgroundColor: '#EA580C',
  },
  stockDotOut: {
    backgroundColor: '#DC2626',
  },
  stockText: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  stockTextLow: {
    color: '#C2410C',
  },
  stockTextOut: {
    color: '#DC2626',
  },
  savePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  saveText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },

  // ── Coupon ──────────────────────────────────────────────────────────────
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#F5A26F',
    backgroundColor: '#FFF2E8',
  },
  couponBody: {
    flex: 1,
    gap: 2,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: '#C2410C',
  },
  couponLine: {
    fontSize: 14,
    color: META,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: Color.white,
  },
  copyBtnDone: {
    borderColor: '#86EFAC',
    backgroundColor: PILL.green.bg,
  },
  copyText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  copyTextDone: {
    color: PILL.green.fg,
  },
  couponHint: {
    fontSize: 12,
    color: MUTED,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    marginTop: 10,
    padding: 14,
    gap: 10,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  link: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Amount ──────────────────────────────────────────────────────────────
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quick: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  quickActive: {
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: '#EEF4FF',
  },
  quickText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  quickTextActive: {
    color: BLUE,
  },
  helper: {
    fontSize: 13,
    color: MUTED,
  },

  // ── About ───────────────────────────────────────────────────────────────
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: META,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specText: {
    fontSize: 14,
    color: INK,
  },

  // ── Reviews ─────────────────────────────────────────────────────────────
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryLeft: {
    alignItems: 'center',
    gap: 4,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: Color.border,
  },
  summaryAvg: {
    fontSize: 34,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bars: {
    flex: 1,
    gap: 4,
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
    overflow: 'hidden',
    backgroundColor: '#E5EAF2',
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
  reviewRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 10,
  },
  reviewDivider: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
  },
  reviewBody: {
    flex: 1,
    gap: 4,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewAgo: {
    fontSize: 12,
    color: MUTED,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 19,
    color: INK,
  },
  reply: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    borderRadius: 8,
    backgroundColor: '#F1F5FB',
  },
  replyTitle: {
    fontSize: 12.5,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  replyText: {
    fontSize: 13,
    color: META,
  },

  // ── More from this store ────────────────────────────────────────────────
  moreRow: {
    paddingHorizontal: G,
    paddingBottom: 6,
    gap: 10,
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
  barCaption: {
    fontSize: 13,
    color: MUTED,
  },
  barPrice: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  barBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  barBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  barBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
