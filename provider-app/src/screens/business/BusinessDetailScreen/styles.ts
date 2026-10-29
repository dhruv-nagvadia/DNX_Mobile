import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.surface,
    ...Shadow.card,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    flex: 1,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 6,
    ...Shadow.card,
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
    flexShrink: 1,
    textAlign: 'right',
  },

  menu: {
    gap: Spacing.sm,
  },
  menuItem: {
    backgroundColor: Color.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.card,
  },
  menuItemText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
});
