import React from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Save,
} from 'lucide-react-native';

import { Pill } from '@/components/Pill';
import { Color } from '@/utils/Theme';
import { INK, PAGE_BG, PILL, PillColors } from '@/utils/modernTheme';
import { formatMoney } from '@/utils/money';
import { BookingStatus, OrderStatus } from '@/redux/api/business/types';

import { TimePill } from '../BusinessHoursScreen/TimePill';
import { DayCell } from './DayCell';
import { HoursSource } from './types';
import { useBusinessCalendarScreen } from './useBusinessCalendarScreen';
import { BRAND_BLUE, TRACK, styles } from './styles';

const BACK_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const weekdayShortFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const dayTitleFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const longDateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

/** "10:00 am" → "10:00 AM" to match the mockup. */
function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso)).toUpperCase();
}

const STATUS_PILL: Record<BookingStatus | OrderStatus, { label: string; colors: PillColors }> = {
  PENDING: { label: 'Pending', colors: PILL.orange },
  CONFIRMED: { label: 'Confirmed', colors: PILL.blue },
  IN_PROGRESS: { label: 'In progress', colors: PILL.teal },
  READY: { label: 'Ready', colors: PILL.green },
  COMPLETED: { label: 'Completed', colors: PILL.green },
  CANCELLED: { label: 'Cancelled', colors: { bg: PILL.grey.bg, fg: Color.textSecondary } },
  NO_SHOW: { label: 'No-show', colors: PILL.red },
};

const SOURCE_PILL: Record<HoursSource, { label: string; colors: PillColors }> = {
  weekly: { label: 'Weekly default', colors: { bg: PILL.grey.bg, fg: Color.textSecondary } },
  custom: { label: 'Custom hours', colors: PILL.orange },
  closedOverride: { label: 'Closed (override)', colors: PILL.red },
};

