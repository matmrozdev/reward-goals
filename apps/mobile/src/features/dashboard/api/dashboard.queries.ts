import { queryOptions } from '@tanstack/react-query';

import { dashboardApi } from '@/features/dashboard/api/dashboard.api';
import type { DashboardRequest } from '@/features/dashboard/types/dashboard.types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: ({ date, timeZone }: DashboardRequest) =>
    [...dashboardKeys.all, 'summary', date, timeZone] as const,
};

export const dashboardQueryOptions = (request: DashboardRequest) =>
  queryOptions({
    queryFn: () => dashboardApi.get(request),
    queryKey: dashboardKeys.summary(request),
  });
