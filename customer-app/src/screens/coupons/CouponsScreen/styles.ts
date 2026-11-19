import { StyleSheet } from 'react-native';

import { Color, FontWeight } from '@/utils/Theme';
import {
  CARD_BORDER,
  CARD_SHADOW,
  INK,
  LINK,
  ModernSize,
  ModernType,
  PAGE_BG,
  PILL,
  SOFT_FILL,
} from '@/utils/modernTheme';

export const MUTED = '#64748B';
export const PEACH_FG = '#EA580C';
export const LAVENDER_FG = '#5B21B6';
const ERROR = '#DC2626';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 4,
    paddingBottom: 32,
    gap: 12,
  },

  // ── Applied strip (same look as the cart's) ─────────────────────────────
  appliedStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: PILL.green.bg,
  },
  appliedCode: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  appliedSep: {
    width: 1,
    height: 18,
    backgroundColor: '#86EFAC',
  },
  appliedSave: {
    flex: 1,
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  removeLink: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Have a code? ────────────────────────────────────────────────────────
  codeBox: {
    gap: 10,
    padding: ModernSize.cardPad,
    borderRadius: 16,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  codeBoxLabel: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: ModernSize.control,
    paddingHorizontal: 14,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: SOFT_FILL,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
    color: INK,
  },
  inputApply: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
    height: ModernSize.control,
    paddingHorizontal: 18,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: LINK,
  },
  inputApplyDisabled: {
    opacity: 0.45,
  },
  inputApplyText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  error: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: ERROR,
  },

  // ── Section head ────────────────────────────────────────────────────────
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  sectionCount: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },
  loading: {
    marginTop: 24,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SOFT_FILL,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  emptyText: {
    fontSize: ModernType.body,
    color: MUTED,
  },

  // ── Coupon ticket card ──────────────────────────────────────────────────
  card: {
    padding: 14,
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    borderStyle: 'dashed',
  },
  cardPeach: {
    borderColor: '#F5A26F',
    backgroundColor: '#FFF2E8',
  },
  cardLavender: {
    borderColor: '#C4B5FD',
    backgroundColor: '#F4F1FF',
  },
  cardDisabled: {
    borderColor: '#CBD5E1',
    backgroundColor: SOFT_FILL,
  },
  cardApplied: {
    borderStyle: 'solid',
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  headline: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.extrabold,
  },
  headlinePeach: {
    color: '#C2410C',
  },
  headlineLavender: {
    color: LAVENDER_FG,
  },
  headlineApplied: {
    color: PILL.green.fg,
  },
  textDisabled: {
    color: MUTED,
  },
  desc: {
    fontSize: ModernType.body,
    color: INK,
  },
  condition: {
    fontSize: ModernType.caption,
    color: MUTED,
  },
  perforation: {
    height: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D6CFC7',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  codeChip: {
    flexShrink: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: INK,
    backgroundColor: Color.white,
  },
  codeChipDisabled: {
    borderColor: '#CBD5E1',
  },
  codeText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 1,
    color: INK,
  },
  applyBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
    height: ModernSize.controlSm,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: LINK,
  },
  applyBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  applyBtnText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  applyBtnTextDisabled: {
    color: '#94A3B8',
  },
  appliedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  appliedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: PILL.green.bg,
  },
  appliedPillText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.bold,
    color: PILL.green.fg,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hint: {
    flex: 1,
    fontSize: ModernType.secondary,
    color: MUTED,
  },
});
