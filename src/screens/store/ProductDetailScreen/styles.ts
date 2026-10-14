import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { paddingBottom: Spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  notFound: { fontSize: FontSize.md, color: Color.textSecondary },

  imageWrap: {
    height: 300,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  outBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(6,11,24,0.78)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  outText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Color.white },

  body: { padding: Spacing.lg },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Color.textPrimary },
  byLine: { marginTop: 2, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.textSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary },
  ratingCount: { fontSize: FontSize.sm, color: Color.textSecondary },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap', marginTop: 4 },
  price: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Color.textPrimary },
  priceStrike: {
    fontSize: FontSize.md,
    color: Color.textSecondary,
    textDecorationLine: 'line-through',
  },
  priceDiscounted: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Color.success },
  sectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    backgroundColor: Color.primarySoft,
  },
  sectionChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Color.primaryDark },
  stock: { marginTop: 4, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.success },
  stockOut: { color: Color.error },

  // Coupon card — a preview of what you'd pay if you apply this code at
  // checkout; sits just above the add-to-cart card it's discounting.
  couponCard: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.successSoft,
  },
  couponCardHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  couponCardTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.success },
  couponPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  couponCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  couponCode: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
    letterSpacing: 0.5,
  },
  couponSavings: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Color.success },
  couponHint: { marginTop: 4, fontSize: FontSize.xs, color: Color.textSecondary },

  // Add-to-cart card — prominent, above the details.
  amountCard: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1.5,
    borderColor: Color.primary,
  },
  amountTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Color.textPrimary },
  amountHint: { marginTop: 2, marginBottom: Spacing.xs, fontSize: FontSize.xs, color: Color.textSecondary },

  sectionTitle: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  description: {
    marginTop: 4,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.5,
    color: Color.textPrimary,
  },
  muted: { marginTop: 4, fontSize: FontSize.sm, color: Color.textSecondary },
});
