import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { gap: Spacing.sm, marginBottom: Spacing.md },
  group: {},
  groupLabel: {
    marginBottom: 4,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textSecondary,
  },

  quickRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.primary,
    backgroundColor: Color.primarySoft,
  },
  quickChipCode: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.extrabold,
    letterSpacing: 0.3,
    color: Color.primary,
  },
  quickChipDiscount: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Color.primaryDark },

  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 6, paddingHorizontal: 4 },
  viewAllText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.primary },

  // Compact mode: a single "View all coupons" entry point, no quick-chip preview.
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
  },
  compactText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.primary },

  appliedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(22,163,74,0.1)',
  },
  appliedText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.success },
  changeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.primary },

  emptyText: { fontSize: FontSize.sm, color: Color.textSecondary },
  errorText: { marginTop: 6, fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Color.error },
});
