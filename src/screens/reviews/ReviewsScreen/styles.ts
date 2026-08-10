import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    padding: Spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
    textAlign: 'center',
  },

  // Summary card
  summary: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
    marginBottom: Spacing.md,
  },
  score: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: Spacing.lg,
    borderRightWidth: 1,
    borderRightColor: Color.border,
    gap: 4,
  },
  scoreNum: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
    letterSpacing: -1,
  },
  scoreStars: { flexDirection: 'row', gap: 2 },
  scoreCount: {
    fontSize: FontSize.xs,
    color: Color.textSecondary,
    marginTop: 2,
  },

  // Distribution
  dist: { flex: 1, justifyContent: 'center', gap: 6 },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  distStar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    width: 34,
  },
  distStarText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  distTrack: {
    flex: 1,
    height: 7,
    borderRadius: Radius.pill,
    backgroundColor: Color.background,
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
    borderRadius: Radius.pill,
    backgroundColor: Color.warning,
  },
  distN: {
    width: 22,
    textAlign: 'right',
    fontSize: FontSize.xs,
    color: Color.textSecondary,
  },

  listCard: {
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Color.surface,
    borderWidth: 1,
    borderColor: Color.border,
  },
});
