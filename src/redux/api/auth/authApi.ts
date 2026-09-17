import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import {
  AuthData,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateMeRequest,
} from './types';
import { ApiEnvelope } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Me'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthData, LoginRequest>({
      query: (data) => ({ endpoint: endpoints.login, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<AuthData>) => res.data,
      invalidatesTags: ['Me'],
    }),

    register: builder.mutation<AuthData, RegisterRequest>({
      query: (data) => ({ endpoint: endpoints.register, method: 'post', data }),
      transformResponse: (res: ApiEnvelope<AuthData>) => res.data,
      invalidatesTags: ['Me'],
    }),

    getMe: builder.query<AuthUser, void>({
      query: () => ({ endpoint: endpoints.me, method: 'get' }),
      transformResponse: (res: ApiEnvelope<AuthUser>) => res.data,
      providesTags: ['Me'],
    }),

    updateMe: builder.mutation<AuthUser, UpdateMeRequest>({
      query: (data) => ({ endpoint: endpoints.me, method: 'patch', data }),
      transformResponse: (res: ApiEnvelope<AuthUser>) => res.data,
      invalidatesTags: ['Me'],
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({ endpoint: endpoints.changePassword, method: 'post', data }),
      transformResponse: () => undefined,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
} = authApi;
