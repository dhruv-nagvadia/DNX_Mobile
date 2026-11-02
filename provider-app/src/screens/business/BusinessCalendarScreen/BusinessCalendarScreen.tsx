import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, CalendarDays, CalendarOff, ChevronRight } from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { AppHeader } from '@/components/AppHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { ACTION, INK } from '@/utils/modernTheme';
import { bookingStatusBadge, orderStatusBadge } from '@/utils/status';
import { BookingStatus, OrderStatus } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { TimePill } from '../BusinessHoursScreen/TimePill';
import { useBusinessCalendarScreen } from './useBusinessCalendarScreen';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BusinessCalendarScreen'>;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TRACK = { true: ACTION, false: Color.border };

const dayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const shortDateFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
const longDateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

/** "10:00 am" → "10:00 AM" to match the mockup. */
function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso)).toUpperCase();
}

export default function BusinessCalendarScreen() {
  const {
    view,
    setView,
    itemLabel,
    monthLabel,
    isCurrentMonth,
    goPrevMonth,
    goNextMonth,
    goThisMonth,
    weekSummaries,
    openDay,
    countFor,
    isInMonth,
    todayKey,
    weekLabel,
    isCurrentWeek,
    goPrevWeek,
    goNextWeek,
    goThisWeek,
    weekDays,
    dateKey,
    selectedKey,
    selectDay,
    hasOverrideFor,
    hasOverride,
    items,
    form,
    setForm,
    saving,
    deleting,
    error,
    save,
    resetToWeekly,
  } = useBusinessCalendarScreen();

  const selectedDate = new Date(`${selectedKey}T00:00:00`);
  const navigation = useNavigation<Nav>();
  const itemLabelPlural = itemLabel === 'order' ? 'orders' : 'bookings';
  const itemLabelTitle = itemLabel === 'order' ? 'Orders' : 'Bookings';
  const selectedCount = countFor(selectedKey);
  const selectedShort = shortDateFmt.format(selectedDate);

  const showToday = view === 'month' ? !isCurrentMonth : !isCurrentWeek;
  const todayButton = showToday ? (
    <TouchableOpacity
      style={styles.todayBtn}
      onPress={view === 'month' ? goThisMonth : goThisWeek}
      accessibilityRole="button"
    >
      <Text style={styles.todayBtnText}>{view === 'month' ? 'This month' : 'This week'}</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <View style={styles.root}>
      <AppHeader title="Calendar" variant="light" right={todayButton} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Month | Week segment */}
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, view === 'month' && styles.segmentBtnActive]}
            onPress={() => setView('month')}
            accessibilityRole="tab"
            accessibilityState={{ selected: view === 'month' }}
          >
            <Text style={[styles.segmentText, view === 'month' && styles.segmentTextActive]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, view === 'week' && styles.segmentBtnActive]}
            onPress={() => setView('week')}
            accessibilityRole="tab"
            accessibilityState={{ selected: view === 'week' }}
          >
            <Text style={[styles.segmentText, view === 'week' && styles.segmentTextActive]}>Week</Text>
          </TouchableOpacity>
        </View>

        {view === 'month' ? (
          <>
            <View style={styles.periodNav}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={goPrevMonth}
                accessibilityLabel="Previous month"
                hitSlop={8}
              >
                <ArrowLeft size={22} color={INK} />
              </TouchableOpacity>
              <Text style={styles.periodLabel}>{monthLabel}</Text>
              <TouchableOpacity style={styles.navBtn} onPress={goNextMonth} accessibilityLabel="Next month" hitSlop={8}>
                <ArrowRight size={22} color={INK} />
              </TouchableOpacity>
            </View>

            <View style={styles.monthGrid}>
              <View style={styles.gridRow}>
                {WEEKDAYS.map((w) => (
                  <Text key={w} style={styles.weekdayLabel}>
                    {w}
                  </Text>
                ))}
              </View>
              {weekSummaries.map((w) => (
                <View key={w.key} style={styles.gridRow}>
                  {w.days.map((d) => {
                    const key = dateKey(d);
                    const selected = key === selectedKey;
                    const inMonth = isInMonth(d);
                    const hasItems = countFor(key) > 0;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={styles.dayCell}
                        onPress={() => selectDay(key)}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={longDateFmt.format(d)}
                      >
                        <View style={[styles.dayCircle, selected && styles.dayCircleSelected]}>
                          <Text
                            style={[
                              styles.dayNum,
                              !inMonth && styles.dayNumMuted,
                              key === todayKey && styles.dayNumToday,
                              selected && styles.dayNumSelected,
                            ]}
                          >
                            {d.getDate()}
                          </Text>
                        </View>
                        <View style={[styles.dayDot, hasItems && styles.dayDotOn, !inMonth && styles.dayDotMuted]} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.selectedCard}
              onPress={() => openDay(selectedKey)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${longDateFmt.format(selectedDate)}`}
            >
              <CalendarDays size={30} color={ACTION} strokeWidth={1.8} />
              <View style={styles.selectedMain}>
                <Text style={styles.selectedTitle}>{longDateFmt.format(selectedDate)}</Text>
                <Text style={styles.selectedSubtitle}>
                  {selectedCount > 0
                    ? `${selectedCount} ${selectedCount === 1 ? itemLabel : itemLabelPlural}`
                    : `No ${itemLabelPlural}`}
                  {hasOverride ? ' · Custom hours' : ''}
                </Text>
              </View>
              <ChevronRight size={22} color={INK} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.periodNav}>
              <TouchableOpacity style={styles.navBtn} onPress={goPrevWeek} accessibilityLabel="Previous week" hitSlop={8}>
                <ArrowLeft size={22} color={INK} />
              </TouchableOpacity>
              <Text style={styles.periodLabel} numberOfLines={1}>
                {weekLabel}
              </Text>
              <TouchableOpacity style={styles.navBtn} onPress={goNextWeek} accessibilityLabel="Next week" hitSlop={8}>
                <ArrowRight size={22} color={INK} />
              </TouchableOpacity>
            </View>

            <View style={styles.chipRow}>
              {weekDays.map((d) => {
                const key = dateKey(d);
                const active = key === selectedKey;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => selectDay(key)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.chipDay, active && styles.chipDayActive]}>{dayFmt.format(d)}</Text>
                    <Text style={[styles.chipDate, active && styles.chipDateActive]}>{d.getDate()}</Text>
                    <View style={[styles.chipDot, hasOverrideFor(key) && styles.chipDotOn, active && styles.chipDotActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* That day's bookings / orders */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {itemLabelTitle} on {selectedShort} ({items.length})
              </Text>
              {items.length > 0 ? (
                <View>
                  {items.map((item, i) => {
                    const statusInfo =
                      itemLabel === 'order'
                        ? orderStatusBadge(item.status as OrderStatus)
                        : bookingStatusBadge(item.status as BookingStatus);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.itemRow, i < items.length - 1 && styles.itemRowDivider]}
                        onPress={() =>
                          itemLabel === 'order'
                            ? navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })
                            : navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.id })
                        }
                      >
                        <View style={styles.timeBox}>
                          <Text style={styles.timeBoxText}>{formatTime(item.time)}</Text>
                          {!!item.endTime && <Text style={styles.timeBoxEnd}>to {formatTime(item.endTime)}</Text>}
                        </View>
                        <View style={styles.itemMain}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.itemSubtitle} numberOfLines={1}>
                            {item.subtitle}
                          </Text>
                        </View>
                        <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyRow}>
                  <CalendarOff size={15} color={Color.placeholder} />
                  <Text style={styles.emptyText}>No {itemLabelPlural} on this date.</Text>
                </View>
              )}
            </View>

            {/* Per-date hours override */}
            <View style={styles.section}>
              <View style={styles.overrideHeader}>
                <View style={styles.overrideHeaderText}>
                  <Text style={styles.sectionTitle} numberOfLines={1}>
                    Override Hours ({selectedShort})
                  </Text>
                  <Text style={styles.overrideHint}>
                    {form.isOpen ? 'Open' : 'Closed'} on this date
                    {hasOverride ? ' · Custom hours' : ' · Weekly default'}
                  </Text>
                </View>
                <Switch
                  value={form.isOpen}
                  onValueChange={(v) => setForm((f) => ({ ...f, isOpen: v }))}
                  trackColor={TRACK}
                  thumbColor={Color.white}
                  ios_backgroundColor={Color.border}
                  accessibilityLabel="Open on this date"
                />
              </View>

              {form.isOpen && (
                <View style={styles.rangeRow}>
                  <TimePill
                    label="Opens"
                    value={form.openTime}
                    onChange={(v) => setForm((f) => ({ ...f, openTime: v }))}
                  />
                  <Text style={styles.rangeDash}>–</Text>
                  <TimePill
                    label="Closes"
                    value={form.closeTime}
                    onChange={(v) => setForm((f) => ({ ...f, closeTime: v }))}
                  />
                </View>
              )}

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <AppButton
                style={styles.primaryButton}
                title="Save for this date"
                loading={saving}
                onPress={save}
              />
              {hasOverride && (
                <AppButton
                  style={styles.outlineButton}
                  title="Reset to Weekly Default"
                  variant="secondary"
                  loading={deleting}
                  onPress={resetToWeekly}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
