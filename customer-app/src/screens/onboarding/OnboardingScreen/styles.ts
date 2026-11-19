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
  PILL,
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const DOT = '#CBD5E1';

/** Icon-chip tones for the category grid; `tint` in slides.ts indexes this. */
export const CATEGORY_TONES = [
  PILL.blue,
  { bg: '#FCE7F3', fg: '#BE185D' },
  PILL.green,
  PILL.yellow,
  PILL.lavender,
  PILL.teal,
];

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ModernSize.gutter + 4,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACTION,
  },
  markText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
  },
  wordmark: {
    color: INK,
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.5,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: ModernRadius.pill,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  skip: {
    color: LINK,
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
  },

  // ── Pager ───────────────────────────────────────────────────────────────
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
  },
  visual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 12,
    paddingBottom: 8,
  },
  title: {
    color: INK,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.6,
  },
  titleAccent: {
    color: LINK,
  },
  body: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
  },

  // ── Illustration stage ──────────────────────────────────────────────────
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Slide 1 — category grid
  categoryGrid: {
    width: '86%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  categoryIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    color: INK,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.semibold,
  },

  // Slide 2 — assistant chat
  chat: {
    width: '88%',
    gap: 12,
  },
  bubble: {
    maxWidth: '90%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    ...CARD_SHADOW,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
    backgroundColor: ACTION,
  },
  bubbleMineText: {
    color: Color.white,
    fontSize: ModernType.body,
    lineHeight: 20,
  },
  bubbleReply: {
    alignSelf: 'flex-start',
    gap: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: Color.white,
  },
  replyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PILL.lavender.bg,
  },
  replyName: {
    color: INK,
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
  },
  bubbleText: {
    color: INK,
    fontSize: ModernType.body,
    lineHeight: 20,
    fontWeight: FontWeight.semibold,
  },
  replyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replyMeta: {
    color: PILL.green.fg,
    fontSize: ModernType.caption,
    fontWeight: FontWeight.medium,
  },

  // Slide 3 — organised tiles
  tileWrap: {
    width: '84%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    gap: 4,
    padding: 14,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  tileWide: {
    width: '100%',
  },
  tileSmall: {
    flexGrow: 1,
    flexBasis: '40%',
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    color: INK,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
  },
  tileBody: {
    color: MUTED,
    fontSize: ModernType.caption,
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: {
    gap: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dotBase: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DOT,
  },
  dotActive: {
    width: 24,
    backgroundColor: ACTION,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTION,
    ...CARD_SHADOW,
  },
  ctaText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
});
