import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
} from '@/utils/modernTheme';

export const AMBER = '#F59E0B';
export const EMPTY_STAR = '#CBD5E1';
/** Same avatar tints as the business page's review cards. */
export const AVATAR_TINTS = [
  { bg: '#EAF1FF', fg: '#1D4ED8' },
  { bg: '#FDECEC', fg: '#DC2626' },
  { bg: '#E7F6EE', fg: '#15803D' },
  { bg: '#F2ECFF', fg: '#6D28D9' },
];

const MUTED = '#64748B';
const META = '#475569';

/** Mirrors ProviderDetailScreen's ReviewsSection (summary + bars + review cards). */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 8,
    gap: ModernSize.gap,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.yellow.bg,
  },
  emptyTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  hint: {
    fontSize: ModernType.body,
    color: MUTED,
    textAlign: 'center',
  },

  // ── Summary card ────────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
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
    fontSize: 38,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -1,
    color: INK,
  },
  summaryCount: {
    fontSize: ModernType.caption,
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
    fontSize: ModernType.caption,
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
    backgroundColor: LINK,
  },
  barPct: {
    width: 34,
    textAlign: 'right',
    fontSize: ModernType.caption,
    color: MUTED,
  },

  // ── Filter chips ────────────────────────────────────────────────────────
  chipScroll: {
    marginHorizontal: -ModernSize.gutter,
    flexGrow: 0,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: ModernSize.gutter,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: ModernSize.controlSm,
    paddingHorizontal: 14,
    borderRadius: ModernRadius.pill,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  chipActive: {
    borderColor: LINK,
    backgroundColor: LINK,
  },
  chipText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  chipCount: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
    color: MUTED,
  },
  chipTextActive: {
    color: Color.white,
  },

  noMatch: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },

  // ── Review cards ────────────────────────────────────────────────────────
  reviewCard: {
    flexDirection: 'row',
    gap: 12,
    padding: ModernSize.cardPad,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  avatar: {
    width: ModernSize.avatar,
    height: ModernSize.avatar,
    borderRadius: ModernSize.avatar / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
  reviewBody: {
    flex: 1,
    gap: 4,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewName: {
    flex: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  reviewAgo: {
    fontSize: ModernType.caption,
    color: MUTED,
  },
  reviewText: {
    marginTop: 2,
    fontSize: ModernType.body,
    lineHeight: 20,
    color: INK,
  },
  reply: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
    borderLeftWidth: 3,
    borderLeftColor: LINK,
    borderRadius: 8,
    backgroundColor: '#F1F5FB',
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
});
