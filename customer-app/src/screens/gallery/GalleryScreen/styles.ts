import { StyleSheet, Dimensions } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

const SCREEN_W = Dimensions.get('window').width;
const GAP = Spacing.sm;
const COLS = 4;
const THUMB = (SCREEN_W - Spacing.lg * 2 - GAP * (COLS - 1)) / COLS;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.ink,
  },
  hero: {
    width: SCREEN_W,
    height: SCREEN_W * 0.82,
    backgroundColor: Color.ink2,
  },
  counter: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Color.glassStrong,
  },
  counterText: {
    color: Color.onDark,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  gridLabel: {
    color: Color.onDarkMuted,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: Color.accent,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
});
