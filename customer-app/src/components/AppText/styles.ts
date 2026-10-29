import { StyleSheet } from 'react-native';
import { Color, Font, FontSize } from '@/utils/Theme';

export const styles = StyleSheet.create({
  title: {
    fontFamily: Font.bold,
    fontSize: FontSize.xxl,
    color: Color.textPrimary,
  },
  subtitle: {
    fontFamily: Font.semibold,
    fontSize: FontSize.lg,
    color: Color.textPrimary,
  },
  body: {
    fontFamily: Font.reg,
    fontSize: FontSize.md,
    color: Color.textPrimary,
  },
  caption: {
    fontFamily: Font.reg,
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
});
