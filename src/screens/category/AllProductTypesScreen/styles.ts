import { StyleSheet } from 'react-native';
import { Color, FontSize, FontWeight, Radius, Shadow, Spacing } from '@/utils/Theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xl },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: Spacing.md,
    columnGap: Spacing.sm,
  },

  // Real-photo cards — same look as Home's row, so the teaser and full list
  // match. Width is set per-card from useGridItemWidth (see the screen), so
  // columns + gaps fill the row edge-to-edge instead of a fixed width
  // leaving a ragged gap at the end of each row.
  productCard: {
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    ...Shadow.card,
  },
  productCardImage: {
    width: '100%',
    height: 82,
    marginBottom: 6,
  },
  productCardIconFallback: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  productCardName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Color.textPrimary,
    textAlign: 'center',
  },
});
