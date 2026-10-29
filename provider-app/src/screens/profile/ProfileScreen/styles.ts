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

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.surface,
    ...Shadow.card,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Color.error,
  },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statTile: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 2,
    ...Shadow.card,
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
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
  editLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  editButton: {
    flex: 1,
  },

  businessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  businessRowFirst: {
    borderTopWidth: 0,
  },
  businessName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  businessMeta: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },

  logoutRow: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  logoutText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.error,
  },

  version: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
});