export default function BusinessCalendarScreen() {
  const {
    view,
    setView,
    itemLabel,
    businessName,
    monthCount,
    goToday,
    goBack,
    viewAll,
    openItem,
    dayInfo,
    monthLabel,
    goPrevMonth,
    goNextMonth,
    weekSummaries,
    isInMonth,
    todayKey,
    weekLabel,
    goPrevWeek,
    goNextWeek,
    weekDays,
    dateKey,
    selectedKey,
    selectDay,
    hasOverride,
    items,
    selectedTotalMinor,
    selectedActiveCount,
    selectedCurrency,
    hoursSource,
    form,
    setForm,
    saving,
    deleting,
    error,
    save,
    resetToWeekly,
  } = useBusinessCalendarScreen();
  const insets = useSafeAreaInsets();

  const isStore = itemLabel === 'order';
  const plural = isStore ? 'orders' : 'bookings';
  const titleWord = isStore ? 'Orders' : 'Bookings';
  const countLabel = (n: number) => `${n} ${n === 1 ? itemLabel : plural}`;

  const monthSummary = `${countLabel(monthCount)} this month`;
  const subtitle = businessName ? `${businessName} • ${monthSummary}` : monthSummary;

  const selectedDate = new Date(`${selectedKey}T00:00:00`);
  const daySubtitle =
    selectedActiveCount > 0
      ? `${countLabel(selectedActiveCount)} • ${formatMoney(selectedTotalMinor, selectedCurrency)}`
      : `No ${plural}`;
  const source = SOURCE_PILL[hoursSource];
  const resetDisabled = !hasOverride || deleting;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          hitSlop={BACK_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={26} color={INK} strokeWidth={2.2} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            Calendar
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.todayBtn}
          onPress={goToday}
          accessibilityRole="button"
          accessibilityLabel="Go to today"
          activeOpacity={0.7}
        >
          <Text style={styles.todayBtnText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Month | Week segment ─────────────────────────────────────── */}
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

        {/* ── Calendar card ────────────────────────────────────────────── */}
        <View style={styles.calendarCard}>
          <View style={styles.periodNav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={view === 'month' ? goPrevMonth : goPrevWeek}
              accessibilityRole="button"
              accessibilityLabel={view === 'month' ? 'Previous month' : 'Previous week'}
              hitSlop={8}
            >
              <ChevronLeft size={24} color={INK} strokeWidth={2.2} />
            </TouchableOpacity>
            <Text style={styles.periodLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {view === 'month' ? monthLabel : weekLabel}
            </Text>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={view === 'month' ? goNextMonth : goNextWeek}
              accessibilityRole="button"
              accessibilityLabel={view === 'month' ? 'Next month' : 'Next week'}
              hitSlop={8}
            >
              <ChevronRight size={24} color={INK} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {view === 'month' ? (
            <>
              <View style={styles.gridRow}>
                {WEEKDAY_LETTERS.map((w, i) => (
                  <Text key={`${w}${i}`} style={styles.weekdayLabel}>
                    {w}
                  </Text>
                ))}
              </View>
              {weekSummaries.map((w) => (
                <View key={w.key} style={styles.gridRow}>
                  {w.days.map((d) => {
                    const key = dateKey(d);
                    return (
                      <DayCell
                        key={key}
                        date={d}
                        info={dayInfo(key)}
                        inMonth={isInMonth(d)}
                        isToday={key === todayKey}
                        selected={key === selectedKey}
                        accessibilityLabel={longDateFmt.format(d)}
                        onPress={() => selectDay(key)}
                      />
                    );
                  })}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.gridRow}>
              {weekDays.map((d) => {
                const key = dateKey(d);
                return (
                  <DayCell
                    key={key}
                    date={d}
                    info={dayInfo(key)}
                    inMonth
                    isToday={key === todayKey}
                    selected={key === selectedKey}
                    weekdayLabel={weekdayShortFmt.format(d)}
                    accessibilityLabel={longDateFmt.format(d)}
                    onPress={() => selectDay(key)}
                  />
                );
              })}
            </View>
          )}

          <View style={styles.legend}>
            <View style={styles.legendChip}>
              <View style={[styles.legendDot, styles.legendBookings]} />
              <Text style={styles.legendText}>{titleWord}</Text>
            </View>
            <View style={styles.legendChip}>
              <View style={[styles.legendDot, styles.legendClosed]} />
              <Text style={styles.legendText}>Closed</Text>
            </View>
            <View style={styles.legendChip}>
              <View style={[styles.legendDot, styles.legendCustom]} />
              <Text style={styles.legendText}>Custom hours</Text>
            </View>
          </View>
        </View>

        {/* ── Selected day: hours editor ───────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.dayHeader}>
            <CalendarDays size={30} color={INK} strokeWidth={1.8} />
            <View style={styles.dayHeaderText}>
              <Text style={styles.dayTitle}>{dayTitleFmt.format(selectedDate)}</Text>
              <Text style={styles.daySubtitle}>{daySubtitle}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.hoursRow}>
            <Clock size={24} color={INK} strokeWidth={1.9} />
            <Text style={styles.hoursLabel}>Hours</Text>
            <Pill label={source.label} colors={source.colors} style={styles.sourcePill} />
          </View>

          <View style={styles.editRow}>
            <View style={styles.switchWrap}>
              <Switch
                value={form.isOpen}
                onValueChange={(v) => setForm((f) => ({ ...f, isOpen: v }))}
                trackColor={TRACK}
                thumbColor={Color.white}
                ios_backgroundColor={TRACK.false}
                accessibilityLabel="Open on this date"
              />
              <Text style={styles.switchLabel}>{form.isOpen ? 'Open' : 'Closed'}</Text>
            </View>
            <TimePill
              size="compact"
              label="Opens"
              value={form.openTime}
              disabled={!form.isOpen}
              onChange={(v) => setForm((f) => ({ ...f, openTime: v }))}
            />
            <Text style={styles.rangeDash}>–</Text>
            <TimePill
              size="compact"
              label="Closes"
              value={form.closeTime}
              disabled={!form.isOpen}
              onChange={(v) => setForm((f) => ({ ...f, closeTime: v }))}
            />
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.primaryBtn, saving && styles.btnDisabled]}
              onPress={save}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Save for this date"
              accessibilityState={{ disabled: saving, busy: saving }}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Color.white} />
              ) : (
                <>
                  <Save size={20} color={Color.white} strokeWidth={2} />
                  <Text style={styles.primaryBtnText} numberOfLines={1}>
                    Save for this date
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.outlineBtn, resetDisabled && !deleting && styles.btnDisabled]}
              onPress={resetToWeekly}
              disabled={resetDisabled}
              accessibilityRole="button"
              accessibilityLabel="Reset to weekly default"
              accessibilityState={{ disabled: resetDisabled, busy: deleting }}
              activeOpacity={0.7}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={BRAND_BLUE} />
              ) : (
                <>
                  <RotateCcw size={18} color={BRAND_BLUE} strokeWidth={2.2} />
                  <Text style={styles.outlineBtnText}>Reset</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── That day's bookings / orders ─────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.listHeader}>
            <CalendarDays size={26} color={INK} strokeWidth={1.9} />
            <Text style={styles.listTitle} numberOfLines={1}>
              {titleWord} ({items.length})
            </Text>
            <TouchableOpacity
              style={styles.viewAll}
              onPress={viewAll}
              accessibilityRole="button"
              accessibilityLabel={`View all ${plural}`}
              hitSlop={8}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={18} color={BRAND_BLUE} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {items.length > 0 ? (
            <View>
              {items.map((item) => {
                const status = STATUS_PILL[item.status];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemRow}
                    onPress={() => openItem(item.id)}
                    accessibilityRole="button"
                    activeOpacity={0.7}
                  >
                    <View style={styles.timeBox}>
                      <Text style={styles.timeBoxText}>{formatTime(item.time)}</Text>
                    </View>
                    <View style={styles.itemMain}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.itemSubtitle} numberOfLines={1}>
                        {item.subtitle} • {formatMoney(item.amountMinor, item.currency)}
                      </Text>
                    </View>
                    <Pill label={status.label} colors={status.colors} style={styles.statusPill} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>No {plural} on this date.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
