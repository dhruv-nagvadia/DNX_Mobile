import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  ModernSize,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = '#64748B';
const META = '#475569';
const ORANGE = '#EA580C';

/**
 * Booking twin of OrderSuccessScreen — same mockup
 * ("designs/customer/mobile/Dual mobile order success screens.png").
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    paddingBottom: 24,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    right: ModernSize.gutter,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },

  // ── Celebration ─────────────────────────────────────────────────────────
  badgeWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  celebration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(34, 197, 94, 0.10)',
  },
  glowWarning: {
    backgroundColor: 'rgba(234, 88, 12, 0.10)',
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 5,
    borderRadius: 3,
  },
  check: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  checkWarning: {
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
  },
  title: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: INK,
  },
  subtitle: {
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    color: META,
  },

  // ── Cards ───────────────────────────────────────────────────────────────
  stack: {
    marginTop: 20,
    gap: 12,
  },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
  },
  headText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  storeName: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  meta: {
    fontSize: 14,
    color: MUTED,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: FontWeight.semibold,
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },
  detailText: {
    flex: 1,
    minWidth: 0,
  },
  detailLabel: {
    fontSize: 13,
    color: MUTED,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  amounts: {
    marginTop: 12,
    paddingTop: 10,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontSize: 15,
    color: META,
  },
  amountTotal: {
    fontSize: 19,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  amountPaid: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  amountPending: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: ORANGE,
  },
  dueRow: {
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFEBDD',
  },
  dueText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: '#C2410C',
  },

  // ── What happens next ───────────────────────────────────────────────────
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  stepRail: {
    alignItems: 'center',
    width: 22,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  stepDotActive: {
    borderColor: BLUE,
    backgroundColor: BLUE,
  },
  stepLine: {
    flex: 1,
    width: 2,
    minHeight: 14,
    marginTop: 2,
    backgroundColor: '#CBD5E1',
  },
  stepText: {
    flex: 1,
    paddingTop: 1,
    paddingBottom: 6,
    fontSize: 15,
    lineHeight: 20,
    color: META,
  },
  stepTextActive: {
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },

  // ── Where ──────────────────────────────────────────────────────────────
  where: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  whereBody: {
    flex: 1,
    gap: 4,
  },
  whereAddress: {
    fontSize: 14,
    lineHeight: 19,
    color: META,
  },
  openPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  closedPill: {
    backgroundColor: '#F1F5F9',
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  closedDot: {
    backgroundColor: '#94A3B8',
  },
  openText: {
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  closedText: {
    color: MUTED,
  },
  dirBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BLUE,
  },
  dirText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },

  // ── Payment pending ─────────────────────────────────────────────────────
  warnCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
    backgroundColor: '#FFF2E8',
    ...CARD_SHADOW,
  },
  warnBody: {
    flex: 1,
    gap: 4,
  },
  warnTitle: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: '#C2410C',
  },
  warnText: {
    fontSize: 14,
    lineHeight: 20,
    color: META,
  },

  // ── Actions ─────────────────────────────────────────────────────────────
  actions: {
    gap: 10,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 12,
    backgroundColor: Color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    ...CARD_SHADOW,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: Color.white,
  },
  secondaryBtnText: {
    fontSize: 17,
    fontWeight: FontWeight.semibold,
    color: BLUE,
  },
});
