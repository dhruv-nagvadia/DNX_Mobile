import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  hero: {
    // Overflow hidden keeps the glow images inside the ink block.
    overflow: 'hidden',
    backgroundColor: Color.ink,
    paddingHorizontal: Spacing.lg,
    /**
     * Generous breathing room under the promise line. The sheet overlaps this
     * edge by Spacing.lg, so the visible gap is this minus 24.
     */
    paddingBottom: Spacing.xl + Spacing.xl,
  },
  heroCompact: {
    paddingBottom: Spacing.xl + Spacing.md,
  },

  // Glow: static part only — size, color and offset are per instance.
  glow: {
    position: 'absolute',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },
  mark: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: Color.ink,
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
  },
  wordmark: {
    color: Color.onDark,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  promise: {
    color: Color.onDark,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xxl * 1.22,
    letterSpacing: -0.5,
  },
  promiseCompact: {
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * 1.24,
  },
  promiseAccent: {
    color: Color.accent,
  },
});
