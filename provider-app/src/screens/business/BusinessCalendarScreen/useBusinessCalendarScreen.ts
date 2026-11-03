import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  useDeleteDateHourMutation,
  useGetBusinessBookingsQuery,
  useGetDateHoursQuery,
  useGetMyBusinessQuery,
  useGetMyOrdersQuery,
  useSetDateHourMutation,
} from '@/redux/api/business/businessApi';
import { ROUTES, RootStackParamList } from '@/navigation/routes';

import {
  BusinessCalendarRouteProp,
  CalendarItem,
  CalendarView,
  DayForm,
  DayInfo,
  HoursSource,
  WeekSummary,
} from './types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BusinessCalendarScreen'>;

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
 * resolution + save/reset flow). Either view shows the selected day's hours
 * editor and that day's bookings (services) / orders (stores) below the grid.
 * All values come from the business, date-hours, bookings and orders queries.
 */
export function useBusinessCalendarScreen() {
  const route = useRoute<BusinessCalendarRouteProp>();
  const navigation = useNavigation<Nav>();
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
          const first = o.items[0]?.name;
          const more = o.items.length - 1;
          push(dateKey(new Date(o.createdAt)), {
            id: o.id,
            time: o.createdAt,
            title: o.user.fullName,
            subtitle: first
              ? `${first}${more > 0 ? ` +${more} more` : ''}`
              : `${o.items.length} item${o.items.length === 1 ? '' : 's'}`,
            amountMinor: o.amountMinor,
            currency: o.currency,
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
            amountMinor: b.amountMinor,
            currency: b.currency,
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
    () => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(monthCursor),
    [monthCursor],
  );

  // Header count — the month on screen (month view) or the selected day's
  // month (week view). Cancelled items are already excluded above.
  const visibleMonth = view === 'month' ? monthCursor : startOfMonth(new Date(`${selectedKey}T00:00:00`));
  const visibleMonthPrefix = dateKey(visibleMonth).slice(0, 7);
  const monthCount = useMemo(() => {
    let n = 0;
    itemsByKey.forEach((arr, key) => {
      if (key.startsWith(visibleMonthPrefix)) {
        n += arr.length;
      }
    });
    return n;
  }, [itemsByKey, visibleMonthPrefix]);
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

  // Month-grid tap → jump to that day's week, keeping the tapped day selected.
  const openDay = useCallback((key: string) => {
    const day = new Date(`${key}T00:00:00`);
    setWeekStart(startOfWeek(day));
    setSelectedKey(key);
    setView('week');
  }, []);

  const goThisWeek = useCallback(() => {
    setWeekStart(startOfWeek(today));
    setSelectedKey(dateKey(today));
  }, [today]);

  // Jump both views (and the selection) back to today.
  const goToday = useCallback(() => {
    setMonthCursor(startOfMonth(today));
    setWeekStart(startOfWeek(today));
    setSelectedKey(dateKey(today));
  }, [today]);

  const countFor = useCallback((key: string) => itemsByKey.get(key)?.length ?? 0, [itemsByKey]);
  const isInMonth = useCallback(
    (d: Date) => d.getMonth() === monthCursor.getMonth() && d.getFullYear() === monthCursor.getFullYear(),
    [monthCursor],
  );

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

  const dayInfo = useCallback(
    (key: string): DayInfo => {
      const items = itemsByKey.get(key) ?? [];
      const override = overrideByKey.get(key);
      let closedWeekly = false;
      if (!override && business) {
        const dayOfWeek = new Date(`${key}T00:00:00`).getDay();
        const weekly = business.businessHours.find((h) => h.dayOfWeek === dayOfWeek);
        closedWeekly = !weekly || !weekly.isOpen;
      }
      return {
        count: items.length,
        hasPending: items.some((i) => i.status === 'PENDING'),
        hasConfirmed: items.some((i) => i.status === 'CONFIRMED'),
        hasCompleted: items.some((i) => i.status === 'COMPLETED' || i.status === 'READY'),
        closedWeekly,
        closedOverride: !!override && !override.isOpen,
        customOpen: !!override && override.isOpen,
      };
    },
    [itemsByKey, overrideByKey, business],
  );

  const selectedOverride = overrideByKey.get(selectedKey);
  const hoursSource: HoursSource = !selectedOverride
    ? 'weekly'
    : selectedOverride.isOpen
      ? 'custom'
      : 'closedOverride';

  const selectedItems = useMemo(() => itemsByKey.get(selectedKey) ?? [], [itemsByKey, selectedKey]);
  const selectedTotalMinor = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.amountMinor, 0),
    [selectedItems],
  );
  const selectedCurrency = selectedItems[0]?.currency ?? 'INR';

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const viewAll = useCallback(
    () => navigation.navigate(ROUTES.BOOKINGS_ORDERS, { businessId, tab: isStore ? 'orders' : 'bookings' }),
    [navigation, businessId, isStore],
  );
  const openItem = useCallback(
    (id: string) =>
      isStore
        ? navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: id })
        : navigation.navigate(ROUTES.BOOKING_DETAIL, { bookingId: id }),
    [navigation, isStore],
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
    businessName: business?.businessName ?? '',
    monthCount,
    goToday,
    goBack,
    viewAll,
    openItem,
    dayInfo,

    // Month view
    monthLabel,
    isCurrentMonth,
    goPrevMonth,
    goNextMonth,
    goThisMonth,
    weekSummaries,
    selectWeek,
    openDay,
    countFor,
    isInMonth,
    todayKey: dateKey(today),

    // Week view
    weekLabel,
    isCurrentWeek,
    goPrevWeek,
    goNextWeek,
    goThisWeek,
    weekDays,
    dateKey,
    selectedKey,
    selectDay,
    hasOverrideFor: (key: string) => overrideByKey.has(key),
    hasOverride,
    items: selectedItems,
    selectedTotalMinor,
    selectedCurrency,
    hoursSource,

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
