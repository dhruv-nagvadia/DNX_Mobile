export const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
export const MINUTES_5 = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,...,55
export const MERIDIEMS = ['am', 'pm'] as const;

/** "HH:MM" (24h) → { hour12, minute, meridiem }. */
export function parse24(value: string) {
  const [h, m] = value.split(':').map((n) => parseInt(n, 10));
  const hour = Number.isFinite(h) ? h : 9;
  const minute = Number.isFinite(m) ? m : 0;
  const meridiem: 'am' | 'pm' = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  // Snap to the nearest 5-minute step so the picker always has a selected row.
  const roundedMinute = Math.round(minute / 5) * 5;
  return { hour12, minute: roundedMinute >= 60 ? 0 : roundedMinute, meridiem };
}

/** { hour12, minute, meridiem } → "HH:MM" (24h). */
export function to24(hour12: number, minute: number, meridiem: 'am' | 'pm'): string {
  let hour = hour12 % 12;
  if (meridiem === 'pm') hour += 12;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** "HH:MM" (24h) → "9:00 am" for display. */
export function formatDisplay(value: string): string {
  const { hour12, minute, meridiem } = parse24(value);
  return `${hour12}:${String(minute).padStart(2, '0')} ${meridiem}`;
}
