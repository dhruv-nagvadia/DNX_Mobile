import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { ACTION, INK } from '@/utils/modernTheme';

// Only shown on the Business Detail screen (mockup look — sits directly on
// the page background, no card).
export const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.xs,
  },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 999,
    backgroundColor: '#EEF1F6',
    borderWidth: 1,
    borderColor: '#E3E8F0',
    marginBottom: Spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: ACTION,
  },
  segmentText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: INK,
  },
  segmentTextActive: {
    color: Color.white,
  },
  range: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  total: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: INK,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  trendPillUp: {
    backgroundColor: Color.successSoft,
  },
  trendPillDown: {
    backgroundColor: Color.errorSoft,
  },
  trendText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  trendTextUp: {
    color: Color.success,
  },
  trendTextDown: {
    color: Color.error,
  },
  trendLabel: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  chart: {
    marginTop: Spacing.sm,
  },
});
