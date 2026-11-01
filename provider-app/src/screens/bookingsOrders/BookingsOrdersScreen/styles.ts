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
    gap: Spacing.sm,
  },

  segment: {
    flexDirection: 'row',
    backgroundColor: Color.border,
    borderRadius: Radius.md,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Color.surface,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: Color.textPrimary,
  },

  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardMain: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  cardSubtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  badgeRow: {
    alignItems: 'flex-end',
    gap: 4,
    marginRight: -Spacing.md,
  },

  itemsPreview: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    fontSize: FontSize.xs,
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
