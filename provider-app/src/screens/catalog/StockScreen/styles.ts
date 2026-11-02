import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG, SOFT_FILL, TINT } from '@/utils/modernTheme';

// Mockup look ("Salon Business Management App UI Collage.png" → Stock):
// light header, rounded search field, selected-product row, underlined
// Add/Remove segment, stepper, dropdown, filled + outlined-red buttons.
const FIELD_BORDER = '#DDE3EC';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // ── Search ─────────────────────────────────────────────────────────────
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 50,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.sm,
    color: INK,
    paddingVertical: 0,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // ── Result list ────────────────────────────────────────────────────────
  card: {
    backgroundColor: Color.white,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: Spacing.md,
    ...CARD_SHADOW,
  },
  divider: {
    height: 1,
    backgroundColor: CARD_BORDER,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm + 4,
  },
  resultMain: {
    flex: 1,
    gap: 4,
  },
  resultName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },

  thumb: {
    width: 44,
    height: 44,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  thumbLarge: {
    width: 72,
    height: 72,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TINT.blue.colors[0],
    borderWidth: 1,
    borderColor: TINT.blue.border,
  },

  // ── Selected product ───────────────────────────────────────────────────
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectedMain: {
    flex: 1,
    gap: Spacing.sm,
  },
  selectedName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  changeLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: ACTION,
  },
  helpText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  // ── Add / Remove segment ───────────────────────────────────────────────
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: ModernRadius.box,
    backgroundColor: SOFT_FILL,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: ModernRadius.box - 2,
  },
  segmentBtnActive: {
    backgroundColor: Color.white,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  segmentTextActive: {
    color: ACTION,
    fontWeight: FontWeight.bold,
  },
  segmentUnderline: {
    position: 'absolute',
    left: Spacing.sm,
    right: Spacing.sm,
    bottom: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: ACTION,
  },

  // ── Form fields ────────────────────────────────────────────────────────
  field: {
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  required: {
    color: Color.error,
  },
  optional: {
    fontWeight: FontWeight.regular,
    color: Color.textSecondary,
  },

  unitToggle: {
    flexDirection: 'row',
    padding: 2,
    borderRadius: ModernRadius.pill,
    backgroundColor: SOFT_FILL,
  },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: ModernRadius.pill,
  },
  unitBtnActive: {
    backgroundColor: ACTION,
  },
  unitText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  unitTextActive: {
    color: Color.white,
  },

  stepper: {
    flexDirection: 'row',
    height: 56,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: INK,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: FIELD_BORDER,
    paddingVertical: 0,
  },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 54,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
  },
  selectText: {
    fontSize: FontSize.sm,
    color: INK,
  },
  dropdown: {
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
    paddingHorizontal: Spacing.md,
    ...CARD_SHADOW,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 4,
  },
  optionText: {
    fontSize: FontSize.sm,
    color: INK,
  },
  optionTextActive: {
    fontWeight: FontWeight.bold,
    color: ACTION,
  },

  noteInput: {
    minHeight: 96,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.sm + 4,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: Color.white,
    fontSize: FontSize.sm,
    color: INK,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  // ── Buttons ────────────────────────────────────────────────────────────
  primaryBtn: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ModernRadius.button,
    backgroundColor: ACTION,
    marginTop: Spacing.xs,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  dangerBtn: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: ModernRadius.button,
    borderWidth: 1.5,
    borderColor: Color.errorBorder,
    backgroundColor: Color.white,
  },
  dangerBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.error,
  },
});
