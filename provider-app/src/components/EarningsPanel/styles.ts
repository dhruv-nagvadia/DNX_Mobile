import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Color.border,
    ...Shadow.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
  },

  segment: {
    flexDirection: 'row',
    backgroundColor: Color.border,
    borderRadius: Radius.md,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: Color.surface,
  },
  segmentText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Color.textSecondary,
  },
  segmentTextActive: {
    color: Color.textPrimary,
  },

  headline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headlineValue: {
    flexShrink: 1,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Color.textPrimary,
  },
  trendBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  trendUp: {
    backgroundColor: Color.successSoft,
  },
  trendDown: {
    backgroundColor: Color.errorSoft,
  },
  trendText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  trendTextUp: {
    color: Color.success,
  },
  trendTextDown: {
    color: Color.error,
  },
});
