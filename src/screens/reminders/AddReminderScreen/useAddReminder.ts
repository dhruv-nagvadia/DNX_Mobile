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
  const existing = params.id ? reminders.find((r) => r.id === params.id) ?? null : null;

  const [createReminder, { isLoading: creating }] = useCreateReminderMutation();
  const [updateReminder, { isLoading: updating }] = useUpdateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();

  const [title, setTitle] = useState(params.prefillTitle ?? '');
  const [type, setType] = useState<ReminderType>((params.prefillType as ReminderType) ?? 'other');
  const [repeat, setRepeat] = useState<ReminderRepeat>('NONE');
  const [note, setNote] = useState('');
  const [startDate, setStartDate] = useState<Date>(todayAt9);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const inited = useRef(false);
  useEffect(() => {
    if (existing && !inited.current) {
      inited.current = true;
      setTitle(existing.title);
      setType(existing.type);
      setRepeat(existing.repeat);
      setNote(existing.note ?? '');
      setStartDate(new Date(existing.dueDate));
      setEndDate(existing.endDate ? new Date(existing.endDate) : null);
    }
  }, [existing]);

  const clearEnd = () => setEndDate(null);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Add a title', 'Give your reminder a name.');
      return;
    }
    const hasEnd = repeat !== 'NONE' && !!endDate;
    if (hasEnd && endDate && endDate < startDate) {
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
      navigation.goBack();
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    }
  };

  const removeReminder = () => {
    if (!params.id) return;
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

  return {
    isEdit,
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
    setRepeat,
    note,
    setNote,
    saving: creating || updating,
    save,
    removeReminder,
  };
}
