import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.white,
  },

  listContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    borderColor: Color.border,
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
});
