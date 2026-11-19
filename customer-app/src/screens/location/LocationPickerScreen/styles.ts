import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const META = '#475569';
const HAIRLINE = '#E8ECF2';
const PLACEHOLDER = '#94A3B8';
const SOFT_BLUE = '#E6EEFC';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 14,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  // ── Current selection ───────────────────────────────────────────────────
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: ModernRadius.card,
    borderWidth: 1.5,
    borderColor: LINK,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  selectedIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_BLUE,
  },
  selectedCaption: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  selectedLabel: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LINK,
  },
  clearSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
  },

  // ── GPS card ────────────────────────────────────────────────────────────
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    padding: 14,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: '#C9D9F8',
    backgroundColor: SOFT_BLUE,
  },
  gpsCardFailed: {
    borderColor: '#F8D4D4',
    backgroundColor: '#FFF5F5',
  },
  gpsIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LINK,
  },
  gpsIconFailed: {
    backgroundColor: PILL.red.bg,
  },
  gpsTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  gpsSub: {
    fontSize: ModernType.secondary,
    color: META,
  },

  // ── Search ──────────────────────────────────────────────────────────────
  section: {
    gap: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: ModernSize.control,
    paddingLeft: 14,
    paddingRight: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: Color.white,
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
  hint: {
    fontSize: ModernType.caption,
    color: MUTED,
  },

  // ── Results ─────────────────────────────────────────────────────────────
  listCard: {
    paddingHorizontal: 14,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: ModernSize.rowMinHeight + 8,
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_BLUE,
  },
  resultIconSelected: {
    backgroundColor: LINK,
  },
  resultTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  resultSub: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  pinPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
    backgroundColor: SOFT_FILL,
  },
  pinPillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: ModernType.body,
    color: MUTED,
    textAlign: 'center',
  },

  // ── Info strip ──────────────────────────────────────────────────────────
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: SOFT_BLUE,
  },
  infoText: {
    flex: 1,
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
});
