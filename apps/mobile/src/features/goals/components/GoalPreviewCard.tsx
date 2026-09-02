import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { createScopedTestId, testIds } from '@reward-goals/test-ids';

import { GoalStatusAction } from '@/features/goals/components/GoalStatusAction';
import type { GoalPreview } from '@/features/goals/types/goal-preview.types';
import { Card } from '@/ui/components/Card';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalPreviewCard.styles';

type GoalPreviewCardProps = {
  disabled?: boolean;
  goal: GoalPreview;
  onPress?: () => void;
  onToggle?: (goal: GoalPreview) => Promise<boolean>;
};

export const GoalPreviewCard = ({
  disabled = false,
  goal,
  onPress,
  onToggle,
}: GoalPreviewCardProps) => {
  const { theme } = useUnistyles();
  const accentColor =
    goal.accent === 'success' ? theme.colors.success : theme.colors.primary;
  const handleToggle = onToggle ? () => onToggle(goal) : undefined;

  const card = (
    <Card
      padding="medium"
      style={styles.card}
      testID={createScopedTestId(testIds.goals.previewCard, goal.id)}
      variant="elevated"
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          color={accentColor}
          name={goal.icon}
          size={theme.spacing.xxl}
        />
      </View>
      <View style={styles.content}>
        <Text numberOfLines={2} variant="bodyStrong">
          {goal.title}
        </Text>
        {goal.progress ? (
          <>
            <ProgressBar
              accessibilityLabel={`${goal.title} progress: ${goal.progress.current} of ${goal.progress.target}`}
              max={goal.progress.target}
              tone={goal.accent}
              value={goal.progress.current}
            />
            <Text tone="muted" variant="caption">
              <Text tone={goal.accent} variant="label">
                {goal.progress.current}
              </Text>{' '}
              / {goal.progress.target}
            </Text>
          </>
        ) : goal.metadata ? (
          <View style={styles.metadataRow}>
            {goal.metadataIcon ? (
              <MaterialCommunityIcons
                color={accentColor}
                name={goal.metadataIcon}
                size={theme.spacing.lg}
              />
            ) : null}
            <Text tone="muted">{goal.metadata}</Text>
          </View>
        ) : null}
        <View style={styles.scheduleBadge}>
          <MaterialCommunityIcons
            color={accentColor}
            name="clock-outline"
            size={theme.spacing.lg}
          />
          <Text numberOfLines={1} tone={goal.accent} variant="caption">
            {goal.scheduleLabel}
          </Text>
        </View>
      </View>
      <GoalStatusAction
        accent={goal.accent}
        accessibilityLabel={
          handleToggle
            ? `${goal.completed ? 'Undo completion for' : 'Mark as done'} ${goal.title}`
            : `${goal.title} is ${goal.completed ? 'completed' : 'not completed'}`
        }
        completed={goal.completed}
        disabled={disabled}
        onPress={handleToggle}
        testID={createScopedTestId(testIds.goals.statusAction, goal.id)}
      />
    </Card>
  );

  return onPress ? (
    <Pressable
      accessibilityHint="Opens Goal editing"
      accessibilityLabel={goal.title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      {card}
    </Pressable>
  ) : (
    card
  );
};
