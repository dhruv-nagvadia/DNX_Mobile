import React, { useId, useMemo, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';

import { SECONDARY_ORANGE, SERIES_BLUE, styles } from './styles';

export { SECONDARY_ORANGE, SERIES_BLUE };

export interface SmoothTrendPoint {
  label: string;
  /** Main series, MINOR units (paise). */
  value: number;
  /** Optional secondary series (e.g. commission), MINOR units. */
  secondary?: number;
}

export interface SmoothTrendChartProps {
  points: SmoothTrendPoint[];
  /** Legend + bubble name for `value`. */
  seriesLabel?: string;
  /** Legend name for `secondary`. */
  secondaryLabel?: string;
  /** Dashed orange line + legend item; defaults to true when any point has `secondary`. */
  showSecondary?: boolean;
  height?: number;
  /** Caption shown under the chart when every value is zero. */
  emptyText?: string;
}

const DEFAULT_HEIGHT = 168;
const PAD_LEFT = 58;
const PAD_RIGHT = 8;
const PAD_TOP = 34; // room for the tooltip bubble above the last point
const PAD_BOTTOM = 22; // x labels
const TICKS = 6;

type Pt = { x: number; y: number };

/** Compact ₹ for axis labels: ₹0, ₹2,500, ₹1.5L, ₹2.3Cr. */
function axisMoney(minor: number): string {
  const rupees = Math.round(minor / 100);
  if (rupees >= 1_00_00_000) {
    return `₹${Number((rupees / 1_00_00_000).toFixed(1))}Cr`;
  }
  if (rupees >= 1_00_000) {
    return `₹${Number((rupees / 1_00_000).toFixed(1))}L`;
  }
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/** A "nice" axis maximum (1/2/2.5/5 × 10ⁿ steps) for TICKS-1 intervals. */
function niceMax(max: number): number {
  if (max <= 0) {
    return 0;
  }
  const rawStep = max / (TICKS - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= rawStep) ?? 10 * mag;
  return step * (TICKS - 1);
}

/** Monotone cubic (Fritsch–Carlson) path — smooth without dipping below 0. */
function smoothPath(pts: Pt[]): string {
  if (pts.length === 0) {
    return '';
  }
  if (pts.length === 1) {
    return `M${pts[0].x},${pts[0].y}`;
  }
  const n = pts.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x);
    slope.push((pts[i + 1].y - pts[i].y) / (dx[i] || 1));
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  }
  m.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / slope[i];
      const b = m[i + 1] / slope[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        m[i] = t * a * slope[i];
        m[i + 1] = t * b * slope[i];
      }
    }
  }
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i].x + h},${pts[i].y + m[i] * h} ${pts[i + 1].x - h},${pts[i + 1].y - m[i + 1] * h} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

/** Up to `max` evenly spaced indices, always including the first and last. */
function labelIndices(n: number, max: number): number[] {
  if (n <= max) {
    return Array.from({ length: n }, (_, i) => i);
  }
  const out = new Set<number>();
  for (let k = 0; k < max; k++) {
    out.add(Math.round((k * (n - 1)) / (max - 1)));
  }
  return [...out];
}

/**
 * Smoothed area chart: solid blue line + light area for the main series,
 * optional dashed orange secondary line, ₹ y-axis, sparse x labels, a value
 * bubble on the latest point and a legend underneath.
 */
