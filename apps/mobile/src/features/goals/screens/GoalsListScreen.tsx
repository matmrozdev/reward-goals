import { useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { ApiError } from '@/api/errors';
import { GoalListTabs } from '@/features/goals/components/GoalListTabs';
import { GoalPreviewCard } from '@/features/goals/components/GoalPreviewCard';
import { useGoalsQuery } from '@/features/goals/hooks/useGoalsQuery';
import { GoalFormSheet } from '@/features/goals/sheets/GoalFormSheet';
import type { GoalListTab } from '@/features/goals/types/goal-list.types';
import type { Goal } from '@/features/goals/types/goals.types';
import { filterGoalsByTab } from '@/features/goals/utils/filter-goals-by-tab';
import { mapGoalPreview } from '@/features/goals/utils/map-goal-preview';
import { BackButton } from '@/ui/components/BackButton';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { FloatingActionButton } from '@/ui/components/FloatingActionButton';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalsListScreen.styles';

type GoalFormState = { mode: 'create' } | { goal: Goal; mode: 'edit' } | null;

const tabLabels: Record<GoalListTab, string> = {
  active: 'active',
  archived: 'archived',
  completed: 'finished',
};

export const GoalsListScreen = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<GoalListTab>('active');
  const [goalFormState, setGoalFormState] = useState<GoalFormState>(null);
  const goalsQuery = useGoalsQuery();
  const goals = goalsQuery.data ?? [];
  const visibleGoals = filterGoalsByTab(goals, selectedTab);
  const queryError = goalsQuery.error
    ? ApiError.fromUnknown(goalsQuery.error).message
    : null;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  const selectedGoal =
    goalFormState?.mode === 'edit' ? goalFormState.goal : undefined;
  const countLabel = `${visibleGoals.length} ${tabLabels[selectedTab]} ${visibleGoals.length === 1 ? 'Goal' : 'Goals'}`;

  return (
    <View style={styles.container}>
      <Screen
        contentContainerStyle={styles.content}
        safeAreaEdges={['top', 'right', 'bottom', 'left']}
        scroll={false}
      >
        <FlatList
          contentContainerStyle={styles.listContent}
          contentInsetAdjustmentBehavior="automatic"
          data={visibleGoals}
          keyExtractor={(goal) => goal.id}
          ListEmptyComponent={
            goalsQuery.isPending ? (
              <View style={styles.centeredState}>
                <Loader label="Loading Goals" />
              </View>
            ) : queryError ? (
              <Card padding="large" style={styles.stateCard}>
                <Text accessibilityRole="alert" tone="danger">
                  {queryError}
                </Text>
                <Button
                  label="Try again"
                  onPress={() => void goalsQuery.refetch()}
                  variant="secondary"
                />
              </Card>
            ) : (
              <Card padding="large" style={styles.stateCard} variant="muted">
                <Text variant="title">No {tabLabels[selectedTab]} Goals</Text>
                <Text tone="muted">
                  {selectedTab === 'active'
                    ? 'Create a Goal to start building momentum.'
                    : `Your ${tabLabels[selectedTab]} Goals will appear here.`}
                </Text>
              </Card>
            )
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.navigationRow}>
                <BackButton onPress={goBack} />
                <Text style={styles.title} variant="heading">
                  All Goals
                </Text>
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={styles.headerSpacer}
                />
              </View>
              <GoalListTabs onChange={setSelectedTab} value={selectedTab} />
              <View style={styles.summaryRow}>
                <Text tone="muted">{countLabel}</Text>
                {queryError && goals.length > 0 ? (
                  <Text accessibilityRole="alert" tone="danger">
                    Refresh failed
                  </Text>
                ) : null}
              </View>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={() => void goalsQuery.refetch()}
          refreshing={goalsQuery.isRefetching}
          renderItem={({ index, item }) => (
            <GoalPreviewCard
              goal={mapGoalPreview(item, index)}
              onPress={() => setGoalFormState({ goal: item, mode: 'edit' })}
            />
          )}
          style={styles.list}
        />
        <View pointerEvents="box-none" style={styles.floatingAction}>
          <FloatingActionButton
            accessibilityHint="Opens the create Goal form"
            accessibilityLabel="Add Goal"
            onPress={() => setGoalFormState({ mode: 'create' })}
          />
        </View>
      </Screen>
      <GoalFormSheet
        goal={selectedGoal}
        onClose={() => setGoalFormState(null)}
        visible={goalFormState !== null}
      />
    </View>
  );
};
