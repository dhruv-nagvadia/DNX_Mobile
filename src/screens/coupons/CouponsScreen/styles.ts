import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  content: { padding: Spacing.lg, gap: Spacing.md },

  appliedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(22,163,74,0.1)',
  },
  appliedText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Color.success },
});
