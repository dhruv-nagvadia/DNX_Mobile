import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: 14,
    backgroundColor: Color.primary,
  },
  backBtn: {
    width: 36,
    height: 36,
    marginLeft: -6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 36,
    height: 36,
    marginLeft: -2,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.accent,
  },
  logoMarkText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
    color: Color.ink,
  },
  titleGroup: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.white,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Color.onDarkMuted,
    marginTop: 1,
  },
  right: {
    marginLeft: 'auto',
    paddingLeft: Spacing.sm,
  },
});
