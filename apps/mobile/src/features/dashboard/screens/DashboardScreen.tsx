import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ApiError } from '@/api/errors';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { GoalsPreviewSection } from '@/features/dashboard/components/GoalsPreviewSection';
import { RewardsPreviewCard } from '@/features/dashboard/components/RewardsPreviewCard';
import { TodaySummaryCard } from '@/features/dashboard/components/TodaySummaryCard';
import { useDashboardGoalProgressMutation } from '@/features/dashboard/hooks/useDashboardGoalProgressMutation';
import { useDashboardQuery } from '@/features/dashboard/hooks/useDashboardQuery';
import type { DashboardGoal } from '@/features/dashboard/types/dashboard.types';
import { getDashboardRequest } from '@/features/dashboard/utils/get-dashboard-request';
import {
  getDashboardGreeting,
  getDashboardIdentity,
  mapDashboardGoal,
  mapDashboardReward,
} from '@/features/dashboard/utils/map-dashboard-data';
import { GoalFormSheet } from '@/features/goals/components/GoalFormSheet';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { FloatingActionButton } from '@/ui/components/FloatingActionButton';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './DashboardScreen.styles';

export const DashboardScreen = () => {
  const router = useRouter();
  const [isGoalFormVisible, setIsGoalFormVisible] = useState(false);
  const { isUserLoading, retryCurrentUser, user, userError } = useAuth();
  const request = getDashboardRequest();
  const dashboardQuery = useDashboardQuery(request);
  const progressMutation = useDashboardGoalProgressMutation();
  const dashboardError = dashboardQuery.error
    ? ApiError.fromUnknown(dashboardQuery.error).message
    : null;

  if (isUserLoading || dashboardQuery.isPending) {
    return (
      <Screen centered>
        <Loader label="Loading Dashboard" size="large" />
      </Screen>
    );
  }

  if (!user || !dashboardQuery.data) {
    const errorMessage =
      userError ?? dashboardError ?? 'The Dashboard could not be loaded.';

    return (
      <Screen centered>
        <Card padding="large" style={styles.stateCard}>
          <Text accessibilityRole="alert" tone="danger">
            {errorMessage}
          </Text>
          <Button
            label="Try again"
            loading={dashboardQuery.isRefetching}
            onPress={() => {
              void Promise.all([retryCurrentUser(), dashboardQuery.refetch()]);
            }}
          />
        </Card>
      </Screen>
    );
  }

  const identity = getDashboardIdentity(user.email);
  const goals = dashboardQuery.data.today.goals.map(mapDashboardGoal);
  const reward = dashboardQuery.data.rewardPreview
    ? mapDashboardReward(dashboardQuery.data.rewardPreview)
    : null;
  const mutationError = progressMutation.error
    ? ApiError.fromUnknown(progressMutation.error).message
    : null;
  const toggleGoal = async (goal: DashboardGoal) => {
    if (progressMutation.isPending) {
      return false;
    }

    try {
      if (goal.completed && goal.latestTodayProgressEntryId) {
        await progressMutation.mutateAsync({
          action: 'undo',
          goalId: goal.id,
          progressEntryId: goal.latestTodayProgressEntryId,
        });
        return true;
      }

      await progressMutation.mutateAsync({ action: 'add', goalId: goal.id });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <Screen
        contentContainerStyle={styles.content}
        safeAreaEdges={['top', 'right', 'left']}
      >
        <DashboardHeader
          avatarLabel={identity.avatarLabel}
          greeting={`${getDashboardGreeting(new Date().getHours())}, ${identity.name}`}
          subtitle="Keep your momentum going."
        />
        <TodaySummaryCard
          completedCount={dashboardQuery.data.today.completedCount}
          totalCount={dashboardQuery.data.today.totalCount}
        />
        <GoalsPreviewSection
          errorMessage={mutationError}
          goals={goals}
          isTogglePending={progressMutation.isPending}
          onSeeAll={() => router.push('/goals')}
          onToggleGoal={toggleGoal}
        />
        <RewardsPreviewCard reward={reward} />
      </Screen>
      <View pointerEvents="box-none" style={styles.floatingAction}>
        <FloatingActionButton
          accessibilityHint="Opens the create Goal form"
          accessibilityLabel="Add Goal"
          onPress={() => setIsGoalFormVisible(true)}
        />
      </View>
      <GoalFormSheet
        onClose={() => setIsGoalFormVisible(false)}
        visible={isGoalFormVisible}
      />
    </View>
  );
};
