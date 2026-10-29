import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius } from '@/utils/Theme';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  warningBg: { backgroundColor: Color.warningSoft },
  warningText: { color: Color.warning },

  accentBg: { backgroundColor: Color.accentSoft },
  accentText: { color: Color.accent2 },

  successBg: { backgroundColor: Color.successSoft },
  successText: { color: Color.success },

  neutralBg: { backgroundColor: Color.background, borderWidth: 1, borderColor: Color.border },
  neutralText: { color: Color.textSecondary },

  errorBg: { backgroundColor: Color.errorSoft },
  errorText: { color: Color.error },

  brandBg: { backgroundColor: Color.primarySoft },
  brandText: { color: Color.primary },
});
