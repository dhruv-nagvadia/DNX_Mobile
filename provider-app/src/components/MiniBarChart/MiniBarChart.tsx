import React from 'react';
import { View } from 'react-native';

import { GradientBackground } from '@/components/GradientBackground';

import { MiniBarChartProps } from './types';
import { styles } from './styles';

const MIN_BAR_HEIGHT = 0.12;
const SKY_GRADIENT = ['#7DD3FC', '#0EA5E9'];

/** A purely decorative ascending bar chart — no axes, no labels, no data
 * points. Just a quick visual read of "trending up" inside a hero card. */
export function MiniBarChart({ values, colors = SKY_GRADIENT, height = 48 }: MiniBarChartProps) {
  const max = Math.max(...values, 1);

  return (
    <View style={[styles.row, { height }]}>
      {values.map((v, i) => {
        const ratio = Math.max(v / max, MIN_BAR_HEIGHT);
        return (
          <View key={i} style={[styles.bar, { height: `${Math.round(ratio * 100)}%` }]}>
            <GradientBackground colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          </View>
        );
      })}
    </View>
  );
}
