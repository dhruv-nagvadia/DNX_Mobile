import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { AppHeader } from '@/components/AppHeader';
import { LoadingView } from '@/components/LoadingView';
import { Color } from '@/utils/Theme';
import { ACTION } from '@/utils/modernTheme';

import { useBusinessHoursScreen } from './useBusinessHoursScreen';
import { DAY_LABELS, DISPLAY_ORDER, SHORT_DAY_LABELS } from './types';
import { TimePill } from './TimePill';
import { styles } from './styles';

const TRACK = { true: ACTION, false: Color.border };

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
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={styles.root}>
        <AppHeader title="Hours" variant="light" />
        <LoadingView />
      </View>
    );
  }

  const orderedDays = DISPLAY_ORDER.map((dow) => days.find((d) => d.dayOfWeek === dow)).filter(
    (d): d is NonNullable<typeof d> => !!d,
  );

  return (
    <View style={styles.root}>
      <AppHeader title="Hours" variant="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Daily break */}
        <View style={styles.breakCard}>
          <View style={styles.breakHeader}>
            <View style={styles.breakHeaderText}>
              <Text style={styles.breakTitle}>Daily Break Time</Text>
              <Text style={styles.breakHint}>Apply a break for all open days</Text>
            </View>
            <Switch
              value={hasBreak}
              onValueChange={toggleBreak}
              trackColor={TRACK}
              thumbColor={Color.white}
              ios_backgroundColor={Color.border}
            />
          </View>
          {hasBreak && (
            <>
              <Text style={styles.breakLabel}>Break Time</Text>
              <View style={styles.rangeRow}>
                <TimePill label="Break starts" value={breakStart} onChange={setBreakStart} />
                <Text style={styles.rangeDash}>–</Text>
                <TimePill label="Break ends" value={breakEnd} onChange={setBreakEnd} />
              </View>
            </>
          )}
        </View>

        {/* Weekly hours */}
        <View style={styles.daysCard}>
          {orderedDays.map((d, i) => (
            <View
              key={d.dayOfWeek}
              style={[styles.dayRow, i < orderedDays.length - 1 && styles.dayRowDivider]}
            >
              <Text style={[styles.dayName, !d.isOpen && styles.dayNameClosed]}>
                {SHORT_DAY_LABELS[d.dayOfWeek]}
              </Text>
              <Switch
                value={d.isOpen}
                onValueChange={() => toggleDay(d.dayOfWeek)}
                trackColor={TRACK}
                thumbColor={Color.white}
                ios_backgroundColor={Color.border}
                accessibilityLabel={`${DAY_LABELS[d.dayOfWeek]} open`}
                style={styles.daySwitch}
              />
              {d.isOpen ? (
                <View style={styles.dayTimes}>
                  <TimePill
                    size="compact"
                    label={`${DAY_LABELS[d.dayOfWeek]} opens`}
                    value={d.openTime}
                    onChange={(v) => setTime(d.dayOfWeek, 'openTime', v)}
                  />
                  <Text style={styles.rangeDashSmall}>–</Text>
                  <TimePill
                    size="compact"
                    label={`${DAY_LABELS[d.dayOfWeek]} closes`}
                    value={d.closeTime}
                    onChange={(v) => setTime(d.dayOfWeek, 'closeTime', v)}
                  />
                </View>
              ) : (
                <View style={styles.dayTimes}>
                  <Text style={styles.closedText}>Closed</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <AppButton title="Save" onPress={save} loading={saving} disabled={!dirty} style={styles.saveButton} />
      </View>
    </View>
  );
}
