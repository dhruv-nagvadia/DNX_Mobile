export type ReminderRepeat = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type ReminderType =
  | 'vehicle'
  | 'insurance'
  | 'health'
  | 'document'
  | 'home'
  | 'appointment'
  | 'other';

export type ReminderStatus = 'PENDING' | 'DONE' | 'MISSED';

// Each row is ONE occurrence — responding to a repeating reminder spawns a
// fresh row for the next occurrence rather than rolling this one forward.
export interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  dueDate: string; // ISO datetime — this occurrence's date, fixed once created
  endDate?: string | null; // ISO date; the series stops spawning after this
  repeat: ReminderRepeat;
  remindDaysBefore: number;
  note?: string | null;
  providerId?: string | null;
  status: ReminderStatus;
  respondedAt?: string | null;
  // The occurrence this one was spawned from, if any.
  previousOccurrenceId?: string | null;
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
