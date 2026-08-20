import { apiClient } from '@/api/client';

import type {
  AuthCredentials,
  AuthSession,
  AuthTokens,
  AuthUser,
} from '@/features/auth/types/auth.types';

export const authApi = {
  getCurrentUser: () =>
    apiClient.request<{ user: AuthUser }>('/auth/me', {
      authenticated: true,
    }),
  login: (credentials: AuthCredentials) =>
    apiClient.request<AuthSession>('/auth/login', {
      body: credentials,
      method: 'POST',
    }),
  logout: (refreshToken: string) =>
    apiClient.request<void>('/auth/logout', {
      body: { refreshToken },
      method: 'POST',
    }),
  refresh: (refreshToken: string) =>
    apiClient.request<AuthTokens>('/auth/refresh', {
      body: { refreshToken },
      method: 'POST',
    }),
  register: (credentials: AuthCredentials) =>
    apiClient.request<{ user: AuthUser }>('/auth/register', {
      body: credentials,
      method: 'POST',
    }),
};
