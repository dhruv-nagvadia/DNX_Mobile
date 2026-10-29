import React, { useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';

import { Color } from '@/utils/Theme';
import { AppInputProps } from './types';
import { styles } from './styles';

/**
 * Labeled text input with focus highlight, inline error/hint, an optional
 * prefix, and a Show/Hide toggle for secure fields.
 * Wraps RN TextInput — pass any TextInput prop.
 */
export function AppInput({
  label,
  error,
  hint,
  prefix,
  dense = false,
  secureTextEntry,
  style,
  onFocus,
  onBlur,
  inputRef,
  ...rest
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  // Compose with the caller's handlers — passing onBlur must not break the
  // focus ring, which is what happened when `rest` overrode these.
  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  return (
    <View style={[styles.container, dense && styles.dense]}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          !!error && styles.inputRowError,
        ]}
      >
        {!!prefix && (
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}

        <TextInput
          ref={inputRef}
          style={[styles.input, style]}
          placeholderTextColor={Color.placeholder}
          secureTextEntry={hidden}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          {...rest}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => setHidden((h) => !h)}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityState={{ selected: !hidden }}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* One slot for both messages — an error replaces the hint. */}
      {(!!error || !!hint) && (
        <Text style={error ? styles.error : styles.hint}>{error || hint}</Text>
      )}
    </View>
  );
}
