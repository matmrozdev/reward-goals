import { queryOptions } from '@tanstack/react-query';

import { goalsApi } from './goals.api';

export const goalKeys = {
  all: ['goals'] as const,
  detail: (goalId: string) => [...goalKeys.details(), goalId] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  list: () => [...goalKeys.all, 'list'] as const,
};

export const goalQueryOptions = (goalId: string) =>
  queryOptions({
    queryFn: async () => (await goalsApi.getById(goalId)).goal,
    queryKey: goalKeys.detail(goalId),
  });

export const goalsQueryOptions = () =>
  queryOptions({
    queryFn: async () => (await goalsApi.list()).goals,
    queryKey: goalKeys.list(),
  });
