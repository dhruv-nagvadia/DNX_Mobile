import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  rowLast: { borderBottomWidth: 0 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0 },
  label: { fontSize: FontSize.xs, color: Color.textSecondary },
  value: {
    marginTop: 2,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  action: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.primary },
});
