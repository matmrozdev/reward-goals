import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { GoalFormOption } from '@/features/goals/components/GoalFormOption';
import type { Goal, Weekday } from '@/features/goals/types/goals.types';
import {
  goalFormSchema,
  type GoalFormValues,
} from '@/features/goals/utils/goal-form-schema';
import { getGoalFormValues } from '@/features/goals/utils/map-goal-form-values';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Text } from '@/ui/components/Text';
import { TextInput } from '@/ui/components/TextInput';

import { styles } from './GoalForm.styles';

type GoalFormProps = {
  goal?: Goal;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: GoalFormValues, coreSettingsLocked: boolean) => void;
  serverError: string | null;
  submitLabel: string;
};

const weekdayOptions: { label: string; value: Weekday }[] = [
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' },
  { label: 'Sat', value: 'SATURDAY' },
  { label: 'Sun', value: 'SUNDAY' },
];

export const GoalForm = ({
  goal,
  isSubmitting,
  onCancel,
  onSubmit,
  serverError,
  submitLabel,
}: GoalFormProps) => {
  const coreSettingsLocked = Boolean(
    goal && (goal.hasProgressHistory || goal.status !== 'ACTIVE'),
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormValues>({
    defaultValues: getGoalFormValues(goal),
    resolver: zodResolver(goalFormSchema),
  });
  const goalType = useWatch({ control, name: 'goalType' });
  const rewardEnabled = useWatch({ control, name: 'rewardEnabled' });
  const submit = handleSubmit((values) => onSubmit(values, coreSettingsLocked));

  return (
    <Card padding="large" style={styles.card}>
      {serverError ? (
        <Text accessibilityRole="alert" tone="danger">
          {serverError}
        </Text>
      ) : null}

      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            error={errors.title?.message}
            label="Title"
            maxLength={120}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            error={errors.description?.message}
            label="Description (optional)"
            maxLength={1000}
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <View style={styles.section}>
        <Text variant="label">Goal type</Text>
        <View accessibilityRole="radiogroup" style={styles.options}>
          <Controller
            control={control}
            name="goalType"
            render={({ field: { onChange, value } }) => (
              <>
                <GoalFormOption
                  disabled={coreSettingsLocked}
                  label="Finite"
                  onPress={() => onChange('FINITE')}
                  role="radio"
                  selected={value === 'FINITE'}
                />
                <GoalFormOption
                  disabled={coreSettingsLocked}
                  label="Ongoing"
                  onPress={() => onChange('ONGOING')}
                  role="radio"
                  selected={value === 'ONGOING'}
                />
              </>
            )}
          />
        </View>
        {coreSettingsLocked ? (
          <Text tone="muted" variant="caption">
            Target and reward settings are locked after progress exists or the
            Goal ends.
          </Text>
        ) : null}
      </View>

      {goalType === 'FINITE' ? (
        <Controller
          control={control}
          name="targetValue"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              disabled={coreSettingsLocked}
              error={errors.targetValue?.message}
              keyboardType="number-pad"
              label="Target"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      ) : null}

      <View style={styles.section}>
        <Text variant="label">Schedule (optional)</Text>
        <Controller
          control={control}
          name="scheduleDays"
          render={({ field: { onChange, value } }) => {
            const isEveryDay = value.length === weekdayOptions.length;

            return (
              <View style={styles.options}>
                <GoalFormOption
                  label="Every day"
                  onPress={() =>
                    onChange(
                      isEveryDay
                        ? []
                        : weekdayOptions.map((option) => option.value),
                    )
                  }
                  selected={isEveryDay}
                />
                {weekdayOptions.map((option) => (
                  <GoalFormOption
                    key={option.value}
                    label={option.label}
                    onPress={() =>
                      onChange(
                        value.includes(option.value)
                          ? value.filter((day) => day !== option.value)
                          : [...value, option.value],
                      )
                    }
                    selected={value.includes(option.value)}
                  />
                ))}
              </View>
            );
          }}
        />
      </View>

      <View style={styles.section}>
        <Text variant="label">Reward (optional)</Text>
        <Controller
          control={control}
          name="rewardEnabled"
          render={({ field: { onChange, value } }) => (
            <GoalFormOption
              disabled={coreSettingsLocked}
              label={value ? 'Reward enabled' : 'Add a reward'}
              onPress={() => onChange(!value)}
              role="switch"
              selected={value}
            />
          )}
        />
        {rewardEnabled ? (
          <View style={styles.rewardFields}>
            <Controller
              control={control}
              name="rewardTitle"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  disabled={coreSettingsLocked}
                  error={errors.rewardTitle?.message}
                  label="Reward title"
                  maxLength={120}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="rewardRequiredProgress"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  disabled={coreSettingsLocked}
                  error={errors.rewardRequiredProgress?.message}
                  keyboardType="number-pad"
                  label="Required progress"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button label={submitLabel} loading={isSubmitting} onPress={submit} />
        <Button
          disabled={isSubmitting}
          label="Cancel"
          onPress={onCancel}
          variant="ghost"
        />
      </View>
    </Card>
  );
};
