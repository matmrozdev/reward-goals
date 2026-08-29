import { View } from 'react-native';

import { GoalPreviewCard } from '@/features/dashboard/components/GoalPreviewCard';
import type { DashboardGoal } from '@/features/dashboard/types/dashboard.types';
import { SectionLinkCard } from '@/ui/components/SectionLinkCard';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalsPreviewSection.styles';

type GoalsPreviewSectionProps = {
  goals: DashboardGoal[];
  onSeeAll: () => void;
  onToggleGoal: (goalId: string) => void;
};

export const GoalsPreviewSection = ({
  goals,
  onSeeAll,
  onToggleGoal,
}: GoalsPreviewSectionProps) => (
  <View accessibilityLabel="Today's goals" style={styles.container}>
    <Text variant="title">Today&apos;s goals</Text>
    <View style={styles.list}>
      {goals.map((goal) => (
        <GoalPreviewCard goal={goal} key={goal.id} onToggle={onToggleGoal} />
      ))}
    </View>
    <SectionLinkCard
      accessibilityHint="Opens the complete Goals list"
      label="See all goals"
      onPress={onSeeAll}
    />
  </View>
);
