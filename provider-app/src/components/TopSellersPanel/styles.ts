import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, ModernRadius, SOFT_FILL } from '@/utils/modernTheme';

/** Rank badge colours: gold, silver, bronze, then neutral. */
export const RANK_COLORS = [
  { bg: '#FDE68A', fg: '#78350F' },
  { bg: '#DCE3EE', fg: '#1E293B' },
  { bg: '#FBD3BC', fg: '#7C2D12' },
  { bg: SOFT_FILL, fg: INK },
];

// Only shown on the Business Detail screen (mockup look — sits directly on
// the page background, no card).
export const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
  },
  rank: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: SOFT_FILL,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: {
    flex: 1,
    gap: 2,
    paddingVertical: Spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: CARD_BORDER,
  },
  rowName: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  rowMeta: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  empty: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
  busiestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernRadius.box,
    backgroundColor: '#F1F0FF',
    borderWidth: 1,
    borderColor: '#E0DDFB',
  },
  busiestMain: {
    flex: 1,
    gap: 2,
  },
  busiestTitle: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: INK,
  },
  busiestSub: {
    fontSize: FontSize.sm,
    color: Color.textSecondary,
  },
});
