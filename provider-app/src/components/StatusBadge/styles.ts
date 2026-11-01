import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius } from '@/utils/Theme';

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  badgeSquare: {
    alignSelf: 'flex-end',
    borderRadius: Radius.sm,
  },
  badgeCutRight: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
    paddingRight: 8,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  warningBg: { backgroundColor: Color.warningSoft, borderColor: Color.warningBorder },
  warningText: { color: Color.warning },

  accentBg: { backgroundColor: Color.accentSoft, borderColor: Color.accentBorder },
  accentText: { color: Color.accent2 },

  successBg: { backgroundColor: Color.successSoft, borderColor: Color.successBorder },
  successText: { color: Color.success },

  neutralBg: { backgroundColor: Color.divider, borderColor: Color.border },
  neutralText: { color: Color.textSecondary },

  errorBg: { backgroundColor: Color.errorSoft, borderColor: Color.errorBorder },
  errorText: { color: Color.error },

  brandBg: { backgroundColor: Color.primarySoft, borderColor: Color.primaryBorder },
  brandText: { color: Color.primary },
});
