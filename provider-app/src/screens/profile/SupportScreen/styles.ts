import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    lineHeight: FontSize.sm * 1.5,
    marginBottom: Spacing.xs,
  },

  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCall: {
    backgroundColor: Color.successSoft,
  },
  iconWhatsapp: {
    backgroundColor: Color.successSoft,
  },
  iconEmail: {
    backgroundColor: Color.primarySoft,
  },
  optionText: {
    gap: 2,
  },
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Color.textPrimary,
  },
  optionValue: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },
});
