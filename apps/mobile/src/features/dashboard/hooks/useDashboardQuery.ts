import { useQuery } from '@tanstack/react-query';

import { dashboardQueryOptions } from '@/features/dashboard/api/dashboard.queries';
import type { DashboardRequest } from '@/features/dashboard/types/dashboard.types';

export const useDashboardQuery = (request: DashboardRequest) =>
  useQuery(dashboardQueryOptions(request));
