import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  useGetRemindersQuery,
  useMarkReminderDoneMutation,
} from '@/redux/api/reminder/reminderApi';
import { Reminder } from '@/redux/api/reminder/types';
import { ROUTES } from '@/navigation/routes';

import { RemindersNavigationProp } from './types';

/** Groups reminders into overdue / upcoming / done and exposes actions. */
export function useRemindersScreen() {
  const navigation = useNavigation<RemindersNavigationProp>();
  const { data: reminders = [], isLoading } = useGetRemindersQuery();
  const [markDone] = useMarkReminderDoneMutation();

  const groups = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const byDue = (a: Reminder, b: Reminder) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    const active = reminders.filter((r) => !r.completedAt);
    return {
      overdue: active.filter((r) => new Date(r.dueDate) < today).sort(byDue),
      upcoming: active.filter((r) => new Date(r.dueDate) >= today).sort(byDue),
      done: reminders.filter((r) => r.completedAt).sort((a, b) => byDue(b, a)),
    };
  }, [reminders]);

  return {
    isLoading,
    total: reminders.length,
    ...groups,
    onAdd: () => navigation.navigate(ROUTES.ADD_REMINDER, {}),
    onOpen: (r: Reminder) => navigation.navigate(ROUTES.ADD_REMINDER, { id: r.id }),
    onDone: (id: string) => markDone(id),
  };
}
