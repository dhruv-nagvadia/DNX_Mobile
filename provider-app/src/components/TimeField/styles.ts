import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, ModernSize, ModernType, PILL } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: ModernType.body,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  field: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: ModernSize.controlRadius,
    paddingHorizontal: Spacing.md,
    minHeight: ModernSize.control,
    justifyContent: 'center',
    backgroundColor: Color.surface,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  fieldText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },

  columns: {
    flexDirection: 'row',
    height: 220,
  },
  column: {
    flex: 1,
  },
  columnDivider: {
    borderLeftWidth: 1,
    borderLeftColor: CARD_BORDER,
  },
  option: {
    minHeight: 44,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ModernSize.controlRadius,
  },
  optionSelected: {
    backgroundColor: PILL.blue.bg,
  },
  optionText: {
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  optionTextSelected: {
    color: PILL.blue.fg,
    fontWeight: FontWeight.bold,
  },
});
