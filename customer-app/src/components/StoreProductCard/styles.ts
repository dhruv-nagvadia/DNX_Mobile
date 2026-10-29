import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  card: {
    width: 156,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    overflow: 'hidden',
    ...Shadow.card,
  },
  imageWrap: {
    height: 124,
    backgroundColor: Color.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  outBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(6,11,24,0.78)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  outText: { fontSize: 10, fontWeight: FontWeight.bold, color: Color.white },
  // Coupon ribbon — opposite corner from the out-of-stock badge.
  saveBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Color.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  saveBadgeText: { fontSize: 10, fontWeight: FontWeight.bold, color: Color.white },
  info: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm, gap: 3 },
  control: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm, paddingTop: 2 },
  name: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary, minHeight: 34 },
  store: { fontSize: FontSize.xs, color: Color.textSecondary },
  price: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Color.textPrimary },
  priceStrike: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    textDecorationLine: 'line-through',
  },
  priceDiscounted: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Color.success },
  // Coupon preview — a small tinted block under the plain price, not mixed
  // into it, so the regular price line never changes shape.
  couponBox: {
    marginTop: 2,
    padding: 6,
    borderRadius: Radius.sm,
    backgroundColor: Color.successSoft,
    gap: 2,
  },
  couponPillText: { fontSize: 10, fontWeight: FontWeight.bold, color: Color.success },
  stock: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Color.success },
  stockOut: { color: Color.error },
});
