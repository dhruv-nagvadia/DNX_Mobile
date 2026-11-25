import React, { RefObject, useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { ModernSize } from '@/utils/modernTheme';

import { FIELD_ICON, PLACEHOLDER, authStyles as styles } from './styles';

interface AuthFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon: LucideIcon;
  /** Small grey text on the right of the label, e.g. "Optional". */
  hint?: string;
  error?: string;
  inputRef?: RefObject<TextInput | null>;
  /** Renders an Eye/EyeOff toggle and masks the value. */
  password?: boolean;
}

/** Auth-screen labelled input: leading icon, 1px border, optional show/hide. */
export function AuthField({
  label,
  icon: Icon,
  hint,
  error,
  inputRef,
  password = false,
  onFocus,
  onBlur,
  ...rest
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password);
  const ToggleIcon = hidden ? EyeOff : Eye;

  return (
    <View style={styles.field}>
      {hint ? (
        <View style={styles.labelRow}>
          <Text style={styles.labelInRow}>{label}</Text>
          <Text style={styles.labelHint}>{hint}</Text>
        </View>
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          !!error && styles.inputRowError,
        ]}
      >
        <Icon size={ModernSize.icon} color={FIELD_ICON} strokeWidth={1.8} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholderTextColor={PLACEHOLDER}
          secureTextEntry={hidden}
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
        {password && (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <ToggleIcon size={ModernSize.icon} color={FIELD_ICON} strokeWidth={1.8} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}
