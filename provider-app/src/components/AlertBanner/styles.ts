import { StyleSheet } from 'react-native';
import { Color, FontWeight, Radius, Spacing } from '@/utils/Theme';
import { ModernType } from '@/utils/modernTheme';

export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 2,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  error: {
    backgroundColor: Color.errorSoft,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  success: {
    backgroundColor: '#EFFBF3',
    borderColor: 'rgba(22, 163, 74, 0.3)',
  },
  // A dot instead of an icon: no icon library in this app.
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  dotError: {
    backgroundColor: Color.error,
  },
  dotSuccess: {
    backgroundColor: Color.success,
  },
  text: {
    flex: 1,
    fontSize: ModernType.body,
    fontWeight: FontWeight.medium,
    lineHeight: 20,
  },
  textError: {
    color: '#B42318',
  },
  textSuccess: {
    color: '#15803D',
  },
});
