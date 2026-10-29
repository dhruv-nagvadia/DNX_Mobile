import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    backgroundColor: Color.successSoft,
  },
  verifiedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.success,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
