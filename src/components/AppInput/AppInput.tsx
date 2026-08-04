import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { Color } from '@/utils/Theme';
import { AppInputProps } from './types';
import { styles } from './styles';

/**
 * Labeled text input with focus highlight, inline error, and a Show/Hide
 * toggle for secure fields. Wraps RN TextInput — pass any TextInput prop.
 */
export function AppInput({ label, error, secureTextEntry, style, ...rest }: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[styles.inputRow, focused && styles.inputRowFocused, !!error && styles.inputRowError]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Color.placeholder}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.toggle} onPress={() => setHidden((h) => !h)}>
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
