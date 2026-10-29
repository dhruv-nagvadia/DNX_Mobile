import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import { Reminder, ReminderInput, ReminderStatus } from './types';
import { ApiEnvelope } from '../types';

export const reminderApi = createApi({
  reducerPath: 'reminderApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Reminders'],
  endpoints: (builder) => ({
    getReminders: builder.query<Reminder[], void>({
      query: () => ({ endpoint: endpoints.reminders, method: 'get' }),
      transformResponse: (res: ApiEnvelope<Reminder[]>) => res.data,
      providesTags: ['Reminders'],
    }),

    createReminder: builder.mutation<Reminder, ReminderInput>({
      query: (data) => ({ endpoint: endpoints.reminders, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<Reminder>) => res.data,
      invalidatesTags: ['Reminders'],
    }),

    updateReminder: builder.mutation<Reminder, { id: string; data: Partial<ReminderInput> }>({
      query: ({ id, data }) => ({ endpoint: endpoints.reminder(id), method: 'patch', data }),
      transformResponse: (res: ApiEnvelope<Reminder>) => res.data,
      invalidatesTags: ['Reminders'],
    }),

    respondReminder: builder.mutation<Reminder, { id: string; status: Extract<ReminderStatus, 'DONE' | 'MISSED'> }>({
      query: ({ id, status }) => ({
        endpoint: endpoints.reminderRespond(id),
        method: 'patch',
        data: { status },
      }),
      transformResponse: (res: ApiEnvelope<Reminder>) => res.data,
      invalidatesTags: ['Reminders'],
    }),

    deleteReminder: builder.mutation<{ id: string }, string>({
      query: (id) => ({ endpoint: endpoints.reminder(id), method: 'delete' }),
      transformResponse: (res: ApiEnvelope<{ id: string }>) => res.data,
      invalidatesTags: ['Reminders'],
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useRespondReminderMutation,
  useDeleteReminderMutation,
} = reminderApi;
