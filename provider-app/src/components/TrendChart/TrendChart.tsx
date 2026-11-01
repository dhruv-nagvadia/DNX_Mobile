import React, { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { Color } from '@/utils/Theme';

import { TrendChartProps } from './types';
import { styles } from './styles';

/**
 * Ports `frontend/src/components/TrendChart/TrendChart.tsx`'s path-generation
 * math to `react-native-svg` — same `niceStep` axis rounding, same normalized
 * 0-100 coordinate space (via `viewBox` + `preserveAspectRatio="none"`), same
 * gradient-area-under-line, same 5-line grid (dashed above zero, solid at
 * zero). No hover/tooltip (no DOM `:hover` on a touch device without a
 * gesture layer) — the axis, grid and a visible last-point marker carry the
 * data instead. The axis/grid/zero-line always render, even with no data —
 * an empty period is a flat line sitting on the zero gridline, not a blank box.
 */
function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const f = raw / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * pow;
}

const TICK_COUNT = 4;
// Vertical inset (in the 0-100 viewBox's own units) so a point/dot sitting
// right on the zero baseline has room to draw its full radius without the
// bottom half being clipped off by the SVG's viewBox edge.
const V_PAD = 6;
let gradientCounter = 0;

export function TrendChart({
  data,
  height = 200,
  color = Color.primary,
  highlightLast = true,
  formatAxis = (v) => String(v),
}: TrendChartProps) {
  const [width, setWidth] = useState(0);
  const gradientId = React.useRef(`trendGrad${(gradientCounter += 1)}`).current;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const isEmpty = data.length === 0 || data.every((d) => d.value === 0);
  const max = Math.max(0, ...data.map((d) => d.value));
  const step = niceStep(max / TICK_COUNT);
  const top = step * TICK_COUNT;
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => step * (TICK_COUNT - i));

  const n = Math.max(data.length, 1);
  const valueToY = (v: number) =>
    top > 0 ? 100 - V_PAD - (v / top) * (100 - 2 * V_PAD) : 100 - V_PAD;
  const points = data.map((d, i) => ({
    x: ((i + 0.5) / n) * 100,
    // A flat line on the zero gridline when every value is 0 (top === 0),
    // rather than collapsing to an empty/blank plot.
    y: valueToY(d.value),
  }));

  const linePath = points.length > 1 ? `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}` : '';
  const areaPath =
    points.length > 1 ? `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z` : '';

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.axis, { height }]}>
          {ticks.map((t, i) => (
            <Text key={i} style={styles.axisLabel}>
              {formatAxis(t)}
            </Text>
          ))}
        </View>

        <View style={[styles.plot, { height }]} onLayout={onLayout}>
          {width > 0 && (
            <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Gridlines — dashed above zero, solid at the zero baseline. */}
              {ticks.map((t, i) => {
                const y = valueToY(t);
                const isZero = i === ticks.length - 1;
                return (
                  <Line
                    key={i}
                    x1={0}
                    y1={y}
                    x2={100}
                    y2={y}
                    stroke={Color.border}
                    strokeWidth={1}
                    strokeDasharray={isZero ? undefined : '3,3'}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {!isEmpty && (
                <>
                  <Defs>
                    <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={color} stopOpacity={0.22} />
                      <Stop offset="1" stopColor={color} stopOpacity={0} />
                    </LinearGradient>
                  </Defs>
                  {!!areaPath && <Path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />}
                </>
              )}

              {!!linePath && (
                <Path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {points.map((p, i) => {
                const isLast = highlightLast && i === points.length - 1;
                if (!isLast) {
                  return <Circle key={i} cx={p.x} cy={p.y} r={1} fill={color} />;
                }
                return (
                  <React.Fragment key={i}>
                    <Circle cx={p.x} cy={p.y} r={3} fill={color} opacity={0.2} />
                    <Circle cx={p.x} cy={p.y} r={1.6} fill={color} />
                  </React.Fragment>
                );
              })}
            </Svg>
          )}
        </View>
      </View>

      <View style={styles.labelsRow}>
        {(data.length > 0 ? data : [{ label: '', value: 0 }]).map((d, i) => (
          <Text key={i} style={styles.xLabel} numberOfLines={1}>
            {d.label}
          </Text>
        ))}
      </View>

      {isEmpty && <Text style={styles.emptyCaption}>No earnings yet</Text>}
    </View>
  );
}
