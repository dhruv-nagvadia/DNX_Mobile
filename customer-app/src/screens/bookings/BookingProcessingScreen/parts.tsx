import React from 'react';
import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { styles } from './styles';

/**
 * The flow's phases as a small checklist: earlier phases ticked, the current
 * one highlighted, later ones grey.
 */
export function StepList({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View style={styles.stepsCard} accessibilityRole="list">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View
            key={label}
            style={styles.stepRow}
            accessibilityLabel={`${label}, ${done ? 'done' : active ? 'in progress' : 'pending'}`}
          >
            <View
              style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}
            >
              {done && <Check size={14} color="#FFFFFF" strokeWidth={3.2} />}
              {active && <View style={styles.stepDotInner} />}
            </View>
            <Text
              style={[
                styles.stepText,
                done && styles.stepTextDone,
                active && styles.stepTextActive,
              ]}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
