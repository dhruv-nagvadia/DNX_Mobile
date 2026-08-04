import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { Color } from '@/utils/Theme';
import { AppButtonProps } from './types';
import { styles } from './styles';

/** Themed primary/secondary button with a loading state. */
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
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Color.white : Color.primary} />
      ) : (
        <Text
          style={[styles.text, variant === 'primary' ? styles.primaryText : styles.secondaryText]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
