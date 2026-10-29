import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

/** Dark on-brand hero gradient: deep ink → dark navy → royal blue. */
export const HERO_GRADIENT = ['#060B18', '#0A1730', '#0E2350', '#183E80'];

let counter = 0;

interface GradientBackgroundProps {
  colors?: string[];
  /** Gradient direction in 0..1 bounding-box units. Default: top-left → bottom-right. */
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
}

/**
 * A smooth linear-gradient fill for a parent container, drawn with SVG so it
 * needs no native gradient library. It measures its own size (percentage-sized
 * SVGs don't render reliably) and paints a numeric-sized rect.
 */
export function GradientBackground({
  colors = HERO_GRADIENT,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  locations,
}: GradientBackgroundProps) {
  const id = useRef(`grad${(counter += 1)}`).current;
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      {size.w > 0 && size.h > 0 && (
        <Svg width={size.w} height={size.h}>
          <Defs>
            <LinearGradient id={id} x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
              {colors.map((c, i) => (
                <Stop
                  key={i}
                  offset={locations ? locations[i] : i / (colors.length - 1)}
                  stopColor={c}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={size.w} height={size.h} fill={`url(#${id})`} />
        </Svg>
      )}
    </View>
  );
}
