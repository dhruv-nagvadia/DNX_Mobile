import { StyleSheet } from 'react-native';
import { Color, FontSize, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg },
  center: {
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  stateText: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
