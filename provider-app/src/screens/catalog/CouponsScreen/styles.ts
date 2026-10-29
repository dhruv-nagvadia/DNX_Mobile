import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
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
  cardInactive: {
    opacity: 0.55,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  code: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
    letterSpacing: 0.5,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  discount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.primary,
  },
  expired: {
    color: Color.error,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Color.border,
  },
  actionBtnDanger: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  actionBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  actionBtnTextDanger: {
    color: Color.error,
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
