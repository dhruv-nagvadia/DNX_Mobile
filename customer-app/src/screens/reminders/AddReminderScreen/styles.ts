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
} from '@/utils/modernTheme';

const MUTED = '#64748B';
const META = '#475569';
const SOFT_BLUE = '#E6EEFC';

/** Mockup "designs/customer/mobile/DNX Reminders App Interface.png" (right frame). */
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

  // ── Title input ─────────────────────────────────────────────────────────
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

  // ── Category tiles ──────────────────────────────────────────────────────
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 10,
  },
  tile: {
    width: '23%',
    // A little taller than square so labels like "Appointment" have room.
    aspectRatio: 0.86,
    // Content sits a touch above centre.
    paddingTop: 4,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 1,
    borderRadius: ModernRadius.box,
    // Same border width selected or not, so picking a tile never shifts the
    // icons/labels of the tiles around it — only the colour changes.
    borderWidth: 2,
    overflow: 'hidden',
  },
  tileActive: {},
  // Fixed-height box so every tile's icon + label line up, even when a long label
  // ("Appointment") shrinks to fit. The box is deliberately taller than the text:
  // on Android, shrink-to-fit also shrinks until the text fits the box HEIGHT, and with
  // the font's default extra padding a tight box made every label come out too small.
  tileText: {
    alignSelf: 'stretch',
    height: 24,
    lineHeight: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  tileTextActive: {
    color: LINK,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LINK,
  },

  // ── When ────────────────────────────────────────────────────────────────
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: META,
  },
  dateField: {
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
  dateFieldTap: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateFieldText: {
    flex: 1,
    fontSize: 15,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  dateFieldPlaceholder: {
    fontWeight: FontWeight.regular,
    color: MUTED,
  },

  segment: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: LINK,
  },
  segmentText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  segmentTextActive: {
    fontWeight: FontWeight.bold,
    color: Color.white,
  },

  // ── Note ────────────────────────────────────────────────────────────────
  noteInput: {
    minHeight: 92,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
    fontSize: 15,
    color: INK,
  },
  counter: {
    marginTop: -6,
    alignSelf: 'flex-end',
    fontSize: ModernType.caption,
    color: MUTED,
  },

  // ── Info strip ──────────────────────────────────────────────────────────
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: SOFT_BLUE,
  },
  infoText: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    color: INK,
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
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF7F7',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#DC2626',
  },
  endRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  endField: {
    flex: 1,
  },
  clearLink: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
  clearLinkOff: {
    color: '#94A3B8',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  bizAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF1FF',
  },
  bizText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  bizName: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  bizMeta: {
    fontSize: 13.5,
    color: '#64748B',
  },
  bizCaption: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },
  viewBtn: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: LINK,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: FontWeight.semibold,
    color: LINK,
  },
});
