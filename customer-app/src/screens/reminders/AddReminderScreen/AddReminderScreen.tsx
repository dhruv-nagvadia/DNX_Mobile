import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CalendarDays } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { CalendarModal } from '@/components/CalendarModal';
import { Color } from '@/utils/Theme';
import { TYPE_ICON, TYPE_LABEL, TYPE_OPTIONS, isReminderOccurrence } from '@/utils/reminderMeta';
import { ReminderRepeat } from '@/redux/api/reminder/types';

import { useAddReminder } from './useAddReminder';
import { styles } from './styles';

const REPEAT_OPTIONS: { value: ReminderRepeat; label: string }[] = [
  { value: 'NONE', label: 'One-time' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

/** Create or edit a reminder. */
export default function AddReminderScreen() {
  const r = useAddReminder();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  // The end date must be strictly after the start date — the start date
  // itself isn't a valid "stop after" point, so it's excluded here rather
  // than just discouraged.
  const minEndDate = new Date(r.startDate);
  minEndDate.setDate(minEndDate.getDate() + 1);

  return (
    <View style={styles.container}>
      <AppHeader title={r.isEdit ? 'Edit reminder' : 'New reminder'} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View>
          <Text style={styles.label}>What's the reminder?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Car insurance renewal"
            placeholderTextColor={Color.placeholder}
            value={r.title}
            onChangeText={r.setTitle}
            maxLength={120}
          />
        </View>

        {/* Type */}
        <View>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipsRow}>
            {TYPE_OPTIONS.map((t) => {
              const Icon = TYPE_ICON[t];
              const active = r.type === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() => r.setType(t)}
                >
                  <Icon size={14} color={active ? Color.primary : Color.textSecondary} />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {TYPE_LABEL[t]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Start date */}
        <View>
          <Text style={styles.label}>Start date</Text>
          <TouchableOpacity style={styles.dateField} activeOpacity={0.8} onPress={() => setStartOpen(true)}>
            <CalendarDays size={18} color={Color.primary} />
            <Text style={styles.dateFieldText}>
              {r.startDate.toLocaleDateString(undefined, DATE_OPTS)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Repeat */}
        <View>
          <Text style={styles.label}>Repeat</Text>
          <View style={styles.chipsRow}>
            {REPEAT_OPTIONS.map((o) => {
              const active = r.repeat === o.value;
              return (
                <TouchableOpacity
                  key={o.value}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() => r.setRepeat(o.value)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* End date — only for repeating reminders */}
        {r.repeat !== 'NONE' && (
          <View>
            <Text style={styles.label}>End date (optional)</Text>
            <TouchableOpacity style={styles.dateField} activeOpacity={0.8} onPress={() => setEndOpen(true)}>
              <CalendarDays size={18} color={Color.primary} />
              <Text style={[styles.dateFieldText, !r.endDate && styles.dateFieldPlaceholder]}>
                {r.endDate ? r.endDate.toLocaleDateString(undefined, DATE_OPTS) : 'No end date'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Note */}
        <View>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Policy number, details…"
            placeholderTextColor={Color.placeholder}
            value={r.note}
            onChangeText={r.setNote}
            multiline
            maxLength={500}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {r.isEdit && (
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={r.removeReminder}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={r.save}
          disabled={r.saving}
        >
          {r.saving ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <Text style={styles.saveBtnText}>{r.isEdit ? 'Save changes' : 'Add reminder'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Calendars */}
      <CalendarModal
        visible={startOpen}
        value={r.startDate}
        onSelect={(d) => {
          r.setStartDate(d);
          setStartOpen(false);
        }}
        onClose={() => setStartOpen(false)}
      />
      <CalendarModal
        visible={endOpen}
        value={r.endDate}
        minDate={minEndDate}
        isDateDisabled={(d) => !isReminderOccurrence(d, r.startDate, r.repeat)}
        onSelect={(d) => {
          r.setEndDate(d);
          setEndOpen(false);
        }}
        onClear={() => {
          r.clearEnd();
          setEndOpen(false);
        }}
        onClose={() => setEndOpen(false)}
      />
    </View>
  );
}
