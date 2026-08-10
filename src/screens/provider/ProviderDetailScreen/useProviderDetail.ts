import { useState, useMemo, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useGetProviderByIdQuery,
  useGetProviderReviewsQuery,
} from '@/redux/api/provider/providerApi';
import { BusinessHour, DateHour } from '@/redux/api/provider/types';
import {
  useCreateBookingMutation,
  useGetBookedSlotsQuery,
  useRescheduleBookingMutation,
} from '@/redux/api/booking/bookingApi';
import { addRecentlyViewed } from '@/utils/recentlyViewed';
import { ROUTES } from '@/navigation/routes';
import { ProviderDetailNavigationProp, ProviderDetailRouteProp } from './types';

const SLOT_STEP_MIN = 30;

/** A busy interval, in epoch milliseconds. */
type Interval = { start: number; end: number };

/** Resolved open hours for a specific day (null = closed). */
type DayConfig = { openTime: string; closeTime: string } | null;

/** A selectable time slot and whether it's already taken. */
export interface SlotInfo {
  time: Date;
  booked: boolean;
}

/** Local YYYY-MM-DD (matches how the provider set date overrides). */
function ymdLocal(d: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Builds the selectable day list (today + next 6 days). */
function buildDays(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

/** Effective hours for a day: a date override wins over the weekly hours. */
function effectiveConfig(
  weekly: BusinessHour[],
  dateHours: DateHour[] | undefined,
  day: Date,
): DayConfig {
  const key = ymdLocal(day);
  const override = dateHours?.find((o) => o.date.slice(0, 10) === key);
  if (override) {
    return override.isOpen ? { openTime: override.openTime, closeTime: override.closeTime } : null;
  }
  const w = weekly.find((h) => h.dayOfWeek === day.getDay() && h.isOpen);
  return w ? { openTime: w.openTime, closeTime: w.closeTime } : null;
}

/**
 * Generates 30-min start times within a day's open hours where the chosen
 * service fits before closing. Each slot is flagged `booked` when its full
 * interval [start, start + duration) overlaps an existing booking.
 */
function buildSlots(config: DayConfig, day: Date, booked: Interval[], durationMin: number): SlotInfo[] {
  if (!config) return [];

  const [oh, om] = config.openTime.split(':').map(Number);
  const [ch, cm] = config.closeTime.split(':').map(Number);

  const cursor = new Date(day);
  cursor.setHours(oh, om, 0, 0);
  const close = new Date(day);
  close.setHours(ch, cm, 0, 0);

  const now = Date.now();
  const durationMs = durationMin * 60_000;
  const slots: SlotInfo[] = [];

  while (cursor < close) {
    const start = cursor.getTime();
    const end = start + durationMs;

    if (start > now && end <= close.getTime()) {
      const isBooked = booked.some((b) => start < b.end && end > b.start);
      slots.push({ time: new Date(cursor), booked: isBooked });
    }

    cursor.setMinutes(cursor.getMinutes() + SLOT_STEP_MIN);
  }
  return slots;
}

export function useProviderDetail() {
  const navigation = useNavigation<ProviderDetailNavigationProp>();
  const { params } = useRoute<ProviderDetailRouteProp>();

  const isReschedule = !!params.rescheduleBookingId;

  const { data: provider, isLoading } = useGetProviderByIdQuery(params.providerId);
  const { data: bookedSlots } = useGetBookedSlotsQuery(params.providerId);
  const { data: reviews = [] } = useGetProviderReviewsQuery(params.providerId);
  const [createBooking, { isLoading: booking }] = useCreateBookingMutation();
  const [reschedule, { isLoading: rescheduling }] = useRescheduleBookingMutation();

  // When rescheduling, the service is fixed to the original booking's service.
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    params.rescheduleServiceId ?? null,
  );
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const days = useMemo(buildDays, []);

  const services = provider?.services ?? [];
  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;
  const durationMin = selectedService?.durationMin ?? SLOT_STEP_MIN;

  const bookedIntervals = useMemo<Interval[]>(
    () =>
      (bookedSlots ?? []).map((b) => ({
        start: new Date(b.startTime).getTime(),
        end: new Date(b.endTime).getTime(),
      })),
    [bookedSlots],
  );

  const dayConfig = useMemo<DayConfig>(
    () => (provider ? effectiveConfig(provider.businessHours, provider.dateHours, days[dayIndex]) : null),
    [provider, days, dayIndex],
  );

  const slots = useMemo(
    () => buildSlots(dayConfig, days[dayIndex], bookedIntervals, durationMin),
    [dayConfig, days, dayIndex, bookedIntervals, durationMin],
  );

  const dayOpen = dayConfig !== null;

  const submitting = booking || rescheduling;

  // Drop a chosen slot that's no longer available (day/service change, or
  // someone else just booked it).
  useEffect(() => {
    if (selectedSlot && !slots.some((s) => !s.booked && s.time.toISOString() === selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [slots, selectedSlot]);

  // Remember this business for the Home "Recently viewed" row.
  useEffect(() => {
    if (provider && !isReschedule) {
      addRecentlyViewed({
        id: provider.id,
        name: provider.businessName,
        type: provider.subcategory?.name ?? provider.category.name,
        categorySlug: provider.category.slug,
        rating: provider.ratingAvg,
      });
    }
  }, [provider, isReschedule]);

  const openGallery = useCallback(
    (index: number) => {
      if (provider) navigation.navigate(ROUTES.GALLERY, { images: provider.images, index });
    },
    [provider, navigation],
  );

  const onViewAllReviews = useCallback(() => {
    if (provider) {
      navigation.navigate(ROUTES.REVIEWS, {
        providerId: provider.id,
        businessName: provider.businessName,
      });
    }
  }, [provider, navigation]);

  const selectService = useCallback((id: string) => setSelectedServiceId(id), []);
  const selectDay = useCallback((i: number) => {
    setDayIndex(i);
    setSelectedSlot(null); // slots differ per day
  }, []);
  const selectSlot = useCallback((iso: string) => setSelectedSlot(iso), []);

  const canBook = !!selectedServiceId && !!selectedSlot && !submitting;

  const onBook = useCallback(async () => {
    if (!provider) return;
    if (!selectedServiceId) {
      Alert.alert('Select a service', 'Choose a service before picking a time.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Pick a time', 'Choose an available time slot to continue.');
      return;
    }
    try {
      if (isReschedule && params.rescheduleBookingId) {
        await reschedule({
          id: params.rescheduleBookingId,
          providerId: provider.id,
          startTime: selectedSlot,
        }).unwrap();
        Alert.alert('Booking rescheduled', 'Your new time is saved.', [
          { text: 'Done', onPress: () => navigation.goBack() },
        ]);
      } else {
        await createBooking({
          providerId: provider.id,
          serviceId: selectedServiceId,
          startTime: selectedSlot,
        }).unwrap();
        Alert.alert('Booking confirmed', 'You can see it under “Your bookings”.', [
          { text: 'Done', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      const status = (err as { status?: number })?.status;
      Alert.alert(
        isReschedule ? 'Could not reschedule' : 'Could not book',
        status === 409
          ? 'That slot was just taken. Please pick another time.'
          : 'Something went wrong. Please try again.',
      );
    }
  }, [
    provider,
    selectedServiceId,
    selectedSlot,
    isReschedule,
    params.rescheduleBookingId,
    reschedule,
    createBooking,
    navigation,
  ]);

  const headerTitle = isReschedule
    ? 'Reschedule'
    : provider?.businessName ?? params.name ?? 'Business';

  return {
    provider,
    isLoading,
    isReschedule,
    headerTitle,
    reviews,
    onViewAllReviews,
    openGallery,
    services,
    selectedService,
    selectedServiceId,
    selectService,
    days,
    dayIndex,
    selectDay,
    slots,
    dayOpen,
    selectedSlot,
    selectSlot,
    canBook,
    booking: submitting,
    onBook,
  };
}
