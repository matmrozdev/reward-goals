import { apiClient } from '@/api/client';

import type {
  CreateGoalInput,
  GoalEnvelope,
  GoalListResponse,
  GoalProgressMutationResponse,
  UpdateGoalInput,
} from '@/features/goals/types/goals.types';

export const goalsApi = {
  abandon: (goalId: string) =>
    apiClient.request<GoalEnvelope>(`/goals/${goalId}/abandon`, {
      authenticated: true,
      method: 'POST',
    }),
  archive: (goalId: string) =>
    apiClient.request<GoalEnvelope>(`/goals/${goalId}/archive`, {
      authenticated: true,
      method: 'POST',
    }),
  create: (input: CreateGoalInput) =>
    apiClient.request<GoalEnvelope>('/goals', {
      authenticated: true,
      body: input,
      method: 'POST',
    }),
  getById: (goalId: string) =>
    apiClient.request<GoalEnvelope>(`/goals/${goalId}`, {
      authenticated: true,
    }),
  list: () =>
    apiClient.request<GoalListResponse>('/goals', {
      authenticated: true,
    }),
  addProgress: (goalId: string) =>
    apiClient.request<GoalProgressMutationResponse>(
      `/goals/${goalId}/progress`,
      {
        authenticated: true,
        method: 'POST',
      },
    ),
  unarchive: (goalId: string) =>
    apiClient.request<GoalEnvelope>(`/goals/${goalId}/unarchive`, {
      authenticated: true,
      method: 'POST',
    }),
  undoProgress: (goalId: string, progressEntryId: string) =>
    apiClient.request<GoalProgressMutationResponse>(
      `/goals/${goalId}/progress/${progressEntryId}/undo`,
      {
        authenticated: true,
        method: 'POST',
      },
    ),
  update: (goalId: string, input: UpdateGoalInput) =>
    apiClient.request<GoalEnvelope>(`/goals/${goalId}`, {
      authenticated: true,
      body: input,
      method: 'PATCH',
    }),
};
