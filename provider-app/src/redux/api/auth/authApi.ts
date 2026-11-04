import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/apiConfigs';
import { endpoints } from '@/api/APIUtils';
import {
  AuthData,
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateMeRequest,
  UploadImageResponse,
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

    // Generic single-image upload (e.g. the provider's own avatar) — the
    // returned url is then saved via `updateMe({ avatarUrl })`.
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({ endpoint: endpoints.uploadImage, method: 'post', data: formData }),
      transformResponse: (res: ApiEnvelope<UploadImageResponse>) => res.data,
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({ endpoint: endpoints.changePassword, method: 'post', data }),
      transformResponse: () => undefined,
    }),

    /** Permanently deactivates the account (password required). */
    deleteAccount: builder.mutation<void, { password: string }>({
      query: (data) => ({ endpoint: endpoints.me, method: 'delete', data }),
      transformResponse: () => undefined,
    }),

    requestPasswordReset: builder.mutation<void, RequestPasswordResetRequest>({
      query: (data) => ({ endpoint: endpoints.forgotPassword, method: 'post', data }),
      transformResponse: () => undefined,
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({ endpoint: endpoints.resetPassword, method: 'post', data }),
      transformResponse: () => undefined,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadImageMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
