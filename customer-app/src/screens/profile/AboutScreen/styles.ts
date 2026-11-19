import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  ACTION,
  CARD_SHADOW,
  INK,
  LINK,
  ModernRadius,
  ModernSize,
  ModernType,
  PAGE_BG,
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const BODY = '#334155';
const HAIRLINE = '#E8ECF2';

export const CHEVRON = '#94A3B8';
export const HEART = '#EF4444';
/** Soft blue gradient behind the brand card (same family as Profile's card). */
export const BRAND_GRADIENT = ['#F1F6FF', '#E1EBFD', '#D6E4FC'];

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  content: { paddingHorizontal: ModernSize.gutter, paddingTop: 8 },

  // ── Brand card ──────────────────────────────────────────────────────────
  brandCard: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 24,
    paddingHorizontal: ModernSize.cardPad,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D5E2FA',
    overflow: 'hidden',
    backgroundColor: '#E6EEFD',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACTION,
    ...CARD_SHADOW,
  },
  logoText: {
    fontSize: 36,
    fontWeight: FontWeight.extrabold,
    color: Color.white,
  },
  appName: {
    fontSize: ModernType.largeTitle,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
    color: INK,
  },
  tagline: {
    fontSize: ModernType.body,
    color: BODY,
    textAlign: 'center',
  },
  versionPill: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: ModernRadius.pill,
    backgroundColor: Color.white,
  },
  versionText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Sections ────────────────────────────────────────────────────────────
  sectionLabel: {
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: MUTED,
  },
  card: {
    padding: ModernSize.cardPad,
    gap: 14,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  blurb: {
    fontSize: 15,
    lineHeight: 22,
    color: BODY,
  },
  highlights: { gap: 10 },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  section: {
    paddingHorizontal: 14,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  rowIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flex: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 28,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: MUTED,
  },
  footerMeta: {
    fontSize: ModernType.caption,
    color: CHEVRON,
  },
});
