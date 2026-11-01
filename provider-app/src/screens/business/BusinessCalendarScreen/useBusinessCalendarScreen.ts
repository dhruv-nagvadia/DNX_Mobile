import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import {
  useDeleteDateHourMutation,
  useGetBusinessBookingsQuery,
  useGetDateHoursQuery,
  useGetMyBusinessQuery,
  useGetMyOrdersQuery,
  useSetDateHourMutation,
} from '@/redux/api/business/businessApi';

import { BusinessCalendarRouteProp, CalendarItem, CalendarView, DayForm, WeekSummary } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" in local time — avoids the UTC-shift bug of toISOString(). */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Sunday of the week containing `d`. */
function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

/**
 * Ports `frontend/src/components/BusinessCalendar/useBusinessCalendar.ts`'s
 * month/week navigation (same Sunday-start weeks, same effective-hours
 * resolution + save/reset flow) onto a two-level mobile drill-down instead of
 * the web's single grid: pick Month to see that month's weeks with their
 * order/booking counts, tap a week to see its 7 days and that day's items +
 * hours editor — so last month's history is as reachable as this week's.
 */
export function useBusinessCalendarScreen() {
  const route = useRoute<BusinessCalendarRouteProp>();
  const { businessId } = route.params;

  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState<CalendarView>('month');
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(today));
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today));
  const [selectedKey, setSelectedKey] = useState(dateKey(today));
  const [form, setForm] = useState<DayForm>({ isOpen: true, openTime: '09:00', closeTime: '18:00' });
  const [error, setError] = useState<string | null>(null);

  const { data: business } = useGetMyBusinessQuery(businessId);
  const isStore = business?.type === 'STORE';
  const [setDateHour, { isLoading: saving }] = useSetDateHourMutation();
  const [deleteDateHour, { isLoading: deleting }] = useDeleteDateHourMutation();

  // The month grid (Sun-start weeks fully covering the cursor's month).
  const monthWeekDays = useMemo(() => {
    const gridStart = startOfWeek(monthCursor);
    const monthEnd = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
    const weeks: Date[][] = [];
    let cursor = gridStart;
    while (cursor <= monthEnd) {
      weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
      cursor = addDays(cursor, 7);
    }
    return weeks;
  }, [monthCursor]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // One override/booking/order fetch range wide enough for whichever view is active.
  const rangeStart = view === 'month' ? monthWeekDays[0][0] : weekDays[0];
  const rangeEnd = view === 'month' ? monthWeekDays[monthWeekDays.length - 1][6] : weekDays[6];
  const from = dateKey(rangeStart);
  const to = dateKey(rangeEnd);

  const { data: overrides = [] } = useGetDateHoursQuery({ id: businessId, from, to });
  const { data: bookings = [] } = useGetBusinessBookingsQuery(businessId, { skip: isStore });
  const { data: orders = [] } = useGetMyOrdersQuery(undefined, { skip: !isStore });

  const overrideByKey = useMemo(() => new Map(overrides.map((o) => [o.date.slice(0, 10), o])), [overrides]);
  const hasOverride = overrideByKey.has(selectedKey);

  // Every booking/order, keyed by date — these queries return the full list
  // (no date filter), so this covers any month, past or future, at once.
  const itemsByKey = useMemo(() => {
    const m = new Map<string, CalendarItem[]>();
    const push = (key: string, item: CalendarItem) => {
      const arr = m.get(key) ?? [];
      arr.push(item);
      m.set(key, arr);
    };

    if (isStore) {
      orders
        .filter((o) => o.provider.id === businessId && o.status !== 'CANCELLED')
        .forEach((o) => {
          push(dateKey(new Date(o.createdAt)), {
            id: o.id,
            time: o.createdAt,
            title: o.user.fullName,
            subtitle: `${o.items.length} item${o.items.length === 1 ? '' : 's'}`,
            status: o.status,
          });
        });
    } else {
      bookings
        .filter((b) => b.status !== 'CANCELLED')
        .forEach((b) => {
          push(dateKey(new Date(b.startTime)), {
            id: b.id,
            time: b.startTime,
            endTime: b.endTime,
            title: b.user.fullName,
            subtitle: b.service.name,
            status: b.status,
          });
        });
    }

    m.forEach((arr) => arr.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()));
    return m;
  }, [isStore, orders, bookings, businessId]);

  const weekSummaries: WeekSummary[] = useMemo(
    () =>
      monthWeekDays.map((days) => ({
        key: dateKey(days[0]),
        start: days[0],
        end: days[6],
        days,
        count: days.reduce((sum, d) => sum + (itemsByKey.get(dateKey(d))?.length ?? 0), 0),
        inMonth: days.some((d) => d.getMonth() === monthCursor.getMonth() && d.getFullYear() === monthCursor.getFullYear()),
      })),
    [monthWeekDays, itemsByKey, monthCursor],
  );

  const monthLabel = useMemo(
    () => monthCursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    [monthCursor],
  );
  const weekLabel = useMemo(() => {
    const startFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });
    const endFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startFmt.format(weekDays[0])} – ${endFmt.format(weekDays[6])}`;
  }, [weekDays]);

  const goPrevMonth = useCallback(() => setMonthCursor((d) => addMonths(d, -1)), []);
  const goNextMonth = useCallback(() => setMonthCursor((d) => addMonths(d, 1)), []);
  const goThisMonth = useCallback(() => setMonthCursor(startOfMonth(today)), [today]);
  const isCurrentMonth = monthCursor.getTime() === startOfMonth(today).getTime();

  // Keep the same weekday selected (e.g. Thursday) when paging to another
  // week, instead of leaving `selectedKey` pointing at a date that's no
  // longer in view.
  const shiftWeek = useCallback(
    (deltaDays: number) => {
      setWeekStart((d) => {
        const selected = new Date(`${selectedKey}T00:00:00`);
        const offset = Math.round((selected.getTime() - d.getTime()) / DAY_MS);
        const next = addDays(d, deltaDays);
        setSelectedKey(dateKey(addDays(next, Math.min(Math.max(offset, 0), 6))));
        return next;
      });
    },
    [selectedKey],
  );
  const goPrevWeek = useCallback(() => shiftWeek(-7), [shiftWeek]);
  const goNextWeek = useCallback(() => shiftWeek(7), [shiftWeek]);
  const isCurrentWeek = weekStart.getTime() === startOfWeek(today).getTime();

  const selectWeek = useCallback((start: Date) => {
    setWeekStart(start);
    setSelectedKey(dateKey(start));
    setView('week');
  }, []);

  const effectiveFor = useCallback(
    (key: string): DayForm => {
      const override = overrideByKey.get(key);
      if (override) {
        return { isOpen: override.isOpen, openTime: override.openTime, closeTime: override.closeTime };
      }
      const dayOfWeek = new Date(`${key}T00:00:00`).getDay();
      const weekly = business?.businessHours.find((h) => h.dayOfWeek === dayOfWeek);
      if (weekly) {
        return { isOpen: weekly.isOpen, openTime: weekly.openTime, closeTime: weekly.closeTime };
      }
      return { isOpen: false, openTime: '09:00', closeTime: '18:00' };
    },
    [overrideByKey, business],
  );

  // Re-sync the form whenever the selected date (or the data behind it) changes.
  useEffect(() => {
    setForm(effectiveFor(selectedKey));
    setError(null);
  }, [selectedKey, effectiveFor]);

  const selectDay = useCallback((key: string) => setSelectedKey(key), []);

  const save = useCallback(async () => {
    setError(null);
    if (form.isOpen && form.closeTime <= form.openTime) {
      setError('Closing time must be after opening time.');
      return;
    }
    try {
      await setDateHour({ id: businessId, data: { date: selectedKey, ...form } }).unwrap();
    } catch {
      setError('Could not save this date. Please try again.');
    }
  }, [businessId, selectedKey, form, setDateHour]);

  const resetToWeekly = useCallback(async () => {
    try {
      await deleteDateHour({ id: businessId, date: selectedKey }).unwrap();
    } catch {
      setError('Could not reset this date. Please try again.');
    }
  }, [businessId, selectedKey, deleteDateHour]);

  return {
    view,
    setView,
    itemLabel: isStore ? ('order' as const) : ('booking' as const),

    // Month view
    monthLabel,
    isCurrentMonth,
    goPrevMonth,
    goNextMonth,
    goThisMonth,
    weekSummaries,
    selectWeek,

    // Week view
    weekLabel,
    isCurrentWeek,
    goPrevWeek,
    goNextWeek,
    weekDays,
    dateKey,
    selectedKey,
    selectDay,
    hasOverrideFor: (key: string) => overrideByKey.has(key),
    hasOverride,
    items: itemsByKey.get(selectedKey) ?? [],

    // Hours editor (either view can have a day selected)
    form,
    setForm,
    saving,
    deleting,
    error,
    save,
    resetToWeekly,
  };
}
