import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.sm },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyTitle: {
    marginTop: Spacing.md,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  emptyText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  markAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },

  // A single notification row.
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
  cardUnread: {
    backgroundColor: Color.primarySoft,
    borderColor: Color.primarySoft,
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primarySoft,
  },
  iconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },

  body: { flex: 1, minWidth: 0 },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  text: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    lineHeight: 19,
  },
  time: {
    marginTop: 4,
    fontSize: FontSize.xs,
    color: Color.placeholder,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: Color.primary,
  },
});
