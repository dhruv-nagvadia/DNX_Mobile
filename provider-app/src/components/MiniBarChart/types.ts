export interface MiniBarChartProps {
  /** Raw values — only their relative size matters, no axis/labels shown. */
  values: number[];
  /** Bar fill gradient (top → bottom). Defaults to a sky-blue gradient. */
  colors?: string[];
  height?: number;
}
