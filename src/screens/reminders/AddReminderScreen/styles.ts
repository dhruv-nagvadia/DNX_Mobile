import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.lg },

  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: Spacing.sm,
  },
  field: { gap: 0 },

  input: {
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  noteInput: {
    padding: Spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },

  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 50,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
  },
  dateFieldText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  dateFieldPlaceholder: {
    color: Color.placeholder,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
  },
  chipActive: {
    borderColor: Color.primary,
    backgroundColor: Color.primarySoft,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  chipTextActive: {
    color: Color.primary,
  },

  dueText: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  dueValue: {
    color: Color.textPrimary,
    fontWeight: FontWeight.bold,
  },
  customRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  hint: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    lineHeight: FontSize.xs * 1.5,
  },
  customInput: {
    flex: 1,
    height: 48,
    textAlign: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },

  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Color.border,
    backgroundColor: Color.surface,
  },
  saveBtn: {
    flex: 1,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: Color.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  deleteBtn: {
    width: 100,
    height: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.error,
    backgroundColor: Color.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: Color.error,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
