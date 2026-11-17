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

const META = '#475569';
const MUTED = '#64748B';
const RING = '#CBD5E1';
const RED = '#DC2626';
const G = ModernSize.gutter;

/** Mockup "designs/customer/mobile/Salon Booking Details & Review States.png". */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFound: {
    fontSize: ModernType.body,
    color: MUTED,
  },
  content: {
    paddingHorizontal: G,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 14,
  },

  // ── Header share button ─────────────────────────────────────────────────
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },

  // ── Status hero ─────────────────────────────────────────────────────────
  hero: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 14,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  headline: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
    color: INK,
  },
  whenLine: {
    fontSize: ModernType.body,
    color: META,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },

  // ── Tracker ─────────────────────────────────────────────────────────────
  tracker: {
    flexDirection: 'row',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  stepDotRow: {
    alignSelf: 'stretch',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    position: 'absolute',
    top: 11,
    height: 2,
    backgroundColor: RING,
  },
  stepLineLeft: {
    left: 0,
    right: '50%',
  },
  stepLineRight: {
    left: '50%',
    right: 0,
  },
  stepLineDone: {
    backgroundColor: LINK,
  },
  stepDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LINK,
  },
  stepStopped: {
    backgroundColor: RED,
  },
  stepTodo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: RING,
    backgroundColor: Color.white,
  },
  stepLabel: {
    fontSize: ModernType.caption,
    color: MUTED,
    textAlign: 'center',
  },
  stepLabelDone: {
    color: INK,
    fontWeight: FontWeight.medium,
  },
  stepLabelStopped: {
    color: RED,
    fontWeight: FontWeight.semibold,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    borderRadius: 16,
    backgroundColor: Color.white,
    gap: 10,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Business card ───────────────────────────────────────────────────────
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bizPhoto: {
    width: 84,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  bizInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bizName: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.3,
    color: INK,
  },
  bizMeta: {
    fontSize: ModernType.secondary,
    color: META,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  ratingCount: {
    fontSize: ModernType.secondary,
    color: META,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  quickBtn: {
    flex: 1,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#BFD0F5',
    backgroundColor: Color.white,
  },
  quickText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Icon rows (Appointment) ─────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
  },
  infoRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER,
  },
  infoLabel: {
    width: 76,
    fontSize: ModernType.body,
    color: META,
  },
  infoValue: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Visit address ───────────────────────────────────────────────────────
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressBody: {
    flex: 1,
    gap: 4,
  },
  addressText: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: META,
  },

  // ── Payment ─────────────────────────────────────────────────────────────
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  payLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payLabel: {
    fontSize: ModernType.body,
    color: META,
  },
  payValue: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  couponPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  couponText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  green: {
    color: PILL.green.fg,
  },
  dashes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginVertical: 2,
  },
  dash: {
    width: 5,
    height: 1.2,
    backgroundColor: RING,
  },
  totalLabel: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  dueRow: {
    marginHorizontal: -6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: PILL.orange.bg,
  },
  dueText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: PILL.orange.fg,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  methodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: SOFT_FILL,
  },
  methodText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  payStatus: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
  },

  // ── Buttons ─────────────────────────────────────────────────────────────
  primaryBtn: {
    height: ModernSize.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: LINK,
  },
  primaryBtnSm: {
    height: 44,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  disabled: {
    opacity: 0.6,
  },

  // ── Info strip (cancellation) ───────────────────────────────────────────
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F7E6C8',
    backgroundColor: '#FFF7EC',
  },
  stripText: {
    flex: 1,
    fontSize: ModernType.secondary,
    lineHeight: 18,
    color: '#9A3412',
  },

  // ── Notes (no-show / provider note) ─────────────────────────────────────
  noteBox: {
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: RED,
    backgroundColor: '#FFF5F5',
  },
  noteText: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: INK,
  },

  // ── Rate your visit ─────────────────────────────────────────────────────
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 2,
  },
  starsRowLeft: {
    justifyContent: 'flex-start',
    gap: 6,
  },
  tapHint: {
    textAlign: 'center',
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  input: {
    minHeight: 64,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    fontSize: ModernType.body,
    color: INK,
    textAlignVertical: 'top',
  },
  counter: {
    alignSelf: 'flex-end',
    marginTop: -4,
    fontSize: ModernType.caption,
    color: MUTED,
  },
  reviewText: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: INK,
  },
  reply: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: LINK,
    borderRadius: 8,
    backgroundColor: '#F1F5FB',
    gap: 2,
  },
  replyTitle: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  replyText: {
    fontSize: ModernType.secondary,
    lineHeight: 18,
    color: META,
  },

  // ── Book again ──────────────────────────────────────────────────────────
  againCard: {
    padding: ModernSize.cardPad,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5E2FA',
    backgroundColor: '#EEF4FF',
    gap: 12,
  },
  againHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  againText: {
    flex: 1,
    gap: 2,
  },
  againSub: {
    fontSize: ModernType.secondary,
    color: META,
  },
  link: {
    alignSelf: 'center',
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: LINK,
    textDecorationLine: 'underline',
  },

  // ── Sticky bottom bar ───────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: G,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  outlineBtn: {
    flex: 1,
    height: ModernSize.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1.5,
    borderColor: LINK,
    backgroundColor: Color.white,
  },
  outlineDanger: {
    borderColor: RED,
  },
  outlineText: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  dangerText: {
    color: RED,
  },
  flex: {
    flex: 1,
  },
});
