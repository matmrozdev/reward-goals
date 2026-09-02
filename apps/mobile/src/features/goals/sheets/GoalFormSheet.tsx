import { ScrollView } from 'react-native';
import { testIds } from '@reward-goals/test-ids';

import { ApiError } from '@/api/errors';
import { GoalForm } from '@/features/goals/components/GoalForm';
import { useCreateGoalMutation } from '@/features/goals/hooks/useCreateGoalMutation';
import { useUpdateGoalMutation } from '@/features/goals/hooks/useUpdateGoalMutation';
import type { Goal } from '@/features/goals/types/goals.types';
import { mapGoalFormValues } from '@/features/goals/utils/map-goal-form-values';
import { BottomSheet } from '@/ui/components/BottomSheet';

import { styles } from './GoalFormSheet.styles';

type GoalFormSheetProps = {
  goal?: Goal;
  onClose: () => void;
  onSuccess?: (goal: Goal) => void;
  visible: boolean;
};

export const GoalFormSheet = ({
  goal,
  onClose,
  onSuccess,
  visible,
}: GoalFormSheetProps) => {
  const createMutation = useCreateGoalMutation();
  const updateMutation = useUpdateGoalMutation();
  const isEditing = Boolean(goal);
  const activeMutation = isEditing ? updateMutation : createMutation;
  const mutationError = activeMutation.error
    ? ApiError.fromUnknown(activeMutation.error).message
    : null;

  const handleClosed = () => {
    activeMutation.reset();
    onClose();
  };

  return (
    <BottomSheet
      dismissible={!activeMutation.isPending}
      onClose={handleClosed}
      subtitle={
        isEditing
          ? 'Update the Goal fields that still preserve its history.'
          : 'Choose a finite target or an ongoing practice.'
      }
      title={isEditing ? 'Edit Goal' : 'New Goal'}
      visible={visible}
    >
      {({ close }) => (
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
          testID={testIds.goals.form.sheet}
        >
          <GoalForm
            goal={goal}
            isSubmitting={activeMutation.isPending}
            onCancel={close}
            onSubmit={(values, coreSettingsLocked) => {
              if (activeMutation.isPending) {
                return;
              }

              if (goal) {
                updateMutation.mutate(
                  {
                    goalId: goal.id,
                    input: mapGoalFormValues(values, coreSettingsLocked),
                  },
                  {
                    onSuccess: ({ goal: updatedGoal }) => {
                      onSuccess?.(updatedGoal);
                      close();
                    },
                  },
                );
                return;
              }

              createMutation.mutate(mapGoalFormValues(values, false), {
                onSuccess: ({ goal: createdGoal }) => {
                  onSuccess?.(createdGoal);
                  close();
                },
              });
            }}
            serverError={mutationError}
            submitLabel={isEditing ? 'Save changes' : 'Create Goal'}
          />
        </ScrollView>
      )}
    </BottomSheet>
  );
};
