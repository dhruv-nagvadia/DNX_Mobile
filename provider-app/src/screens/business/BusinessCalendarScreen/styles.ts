import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  chipStrip: {
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    width: 56,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    alignItems: 'center',
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    gap: 2,
  },
  chipActive: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  chipDay: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  chipDayActive: {
    color: Color.onDark,
  },
  chipDate: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  chipDateActive: {
    color: Color.white,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Color.accent,
    marginTop: 2,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  overrideTag: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.accent2,
  },
  timesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeField: {
    flex: 1,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },

  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
});
