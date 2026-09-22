import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useGetRemindersQuery, useRespondReminderMutation } from '@/redux/api/reminder/reminderApi';
import { Reminder, ReminderStatus } from '@/redux/api/reminder/types';
import { ROUTES } from '@/navigation/routes';

import { RemindersNavigationProp } from './types';

/** Groups reminders into overdue / upcoming (PENDING) / history (Done or Missed). */
export function useRemindersScreen() {
  const navigation = useNavigation<RemindersNavigationProp>();
  const { data: reminders = [], isLoading } = useGetRemindersQuery();
  const [respond] = useRespondReminderMutation();

  const groups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const byDue = (a: Reminder, b: Reminder) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    const byResponded = (a: Reminder, b: Reminder) =>
      new Date(b.respondedAt ?? b.dueDate).getTime() - new Date(a.respondedAt ?? a.dueDate).getTime();

    const pending = reminders.filter((r) => r.status === 'PENDING');
    return {
      overdue: pending.filter((r) => new Date(r.dueDate) < today).sort(byDue),
      upcoming: pending.filter((r) => new Date(r.dueDate) >= today).sort(byDue),
      history: reminders.filter((r) => r.status !== 'PENDING').sort(byResponded),
    };
  }, [reminders]);

  return {
    isLoading,
    total: reminders.length,
    ...groups,
    onAdd: () => navigation.navigate(ROUTES.ADD_REMINDER, {}),
    onOpen: (r: Reminder) => navigation.navigate(ROUTES.ADD_REMINDER, { id: r.id }),
    // Tapping the already-selected icon is a no-op; tapping the other one
    // switches the outcome directly — that IS the edit/undo mechanism, no
    // separate confirmation needed.
    onRespond: (r: Reminder, status: Extract<ReminderStatus, 'DONE' | 'MISSED'>) => {
      if (r.status === status) return;
      respond({ id: r.id, status });
    },
  };
}
