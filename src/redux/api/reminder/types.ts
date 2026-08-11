export type ReminderRepeat = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type ReminderType =
  | 'vehicle'
  | 'insurance'
  | 'health'
  | 'document'
  | 'home'
  | 'appointment'
  | 'other';

export interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  dueDate: string; // ISO datetime (next occurrence)
  endDate?: string | null; // ISO date; repeats stop after this
  repeat: ReminderRepeat;
  remindDaysBefore: number;
  note?: string | null;
  providerId?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface ReminderInput {
  title: string;
  type: ReminderType;
  dueDate: string;
  endDate?: string | null;
  repeat: ReminderRepeat;
  note?: string;
  providerId?: string;
}
