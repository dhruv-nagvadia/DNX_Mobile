import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet, SheetButton } from '@/components/BottomSheet';

import { HOURS_12, MERIDIEMS, MINUTES_5, parse24, to24 } from './utils';
import { styles } from './styles';

interface TimePickerSheetProps {
  visible: boolean;
  title: string;
  /** 24-hour "HH:MM" — the picker starts from this each time it opens. */
  value: string;
  /** Show "AM"/"PM" instead of "am"/"pm". */
  upperMeridiem?: boolean;
  onClose: () => void;
  /** Called with the picked 24-hour "HH:MM" when Done is pressed. */
  onDone: (value: string) => void;
}

/** The 12h + AM/PM three-column picker, in the standard bottom sheet. Shared by TimeField and TimePill. */
export function TimePickerSheet({ visible, title, value, upperMeridiem = false, onClose, onDone }: TimePickerSheetProps) {
  const [draft, setDraft] = useState(() => parse24(value));

  useEffect(() => {
    if (visible) {
      setDraft(parse24(value));
    }
  }, [visible, value]);

  return (
    <BottomSheet
      visible={visible}
      title={title}
      onClose={onClose}
      footer={
        <>
          <SheetButton title="Cancel" variant="secondary" onPress={onClose} />
          <SheetButton title="Done" onPress={() => onDone(to24(draft.hour12, draft.minute, draft.meridiem))} />
        </>
      }
    >
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
                {upperMeridiem ? mer.toUpperCase() : mer}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
