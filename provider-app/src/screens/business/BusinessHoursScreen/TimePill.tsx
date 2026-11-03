import React, { useState } from 'react';
import { Modal, ScrollView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Clock } from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { styles as pickerStyles } from '@/components/TimeField/styles';
import { HOURS_12, MERIDIEMS, MINUTES_5, parse24, to24 } from '@/components/TimeField/utils';
import { Color, FontSize, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, ModernRadius } from '@/utils/modernTheme';

interface TimePillProps {
  /** Shown as the picker sheet's title and as the accessibility label. */
  label: string;
  /** 24-hour "HH:MM". */
  value: string;
  onChange: (value: string) => void;
  size?: 'regular' | 'compact';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** "13:00" → "01:00 PM" — the mockup's pill format. */
export function formatPill(value: string): string {
  const { hour12, minute, meridiem } = parse24(value);
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem.toUpperCase()}`;
}

/**
 * A soft rounded time "pill" for the mockup's Hours / Override Hours rows.
 * Same 12h + AM/PM three-column picker as `TimeField` (reuses its styles and
 * helpers), just without the stacked label and boxed input.
 */
export function TimePill({ label, value, onChange, size = 'regular', disabled, style }: TimePillProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => parse24(value));

  const openPicker = () => {
    if (disabled) {
      return;
    }
    setDraft(parse24(value));
    setOpen(true);
  };

  const confirm = () => {
    onChange(to24(draft.hour12, draft.minute, draft.meridiem));
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.pill, size === 'compact' && styles.pillCompact, disabled && styles.pillDisabled, style]}
        onPress={openPicker}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${formatPill(value)}`}
        activeOpacity={0.7}
      >
        <Clock size={size === 'compact' ? 14 : 18} color={INK} strokeWidth={1.9} />
        <Text
          style={[styles.text, size === 'compact' && styles.textCompact]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {formatPill(value)}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={pickerStyles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={pickerStyles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={pickerStyles.sheetTitle}>{label}</Text>

            <View style={pickerStyles.columns}>
              <ScrollView style={pickerStyles.column} showsVerticalScrollIndicator={false}>
                {HOURS_12.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[pickerStyles.option, h === draft.hour12 && pickerStyles.optionSelected]}
                    onPress={() => setDraft((d) => ({ ...d, hour12: h }))}
                  >
                    <Text style={[pickerStyles.optionText, h === draft.hour12 && pickerStyles.optionTextSelected]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={[pickerStyles.column, pickerStyles.columnDivider]} showsVerticalScrollIndicator={false}>
                {MINUTES_5.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[pickerStyles.option, m === draft.minute && pickerStyles.optionSelected]}
                    onPress={() => setDraft((d) => ({ ...d, minute: m }))}
                  >
                    <Text style={[pickerStyles.optionText, m === draft.minute && pickerStyles.optionTextSelected]}>
                      {String(m).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={[pickerStyles.column, pickerStyles.columnDivider]} showsVerticalScrollIndicator={false}>
                {MERIDIEMS.map((mer) => (
                  <TouchableOpacity
                    key={mer}
                    style={[pickerStyles.option, mer === draft.meridiem && pickerStyles.optionSelected]}
                    onPress={() => setDraft((d) => ({ ...d, meridiem: mer }))}
                  >
                    <Text style={[pickerStyles.optionText, mer === draft.meridiem && pickerStyles.optionTextSelected]}>
                      {mer.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={pickerStyles.actions}>
              <AppButton
                style={pickerStyles.actionButton}
                title="Cancel"
                variant="secondary"
                onPress={() => setOpen(false)}
              />
              <AppButton style={pickerStyles.actionButton} title="Done" onPress={confirm} />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernRadius.box,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  pillCompact: {
    justifyContent: 'center',
    gap: 5,
    minHeight: 36,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  pillDisabled: {
    opacity: 0.45,
  },
  text: {
    flexShrink: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  textCompact: {
    fontSize: FontSize.xs,
  },
});
