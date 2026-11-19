import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, LINK } from '@/utils/modernTheme';

const MUTED = '#64748B';
const BLUE = '#1D4ED8';

/** Home's booking-led sections: next booking, Book again, Popular services. */
export const sectionStyles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaGap: {
    marginLeft: 6,
  },

  // ── Your next booking ───────────────────────────────────────────────────
  nextCard: {
    marginTop: 14,
    padding: 12,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5E2FA',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  nextTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  nextThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  nextInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  nextService: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  nextBusiness: {
    fontSize: 13,
    color: MUTED,
  },
  nextWhen: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: FontWeight.bold,
  },
  nextActions: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: LINK,
    backgroundColor: Color.white,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  solidBtn: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: BLUE,
  },
  solidBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Book again ──────────────────────────────────────────────────────────
  againCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  againImage: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  againBody: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 3,
  },
  againName: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  againLast: {
    fontSize: 12,
    color: MUTED,
  },
  againBtn: {
    marginTop: 6,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: '#EEF4FF',
  },
  againBtnText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  // ── Popular services ────────────────────────────────────────────────────
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
    width: 84,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  svcInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  svcName: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  svcSub: {
    flexShrink: 1,
    fontSize: 12,
    color: MUTED,
  },
  svcMeta: {
    fontSize: 12,
    color: '#334155',
  },
  svcAside: {
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: Color.border,
  },
  svcPrice: {
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bookBtn: {
    height: 28,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: BLUE,
  },
  bookBtnText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
