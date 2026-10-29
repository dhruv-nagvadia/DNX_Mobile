import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { Color } from '@/utils/Theme';
import { AppButtonProps } from './types';
import { styles } from './styles';

/** Spinner color per variant, so it stays visible on that background. */
const SPINNER_COLOR = {
  primary: Color.white,
  secondary: Color.primary,
  accent: Color.ink,
} as const;

/** Themed button with a loading state. */
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={SPINNER_COLOR[variant]} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
