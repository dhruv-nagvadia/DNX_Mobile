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
  info: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm, gap: 3 },
  control: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm, paddingTop: 2 },
  name: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.textPrimary, minHeight: 34 },
  store: { fontSize: FontSize.xs, color: Color.textSecondary },
  price: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold, color: Color.textPrimary },
  stock: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Color.success },
  stockOut: { color: Color.error },
});
