import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { DayInfo } from './types';
import { styles } from './styles';

interface DayCellProps {
  date: Date;
  info: DayInfo;
  /** False for the grey leading/trailing days of an adjacent month. */
  inMonth: boolean;
  isToday: boolean;
  selected: boolean;
  /** Week view: show the weekday letter inside a taller cell. */
  weekdayLabel?: string;
  accessibilityLabel: string;
  onPress: () => void;
}

/**
 * One compact rounded calendar cell: date number (blue ring for today),
 * up to three status dots top-right, a soft-blue count badge, and a tint for
 * closed (weekly / override) or custom-hours dates.
 */
export function DayCell({
  date,
  info,
  inMonth,
  isToday,
  selected,
  weekdayLabel,
  accessibilityLabel,
  onPress,
}: DayCellProps) {
  const closed = info.closedWeekly || info.closedOverride;
  const showDetail = inMonth || selected;

  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        !!weekdayLabel && styles.dayCellTall,
        !inMonth && styles.dayCellOutside,
        showDetail && info.closedWeekly && styles.dayCellClosed,
        showDetail && info.closedOverride && styles.dayCellClosedOverride,
        showDetail && info.customOpen && styles.dayCellCustom,
        isToday && styles.dayCellToday,
        selected && styles.dayCellSelected,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.7}
    >
      {!!weekdayLabel && (
        <Text style={[styles.weekdayInCell, selected && styles.weekdayInCellSelected]}>{weekdayLabel}</Text>
      )}
      <View style={[styles.dayNumWrap, isToday && !selected && styles.dayNumRing]}>
        <Text
          style={[
            styles.dayNum,
            !inMonth && styles.dayNumOutside,
            isToday && styles.dayNumToday,
            showDetail && info.closedOverride && styles.dayNumClosedOverride,
            selected && styles.dayNumSelected,
          ]}
        >
          {date.getDate()}
        </Text>
      </View>

      {showDetail && !closed && (info.hasPending || info.hasConfirmed || info.hasCompleted || info.customOpen) && (
        <View style={styles.dots}>
          {info.customOpen ? (
            <View style={[styles.dot, styles.dotCustom]} />
          ) : (
            <>
              {info.hasConfirmed && <View style={[styles.dot, styles.dotConfirmed]} />}
              {info.hasCompleted && <View style={[styles.dot, styles.dotCompleted]} />}
              {info.hasPending && <View style={[styles.dot, styles.dotPending]} />}
            </>
          )}
        </View>
      )}

      {showDetail && closed ? (
        <Text
          style={[
            styles.closedLabel,
            info.closedOverride && styles.closedLabelOverride,
            selected && styles.closedLabelSelected,
          ]}
          numberOfLines={1}
        >
          Closed
        </Text>
      ) : null}

      {showDetail && info.count > 0 && (
        <View style={[styles.countBadge, selected && styles.countBadgeSelected]}>
          <Text style={styles.countText}>{info.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
