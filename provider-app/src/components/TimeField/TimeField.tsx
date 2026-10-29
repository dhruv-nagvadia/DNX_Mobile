import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';

import { TimeFieldProps } from './types';
import { HOURS_12, MERIDIEMS, MINUTES_5, formatDisplay, parse24, to24 } from './utils';
import { styles } from './styles';

/**
 * A 12-hour + AM/PM three-column time picker — the RN counterpart to the web
 * dashboard's redesigned TimeField (same Hour/Minute/AM-PM column idea,
 * built from plain RN primitives instead of ported pixel-for-pixel).
 */
export function TimeField({ label, value, onChange, disabled }: TimeFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => parse24(value));

  const openPicker = () => {
    if (disabled) return;
    setDraft(parse24(value));
    setOpen(true);
  };

  const confirm = () => {
    onChange(to24(draft.hour12, draft.minute, draft.meridiem));
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

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>

            <View style={styles.columns}>
              <ScrollView style={styles.column} showsVerticalScrollIndicator={false}>
                {HOURS_12.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.option, h === draft.hour12 && styles.optionSelected]}
                    onPress={() => setDraft((d) => ({ ...d, hour12: h }))}
                  >
                    <Text style={[styles.optionText, h === draft.hour12 && styles.optionTextSelected]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={[styles.column, styles.columnDivider]} showsVerticalScrollIndicator={false}>
                {MINUTES_5.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.option, m === draft.minute && styles.optionSelected]}
                    onPress={() => setDraft((d) => ({ ...d, minute: m }))}
                  >
                    <Text style={[styles.optionText, m === draft.minute && styles.optionTextSelected]}>
                      {String(m).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={[styles.column, styles.columnDivider]} showsVerticalScrollIndicator={false}>
                {MERIDIEMS.map((mer) => (
                  <TouchableOpacity
                    key={mer}
                    style={[styles.option, mer === draft.meridiem && styles.optionSelected]}
                    onPress={() => setDraft((d) => ({ ...d, meridiem: mer }))}
                  >
                    <Text style={[styles.optionText, mer === draft.meridiem && styles.optionTextSelected]}>
                      {mer}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.actions}>
              <AppButton
                style={styles.actionButton}
                title="Cancel"
                variant="secondary"
                onPress={() => setOpen(false)}
              />
              <AppButton style={styles.actionButton} title="Done" onPress={confirm} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
