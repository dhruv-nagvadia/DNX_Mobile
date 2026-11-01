import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Color.border,
    padding: Spacing.sm,
    gap: Spacing.xs,
    ...Shadow.card,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  statusStack: {
    gap: 4,
    alignItems: 'flex-end',
    marginRight: -Spacing.sm,
  },
  note: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    fontStyle: 'italic',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  summaryDue: {
    color: Color.warning,
  },

  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Color.border,
  },
  actionBtnPrimary: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  actionBtnDanger: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  actionBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  actionBtnTextPrimary: {
    color: Color.white,
  },
  actionBtnTextDanger: {
    color: Color.error,
  },
});
