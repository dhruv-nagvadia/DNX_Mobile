import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { TimeFieldProps } from './types';
import { TimePickerSheet } from './TimePickerSheet';
import { formatDisplay } from './utils';
import { styles } from './styles';

/**
 * A 12-hour + AM/PM three-column time picker — the RN counterpart to the web
 * dashboard's redesigned TimeField (same Hour/Minute/AM-PM column idea,
 * built from plain RN primitives instead of ported pixel-for-pixel).
 */
export function TimeField({ label, value, onChange, disabled }: TimeFieldProps) {
  const [open, setOpen] = useState(false);

  const openPicker = () => {
    if (disabled) {
      return;
    }
    setOpen(true);
  };

  const confirm = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.field, disabled && styles.fieldDisabled]}
        onPress={openPicker}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text style={styles.fieldText}>{formatDisplay(value)}</Text>
      </TouchableOpacity>

      <TimePickerSheet visible={open} title={label} value={value} onClose={() => setOpen(false)} onDone={confirm} />
    </View>
  );
}
