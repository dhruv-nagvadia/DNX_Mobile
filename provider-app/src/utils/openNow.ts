import { BusinessHour } from '@/redux/api/business/types';

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

/**
 * Whether a business is open right now from its weekly hours (device time).
 * Returns null when hours weren't sent, so callers can hide the badge
 * instead of wrongly saying "Closed".
 */
export function isOpenNow(
  hours: BusinessHour[] | undefined | null,
  now = new Date(),
): boolean | null {
  if (!hours || hours.length === 0) {
    return null;
  }
  const today = hours.find((h) => h.dayOfWeek === now.getDay());
  if (!today || !today.isOpen) {
    return false;
  }
  const t = now.getHours() * 60 + now.getMinutes();
  if (t < toMin(today.openTime) || t >= toMin(today.closeTime)) {
    return false;
  }
  if (
    today.breakStart &&
    today.breakEnd &&
    t >= toMin(today.breakStart) &&
    t < toMin(today.breakEnd)
  ) {
    return false;
  }
  return true;
}

/** "13:30" → "1:30 PM", "10:00" → "10 AM". */
export function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
}

/** Today's opening hours, e.g. "10 AM – 9 PM" (null when closed today or unknown). */
export function todayHours(
  hours: BusinessHour[] | undefined | null,
  now = new Date(),
): string | null {
  const today = hours?.find((h) => h.dayOfWeek === now.getDay());
  return today?.isOpen ? `${formatHour(today.openTime)} – ${formatHour(today.closeTime)}` : null;
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * When a closed business next opens: "Opens 10 AM" (later today), "Opens
 * tomorrow 10 AM", or "Opens Mon 10 AM". Null when it never opens / unknown.
 */
export function nextOpening(
  hours: BusinessHour[] | undefined | null,
  now = new Date(),
): string | null {
  if (!hours?.length) {
    return null;
  }
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (let offset = 0; offset < 7; offset++) {
    const dow = (now.getDay() + offset) % 7;
    const day = hours.find((h) => h.dayOfWeek === dow);
    if (!day?.isOpen) {
      continue;
    }
    if (offset === 0) {
      // Still to open today, or reopening after the midday break.
      if (minutes < toMin(day.openTime)) {
        return `Opens ${formatHour(day.openTime)}`;
      }
      if (
        day.breakStart &&
        day.breakEnd &&
        minutes >= toMin(day.breakStart) &&
        minutes < toMin(day.breakEnd)
      ) {
        return `Opens ${formatHour(day.breakEnd)}`;
      }
      continue;
    }
    return `Opens ${offset === 1 ? 'tomorrow' : DAY_SHORT[dow]} ${formatHour(day.openTime)}`;
  }
  return null;
}
