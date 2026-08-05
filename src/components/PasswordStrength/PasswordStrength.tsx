import React from 'react';
import { Text, View } from 'react-native';

import { Color } from '@/utils/Theme';

import { getPasswordStrength } from './strength';
import { PasswordStrengthProps } from './types';
import { styles } from './styles';

const SEGMENT_COLOR = [Color.error, Color.warning, Color.success];

/** Three-segment meter under a password field. */
export function PasswordStrength({ value }: PasswordStrengthProps) {
  const { score, label } = getPasswordStrength(value);

  return (
    <View style={styles.row}>
      <View style={styles.track}>
        {[1, 2, 3].map((segment) => (
          <View
            key={segment}
            style={[
              styles.segment,
              score >= segment && { backgroundColor: SEGMENT_COLOR[score - 1] },
            ]}
          />
        ))}
      </View>
      <Text style={styles.label} accessibilityLiveRegion="polite">
        {label}
      </Text>
    </View>
  );
}
