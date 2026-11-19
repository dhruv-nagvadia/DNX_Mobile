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

const MUTED = '#64748B';
const META = '#475569';
const SOFT_BLUE = '#E6EEFC';
const ERROR = '#DC2626';

/** Mirrors AddReminderScreen: titled cards, 48px icon inputs, sticky bar. */
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
    paddingBottom: 24,
    gap: 14,
  },
  flex1: {
    flex: 1,
    minWidth: 0,
  },

  // ── GPS card ────────────────────────────────────────────────────────────
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: '#C9D9F8',
    backgroundColor: SOFT_BLUE,
  },
  gpsIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LINK,
  },
  gpsText: {
    flex: 1,
    gap: 2,
  },
  gpsTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: LINK,
  },
  gpsSub: {
    fontSize: ModernType.secondary,
    color: META,
  },

  // ── Card ────────────────────────────────────────────────────────────────
  card: {
    padding: ModernSize.cardPad,
    gap: 12,
    borderRadius: ModernRadius.card,
    backgroundColor: Color.white,
    ...CARD_SHADOW,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  // ── Label chips ─────────────────────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: ModernRadius.pill,
    // Constant border width so selecting never shifts the row.
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
  },

  // ── Fields ──────────────────────────────────────────────────────────────
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: META,
  },
  required: {
    color: ERROR,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: ModernSize.control,
    paddingHorizontal: 14,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontSize: 15,
    color: INK,
  },
  inputError: {
    borderColor: ERROR,
    backgroundColor: '#FFF7F7',
  },
  errorText: {
    fontSize: 13,
    color: ERROR,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helperText: {
    fontSize: 13,
    color: MUTED,
  },
  resolvedText: {
    flex: 1,
    fontSize: 13,
    fontWeight: FontWeight.semibold,
    color: PILL.green.fg,
  },
  row2: {
    flexDirection: 'row',
    gap: 12,
  },

  // ── Default toggle ──────────────────────────────────────────────────────
  defaultCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultIcon: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    flex: 1,
    gap: 2,
  },
  defaultTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  defaultSub: {
    fontSize: ModernType.secondary,
    color: MUTED,
  },

  submitError: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: PILL.red.bg,
  },
  submitErrorText: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: ERROR,
  },

  // ── Sticky bar ──────────────────────────────────────────────────────────
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: 12,
    backgroundColor: Color.white,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    ...CARD_SHADOW,
    shadowOffset: { width: 0, height: -4 },
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    minWidth: 112,
    paddingHorizontal: 22,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: Color.error,
    backgroundColor: Color.white,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: ModernRadius.button,
    backgroundColor: LINK,
  },
  saveBtnBusy: {
    opacity: 0.8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
