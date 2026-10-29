import React from 'react';
import { Text, View } from 'react-native';

import { StatusBadgeProps } from './types';
import { styles } from './styles';

/** A small pill — same status/payment-state language as the web dashboard's Badge. */
export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const bgKey = `${tone}Bg` as const;
  const textKey = `${tone}Text` as const;

  return (
    <View style={[styles.badge, styles[bgKey]]}>
      <Text style={[styles.text, styles[textKey]]}>{label}</Text>
    </View>
  );
}
