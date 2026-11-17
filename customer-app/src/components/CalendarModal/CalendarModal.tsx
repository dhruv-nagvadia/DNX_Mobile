import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { INK } from '@/utils/modernTheme';

import { styles } from './styles';

interface CalendarModalProps {
  visible: boolean;
  value: Date | null;
  /** Called with the picked date when the customer taps "Set date". */
  onSelect: (date: Date) => void;
  onClose: () => void;
  /** Sheet title, e.g. "Start date". */
  title?: string;
  /** Days before this are disabled (compared at day granularity). */
  minDate?: Date | null;
  /** Shows a "No date" button that calls onClear. */
  onClear?: () => void;
  /** Extra per-day rule — e.g. only the dates a recurring reminder actually falls on. */
  isDateDisabled?: (date: Date) => boolean;
  /** Show the Tomorrow / In 1 week / In 1 month shortcuts. Default true. */
  quickPicks?: boolean;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a: Date | null, b: Date): boolean {
  return (
    !!a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
/** 9 AM on that day — the time reminders are stored at. */
function at9(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0, 0);
}

/**
 * Bottom-sheet month calendar (mockup "DNX Reminder App UI Trio.png"): pick a
 * day (or a quick shortcut), then "Set date". Tap the month title for a year
 * grid. Pure JS — no native date-picker dependency.
 */
export function CalendarModal({
  visible,
  value,
  onSelect,
  onClose,
  title,
  minDate,
  onClear,
  isDateDisabled,
  quickPicks = true,
}: CalendarModalProps) {
  const insets = useSafeAreaInsets();
  const [cursor, setCursor] = useState(() => value ?? new Date());
  const [pending, setPending] = useState<Date | null>(value);
  const [view, setView] = useState<'days' | 'years'>('days');
  const [yearBase, setYearBase] = useState(() => (value ?? new Date()).getFullYear() - 5);

  // Reset to the current value each time it opens.
  useEffect(() => {
    if (visible) {
      const base = value ?? new Date();
      setCursor(base);
      setPending(value);
      setView('days');
      setYearBase(base.getFullYear() - 5);
    }
  }, [visible, value]);

  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : null;
  const isDisabled = (d: Date) =>
    (min ? startOfDay(d) < min : false) || (isDateDisabled ? isDateDisabled(d) : false);

  // Monday-first grid, 6 weeks.
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(1 - offset);
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
  const years = Array.from({ length: 12 }, (_, i) => yearBase + i);

  const pick = (d: Date) => {
    setPending(at9(d));
    setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const shortcut = (addDays: number, months = 0) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    d.setDate(d.getDate() + addDays);
    return d;
  };
  const QUICK = [
    { label: 'Tomorrow', date: shortcut(1) },
    { label: 'In 1 week', date: shortcut(7) },
    { label: 'In 1 month', date: shortcut(0, 1) },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close"
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) + 6 }]}>
          <View style={styles.handle} />
          {!!title && <Text style={styles.sheetTitle}>{title}</Text>}

          {/* Month header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() =>
                view === 'days'
                  ? setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                  : setYearBase(yearBase - 12)
              }
              accessibilityLabel="Previous"
            >
              <ChevronLeft size={22} color={INK} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (view === 'days') {
                  setYearBase(cursor.getFullYear() - 5);
                  setView('years');
                } else {
                  setView('days');
                }
              }}
              accessibilityRole="button"
              accessibilityHint="Switch between days and years"
            >
              <Text style={styles.monthText}>
                {view === 'days'
                  ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
                  : `${years[0]} – ${years[years.length - 1]}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() =>
                view === 'days'
                  ? setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                  : setYearBase(yearBase + 12)
              }
              accessibilityLabel="Next"
            >
              <ChevronRight size={22} color={INK} />
            </TouchableOpacity>
          </View>

          {view === 'years' ? (
            <View style={styles.yearGrid}>
              {years.map((y) => {
                const active = y === cursor.getFullYear();
                return (
                  <View key={y} style={styles.yearCell}>
                    <TouchableOpacity
                      style={[styles.yearBtn, active && styles.yearBtnActive]}
                      onPress={() => {
                        setCursor(new Date(y, cursor.getMonth(), 1));
                        setView('days');
                      }}
                    >
                      <Text style={[styles.yearText, active && styles.yearTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : (
            <>
              <View style={styles.weekRow}>
                {WEEKDAYS.map((w) => (
                  <Text key={w} style={styles.weekday}>
                    {w}
                  </Text>
                ))}
              </View>
              <View style={styles.grid}>
                {days.map((d, i) => {
                  const inMonth = d.getMonth() === cursor.getMonth();
                  const selected = sameDay(pending, d);
                  const isToday = sameDay(today, d);
                  const disabled = isDisabled(d);
                  return (
                    <View key={i} style={styles.cell}>
                      <TouchableOpacity
                        style={[
                          styles.dayBtn,
                          isToday && !selected && styles.dayToday,
                          selected && styles.daySelected,
                        ]}
                        disabled={disabled}
                        onPress={() => pick(d)}
                        accessibilityLabel={d.toDateString()}
                        accessibilityState={{ selected, disabled }}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            !inMonth && styles.dayTextMuted,
                            disabled && styles.dayTextDisabled,
                            selected && styles.dayTextSelected,
                          ]}
                        >
                          {d.getDate()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {quickPicks && view === 'days' && (
            <View style={styles.quickRow}>
              {QUICK.map((q) => {
                const off = isDisabled(q.date);
                const active = sameDay(pending, q.date);
                return (
                  <TouchableOpacity
                    key={q.label}
                    style={[styles.quick, active && styles.quickActive, off && styles.quickOff]}
                    disabled={off}
                    onPress={() => pick(q.date)}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.quickText, active && styles.quickTextActive]}>
                      {q.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClear ?? onClose}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>{onClear ? 'No date' : 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.setBtn, !pending && styles.setBtnOff]}
              disabled={!pending}
              onPress={() => pending && onSelect(pending)}
              accessibilityRole="button"
            >
              <Text style={styles.setText}>Set date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
