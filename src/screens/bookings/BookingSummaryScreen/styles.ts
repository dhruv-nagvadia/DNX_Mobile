import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, paddingBottom: 140, gap: Spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginTop: Spacing.xs,
  },

  card: {
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    paddingHorizontal: Spacing.md,
  },

  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  bizInfo: { flex: 1, minWidth: 0 },
  bizName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Color.textPrimary },
  bizMeta: { marginTop: 2, fontSize: FontSize.xs, color: Color.textSecondary },
  divider: { height: 1, backgroundColor: Color.border },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: FontSize.sm, color: Color.textSecondary },
  rowValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.textPrimary },

  discountLabel: { fontSize: FontSize.sm, color: Color.success, fontWeight: FontWeight.semibold },
  discountValue: { fontSize: FontSize.sm, color: Color.success, fontWeight: FontWeight.bold },
  totalLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Color.textPrimary },
  totalValue: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Color.textPrimary },

  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Color.surface,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  barLabel: { fontSize: FontSize.xs, color: Color.textSecondary, fontWeight: FontWeight.semibold },
  barTotal: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Color.textPrimary },
  continueBtn: { minWidth: 170 },
});
