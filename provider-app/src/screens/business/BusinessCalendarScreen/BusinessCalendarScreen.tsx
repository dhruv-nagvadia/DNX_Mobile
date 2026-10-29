import React from 'react';
import { SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { TimeField } from '@/components/TimeField';
import { Color } from '@/utils/Theme';

import { useBusinessCalendarScreen } from './useBusinessCalendarScreen';
import { styles } from './styles';

const dayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const fullDateFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

export default function BusinessCalendarScreen() {
  const {
    days,
    dateKey,
    selectedKey,
    selectDay,
    hasOverrideFor,
    hasOverride,
    form,
    setForm,
    saving,
    deleting,
    error,
    save,
    resetToWeekly,
  } = useBusinessCalendarScreen();

  const selectedDate = new Date(`${selectedKey}T00:00:00`);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Date overrides</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipStrip}>
          {days.map((d) => {
            const key = dateKey(d);
            const active = key === selectedKey;
            return (
              <TouchableOpacity key={key} style={[styles.chip, active && styles.chipActive]} onPress={() => selectDay(key)}>
                <Text style={[styles.chipDay, active && styles.chipDayActive]}>{dayFmt.format(d)}</Text>
                <Text style={[styles.chipDate, active && styles.chipDateActive]}>{d.getDate()}</Text>
                {hasOverrideFor(key) && <View style={styles.chipDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{fullDateFmt.format(selectedDate)}</Text>
            {hasOverride && <Text style={styles.overrideTag}>Custom hours</Text>}
          </View>

          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Open</Text>
            <Switch
              value={form.isOpen}
              onValueChange={(v) => setForm((f) => ({ ...f, isOpen: v }))}
              trackColor={{ true: Color.primary, false: Color.border }}
            />
          </View>

          {form.isOpen && (
            <View style={styles.timesRow}>
              <View style={styles.timeField}>
                <TimeField label="Opens" value={form.openTime} onChange={(v) => setForm((f) => ({ ...f, openTime: v }))} />
              </View>
              <View style={styles.timeField}>
                <TimeField label="Closes" value={form.closeTime} onChange={(v) => setForm((f) => ({ ...f, closeTime: v }))} />
              </View>
            </View>
          )}

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.actionsRow}>
            {hasOverride && (
              <AppButton
                style={styles.actionButton}
                title="Reset to weekly"
                variant="secondary"
                loading={deleting}
                onPress={resetToWeekly}
              />
            )}
            <AppButton style={styles.actionButton} title="Save for this date" loading={saving} onPress={save} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
