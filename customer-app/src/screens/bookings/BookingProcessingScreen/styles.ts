import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_SHADOW, INK, LINK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

const MUTED = '#64748B';
const META = '#475569';
const RING = 132;
const BADGE = 88;

/** Calm full-screen "working on it" state, in the modern (OrderSuccess) language. */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ModernSize.gutter + 8,
    paddingVertical: 32,
  },

  // ── Spinner ─────────────────────────────────────────────────────────────
  spinnerWrap: {
    width: RING + 48,
    height: RING + 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: RING + 48,
    height: RING + 48,
    borderRadius: (RING + 48) / 2,
    backgroundColor: 'rgba(29, 78, 216, 0.07)',
  },
  ring: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 4,
    borderColor: PILL.blue.bg,
    borderTopColor: LINK,
    borderRightColor: LINK,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },

  // ── Copy ────────────────────────────────────────────────────────────────
  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.4,
    textAlign: 'center',
    color: INK,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    color: META,
  },

  // ── Step list ───────────────────────────────────────────────────────────
  stepsCard: {
    alignSelf: 'stretch',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  stepDotDone: {
    borderColor: PILL.green.fg,
    backgroundColor: PILL.green.fg,
  },
  stepDotActive: {
    borderColor: LINK,
  },
  stepDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: LINK,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: MUTED,
  },
  stepTextDone: {
    color: INK,
  },
  stepTextActive: {
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Note ────────────────────────────────────────────────────────────────
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  noteText: {
    fontSize: 13,
    color: MUTED,
  },

  // ── Failure ─────────────────────────────────────────────────────────────
  errorWrap: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
  },
  errorBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.red.fg,
    shadowColor: PILL.red.fg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  errorCard: {
    alignSelf: 'stretch',
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: PILL.red.fg,
    backgroundColor: '#FEF2F2',
    ...CARD_SHADOW,
  },
  errorText: {
    fontSize: 14.5,
    lineHeight: 21,
    color: META,
  },
  actions: {
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 12,
    backgroundColor: LINK,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
