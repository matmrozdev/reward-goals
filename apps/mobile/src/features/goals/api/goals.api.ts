import { apiClient } from '@/api/client';

import type {
  GoalEnvelope,
  GoalListResponse,
} from '@/features/goals/types/goals.types';

export const goalsApi = {
  getById: (goalId: string) =>
    apiClient.request<GoalEnvelope>(`/goals/${goalId}`, {
      authenticated: true,
    }),
  list: () =>
    apiClient.request<GoalListResponse>('/goals', {
      authenticated: true,
    }),
};
