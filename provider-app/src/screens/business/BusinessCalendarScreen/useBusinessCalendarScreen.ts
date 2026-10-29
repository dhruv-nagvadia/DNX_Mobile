import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import {
  useDeleteDateHourMutation,
  useGetDateHoursQuery,
  useGetMyBusinessQuery,
  useSetDateHourMutation,
} from '@/redux/api/business/businessApi';

import { BusinessCalendarRouteProp, DayForm } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" in local time — avoids the UTC-shift bug of toISOString(). */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Ports `frontend/src/components/BusinessCalendar/useBusinessCalendar.ts`'s
 * effective-hours resolution + save/reset flow (the web's month/week grid is
 * a separate, DOM-specific layout concern — this uses a 14-day chip strip
 * instead). */
export function useBusinessCalendarScreen() {
  const route = useRoute<BusinessCalendarRouteProp>();
  const { businessId } = route.params;

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => new Date(Date.now() + i * DAY_MS)), []);
  const from = dateKey(days[0]);
  const to = dateKey(days[days.length - 1]);

  const { data: business } = useGetMyBusinessQuery(businessId);
  const { data: overrides = [] } = useGetDateHoursQuery({ id: businessId, from, to });
  const [setDateHour, { isLoading: saving }] = useSetDateHourMutation();
  const [deleteDateHour, { isLoading: deleting }] = useDeleteDateHourMutation();

  const [selectedKey, setSelectedKey] = useState(dateKey(days[0]));
  const [form, setForm] = useState<DayForm>({ isOpen: true, openTime: '09:00', closeTime: '18:00' });
  const [error, setError] = useState<string | null>(null);

  const overrideByKey = useMemo(() => new Map(overrides.map((o) => [o.date.slice(0, 10), o])), [overrides]);
  const hasOverride = overrideByKey.has(selectedKey);

  const effectiveFor = useCallback(
    (key: string): DayForm => {
      const override = overrideByKey.get(key);
      if (override) return { isOpen: override.isOpen, openTime: override.openTime, closeTime: override.closeTime };
      const dayOfWeek = new Date(`${key}T00:00:00`).getDay();
      const weekly = business?.businessHours.find((h) => h.dayOfWeek === dayOfWeek);
      if (weekly) return { isOpen: weekly.isOpen, openTime: weekly.openTime, closeTime: weekly.closeTime };
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
    days,
    dateKey,
    selectedKey,
    selectDay,
    hasOverrideFor: (key: string) => overrideByKey.has(key),
    hasOverride,
    form,
    setForm,
    saving,
    deleting,
    error,
    save,
    resetToWeekly,
  };
}
