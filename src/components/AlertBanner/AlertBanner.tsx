import React from 'react';
import { Text, View } from 'react-native';

import { AlertBannerProps } from './types';
import { styles } from './styles';

/**
 * Form-level message. `accessibilityLiveRegion` makes TalkBack/VoiceOver
 * announce it when it appears, so a failed submit isn't silent.
 */
export function AlertBanner({ tone = 'error', message }: AlertBannerProps) {
  return (
    <View
      style={[styles.banner, tone === 'error' ? styles.error : styles.success]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View style={[styles.dot, tone === 'error' ? styles.dotError : styles.dotSuccess]} />
      <Text style={[styles.text, tone === 'error' ? styles.textError : styles.textSuccess]}>
        {message}
      </Text>
    </View>
  );
}
