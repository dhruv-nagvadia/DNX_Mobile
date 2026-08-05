import { Slide } from './types';

/** The three things worth saying before someone signs up. */
export const SLIDES: Slide[] = [
  {
    key: 'categories',
    title: 'Every service in your life,',
    accentTail: 'in one app.',
    body: 'Dentists, salons, gyms, tutors, plumbers — book any appointment-based service without hunting through five different apps.',
  },
  {
    key: 'assistant',
    title: 'Just ask, and',
    accentTail: 'it’s handled.',
    body: 'Say what you need in plain words. DNX finds the provider, checks availability, books the slot and pays.',
  },
  {
    key: 'organised',
    title: 'Nothing',
    accentTail: 'slips again.',
    body: 'Invoices, prescriptions and renewals stay organised — with reminders before anything lapses.',
  },
];

/** Categories shown on the first slide. `tint` indexes the palette in styles.ts. */
export const CATEGORIES = [
  { name: 'Dentist', tint: 0 },
  { name: 'Salon', tint: 1 },
  { name: 'Gym', tint: 2 },
  { name: 'Tutor', tint: 3 },
  { name: 'Plumber', tint: 4 },
  { name: 'Cleaning', tint: 5 },
];

/** Tiles shown on the third slide. `wide` ones span the full row. */
export const ORGANISED_TILES = [
  { label: 'One calendar', body: 'Every appointment in one place', wide: true },
  { label: 'Receipts', body: 'Invoices, saved', wide: false },
  { label: 'Renewals', body: 'Reminded early', wide: false },
];
