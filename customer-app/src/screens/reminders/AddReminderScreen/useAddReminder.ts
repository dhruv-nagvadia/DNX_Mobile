import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  useCreateReminderMutation,
  useDeleteReminderMutation,
  useGetRemindersQuery,
  useUpdateReminderMutation,
} from '@/redux/api/reminder/reminderApi';
import { ReminderRepeat, ReminderType } from '@/redux/api/reminder/types';
import { ROUTES } from '@/navigation/routes';

import { AddReminderNavigationProp, AddReminderRouteProp } from './types';

function todayAt9(): Date {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  return d;
}

/** Create/edit a reminder: title, type, start date, optional end date, repeat, notes. */
export function useAddReminder() {
  const navigation = useNavigation<AddReminderNavigationProp>();
  const { params } = useRoute<AddReminderRouteProp>();
  const isEdit = !!params.id;

  const { data: reminders = [] } = useGetRemindersQuery();
  const existing = params.id ? (reminders.find((r) => r.id === params.id) ?? null) : null;

  const [createReminder, { isLoading: creating }] = useCreateReminderMutation();
  const [updateReminder, { isLoading: updating }] = useUpdateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();

  const [title, setTitleState] = useState(params.prefillTitle ?? '');
  // A new reminder starts with no category / date picked, so the customer
  // chooses deliberately (inline errors explain what's missing on Save).
  const [type, setTypeState] = useState<ReminderType | null>(
    (params.prefillType as ReminderType) ?? null,
  );
  const [repeat, setRepeat] = useState<ReminderRepeat>('NONE');
  const [note, setNote] = useState('');
  const [startDate, setStartDateState] = useState<Date | null>(isEdit ? todayAt9() : null);
  const [errors, setErrors] = useState<{ title?: string; type?: string; startDate?: string }>({});
  const [endDate, setEndDate] = useState<Date | null>(null);

  const inited = useRef(false);
  useEffect(() => {
    if (existing && !inited.current) {
      inited.current = true;
      setTitleState(existing.title);
      setTypeState(existing.type);
      setRepeat(existing.repeat);
      setNote(existing.note ?? '');
      setStartDateState(new Date(existing.dueDate));
      setEndDate(existing.endDate ? new Date(existing.endDate) : null);
    }
  }, [existing]);

  const clearEnd = () => setEndDate(null);

  // Switching repeat type invalidates any previously-picked end date — it was
  // only valid for the old cycle (e.g. "every 14 days" for weekly means
  // nothing once switched to monthly), so start clean rather than keep a
  // date that no longer lines up with the new occurrence pattern.
  const changeRepeat = (next: ReminderRepeat) => {
    setRepeat(next);
    setEndDate(null);
  };

  // Editing a field clears its error.
  const setTitle = (v: string) => {
    setTitleState(v);
    if (errors.title && v.trim()) {
      setErrors((e) => ({ ...e, title: undefined }));
    }
  };
  const setType = (t: ReminderType) => {
    setTypeState(t);
    setErrors((e) => ({ ...e, type: undefined }));
  };
  const setStartDate = (d: Date) => {
    setStartDateState(d);
    setErrors((e) => ({ ...e, startDate: undefined }));
  };

  const save = async () => {
    const next = {
      title: title.trim() ? undefined : 'Give your reminder a name.',
      type: type ? undefined : 'Pick a category.',
      startDate: startDate ? undefined : 'Pick a date.',
    };
    setErrors(next);
    if (next.title || next.type || next.startDate || !type || !startDate) {
      return;
    }
    const hasEnd = repeat !== 'NONE' && !!endDate;
    if (hasEnd && endDate && endDate <= startDate) {
      Alert.alert('Check the end date', 'The end date must be after the start date.');
      return;
    }
    const payload = {
      title: title.trim(),
      type,
      dueDate: startDate.toISOString(),
      endDate: hasEnd && endDate ? endDate.toISOString() : null,
      repeat,
      note: note.trim() || undefined,
      ...(params.providerId ? { providerId: params.providerId } : {}),
    };
    try {
      if (isEdit && params.id) {
        await updateReminder({ id: params.id, data: payload }).unwrap();
      } else {
        await createReminder(payload).unwrap();
      }
      // Came from a booking's "remind me to book again" flow — land on the
      // Reminders tab so the new reminder is visible, instead of returning
      // to the booking screen it was opened from.
      if (!isEdit && params.providerId) {
        (navigation as unknown as { replace: (r: string, p?: object) => void }).replace(
          ROUTES.TABS,
          { screen: ROUTES.REMINDERS },
        );
      } else {
        navigation.goBack();
      }
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    }
  };

  const removeReminder = () => {
    if (!params.id) {
      return;
    }
    Alert.alert('Delete reminder?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReminder(params.id as string).unwrap();
            navigation.goBack();
          } catch {
            Alert.alert('Could not delete', 'Please try again.');
          }
        },
      },
    ]);
  };

  // The business this reminder belongs to (from a booking's "remind me to
  // book again"), when there is one.
  const linkedProviderId = params.providerId ?? existing?.providerId ?? null;

  return {
    isEdit,
    errors,
    linkedProviderId,
    createdAt: existing?.createdAt ?? null,
    title,
    setTitle,
    type,
    setType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearEnd,
    repeat,
    setRepeat: changeRepeat,
    note,
    setNote,
    saving: creating || updating,
    save,
    removeReminder,
  };
}
