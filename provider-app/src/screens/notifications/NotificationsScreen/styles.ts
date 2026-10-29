import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },

  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 2,
    ...Shadow.card,
  },
  rowUnread: {
    backgroundColor: Color.primarySoft,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.surface,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  rowTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Color.primary,
    marginTop: 4,
  },
  body: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  time: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
});
