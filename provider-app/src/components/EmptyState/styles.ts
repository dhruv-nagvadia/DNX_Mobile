import { StyleSheet } from 'react-native';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { ModernType } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: ModernType.cardTitle,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  body: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
    textAlign: 'center',
  },
});
