import { apiClient } from '@/api/client';
import type {
  DashboardRequest,
  DashboardResponse,
} from '@/features/dashboard/types/dashboard.types';

export const dashboardApi = {
  get: ({ date, timeZone }: DashboardRequest) =>
    apiClient.request<DashboardResponse>(
      `/dashboard?date=${encodeURIComponent(date)}&timeZone=${encodeURIComponent(timeZone)}`,
      { authenticated: true },
    ),
};
