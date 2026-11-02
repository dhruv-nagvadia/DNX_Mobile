import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.divider,
  },
  main: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
  // Vertically centers the trailing badge within the row — overrides the
  // badge's own `alignSelf: 'flex-start'`, which otherwise pins it to the
  // top of a taller (2-line) row instead of centering with its content.
  centerBadge: {
    alignSelf: 'center',
  },
});
