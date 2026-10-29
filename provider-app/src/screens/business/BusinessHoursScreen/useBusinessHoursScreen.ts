import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetMyBusinessQuery, useSetBusinessHoursMutation } from '@/redux/api/business/businessApi';
import { BusinessHour } from '@/redux/api/business/types';

import { BusinessHoursRouteProp } from './types';

const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '18:00';

function normalize(hours: BusinessHour[] | undefined): BusinessHour[] {
  return Array.from({ length: 7 }, (_, dayOfWeek) => {
    const existing = hours?.find((h) => h.dayOfWeek === dayOfWeek);
    if (existing) return existing;
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

/** Ports `frontend/src/components/BusinessHours/useBusinessHours.ts` 1:1. */
export function useBusinessHoursScreen() {
  const route = useRoute<BusinessHoursRouteProp>();
  const navigation = useNavigation();
  const { businessId } = route.params;

  const { data: business, isLoading } = useGetMyBusinessQuery(businessId);
  const [setBusinessHours, { isLoading: saving }] = useSetBusinessHoursMutation();

  const [days, setDays] = useState<BusinessHour[]>([]);
  const [baseline, setBaseline] = useState<string>('');
  const [hasBreak, setHasBreak] = useState(false);
  const [breakStart, setBreakStart] = useState('13:00');
  const [breakEnd, setBreakEnd] = useState('14:00');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!business) return;
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

  const dirty = useMemo(() => JSON.stringify(days) !== baseline, [days, baseline]);

  const save = useCallback(async () => {
    setError(null);

    for (const d of days) {
      if (d.isOpen && d.closeTime <= d.openTime) {
        setError(`${d.dayOfWeek === 0 ? 'Sunday' : 'That day'}'s closing time must be after opening time.`);
        return;
      }
    }
    if (hasBreak && breakEnd <= breakStart) {
      setError('Break end time must be after break start time.');
      return;
    }

    const withBreak = days.map((d) => {
      if (!d.isOpen) return { ...d, breakStart: null, breakEnd: null };
      const fits = hasBreak && breakStart >= d.openTime && breakEnd <= d.closeTime;
      return { ...d, breakStart: fits ? breakStart : null, breakEnd: fits ? breakEnd : null };
    });

    try {
      await setBusinessHours({ id: businessId, hours: withBreak }).unwrap();
      setDays(withBreak);
      setBaseline(JSON.stringify(withBreak));
      navigation.goBack();
    } catch {
      setError('Could not save your hours. Please try again.');
    }
  }, [days, hasBreak, breakStart, breakEnd, businessId, setBusinessHours, navigation]);

  return {
    isLoading,
    saving,
    days,
    toggleDay,
    setTime,
    hasBreak,
    toggleBreak,
    breakStart,
    setBreakStart,
    breakEnd,
    setBreakEnd,
    dirty,
    error,
    save,
  };
}
