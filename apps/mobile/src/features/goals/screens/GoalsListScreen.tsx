import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { FlatList, View } from 'react-native';

import { ApiError } from '@/api/errors';
import { GoalCard } from '@/features/goals/components/GoalCard';
import { GoalFormSheet } from '@/features/goals/components/GoalFormSheet';
import { useGoalsQuery } from '@/features/goals/hooks/useGoalsQuery';
import type { Goal } from '@/features/goals/types/goals.types';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalsListScreen.styles';

export const GoalsListScreen = () => {
  const router = useRouter();
  const [isGoalFormVisible, setIsGoalFormVisible] = useState(false);
  const goalsQuery = useGoalsQuery();
  const goals = goalsQuery.data ?? [];
  const queryError = goalsQuery.error
    ? ApiError.fromUnknown(goalsQuery.error).message
    : null;
  const openGoal = (goal: Goal) => {
    router.push(`/goals/${goal.id}` as Href);
  };

  return (
    <Screen
      contentContainerStyle={styles.content}
      safeAreaEdges={['top', 'right', 'left']}
      scroll={false}
    >
      <FlatList
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="automatic"
        data={goals}
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
            <Card padding="large" style={styles.stateCard}>
              <Text variant="title">No Goals yet</Text>
              <Text tone="muted">
                Your Goals will appear here once you create one.
              </Text>
            </Card>
          )
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.heading}>
              <Text variant="heading">Your Goals</Text>
              <Text tone="muted">Build consistency one action at a time.</Text>
            </View>
            {queryError && goals.length > 0 ? (
              <Card padding="small" variant="muted">
                <Text accessibilityRole="alert" tone="danger">
                  {queryError} Pull down to try again.
                </Text>
              </Card>
            ) : null}
            <Button
              label="Create Goal"
              onPress={() => setIsGoalFormVisible(true)}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={() => void goalsQuery.refetch()}
        refreshing={goalsQuery.isRefetching}
        renderItem={({ item }) => (
          <GoalCard goal={item} onPress={() => openGoal(item)} />
        )}
        style={styles.list}
      />
      <GoalFormSheet
        onClose={() => setIsGoalFormVisible(false)}
        visible={isGoalFormVisible}
      />
    </Screen>
  );
};
