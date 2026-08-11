import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';

import { Color } from '@/utils/Theme';

import { styles } from './styles';

interface CalendarModalProps {
  visible: boolean;
  value: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
  /** Days before this are disabled (compared at day granularity). */
  minDate?: Date | null;
  /** Shows a "No date" button that calls onClear. */
  onClear?: () => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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

/** Pure-JS month calendar with a year picker — no native date-picker dependency. */
export function CalendarModal({ visible, value, onSelect, onClose, minDate, onClear }: CalendarModalProps) {
  const [cursor, setCursor] = useState(() => value ?? new Date());
  const [view, setView] = useState<'days' | 'years'>('days');
  const [yearBase, setYearBase] = useState(() => (value ?? new Date()).getFullYear() - 5);

  // Reset to the selected month each time it opens.
  useEffect(() => {
    if (visible) {
      const base = value ?? new Date();
      setCursor(base);
      setView('days');
      setYearBase(base.getFullYear() - 5);
    }
  }, [visible, value]);

  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const today = startOfDay(new Date());
  const min = minDate ? startOfDay(minDate) : null;
  const years = Array.from({ length: 12 }, (_, i) => yearBase + i);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() =>
                view === 'days'
                  ? setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                  : setYearBase(yearBase - 12)
              }
            >
              <ChevronLeft size={18} color={Color.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.titleBtn}
              activeOpacity={0.7}
              onPress={() => {
                if (view === 'days') {
                  setYearBase(cursor.getFullYear() - 5);
                  setView('years');
                } else {
                  setView('days');
                }
              }}
            >
              <Text style={styles.titleText}>
                {view === 'days'
                  ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
                  : `${years[0]} – ${years[years.length - 1]}`}
              </Text>
              <ChevronDown size={16} color={Color.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navBtn}
              onPress={() =>
                view === 'days'
                  ? setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                  : setYearBase(yearBase + 12)
              }
            >
              <ChevronRight size={18} color={Color.textPrimary} />
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
                      activeOpacity={0.8}
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
                {WEEKDAYS.map((w, i) => (
                  <Text key={i} style={styles.weekday}>
                    {w}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {days.map((d, i) => {
                  const inMonth = d.getMonth() === cursor.getMonth();
                  const selected = sameDay(value, d);
                  const isToday = sameDay(today, d);
                  const disabled = min ? startOfDay(d) < min : false;
                  return (
                    <View key={i} style={styles.cell}>
                      <TouchableOpacity
                        style={[
                          styles.dayBtn,
                          selected && styles.daySelected,
                          isToday && !selected && styles.dayToday,
                        ]}
                        activeOpacity={0.7}
                        disabled={disabled}
                        onPress={() =>
                          onSelect(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0, 0))
                        }
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

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerBtn}
              onPress={() => {
                setCursor(new Date());
                setView('days');
              }}
            >
              <Text style={[styles.footerBtnText, styles.todayText]}>Today</Text>
            </TouchableOpacity>
            <View style={styles.footerRight}>
              {onClear && (
                <TouchableOpacity style={styles.footerBtn} onPress={onClear}>
                  <Text style={[styles.footerBtnText, styles.clearText]}>No date</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.footerBtn} onPress={onClose}>
                <Text style={styles.footerBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
