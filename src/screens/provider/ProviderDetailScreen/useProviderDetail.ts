import { useState, useMemo, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetProviderByIdQuery } from '@/redux/api/provider/providerApi';
import { useCreateBookingMutation, useGetBookedSlotsQuery } from '@/redux/api/booking/bookingApi';
import { ROUTES } from '@/navigation/routes';
import { ProviderDetailNavigationProp, ProviderDetailRouteProp } from './types';

const SLOT_STEP_MIN = 30;

/** A busy interval, in epoch milliseconds. */
type Interval = { start: number; end: number };

/** Builds the selectable day list (today + next 6 days). */
function buildDays(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

/**
 * Generates bookable 30-min start times within a day's open hours.
 *
 * A slot is only offered when the chosen service fits entirely before closing
 * AND its full interval [start, start + duration) doesn't overlap any existing
 * booking. So booking a 2h service blocks the two hours behind it, not just the
 * exact start minute.
 */
function buildSlots(
  hours: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }[],
  day: Date,
  booked: Interval[],
  durationMin: number,
): Date[] {
  const config = hours.find((h) => h.dayOfWeek === day.getDay() && h.isOpen);
  if (!config) return [];

  const [oh, om] = config.openTime.split(':').map(Number);
  const [ch, cm] = config.closeTime.split(':').map(Number);

  const cursor = new Date(day);
  cursor.setHours(oh, om, 0, 0);
  const close = new Date(day);
  close.setHours(ch, cm, 0, 0);

  const now = Date.now();
  const durationMs = durationMin * 60_000;
  const slots: Date[] = [];

  while (cursor < close) {
    const start = cursor.getTime();
    const end = start + durationMs;

    // Must finish before closing.
    if (end <= close.getTime()) {
      // Must be in the future and not overlap an existing booking.
      const overlaps = booked.some((b) => start < b.end && end > b.start);
      if (start > now && !overlaps) slots.push(new Date(cursor));
    }

    cursor.setMinutes(cursor.getMinutes() + SLOT_STEP_MIN);
  }
  return slots;
}

export function useProviderDetail() {
  const navigation = useNavigation<ProviderDetailNavigationProp>();
  const { params } = useRoute<ProviderDetailRouteProp>();

  const { data: provider, isLoading } = useGetProviderByIdQuery(params.providerId);
  const { data: bookedSlots } = useGetBookedSlotsQuery(params.providerId);
  const [createBooking, { isLoading: booking }] = useCreateBookingMutation();

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const days = useMemo(buildDays, []);

  const services = provider?.services ?? [];
  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;
  // Until a service is picked we filter by one step, so slot starts still
  // respect existing bookings; once picked we use the real duration.
  const durationMin = selectedService?.durationMin ?? SLOT_STEP_MIN;

  const bookedIntervals = useMemo<Interval[]>(
    () =>
      (bookedSlots ?? []).map((b) => ({
        start: new Date(b.startTime).getTime(),
        end: new Date(b.endTime).getTime(),
      })),
    [bookedSlots],
  );

  const slots = useMemo(
    () =>
      provider
        ? buildSlots(provider.businessHours, days[dayIndex], bookedIntervals, durationMin)
        : [],
    [provider, days, dayIndex, bookedIntervals, durationMin],
  );

  // Whether the business is open on the selected day (drives the empty message:
  // "closed" vs "fully booked").
  const dayOpen = useMemo(() => {
    if (!provider) return false;
    const day = days[dayIndex].getDay();
    return provider.businessHours.some((h) => h.dayOfWeek === day && h.isOpen);
  }, [provider, days, dayIndex]);

  // Drop a chosen slot that's no longer offered (day/service change, or someone
  // else just booked it).
  useEffect(() => {
    if (selectedSlot && !slots.some((s) => s.toISOString() === selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [slots, selectedSlot]);

  const openGallery = useCallback(
    (index: number) => {
      if (provider) navigation.navigate(ROUTES.GALLERY, { images: provider.images, index });
    },
    [provider, navigation],
  );

  const selectService = useCallback((id: string) => setSelectedServiceId(id), []);
  const selectDay = useCallback((i: number) => {
    setDayIndex(i);
    setSelectedSlot(null); // slots differ per day
  }, []);
  const selectSlot = useCallback((iso: string) => setSelectedSlot(iso), []);

  const canBook = !!selectedServiceId && !!selectedSlot && !booking;

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
      await createBooking({
        providerId: provider.id,
        serviceId: selectedServiceId,
        startTime: selectedSlot,
      }).unwrap();
      Alert.alert('Booking confirmed', 'You can see it under “Your bookings”.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      Alert.alert(
        'Could not book',
        status === 409
          ? 'That slot was just taken. Please pick another time.'
          : 'Something went wrong. Please try again.',
      );
    }
  }, [provider, selectedServiceId, selectedSlot, createBooking, navigation]);

  return {
    provider,
    isLoading,
    openGallery,
    services,
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
    booking,
    onBook,
  };
}
