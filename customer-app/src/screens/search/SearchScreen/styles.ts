import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  ModernSize,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const PLACEHOLDER = '#94A3B8';
const HAIRLINE = '#E8ECF2';
const G = ModernSize.gutter;

/** Mockup "designs/customer/mobile/Modern Hair Search App Interface.png". */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  fill: {
    width: '100%',
    height: '100%',
  },

  // ── Top: back + search field ────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: G,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 14,
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: HAIRLINE,
    ...CARD_SHADOW,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 16,
    color: INK,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PLACEHOLDER,
  },

  // ── Type chips ──────────────────────────────────────────────────────────
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: G,
    paddingBottom: 12,
  },
  typeChip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: ModernRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  typeChipActive: {
    backgroundColor: INK,
    borderColor: INK,
  },
  typeChipText: {
    fontSize: 15,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  typeChipTextActive: {
    color: Color.white,
    fontWeight: FontWeight.semibold,
  },

  // ── Location ────────────────────────────────────────────────────────────
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: G,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    color: MUTED,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  locationChange: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Scroll content / sections ───────────────────────────────────────────
  content: {
    paddingHorizontal: G,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 22,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  sectionLink: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.4,
    color: INK,
    marginBottom: -8,
  },
  hintText: {
    fontSize: 13,
    color: MUTED,
  },

  // ── Recent searches ─────────────────────────────────────────────────────
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: ModernRadius.pill,
    backgroundColor: '#E6EEFB',
  },
  recentChipText: {
    fontSize: 15,
    fontWeight: FontWeight.medium,
    color: INK,
  },

  // ── Shared white list card ──────────────────────────────────────────────
  listCard: {
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: HAIRLINE,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginLeft: 12,
  },

  // ── Recently viewed rows ────────────────────────────────────────────────
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
  },
  viewThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  rowSub: {
    fontSize: 14,
    color: MUTED,
  },
  iconTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },

  // ── Popular tiles ───────────────────────────────────────────────────────
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 6,
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: INK,
    textAlign: 'center',
  },

  // ── Business result card ────────────────────────────────────────────────
  bizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: HAIRLINE,
    ...CARD_SHADOW,
  },
  bizThumb: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bizInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bizName: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  bizServices: {
    fontSize: 14,
    color: '#334155',
  },
  bizMeta: {
    fontSize: 13,
    color: MUTED,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  ratingInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  openPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.green.bg,
  },
  openPillText: {
    fontSize: 12,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  strong: {
    fontWeight: FontWeight.bold,
    color: INK,
  },
  match: {
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  // ── Service rows ────────────────────────────────────────────────────────
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  serviceThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  serviceMeta: {
    fontSize: 13,
    color: MUTED,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  outlineBtn: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: LINK,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Products ────────────────────────────────────────────────────────────
  productRow: {
    gap: 10,
    paddingRight: G,
  },
  productScroll: {
    marginRight: -G,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // ── Footer hint ─────────────────────────────────────────────────────────
  footerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#EAF0FA',
  },
  footerHintText: {
    flexShrink: 1,
    fontSize: 14,
    color: INK,
  },

  // ── Empty / loading ─────────────────────────────────────────────────────
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    marginBottom: 6,
    ...CARD_SHADOW,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: INK,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
  },
});
