import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: 10,
    backgroundColor: Color.surface,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  headerDark: {
    backgroundColor: Color.ink,
    borderBottomColor: 'transparent',
  },
  headerFloating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },

  backBtn: {
    marginLeft: -6,
    padding: 4,
  },
  backBtnFloating: {
    marginLeft: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...Shadow.card,
  },

  title: {
    flex: 1,
    marginLeft: 4,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },
  titleDark: {
    color: Color.onDark,
  },

  right: {
    marginLeft: 'auto',
    paddingLeft: Spacing.sm,
  },
});
