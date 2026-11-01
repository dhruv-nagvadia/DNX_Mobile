export interface TrendPoint {
  label: string;
  value: number;
}

export interface TrendChartProps {
  data: TrendPoint[];
  height?: number;
  color?: string;
  /** Draws the last point larger with a soft glow ring. */
  highlightLast?: boolean;
  formatValue?: (value: number) => string;
  formatAxis?: (value: number) => string;
}
