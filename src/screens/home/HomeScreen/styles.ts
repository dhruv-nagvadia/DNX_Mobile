import { StyleSheet } from 'react-native';
import { Color, Font, FontSize, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.md,
  },
  greeting: {
    marginBottom: Spacing.md,
  },
  grid: {
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: Color.surface,
    borderRadius: 12,
    padding: Spacing.md,
    margin: Spacing.xs,
    borderWidth: 1,
    borderColor: Color.border,
    minHeight: 88,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
