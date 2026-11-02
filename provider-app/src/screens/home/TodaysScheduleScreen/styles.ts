import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  timeBadge: {
    width: 48,
    alignItems: 'center',
  },
  timeBadgeText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.primary,
  },
  timeBadgeMeridiem: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  main: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
});
