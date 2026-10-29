export type ReminderKind = 'insurance' | 'passport' | 'vehicle' | 'appliance';

export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  kind: ReminderKind;
}

/** Static placeholder reminders — swap for a real API query later. */
export const REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Car insurance', subtitle: 'Renews in 12 days', kind: 'insurance' },
  { id: 'r2', title: 'Passport', subtitle: 'Expires in 3 months', kind: 'passport' },
  { id: 'r3', title: 'Bike service', subtitle: 'Due next week', kind: 'vehicle' },
  { id: 'r4', title: 'Fridge warranty', subtitle: 'Ends in 30 days', kind: 'appliance' },
];
