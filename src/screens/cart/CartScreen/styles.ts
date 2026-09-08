import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Color.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Color.textSecondary, textAlign: 'center' },

  note: { fontSize: FontSize.sm, color: Color.textSecondary, marginBottom: Spacing.md },

  // Shop group
  shopCard: {
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  shopHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  shopIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopName: { flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Color.textPrimary },
  clearShop: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Color.error },

  // Item row — e-commerce style: image on the left, details on the right.
  itemRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  thumb: {
    width: 62,
    height: 62,
    borderRadius: Radius.md,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  itemMain: { flex: 1, minWidth: 0, gap: 5 },
  itemTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  itemName: { flex: 1, minWidth: 0, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.primary,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  stepBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.primarySoft },
  disabled: { opacity: 0.4 },
  qty: { minWidth: 44, textAlign: 'center', fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },

  itemUnit: { fontSize: FontSize.xs, color: Color.textSecondary },
  lineTotal: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Color.primary },
  removeBtn: { padding: 4 },
  minMsg: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.error },

  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  subtotalLabel: { fontSize: FontSize.sm, color: Color.textSecondary, fontWeight: FontWeight.semibold },
  subtotalValue: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Color.textPrimary },

  // Coupon (applied summary — managed from the payment sheet)
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  discountLabel: { fontSize: FontSize.sm, color: Color.success, fontWeight: FontWeight.semibold },
  discountValue: { fontSize: FontSize.sm, color: Color.success, fontWeight: FontWeight.bold },
  totalLabel: { fontSize: FontSize.sm, color: Color.textPrimary, fontWeight: FontWeight.bold },

  // Payment
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Color.textPrimary, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
    backgroundColor: Color.surface,
    marginBottom: Spacing.sm,
  },
  payOptionActive: { borderColor: Color.primary, backgroundColor: Color.primarySoft },
  payText: { flex: 1, minWidth: 0 },
  payTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  paySub: { marginTop: 2, fontSize: FontSize.xs, color: Color.textSecondary },

  // Bottom bar
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Color.surface,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  barLabel: { fontSize: FontSize.xs, color: Color.textSecondary, fontWeight: FontWeight.semibold },
  barTotal: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Color.textPrimary },
  placeBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Color.primary,
    minWidth: 150,
    alignItems: 'center',
  },
  placeText: { color: Color.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
});
