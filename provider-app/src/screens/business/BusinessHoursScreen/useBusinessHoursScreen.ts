import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useGetDateHoursQuery,
  useGetMyBusinessQuery,
  useSetBusinessHoursMutation,
} from '@/redux/api/business/businessApi';
import { BusinessHour, DateHour } from '@/redux/api/business/types';
import { ROUTES } from '@/navigation/routes';
import { formatDisplay } from '@/components/TimeField/utils';

import {
  BusinessHoursNavigationProp,
  BusinessHoursRouteProp,
  DAY_LABELS,
  OpenNowStatus,
  SHORT_DAY_LABELS,
} from './types';

const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '18:00';
const MINUTE_MS = 60 * 1000;

function normalize(hours: BusinessHour[] | undefined): BusinessHour[] {
  return Array.from({ length: 7 }, (_, dayOfWeek) => {
    const existing = hours?.find((h) => h.dayOfWeek === dayOfWeek);
    if (existing) {return existing;}
    // Mon(1)-Sat(6) default open; Sun(0) defaults closed — mirrors the web form's defaults.
    return {
      dayOfWeek,
      isOpen: dayOfWeek !== 0,
      openTime: DEFAULT_OPEN,
      closeTime: DEFAULT_CLOSE,
      breakStart: null,
      breakEnd: null,
    };
  });
}

/** "HH:MM" → minutes since midnight. */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map((n) => parseInt(n, 10));
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}

