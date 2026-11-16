import { StyleSheet } from 'react-native';

import { CARD_GAP } from '@/components/BusinessCards';
import { Color, FontWeight } from '@/utils/Theme';
import { CARD_SHADOW, INK, ModernSize, PAGE_BG } from '@/utils/modernTheme';

const MUTED = Color.textSecondary;

/** Mockup "designs/customer/mobile/user_Beauty_Guide.png". */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 6,
    paddingBottom: 32,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginTop: 24,
  },
  stateText: {
    marginTop: 12,
    fontSize: 14,
    color: MUTED,
  },

  // ── Banner ──────────────────────────────────────────────────────────────
  banner: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    ...CARD_SHADOW,
  },
  bannerText: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
  },
  bannerTitle: {
    fontSize: 21,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.3,
    color: Color.white,
  },
  bannerLine: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.92)',
  },

  // ── Search ──────────────────────────────────────────────────────────────
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    marginTop: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
  },

  // ── Sections ────────────────────────────────────────────────────────────
  sectionTitle: {
    marginTop: 22,
    marginBottom: 12,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeadTitle: {
    flexShrink: 1,
    fontSize: 19,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    color: INK,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: '#1D4ED8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  list: {
    gap: 8,
  },

  // ── Sub-category card ───────────────────────────────────────────────────
  subCard: {
    borderRadius: 14,
    backgroundColor: Color.white,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  subImage: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  subBody: {
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 11,
    gap: 3,
  },
  // Reserves two lines so cards in a row stay the same height.
  subName: {
    minHeight: 40,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  subCount: {
    fontSize: 13,
    color: MUTED,
  },
});
