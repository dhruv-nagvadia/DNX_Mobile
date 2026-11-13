import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/** How far the bottom corners drop below the centre of the curved edge. */
const CURVE_DEPTH = 36;

/**
 * Navy → royal-blue hero fill with soft wave shapes and a gently curved
 * bottom edge. Measures itself so the SVG gets numeric dimensions.
 */
export function HeroBackground() {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const { w, h } = size;

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      {w > 0 && h > 0 && (
        <Svg width={w} height={h}>
          <Defs>
            <LinearGradient id="authHeroFill" x1={0} y1={0} x2={1} y2={1}>
              <Stop offset={0} stopColor="#0B1A4A" />
              <Stop offset={0.55} stopColor="#0F2E8C" />
              <Stop offset={1} stopColor="#2457E6" />
            </LinearGradient>
          </Defs>

          {/* Base shape: corners sit lower than the middle → curved edge. */}
          <Path
            d={`M0 0 H${w} V${h} Q${w / 2} ${h - CURVE_DEPTH * 2} 0 ${h} Z`}
            fill="url(#authHeroFill)"
          />

          {/* Soft waves */}
          <Path
            d={`M0 ${h * 0.42} C${w * 0.3} ${h * 0.3} ${w * 0.6} ${h * 0.55} ${w} ${h * 0.22} V0 H0 Z`}
            fill="#FFFFFF"
            opacity={0.04}
          />
          <Path
            d={`M${w * 0.35} ${h} C${w * 0.6} ${h * 0.72} ${w * 0.8} ${h * 0.7} ${w} ${h * 0.5} V${h} Z`}
            fill="#5B8CFF"
            opacity={0.18}
          />
          <Path
            d={`M0 ${h * 0.78} C${w * 0.25} ${h * 0.62} ${w * 0.55} ${h * 0.86} ${w} ${h * 0.6}`}
            stroke="#FFFFFF"
            strokeWidth={1.5}
            fill="none"
            opacity={0.08}
          />
          <Path
            d={`M${w * 0.55} 0 C${w * 0.7} ${h * 0.15} ${w * 0.85} ${h * 0.12} ${w} ${h * 0.3}`}
            stroke="#FFFFFF"
            strokeWidth={1.5}
            fill="none"
            opacity={0.07}
          />
        </Svg>
      )}
    </View>
  );
}
