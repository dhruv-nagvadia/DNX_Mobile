import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },

  listContent: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Color.border,
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
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    flex: 1,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
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
});
