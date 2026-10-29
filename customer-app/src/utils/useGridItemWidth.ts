import { useWindowDimensions } from 'react-native';

/**
 * Exact per-item width for a fixed-column grid, so `columns * itemWidth +
 * (columns - 1) * gap` fills the available width precisely — no dangling
 * gap on the right of a full row, and (paired with `justifyContent:
 * 'flex-start'` on the grid container) no stretched partial last row either.
 * Recomputes on rotation/fold since it's driven by the live window width.
 */
export function useGridItemWidth(columns: number, gap: number, horizontalPadding: number): number {
  const { width } = useWindowDimensions();
  const available = width - horizontalPadding * 2;
  // Floored: RN rounds each child's fractional width up independently when
  // laying out, so an un-floored width (e.g. 108.667) can have its row sum
  // to a pixel or two more than `available` — enough for Yoga to wrap the
  // last column onto a new line, silently dropping a column.
  return Math.floor((available - gap * (columns - 1)) / columns);
}
