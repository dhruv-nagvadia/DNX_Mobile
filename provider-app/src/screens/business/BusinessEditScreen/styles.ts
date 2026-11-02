import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, CARD_BORDER, CARD_SHADOW, INK, ModernRadius, PAGE_BG } from '@/utils/modernTheme';

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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: ModernRadius.card,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: Spacing.md,
    gap: Spacing.md,
    ...CARD_SHADOW,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  rowItem: {
    flex: 1,
  },

  // ── FormField ─────────────────────────────────────────────────────────
  field: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
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
    borderRadius: ModernRadius.box,
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
    minHeight: 48,
    fontSize: FontSize.md,
    color: INK,
    padding: 0,
  },
  inputMultiline: {
    minHeight: 96,
  },
  address: {
    minHeight: 52,
  },
  trailing: {
    paddingLeft: Spacing.sm,
    alignSelf: 'center',
  },
  hint: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  saveBtn: {
    height: 52,
    borderRadius: ModernRadius.button,
    backgroundColor: ACTION,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
});
