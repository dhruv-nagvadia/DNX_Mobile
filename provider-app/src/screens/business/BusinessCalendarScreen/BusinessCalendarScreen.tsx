import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarOff, ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react-native';

import { AppButton } from '@/components/AppButton';
import { AppHeader } from '@/components/AppHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { TimeField } from '@/components/TimeField';
import { Color } from '@/utils/Theme';
import { bookingStatusBadge, orderStatusBadge } from '@/utils/status';
import { BookingStatus, OrderStatus } from '@/redux/api/business/types';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import { useBusinessCalendarScreen } from './useBusinessCalendarScreen';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BusinessCalendarScreen'>;

const dayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const rangeFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });
const fullDateFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
const timeFmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' });

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
    selectWeek,
    weekLabel,
    isCurrentWeek,
    goPrevWeek,
    goNextWeek,
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

  return (
    <View style={styles.root}>
      <AppHeader title="Calendar" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, view === 'month' && styles.segmentBtnActive]}
            onPress={() => setView('month')}
          >
            <Text style={[styles.segmentText, view === 'month' && styles.segmentTextActive]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, view === 'week' && styles.segmentBtnActive]}
            onPress={() => setView('week')}
          >
            <Text style={[styles.segmentText, view === 'week' && styles.segmentTextActive]}>Week</Text>
          </TouchableOpacity>
        </View>

        {view === 'month' ? (
          <>
            <View style={styles.toolbar}>
              <View style={styles.toolbarNav}>
                <TouchableOpacity style={styles.navBtn} onPress={goPrevMonth} accessibilityLabel="Previous month">
                  <ChevronLeft size={18} color={Color.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn} onPress={goNextMonth} accessibilityLabel="Next month">
                  <ChevronRight size={18} color={Color.textPrimary} />
                </TouchableOpacity>
                {!isCurrentMonth && (
                  <TouchableOpacity style={styles.todayBtn} onPress={goThisMonth}>
                    <Text style={styles.todayBtnText}>This month</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.periodLabel}>{monthLabel}</Text>
            </View>

            <View style={styles.weekList}>
              {weekSummaries.map((w) => (
                <TouchableOpacity
                  key={w.key}
                  style={[styles.weekRow, !w.inMonth && styles.weekRowMuted]}
                  onPress={() => selectWeek(w.start)}
                >
                  <View style={styles.weekMain}>
                    <Text style={styles.weekRange}>
                      {rangeFmt.format(w.start)} – {rangeFmt.format(w.end)}
                    </Text>
                  </View>
                  {w.count > 0 ? (
                    <View style={styles.weekCountBadge}>
                      <Text style={styles.weekCountText}>
                        {w.count} {itemLabel}
                        {w.count === 1 ? '' : 's'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.weekEmptyText}>No {itemLabelPlural}</Text>
                  )}
                  <ChevronRight size={16} color={Color.placeholder} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.toolbar}>
              <View style={styles.toolbarNav}>
                <TouchableOpacity style={styles.navBtn} onPress={goPrevWeek} accessibilityLabel="Previous week">
                  <ChevronLeft size={18} color={Color.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn} onPress={goNextWeek} accessibilityLabel="Next week">
                  <ChevronRight size={18} color={Color.textPrimary} />
                </TouchableOpacity>
                {!isCurrentWeek && (
                  <TouchableOpacity style={styles.todayBtn} onPress={() => selectWeek(weekDays[0])}>
                    <Text style={styles.todayBtnText}>This week</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.periodLabel}>{weekLabel}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipStrip}>
              {weekDays.map((d) => {
                const key = dateKey(d);
                const active = key === selectedKey;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => selectDay(key)}
                  >
                    <Text style={[styles.chipDay, active && styles.chipDayActive]}>{dayFmt.format(d)}</Text>
                    <Text style={[styles.chipDate, active && styles.chipDateActive]}>{d.getDate()}</Text>
                    {hasOverrideFor(key) && <View style={styles.chipDot} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.sectionGroup}>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>{itemLabel === 'order' ? 'Orders' : 'Bookings'}</Text>
                {items.length > 0 && (
                  <View style={styles.sectionCount}>
                    <Text style={styles.sectionCountText}>{items.length}</Text>
                  </View>
                )}
              </View>
              {items.length > 0 ? (
                <View style={styles.itemList}>
                  {items.map((item) => {
                    const statusInfo =
                      itemLabel === 'order'
                        ? orderStatusBadge(item.status as OrderStatus)
                        : bookingStatusBadge(item.status as BookingStatus);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.itemRow}
                        onPress={() =>
                          itemLabel === 'order'
                            ? navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })
                            : navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: item.id })
                        }
                      >
                        <View style={styles.itemIcon}>
                          <PackageCheck size={16} color={Color.primary} />
                        </View>
                        <View style={styles.itemMain}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.itemSubtitle} numberOfLines={1}>
                            {item.subtitle} ·{' '}
                            {timeFmt.format(new Date(item.time))}
                            {item.endTime ? `–${timeFmt.format(new Date(item.endTime))}` : ''}
                          </Text>
                        </View>
                        <StatusBadge label={statusInfo.label} tone={statusInfo.tone} cutRight style={styles.edgeBadge} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <CalendarOff size={15} color={Color.placeholder} />
                  <Text style={styles.emptyText}>No {itemLabelPlural} on this date.</Text>
                </View>
              )}
            </View>

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
                    <TimeField
                      label="Opens"
                      value={form.openTime}
                      onChange={(v) => setForm((f) => ({ ...f, openTime: v }))}
                    />
                  </View>
                  <View style={styles.timeField}>
                    <TimeField
                      label="Closes"
                      value={form.closeTime}
                      onChange={(v) => setForm((f) => ({ ...f, closeTime: v }))}
                    />
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
          </>
        )}
      </ScrollView>
    </View>
  );
}
