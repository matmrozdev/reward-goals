import { View } from 'react-native';

import { GoalPreviewCard } from '@/features/dashboard/components/GoalPreviewCard';
import type { DashboardGoal } from '@/features/dashboard/types/dashboard.types';
import { Card } from '@/ui/components/Card';
import { SectionLinkCard } from '@/ui/components/SectionLinkCard';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalsPreviewSection.styles';

type GoalsPreviewSectionProps = {
  errorMessage?: string | null;
  goals: DashboardGoal[];
  isTogglePending?: boolean;
  onSeeAll: () => void;
  onToggleGoal: (goal: DashboardGoal) => void;
};

export const GoalsPreviewSection = ({
  errorMessage,
  goals,
  isTogglePending = false,
  onSeeAll,
  onToggleGoal,
}: GoalsPreviewSectionProps) => (
  <View accessibilityLabel="Today's goals" style={styles.container}>
    <Text variant="title">Today&apos;s goals</Text>
    {errorMessage ? (
      <Card padding="small" variant="muted">
        <Text accessibilityRole="alert" tone="danger">
          {errorMessage}
        </Text>
      </Card>
    ) : null}
    <View style={styles.list}>
      {goals.length ? (
        goals.map((goal) => (
          <GoalPreviewCard
            disabled={isTogglePending}
            goal={goal}
            key={goal.id}
            onToggle={onToggleGoal}
          />
        ))
      ) : (
        <Card padding="large" variant="muted">
          <Text variant="bodyStrong">Nothing scheduled for today</Text>
          <Text tone="muted">
            Create a Goal or adjust its schedule to see it here.
          </Text>
        </Card>
      )}
    </View>
    <SectionLinkCard
      accessibilityHint="Opens the complete Goals list"
      label="See all goals"
      onPress={onSeeAll}
    />
  </View>
);
