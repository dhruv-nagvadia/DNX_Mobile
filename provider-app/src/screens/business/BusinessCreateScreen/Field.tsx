import React from 'react';
import { StyleProp, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { Color } from '@/utils/Theme';

import { styles } from './styles';

interface FieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  /** Grey suffix after the label, e.g. "(optional)". */
  labelHint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  /** Rendered under the input, right-aligned (e.g. a character counter). */
  footer?: string;
  /** Rendered before the input on the same row (e.g. "+91" prefix box). */
  prefix?: React.ReactNode;
}

/** Bold label (red * when required) + bordered input, as on the mockup. */
export function Field({
  label,
  required,
  labelHint,
  error,
  containerStyle,
  footer,
  prefix,
  multiline,
  style,
  ...inputProps
}: FieldProps) {
  const input = (
    <TextInput
      placeholderTextColor={Color.placeholder}
      multiline={multiline}
      style={[
        styles.input,
        multiline && styles.inputMultiline,
        !!error && styles.inputError,
        !!prefix && styles.flex,
        style,
      ]}
      {...inputProps}
    />
  );
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
        {!!labelHint && <Text style={styles.labelHint}> {labelHint}</Text>}
      </Text>
      {prefix ? (
        <View style={styles.phoneRow}>
          {prefix}
          {input}
        </View>
      ) : (
        input
      )}
      {!!error && <Text style={styles.inlineError}>{error}</Text>}
      {!!footer && <Text style={styles.counter}>{footer}</Text>}
    </View>
  );
}
