import { StyleSheet } from 'react-native';

import { Color, FontWeight, Spacing } from '@/utils/Theme';
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
  SOFT_FILL,
} from '@/utils/modernTheme';

/** Shared look for the redesigned Add/Edit form screens (service, product, offer). */
export const INPUT_BORDER = '#D6DEEA';
export const SWITCH_OFF = '#D5DAE3';
const SEGMENT_PAD = 4;
const CHIP_HEIGHT = 32;

export const kit = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.lg,
    gap: ModernSize.gap,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm + 4,
    backgroundColor: PAGE_BG,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: ModernType.title,
    fontWeight: FontWeight.bold,
    color: INK,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },

  // ── Section card ────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: ModernSize.cardPad,
    gap: Spacing.md,
    ...CARD_SHADOW,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
  },
  // Optional: a line under the header row (see SectionCard `divided`).
  cardHeaderDivided: {
    paddingBottom: ModernSize.gap,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  iconBox: {
    width: ModernSize.iconBox,
    height: ModernSize.iconBox,
    borderRadius: ModernSize.controlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  cardSubtitle: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  // ── Field ───────────────────────────────────────────────────────────────
  field: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  optional: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: ModernSize.control,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    backgroundColor: Color.white,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm + 2,
  },
  inputRowFocused: {
    borderColor: LINK,
  },
  inputRowInvalid: {
    borderColor: Color.error,
  },
  input: {
    flex: 1,
    minHeight: ModernSize.control - 2,
    padding: 0,
    fontSize: ModernType.rowTitle,
    color: INK,
  },
  inputMultiline: {
    minHeight: 88,
  },
  prefix: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  suffix: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  hint: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },
  errorText: {
    fontSize: ModernType.caption,
    color: Color.error,
  },
  row: {
    flexDirection: 'row',
    gap: ModernSize.gap,
  },
  rowItem: {
    flex: 1,
  },

  // ── Segmented control ───────────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    height: ModernSize.control,
    padding: SEGMENT_PAD,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: SOFT_FILL,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ModernSize.controlRadius - SEGMENT_PAD,
  },
  segmentBtnActive: {
    backgroundColor: Color.white,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    fontWeight: FontWeight.semibold,
    color: LINK,
  },

  // ── Chips ───────────────────────────────────────────────────────────────
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chipsScroll: {
    marginHorizontal: -ModernSize.cardPad,
    flexGrow: 0,
  },
  chipsScrollContent: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: ModernSize.cardPad,
  },
  chip: {
    height: CHIP_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md - 4,
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
    fontWeight: FontWeight.medium,
    color: INK,
  },
  chipTextActive: {
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },

  // ── Toggle row ──────────────────────────────────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    minHeight: ModernSize.control,
  },
  toggleDivider: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: SOFT_FILL,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  toggleHint: {
    fontSize: ModernType.secondary,
    color: Color.textSecondary,
  },

  // ── Bottom action bar ───────────────────────────────────────────────────
  bar: {
    gap: Spacing.sm + 2,
    paddingHorizontal: ModernSize.gutter,
    paddingTop: ModernSize.gap,
    borderTopWidth: 1,
    borderTopColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: ModernSize.gap,
    paddingVertical: Spacing.sm + 2,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: PILL.red.bg,
  },
  bannerText: {
    flex: 1,
    fontSize: ModernType.secondary,
    fontWeight: FontWeight.medium,
    color: PILL.red.fg,
  },
  barButtons: {
    flexDirection: 'row',
    gap: ModernSize.gap,
  },
  primaryBtn: {
    flex: 1,
    height: ModernSize.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: LINK,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