export function SmoothTrendChart({
  points,
  seriesLabel = 'You earn',
  secondaryLabel = 'Commission',
  showSecondary,
  height = DEFAULT_HEIGHT,
  emptyText,
}: SmoothTrendChartProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const gradientId = `smoothArea${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const withSecondary = showSecondary ?? points.some((p) => p.secondary !== undefined);

  const maxValue = Math.max(
    0,
    ...points.map((p) => Math.max(p.value, withSecondary ? p.secondary ?? 0 : 0)),
  );
  const yMax = niceMax(maxValue);
  const plotW = Math.max(width - PAD_LEFT - PAD_RIGHT, 1);
  const plotH = height - PAD_TOP - PAD_BOTTOM;
  const baseY = PAD_TOP + plotH;

  // A single bucket (e.g. "Today" by day) is drawn as a flat line across.
  const series = points.length === 1 ? [points[0], points[0]] : points;
  const xAt = (i: number) => PAD_LEFT + (series.length > 1 ? (i / (series.length - 1)) * plotW : plotW / 2);
  const yAt = (v: number) => (yMax > 0 ? baseY - (v / yMax) * plotH : baseY);

  const mainPts = series.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));
  const secPts = series.map((p, i) => ({ x: xAt(i), y: yAt(p.secondary ?? 0) }));
  const mainLine = smoothPath(mainPts);
  const area =
    mainPts.length > 1
      ? `${mainLine} L${mainPts[mainPts.length - 1].x},${baseY} L${mainPts[0].x},${baseY} Z`
      : '';

  const ticks = yMax > 0 ? Array.from({ length: TICKS }, (_, i) => (yMax / (TICKS - 1)) * i) : [0];
  const xLabelIdx = labelIndices(points.length, width > 340 ? 8 : 6);

  const last = points[points.length - 1];
  const lastPt = mainPts[mainPts.length - 1];
  const isEmpty = points.every((p) => p.value === 0 && (!withSecondary || !p.secondary));

  const wrapSize = useMemo(() => ({ height }), [height]);
  const bubbleTop = lastPt ? Math.max(lastPt.y - 34, 0) : 0;
  const bubblePos = useMemo(() => ({ top: bubbleTop }), [bubbleTop]);

  return (
    <View style={styles.root}>
      <View onLayout={onLayout} style={[styles.wrap, wrapSize]}>
        {width > 0 && points.length > 0 && (
          <>
            <Svg width={width} height={height}>
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={SERIES_BLUE} stopOpacity={0.32} />
                  <Stop offset="1" stopColor={SERIES_BLUE} stopOpacity={0.03} />
                </LinearGradient>
              </Defs>

              {ticks.map((t) => (
                <React.Fragment key={t}>
                  <Line
                    x1={PAD_LEFT}
                    x2={width - PAD_RIGHT}
                    y1={yAt(t)}
                    y2={yAt(t)}
                    stroke={t === 0 ? '#CBD5E1' : '#EEF2F7'}
                    strokeWidth={1}
                  />
                  <SvgText
                    x={PAD_LEFT - 8}
                    y={yAt(t) + 3.5}
                    fontSize={10}
                    fill={Color.textSecondary}
                    textAnchor="end"
                  >
                    {axisMoney(t)}
                  </SvgText>
                </React.Fragment>
              ))}
              <Line x1={PAD_LEFT} x2={PAD_LEFT} y1={PAD_TOP - 6} y2={baseY} stroke="#CBD5E1" strokeWidth={1} />

              {!!area && <Path d={area} fill={`url(#${gradientId})`} />}
              {withSecondary && (
                <Path
                  d={smoothPath(secPts)}
                  stroke={SECONDARY_ORANGE}
                  strokeWidth={1.6}
                  strokeDasharray="5,4"
                  fill="none"
                />
              )}
              <Path d={mainLine} stroke={SERIES_BLUE} strokeWidth={2.4} fill="none" strokeLinecap="round" />

              {xLabelIdx.map((i) => (
                <SvgText
                  key={i}
                  x={points.length === 1 ? PAD_LEFT + plotW / 2 : xAt(i)}
                  y={height - 6}
                  fontSize={10}
                  fill={Color.textSecondary}
                  textAnchor={i === 0 && points.length > 1 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
                >
                  {points[i].label}
                </SvgText>
              ))}

              <Circle cx={lastPt.x} cy={lastPt.y} r={5.5} fill={SERIES_BLUE} stroke={Color.white} strokeWidth={2} />
            </Svg>

            <View
              style={[styles.bubble, bubblePos]}
              pointerEvents="none"
              accessibilityLabel={`${seriesLabel}, ${last.label}: ${formatMoney(last.value)}`}
            >
              <Text style={styles.bubbleText} numberOfLines={1}>
                {last.label} • {formatMoney(last.value)}
              </Text>
            </View>
          </>
        )}
      </View>

      {isEmpty && !!emptyText && <Text style={styles.caption}>{emptyText}</Text>}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>{seriesLabel}</Text>
        </View>
        {withSecondary && (
          <View style={styles.legendItem}>
            <View style={styles.legendDash}>
              <View style={styles.legendDashSeg} />
              <View style={styles.legendDashSeg} />
              <View style={styles.legendDashSeg} />
            </View>
            <Text style={styles.legendText}>{secondaryLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
