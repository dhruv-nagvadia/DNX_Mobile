import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import { CARD_BORDER, CARD_SHADOW, INK, ModernSize, PAGE_BG, PILL } from '@/utils/modernTheme';

const BLUE = '#1D4ED8';
const MUTED = Color.textSecondary;
const META = '#475569';

/** Mockup "designs/customer/mobile/Unisex Salon Booking App Listings.png". */
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
    flexGrow: 1,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 4,
    paddingBottom: 32,
    gap: 12,
  },
  fill: {
    width: '100%',
    height: '100%',
  },

  // ── Search ──────────────────────────────────────────────────────────────
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
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

  // ── Chips ───────────────────────────────────────────────────────────────
  chipsBleed: {
    marginHorizontal: -ModernSize.gutter,
    marginTop: 12,
  },
  chips: {
    paddingHorizontal: ModernSize.gutter,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: BLUE,
    backgroundColor: BLUE,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  chipDotActive: {
    backgroundColor: '#86EFAC',
  },
  chipText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  chipTextActive: {
    color: Color.white,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 2,
  },
  count: {
    fontSize: 14,
    color: MUTED,
  },

  // ── Card ────────────────────────────────────────────────────────────────
  card: {
    borderRadius: 16,
    backgroundColor: Color.white,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  photo: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  openPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  openPillText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  closedPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
  },
  closedPillText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 4,
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
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.3,
    color: INK,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  sub: {
    fontSize: 13.5,
    color: META,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: CARD_BORDER,
  },
  meta: {
    flexShrink: 1,
    fontSize: 13,
    color: META,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  fromLabel: {
    fontSize: 14,
    color: META,
  },
  fromPrice: {
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  bookBtn: {
    height: 38,
    paddingHorizontal: 22,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: BLUE,
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Footer / empty ──────────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 13,
    color: MUTED,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: MUTED,
  },
});
