import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useGetRemindersQuery, useRespondReminderMutation } from '@/redux/api/reminder/reminderApi';
import { Reminder, ReminderStatus, ReminderType } from '@/redux/api/reminder/types';
import { TYPE_OPTIONS } from '@/utils/reminderMeta';
import { ROUTES } from '@/navigation/routes';

import { RemindersNavigationProp } from './types';
import { daysUntil, HISTORY_COLLAPSE_AFTER } from './data';

/**
 * Groups reminders into overdue / due today / upcoming (PENDING) and history
 * (Done or Missed), plus the stat-tile counts and the category filter.
 */
export function useRemindersScreen() {
  const navigation = useNavigation<RemindersNavigationProp>();
  // Missed days of a repeating reminder are added by the server whenever the
  // list is loaded, so always load a fresh list instead of reusing a cached one.
  const {
    data: reminders = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetRemindersQuery(undefined, { refetchOnMountOrArgChange: true });
  const [respond] = useRespondReminderMutation();

  // This is a tab, so it stays mounted — reload each time it comes back into
  // view (the first focus is covered by the initial load above).
  const seenFirstFocus = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!seenFirstFocus.current) {
        seenFirstFocus.current = true;
        return;
      }
      refetch();
    }, [refetch]),
  );

  // View state: category filter chip + History collapse (null = auto).
  const [filter, setFilter] = useState<ReminderType | 'all'>('all');
  const [historyOpen, setHistoryOpen] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Only categories that actually have reminders get a chip.
  const categories = useMemo(() => {
    const present = new Set(reminders.map((r) => r.type));
    return TYPE_OPTIONS.filter((t) => present.has(t));
  }, [reminders]);
  // If the selected category disappears (last one deleted), fall back to All.
  const activeFilter = filter !== 'all' && !categories.includes(filter) ? 'all' : filter;

  // Stat tiles — always over the full list, independent of the filter.
  const stats = useMemo(() => {
    const now = new Date();
    const pending = reminders.filter((r) => r.status === 'PENDING');
    return {
      overdue: pending.filter((r) => daysUntil(r.dueDate) < 0).length,
      today: pending.filter((r) => daysUntil(r.dueDate) === 0).length,
      thisMonth: pending.filter((r) => {
        const d = new Date(r.dueDate);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length,
    };
  }, [reminders]);

  const groups = useMemo(() => {
    const byDue = (a: Reminder, b: Reminder) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    const byResponded = (a: Reminder, b: Reminder) =>
      new Date(b.respondedAt ?? b.dueDate).getTime() -
      new Date(a.respondedAt ?? a.dueDate).getTime();

    const visible =
      activeFilter === 'all' ? reminders : reminders.filter((r) => r.type === activeFilter);
    const pending = visible.filter((r) => r.status === 'PENDING');
    return {
      overdue: pending.filter((r) => daysUntil(r.dueDate) < 0).sort(byDue),
      dueToday: pending.filter((r) => daysUntil(r.dueDate) === 0).sort(byDue),
      upcoming: pending.filter((r) => daysUntil(r.dueDate) > 0).sort(byDue),
      history: visible.filter((r) => r.status !== 'PENDING').sort(byResponded),
    };
  }, [reminders, activeFilter]);

  // History shows the latest few; expanding shows every past reminder.
  const historyExpanded = historyOpen ?? false;
  const historyCanExpand = groups.history.length > HISTORY_COLLAPSE_AFTER;
  const historyShown = historyExpanded
    ? groups.history
    : groups.history.slice(0, HISTORY_COLLAPSE_AFTER);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    isLoading,
    isFetching,
    total: reminders.length,
    ...groups,
    stats,
    categories,
    filter: activeFilter,
    setFilter,
    historyExpanded,
    historyCanExpand,
    historyShown,
    toggleHistory: () => setHistoryOpen(!historyExpanded),
    refreshing,
    onRefresh,
    onAdd: () => navigation.navigate(ROUTES.ADD_REMINDER, {}),
    onOpen: (r: Reminder) => navigation.navigate(ROUTES.ADD_REMINDER, { id: r.id }),
    onBook: (providerId: string, name?: string) =>
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { providerId, name }),
    // Tapping the already-selected icon is a no-op; tapping the other one
    // switches the outcome directly — that IS the edit/undo mechanism, no
    // separate confirmation needed.
    onRespond: (r: Reminder, status: Extract<ReminderStatus, 'DONE' | 'MISSED'>) => {
      if (r.status === status) return;
      respond({ id: r.id, status });
    },
  };
}
