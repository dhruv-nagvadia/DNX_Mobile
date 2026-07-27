import React from 'react';
import { Text } from 'react-native';

import { AppTextProps } from './types';
import { styles } from './styles';

/** Themed Text wrapper so typography stays consistent across the app. */
export function AppText({ variant = 'body', color, style, children, ...rest }: AppTextProps) {
  return (
    <Text style={[styles[variant], color ? { color } : null, style]} {...rest}>
      {children}
    </Text>
  );
}
