import React from 'react';
import { SafeAreaView, ScrollView, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { LoadingView } from '@/components/LoadingView';
import { TimeField } from '@/components/TimeField';
import { Color } from '@/utils/Theme';

import { useBusinessHoursScreen } from './useBusinessHoursScreen';
import { DAY_LABELS } from './types';
import { styles } from './styles';

export default function BusinessHoursScreen() {
  const {
    isLoading,
    saving,
    days,
    toggleDay,
    setTime,
    hasBreak,
    toggleBreak,
    breakStart,
    setBreakStart,
    breakEnd,
    setBreakEnd,
    dirty,
    error,
    save,
  } = useBusinessHoursScreen();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root}>
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Weekly hours</Text>

        {days.map((d) => (
          <View key={d.dayOfWeek} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{DAY_LABELS[d.dayOfWeek]}</Text>
              <Switch
                value={d.isOpen}
                onValueChange={() => toggleDay(d.dayOfWeek)}
                trackColor={{ true: Color.primary, false: Color.border }}
              />
            </View>
            {d.isOpen ? (
              <View style={styles.timesRow}>
                <View style={styles.timeField}>
                  <TimeField
                    label="Opens"
                    value={d.openTime}
                    onChange={(v) => setTime(d.dayOfWeek, 'openTime', v)}
                  />
                </View>
                <View style={styles.timeField}>
                  <TimeField
                    label="Closes"
                    value={d.closeTime}
                    onChange={(v) => setTime(d.dayOfWeek, 'closeTime', v)}
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.closedText}>Closed</Text>
            )}
          </View>
        ))}

        <View style={styles.breakCard}>
          <View style={styles.breakHeader}>
            <View>
              <Text style={styles.breakTitle}>Daily break</Text>
              <Text style={styles.breakHint}>Applied to every open day it fits inside.</Text>
            </View>
            <Switch value={hasBreak} onValueChange={toggleBreak} trackColor={{ true: Color.primary, false: Color.border }} />
          </View>
          {hasBreak && (
            <View style={styles.timesRow}>
              <View style={styles.timeField}>
                <TimeField label="Break starts" value={breakStart} onChange={setBreakStart} />
              </View>
              <View style={styles.timeField}>
                <TimeField label="Break ends" value={breakEnd} onChange={setBreakEnd} />
              </View>
            </View>
          )}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <AppButton title="Save hours" onPress={save} loading={saving} disabled={!dirty} />
      </ScrollView>
    </SafeAreaView>
  );
}
