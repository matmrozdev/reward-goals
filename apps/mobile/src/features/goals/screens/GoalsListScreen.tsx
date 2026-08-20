import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { FlatList, View } from 'react-native';

import { ApiError } from '@/api/errors';
import { useAuth } from '@/features/auth/AuthProvider';
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';
import { GoalCard } from '@/features/goals/components/GoalCard';
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
  const { user } = useAuth();
  const goalsQuery = useGoalsQuery();
  const logoutMutation = useLogoutMutation();
  const goals = goalsQuery.data ?? [];
  const queryError = goalsQuery.error
    ? ApiError.fromUnknown(goalsQuery.error).message
    : null;
  const logoutError = logoutMutation.error
    ? ApiError.fromUnknown(logoutMutation.error).message
    : null;
  const openGoal = (goal: Goal) => {
    router.push(`/goals/${goal.id}` as Href);
  };

  return (
    <Screen contentContainerStyle={styles.content} scroll={false}>
      <FlatList
        contentContainerStyle={styles.listContent}
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
            <View style={styles.titleRow}>
              <View style={styles.heading}>
                <Text variant="heading">Your Goals</Text>
                {user ? <Text tone="muted">{user.email}</Text> : null}
              </View>
              <Button
                label="Sign out"
                loading={logoutMutation.isPending}
                onPress={() => logoutMutation.mutate()}
                size="small"
                variant="ghost"
              />
            </View>
            {logoutError ? (
              <Text accessibilityRole="alert" tone="danger">
                {logoutError}
              </Text>
            ) : null}
            {queryError && goals.length > 0 ? (
              <Card padding="small" variant="muted">
                <Text accessibilityRole="alert" tone="danger">
                  {queryError} Pull down to try again.
                </Text>
              </Card>
            ) : null}
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
    </Screen>
  );
};
