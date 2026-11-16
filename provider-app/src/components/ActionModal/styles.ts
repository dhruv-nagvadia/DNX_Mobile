import { StyleSheet } from 'react-native';
import { Color, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, ModernSize, ModernType } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  message: {
    fontSize: ModernType.body,
    color: Color.textSecondary,
    lineHeight: 20,
  },
  input: {
    marginTop: Spacing.sm + 4,
    minHeight: 96,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: ModernSize.controlRadius,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.sm + 4,
    fontSize: ModernType.body,
    color: INK,
    textAlignVertical: 'top',
  },
});
