import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, ModernRadius, ModernSize, ModernType, PAGE_BG } from '@/utils/modernTheme';

const INPUT_BORDER = '#E3E8F0';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ModernSize.gutter,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: ModernSize.gap,
  },
  errorText: {
    fontSize: ModernType.secondary,
    color: Color.error,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: ModernSize.cardPad,
    gap: Spacing.md,
    ...CARD_SHADOW,
  },
  row: {
    flexDirection: 'row',
    gap: ModernSize.gap,
  },
  rowItem: {
    flex: 1,
  },

  // ── FormField ─────────────────────────────────────────────────────────
  field: {
    gap: 6,
  },
  label: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  required: {
    color: Color.error,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: ModernSize.controlRadius,
    paddingHorizontal: Spacing.md - 2,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm + 2,
  },
  inputRowFocused: {
    borderColor: ACTION,
  },
  input: {
    flex: 1,
    minHeight: ModernSize.control,
    fontSize: ModernType.rowTitle,
    color: INK,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 96,
  },
  address: {
    minHeight: ModernSize.control,
  },
  trailing: {
    paddingLeft: Spacing.sm,
    alignSelf: 'center',
  },
  hint: {
    fontSize: ModernType.caption,
    color: Color.textSecondary,
  },

  saveBtn: {
    height: ModernSize.control,
    borderRadius: ModernSize.controlRadius,
    backgroundColor: ACTION,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
