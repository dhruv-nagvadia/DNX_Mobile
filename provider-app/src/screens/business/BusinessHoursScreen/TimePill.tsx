import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { Clock } from 'lucide-react-native';

import { TimePickerSheet } from '@/components/TimeField';
import { parse24 } from '@/components/TimeField/utils';
import { Color, FontWeight, Spacing } from '@/utils/Theme';
import { CARD_BORDER, INK, ModernSize, ModernType } from '@/utils/modernTheme';

interface TimePillProps {
  /** Shown as the picker sheet's title and as the accessibility label. */
  label: string;
  /** 24-hour "HH:MM". */
  value: string;
  onChange: (value: string) => void;
  size?: 'regular' | 'compact';
  disabled?: boolean;
  /** Hide the clock glyph where horizontal space is tight. */
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** "13:00" → "01:00 PM" — the mockup's pill format. */
export function formatPill(value: string): string {
  const { hour12, minute, meridiem } = parse24(value);
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem.toUpperCase()}`;
}

/**
 * A soft rounded time "pill" for the mockup's Hours / Override Hours rows.
 * Same 12h + AM/PM three-column picker sheet as `TimeField` (`TimePickerSheet`),
 * just without the stacked label and boxed input.
 */
export function TimePill({ label, value, onChange, size = 'regular', disabled, showIcon = true, style }: TimePillProps) {
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
    <>
      <TouchableOpacity
        style={[styles.pill, size === 'compact' && styles.pillCompact, disabled && styles.pillDisabled, style]}
        onPress={openPicker}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${formatPill(value)}`}
        activeOpacity={0.7}
      >
        {showIcon && <Clock size={size === 'compact' ? 14 : 18} color={INK} strokeWidth={1.9} />}
        <Text
          style={[styles.text, size === 'compact' && styles.textCompact]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {formatPill(value)}
        </Text>
      </TouchableOpacity>

      <TimePickerSheet
        visible={open}
        title={label}
        value={value}
        upperMeridiem
        onClose={() => setOpen(false)}
        onDone={confirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ModernSize.gap,
    minHeight: ModernSize.control,
    paddingHorizontal: Spacing.md,
    borderRadius: ModernSize.controlRadius,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Color.white,
  },
  // Compact pills hug their text instead of stretching to fill the row.
  pillCompact: {
    flex: 0,
    flexShrink: 1,
    justifyContent: 'center',
    gap: 5,
    minHeight: 40,
    paddingHorizontal: 11,
    borderRadius: 10,
  },
  pillDisabled: {
    opacity: 0.45,
  },
  text: {
    flexShrink: 1,
    fontSize: ModernType.rowTitle,
    fontWeight: FontWeight.medium,
    color: INK,
  },
  textCompact: {
    fontSize: ModernType.secondary,
  },
});
