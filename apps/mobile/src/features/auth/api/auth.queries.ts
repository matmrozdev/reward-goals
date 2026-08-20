import { queryOptions } from '@tanstack/react-query';

import { authApi } from './auth.api';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export const currentUserQueryOptions = () =>
  queryOptions({
    queryFn: async () => (await authApi.getCurrentUser()).user,
    queryKey: authKeys.me(),
    retry: false,
  });