/** 630 → "10h 30m", 600 → "10h", 30 → "30m". */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) {
    return `${m}m`;
  }
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** "20:00" → "8:00 PM" (the tile's compact format). */
function formatShort(value: string): string {
  return formatDisplay(value).toUpperCase();
}

/** "YYYY-MM-DD" in local time — avoids the UTC-shift bug of toISOString(). */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Open / closed / on-break right now, from the SAVED weekly hours plus today's
 * date override (if any). Later days use the weekly hours only — only today's
 * override is fetched.
 */
function computeOpenNow(
  saved: BusinessHour[] | undefined,
  todayOverride: DateHour | undefined,
  now: Date,
): OpenNowStatus | null {
  const weekly = new Map((saved ?? []).map((h) => [h.dayOfWeek, h]));
  const today = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const todayHours = todayOverride
    ? { isOpen: todayOverride.isOpen, openTime: todayOverride.openTime, closeTime: todayOverride.closeTime }
    : weekly.get(today);

  if (!todayOverride && weekly.size === 0) {
    return null;
  }

  if (todayHours?.isOpen) {
    const open = toMinutes(todayHours.openTime);
    const close = toMinutes(todayHours.closeTime);
    if (nowMin >= open && nowMin < close) {
      const weeklyToday = todayOverride ? undefined : weekly.get(today);
      if (weeklyToday?.breakStart && weeklyToday.breakEnd) {
        const bs = toMinutes(weeklyToday.breakStart);
        const be = toMinutes(weeklyToday.breakEnd);
        if (nowMin >= bs && nowMin < be) {
          return { state: 'break', label: 'On break', detail: `back ${formatShort(weeklyToday.breakEnd)}` };
        }
      }
      return { state: 'open', label: 'Open', detail: `till ${formatShort(todayHours.closeTime)}` };
    }
    if (nowMin < open) {
      return { state: 'closed', label: 'Closed', detail: `opens Today ${formatShort(todayHours.openTime)}` };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const dow = (today + offset) % 7;
    const h = weekly.get(dow);
    if (h?.isOpen) {
      return { state: 'closed', label: 'Closed', detail: `opens ${SHORT_DAY_LABELS[dow]} ${formatShort(h.openTime)}` };
    }
  }
  return { state: 'closed', label: 'Closed', detail: null };
}

/** Ports `frontend/src/components/BusinessHours/useBusinessHours.ts` 1:1. */
export function useBusinessHoursScreen() {
  const route = useRoute<BusinessHoursRouteProp>();
  const navigation = useNavigation<BusinessHoursNavigationProp>();
  const { businessId } = route.params;

  const { data: business, isLoading } = useGetMyBusinessQuery(businessId);
  const [setBusinessHours, { isLoading: saving }] = useSetBusinessHoursMutation();

  // Current local time, ticking every minute so "Open now" / "Today" stay right.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), MINUTE_MS);
    return () => clearInterval(timer);
  }, []);
  const todayKey = dateKey(now);
  const todayDow = now.getDay();

  const { data: todayOverrides } = useGetDateHoursQuery({ id: businessId, from: todayKey, to: todayKey });

  const [days, setDays] = useState<BusinessHour[]>([]);
  const [baseline, setBaseline] = useState<string>('');
  const [hasBreak, setHasBreak] = useState(false);
  const [breakStart, setBreakStart] = useState('13:00');
  const [breakEnd, setBreakEnd] = useState('14:00');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!business) {
      return;
    }
    const normalized = normalize(business.businessHours);
    setDays(normalized);
    setBaseline(JSON.stringify(normalized));

    const withBreak = normalized.find((d) => d.breakStart && d.breakEnd);
    if (withBreak?.breakStart && withBreak?.breakEnd) {
      setHasBreak(true);
      setBreakStart(withBreak.breakStart);
      setBreakEnd(withBreak.breakEnd);
    }
  }, [business]);

  const toggleDay = useCallback((dayOfWeek: number) => {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, isOpen: !d.isOpen } : d)));
  }, []);

  const setTime = useCallback((dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) => {
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d)));
  }, []);

  const toggleBreak = useCallback(() => {
    setHasBreak((prev) => !prev);
  }, []);

  /** Copies Monday's open flag + times onto Tue–Sun (form state only). */
  const copyMondayToAll = useCallback(() => {
    setDays((prev) => {
      const monday = prev.find((d) => d.dayOfWeek === 1);
      if (!monday) {
        return prev;
      }
      return prev.map((d) =>
        d.dayOfWeek === 1
          ? d
          : { ...d, isOpen: monday.isOpen, openTime: monday.openTime, closeTime: monday.closeTime },
      );
    });
  }, []);

  // What would actually be saved: each open day gets the daily break if it
  // fits inside that day's hours. Comparing THIS (not just `days`) against
  // the loaded hours means a break-only change also enables Save.
  const payload = useMemo(
    () =>
      days.map((d) => {
        if (!d.isOpen) {
          return { ...d, breakStart: null, breakEnd: null };
        }
        const fits = hasBreak && breakStart >= d.openTime && breakEnd <= d.closeTime;
        return { ...d, breakStart: fits ? breakStart : null, breakEnd: fits ? breakEnd : null };
      }),
    [days, hasBreak, breakStart, breakEnd],
  );

  const dirty = useMemo(() => JSON.stringify(payload) !== baseline, [payload, baseline]);

  // ── Summary tiles ────────────────────────────────────────────────────────
  const openDaysCount = useMemo(() => days.filter((d) => d.isOpen).length, [days]);

  /** Sum over open days of (close − open), minus the break where it fits — from the edited values. */
  const weeklyMinutes = useMemo(
    () =>
      payload.reduce((sum, d) => {
        if (!d.isOpen) {
          return sum;
        }
        const span = toMinutes(d.closeTime) - toMinutes(d.openTime);
        if (span <= 0) {
          return sum;
        }
        const brk = d.breakStart && d.breakEnd ? Math.max(0, toMinutes(d.breakEnd) - toMinutes(d.breakStart)) : 0;
        return sum + Math.max(0, span - brk);
      }, 0),
    [payload],
  );

  const todayOverride = useMemo(
    () => todayOverrides?.find((o) => o.date.slice(0, 10) === todayKey),
    [todayOverrides, todayKey],
  );

  const openNow = useMemo(
    () => (business ? computeOpenNow(business.businessHours, todayOverride, now) : null),
    [business, todayOverride, now],
  );

  const save = useCallback(async () => {
    setError(null);

    for (const d of days) {
      if (d.isOpen && d.closeTime <= d.openTime) {
        setError(`${DAY_LABELS[d.dayOfWeek]}'s closing time must be after opening time.`);
        return;
      }
    }
    if (hasBreak && breakEnd <= breakStart) {
      setError('Break end time must be after break start time.');
      return;
    }

    const withBreak = payload;

    try {
      await setBusinessHours({ id: businessId, hours: withBreak }).unwrap();
      setDays(withBreak);
      setBaseline(JSON.stringify(withBreak));
      navigation.goBack();
    } catch {
      setError('Could not save your hours. Please try again.');
    }
  }, [days, payload, hasBreak, breakStart, breakEnd, businessId, setBusinessHours, navigation]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const goToCalendar = useCallback(
    () => navigation.navigate(ROUTES.BUSINESS_CALENDAR, { businessId }),
    [navigation, businessId],
  );

  return {
    isLoading,
    saving,
    businessName: business?.businessName ?? '',
    todayDow,
    days,
    toggleDay,
    setTime,
    copyMondayToAll,
    hasBreak,
    toggleBreak,
    breakStart,
    setBreakStart,
    breakEnd,
    setBreakEnd,
    openDaysCount,
    weeklyMinutes,
    openNow,
    dirty,
    error,
    save,
    goBack,
    goToCalendar,
  };
}
