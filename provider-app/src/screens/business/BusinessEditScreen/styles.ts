import { StyleSheet } from 'react-native';
import { Color, FontSize, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  flex: {
    flex: 1,
  },
  description: {
    minHeight: 80,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Color.error,
    marginBottom: Spacing.xs,
  },
});
