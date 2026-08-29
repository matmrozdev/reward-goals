import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { DashboardGoal } from '@/features/dashboard/types/dashboard.types';
import { Card } from '@/ui/components/Card';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalPreviewCard.styles';

type GoalPreviewCardProps = {
  goal: DashboardGoal;
  onToggle: (goalId: string) => void;
};

export const GoalPreviewCard = ({ goal, onToggle }: GoalPreviewCardProps) => {
  const { theme } = useUnistyles();
  const accentColor =
    goal.accent === 'success' ? theme.colors.success : theme.colors.primary;
  const handleToggle = () => {
    onToggle(goal.id);
  };

  return (
    <Card padding="medium" style={styles.card} variant="elevated">
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
          <Text tone={goal.accent} variant="caption">
            {goal.scheduleLabel}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel={`${goal.completed ? 'Undo completion for' : 'Mark as done'} ${goal.title}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: goal.completed }}
        onPress={handleToggle}
        style={styles.statusAction(goal.completed, goal.accent)}
      >
        {goal.completed ? (
          <MaterialCommunityIcons
            color={theme.colors.onPrimary}
            name="check"
            size={theme.spacing.xl}
          />
        ) : null}
      </Pressable>
    </Card>
  );
};
