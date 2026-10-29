import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  field: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Color.surface,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  fieldText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },

  overlay: {
    flex: 1,
    backgroundColor: Color.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Color.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    textAlign: 'center',
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
    borderLeftColor: Color.border,
  },
  option: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: Color.primarySoft,
    borderRadius: Radius.sm,
  },
  optionText: {
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  optionTextSelected: {
    color: Color.primary,
    fontWeight: FontWeight.bold,
  },

  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
