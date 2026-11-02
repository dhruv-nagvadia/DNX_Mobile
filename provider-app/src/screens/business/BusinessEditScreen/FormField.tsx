import React, { ReactNode, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { Color } from '@/utils/Theme';

import { styles } from './styles';

interface FormFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  hint?: string;
  /** Icon shown inside the input, on the right (e.g. a map pin). */
  trailing?: ReactNode;
}

/**
 * Mockup-styled labelled input for this screen only — the shared AppInput
 * can't render a red required "*" or a trailing icon, and it's used across
 * many other screens, so this keeps the redesign local.
 */
export function FormField({ label, required, hint, trailing, multiline, style, onFocus, onBlur, ...rest }: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputRow, multiline && styles.inputRowMultiline, focused && styles.inputRowFocused]}>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, style]}
          placeholderTextColor={Color.placeholder}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {!!trailing && <View style={styles.trailing}>{trailing}</View>}
      </View>
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}
