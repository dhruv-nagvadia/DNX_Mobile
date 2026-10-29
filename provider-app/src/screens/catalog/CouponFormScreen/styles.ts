import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
    marginBottom: Spacing.xs,
  },

  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
    marginBottom: 6,
  },
  segment: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Color.primarySoft,
    borderColor: Color.primary,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: Color.primary,
  },

  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  field: {
    flex: 1,
  },

  pickerList: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  pickerRow: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
  },
  pickerRowActive: {
    backgroundColor: Color.primarySoft,
    borderColor: Color.primary,
  },
  pickerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  pickerTextActive: {
    color: Color.primary,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    marginBottom: Spacing.sm,
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  toggleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
});
