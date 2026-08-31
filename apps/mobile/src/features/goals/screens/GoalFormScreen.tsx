import { type Href, useRouter } from 'expo-router';
import { View } from 'react-native';

import { ApiError } from '@/api/errors';
import { GoalForm } from '@/features/goals/components/GoalForm';
import { useCreateGoalMutation } from '@/features/goals/hooks/useCreateGoalMutation';
import { useGoalQuery } from '@/features/goals/hooks/useGoalQuery';
import { useUpdateGoalMutation } from '@/features/goals/hooks/useUpdateGoalMutation';
import { mapGoalFormValues } from '@/features/goals/utils/map-goal-form-values';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalFormScreen.styles';

type GoalFormScreenProps = {
  goalId?: string;
};

export const GoalFormScreen = ({ goalId = '' }: GoalFormScreenProps) => {
  const router = useRouter();
  const isEditing = goalId.length > 0;
  const goalQuery = useGoalQuery(goalId);
  const createMutation = useCreateGoalMutation();
  const updateMutation = useUpdateGoalMutation();
  const activeMutation = isEditing ? updateMutation : createMutation;
  const mutationError = activeMutation.error
    ? ApiError.fromUnknown(activeMutation.error).message
    : null;
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace('/');

  if (isEditing && goalQuery.isPending) {
    return (
      <Screen centered>
        <Loader label="Loading Goal form" size="large" />
      </Screen>
    );
  }

  if (isEditing && !goalQuery.data) {
    const queryError = goalQuery.error
      ? ApiError.fromUnknown(goalQuery.error).message
      : 'This Goal could not be loaded.';

    return (
      <Screen contentContainerStyle={styles.content} centered>
        <Card padding="large" style={styles.stateCard}>
          <Text accessibilityRole="alert" tone="danger">
            {queryError}
          </Text>
          <Button
            label="Try again"
            loading={goalQuery.isRefetching}
            onPress={() => void goalQuery.refetch()}
          />
          <Button label="Back" onPress={goBack} variant="ghost" />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="heading">{isEditing ? 'Edit Goal' : 'New Goal'}</Text>
        <Text tone="muted">
          {isEditing
            ? 'Update the Goal fields that still preserve its history.'
            : 'Choose a finite target or an ongoing practice.'}
        </Text>
      </View>
      <GoalForm
        goal={goalQuery.data}
        isSubmitting={activeMutation.isPending}
        onCancel={goBack}
        onSubmit={(values, coreSettingsLocked) => {
          if (activeMutation.isPending) {
            return;
          }

          if (isEditing) {
            const input = mapGoalFormValues(values, coreSettingsLocked);
            updateMutation.mutate(
              { goalId, input },
              {
                onSuccess: () =>
                  router.replace(`/goals/${goalId}?updated=1` as Href),
              },
            );
          } else {
            const input = mapGoalFormValues(values, false);
            createMutation.mutate(input, {
              onSuccess: () => router.replace('/'),
            });
          }
        }}
        serverError={mutationError}
        submitLabel={isEditing ? 'Save changes' : 'Create Goal'}
      />
    </Screen>
  );
};
