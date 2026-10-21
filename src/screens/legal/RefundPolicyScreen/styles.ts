import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.lg },
  updated: { fontSize: FontSize.xs, color: Color.textSecondary },
  heading: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  body: {
    marginTop: 4,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.6,
    color: Color.textSecondary,
  },
});
