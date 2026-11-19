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
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const HAIRLINE = '#E8ECF2';
const SOFT_BLUE = '#E6EEFC';
const DASHED = '#93B4F5';

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

  // ── Address card ────────────────────────────────────────────────────────
  card: {
    paddingHorizontal: ModernSize.cardPad,
    paddingTop: ModernSize.cardPad,
    borderRadius: ModernRadius.card,
    borderWidth: 1.5,
    borderColor: Color.white,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardDefault: {
    borderColor: '#BFD3F8',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 14,
  },
  iconTile: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 22,
  },
  label: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  defaultPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: ModernRadius.pill,
    backgroundColor: PILL.green.bg,
  },
  defaultPillText: {
    fontSize: ModernType.caption,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  line: {
    fontSize: ModernType.secondary,
    lineHeight: 19,
    color: MUTED,
  },

  // ── Card actions ────────────────────────────────────────────────────────
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
    marginHorizontal: -6,
  },
  actionsSpacer: {
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 6,
  },
  actionText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  actionTextDanger: {
    color: Color.error,
  },

  // ── Add new (dashed card) ───────────────────────────────────────────────
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: ModernRadius.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: DASHED,
    backgroundColor: '#F7FAFF',
  },
  addIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_BLUE,
  },
  addText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: LINK,
  },

  // ── Loading / empty ─────────────────────────────────────────────────────
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 10,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: SOFT_BLUE,
  },
  emptyTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyText: {
    fontSize: ModernType.body,
    lineHeight: 20,
    color: MUTED,
    textAlign: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: ModernSize.control,
    marginTop: 10,
    paddingHorizontal: 24,
    borderRadius: ModernRadius.button,
    backgroundColor: LINK,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
