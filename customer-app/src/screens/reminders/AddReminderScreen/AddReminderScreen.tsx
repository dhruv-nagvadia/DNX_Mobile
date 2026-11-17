import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, CalendarDays, Check, ChevronDown, Pencil, Save, Trash2 } from 'lucide-react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { CalendarModal } from '@/components/CalendarModal';
import { GradientBackground } from '@/components/GradientBackground';
import { Color } from '@/utils/Theme';
import { INK, LINK } from '@/utils/modernTheme';
import { TYPE_ICON, TYPE_LABEL, TYPE_OPTIONS, isReminderOccurrence } from '@/utils/reminderMeta';
import { ReminderRepeat } from '@/redux/api/reminder/types';

import { LinkedBusinessCard } from './LinkedBusinessCard';
import { useAddReminder } from './useAddReminder';
import { CATEGORY_TINT, SELECTED_TINT_COLORS } from './categoryTints';
import { styles } from './styles';

const REPEAT_OPTIONS: { value: ReminderRepeat; label: string }[] = [
  { value: 'NONE', label: 'Once' },
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

/** Matches the backend zod limits in reminder.validation.ts. */
const TITLE_MAX = 120;
const NOTE_MAX = 500;

/** Create or edit a reminder. Mockup: "DNX Reminders App Interface.png" (right frame). */
export default function AddReminderScreen() {
  const r = useAddReminder();
  const insets = useSafeAreaInsets();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  // The end date must be strictly after the start date — the start date
  // itself isn't a valid "stop after" point, so it's excluded here rather
  // than just discouraged.
  const minEndDate = new Date(r.startDate ?? new Date());
  minEndDate.setDate(minEndDate.getDate() + 1);

  const startLabel = r.startDate
    ? r.startDate.toLocaleDateString(undefined, DATE_OPTS)
    : 'Pick a date';
  const endLabel = r.endDate ? r.endDate.toLocaleDateString(undefined, DATE_OPTS) : 'No end date';

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={r.isEdit ? 'Edit reminder' : 'New reminder'}
        // The backend doesn't send reminder notifications (no scheduler) —
        // reminders surface in the Reminders tab, so don't promise a ping.
        subtitle="We'll keep track of when it's due"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Linked business — reminders created from a booking */}
        {!!r.linkedProviderId && (
          <LinkedBusinessCard providerId={r.linkedProviderId} createdAt={r.createdAt} />
        )}

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What's the reminder?</Text>
          <View style={[styles.inputWrap, !!r.errors.title && styles.inputError]}>
            <Pencil size={18} color={INK} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Car insurance renewal"
              placeholderTextColor={Color.placeholder}
              value={r.title}
              onChangeText={r.setTitle}
              maxLength={TITLE_MAX}
              accessibilityLabel="Reminder title"
            />
          </View>
          {!!r.errors.title && <Text style={styles.errorText}>{r.errors.title}</Text>}
        </View>

        {/* Category */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category</Text>
          <View style={styles.tileGrid} accessibilityRole="radiogroup">
            {TYPE_OPTIONS.map((t) => {
              const Icon = TYPE_ICON[t];
              const tint = CATEGORY_TINT[t];
              const active = r.type === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.tile,
                    { borderColor: active ? LINK : tint.border },
                    active && styles.tileActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => r.setType(t)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active, checked: active }}
                  accessibilityLabel={`Category ${TYPE_LABEL[t]}`}
                >
                  <GradientBackground colors={active ? SELECTED_TINT_COLORS : tint.colors} />
                  <Icon size={24} color={active ? LINK : tint.icon} strokeWidth={1.9} />
                  <Text
                    style={[styles.tileText, active && styles.tileTextActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {TYPE_LABEL[t]}
                  </Text>
                  {active && (
                    <View style={styles.checkBadge}>
                      <Check size={11} color={Color.white} strokeWidth={3.5} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {!!r.errors.type && <Text style={styles.errorText}>{r.errors.type}</Text>}
        </View>

        {/* When */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>When</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Start date</Text>
            <TouchableOpacity
              style={[styles.dateField, !!r.errors.startDate && styles.inputError]}
              activeOpacity={0.8}
              onPress={() => setStartOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`Start date, ${startLabel}`}
              accessibilityHint="Opens a calendar"
            >
              <CalendarDays size={18} color={INK} />
              <Text style={[styles.dateFieldText, !r.startDate && styles.dateFieldPlaceholder]}>
                {startLabel}
              </Text>
            </TouchableOpacity>
            {!!r.errors.startDate && <Text style={styles.errorText}>{r.errors.startDate}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Repeat</Text>
            <View style={styles.segment} accessibilityRole="radiogroup">
              {REPEAT_OPTIONS.map((o) => {
                const active = r.repeat === o.value;
                return (
                  <TouchableOpacity
                    key={o.value}
                    style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                    activeOpacity={0.85}
                    onPress={() => r.setRepeat(o.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active, checked: active }}
                    accessibilityLabel={`Repeat ${o.label}`}
                  >
                    <Text
                      style={[styles.segmentText, active && styles.segmentTextActive]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {o.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* End date — only for repeating reminders */}
          {r.repeat !== 'NONE' && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Ends on (optional)</Text>
              <View style={styles.endRow}>
                <View style={[styles.dateField, styles.endField]}>
                  <TouchableOpacity
                    style={styles.dateFieldTap}
                    activeOpacity={0.8}
                    onPress={() => setEndOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel={`Ends on, ${endLabel}`}
                    accessibilityHint="Opens a calendar"
                  >
                    <CalendarDays size={18} color={INK} />
                    <Text style={[styles.dateFieldText, !r.endDate && styles.dateFieldPlaceholder]}>
                      {endLabel}
                    </Text>
                    <ChevronDown size={20} color={INK} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={r.clearEnd}
                  disabled={!r.endDate}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel="Clear end date"
                >
                  <Text style={[styles.clearLink, !r.endDate && styles.clearLinkOff]}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Note */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Policy number, details…"
            placeholderTextColor={Color.placeholder}
            value={r.note}
            onChangeText={r.setNote}
            multiline
            maxLength={NOTE_MAX}
            accessibilityLabel="Note"
          />
          <Text style={styles.counter}>
            {r.note.length}/{NOTE_MAX}
          </Text>
        </View>

        {/* Info strip — reminders aren't pushed; they surface in the Reminders tab. */}
        <View style={styles.infoStrip}>
          <Bell size={20} color={LINK} />
          <Text style={styles.infoText}>It'll show in your Reminders when it's due.</Text>
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        {r.isEdit && (
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.85}
            onPress={r.removeReminder}
            accessibilityRole="button"
            accessibilityLabel="Delete reminder"
          >
            <Trash2 size={20} color={Color.error} />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveBtn, r.saving && styles.saveBtnBusy]}
          activeOpacity={0.85}
          onPress={r.save}
          disabled={r.saving}
          accessibilityRole="button"
          accessibilityLabel="Save reminder"
          accessibilityState={{ disabled: r.saving, busy: r.saving }}
        >
          {r.saving ? (
            <ActivityIndicator color={Color.white} />
          ) : (
            <>
              <Save size={20} color={Color.white} />
              <Text style={styles.saveBtnText}>{r.isEdit ? 'Save changes' : 'Save reminder'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Calendars */}
      <CalendarModal
        visible={startOpen}
        title="Start date"
        value={r.startDate}
        onSelect={(d) => {
          r.setStartDate(d);
          setStartOpen(false);
        }}
        onClose={() => setStartOpen(false)}
      />
      <CalendarModal
        visible={endOpen}
        title="Ends on"
        value={r.endDate}
        minDate={minEndDate}
        isDateDisabled={(d) => !!r.startDate && !isReminderOccurrence(d, r.startDate, r.repeat)}
        quickPicks={false}
        onSelect={(d) => {
          r.setEndDate(d);
          setEndOpen(false);
        }}
        onClose={() => setEndOpen(false)}
      />
    </View>
  );
}
