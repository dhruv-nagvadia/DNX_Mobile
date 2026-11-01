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
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    marginBottom: 2,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  customer: {
    flex: 1,
    gap: 2,
  },
  customerName: {
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

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Color.divider,
  },
  itemRowFirst: {
    borderTopWidth: 0,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Color.divider,
  },
  itemImageFallback: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Color.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemMain: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  itemTotal: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
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
