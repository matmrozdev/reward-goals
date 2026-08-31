import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { GoalsPreviewSection } from '@/features/dashboard/components/GoalsPreviewSection';
import { RewardsPreviewCard } from '@/features/dashboard/components/RewardsPreviewCard';
import { TodaySummaryCard } from '@/features/dashboard/components/TodaySummaryCard';
import type {
  DashboardGoal,
  DashboardReward,
} from '@/features/dashboard/types/dashboard.types';
import { FloatingActionButton } from '@/ui/components/FloatingActionButton';
import { Screen } from '@/ui/components/Screen';

import { styles } from './DashboardScreen.styles';

const initialGoals: DashboardGoal[] = [
  {
    accent: 'primary',
    completed: true,
    icon: 'book-open-page-variant',
    id: 'read-pages',
    progress: { current: 12, target: 20 },
    scheduleLabel: 'Today',
    title: 'Read 20 pages',
  },
  {
    accent: 'success',
    completed: true,
    icon: 'shoe-sneaker',
    id: 'morning-run',
    progress: { current: 3, target: 5 },
    scheduleLabel: 'Today',
    title: 'Morning run',
  },
  {
    accent: 'primary',
    completed: false,
    icon: 'chat-processing',
    id: 'practice-spanish',
    metadata: '7 day streak',
    metadataIcon: 'fire',
    scheduleLabel: 'Today',
    title: 'Practice Spanish',
  },
  {
    accent: 'primary',
    completed: false,
    icon: 'notebook-outline',
    id: 'journal',
    metadata: '7:00 PM',
    metadataIcon: 'clock-outline',
    scheduleLabel: 'Today',
    title: 'Journal',
  },
];

const movieNightReward: DashboardReward = {
  currentProgress: 12,
  id: 'movie-night',
  remainingCopy: "You're 8 points away from your next reward!",
  targetProgress: 20,
  title: 'Movie night',
};

export const DashboardScreen = () => {
  const router = useRouter();
  const [goals, setGoals] = useState(initialGoals);
  const completedCount = goals.filter((goal) => goal.completed).length;

  const toggleGoal = (goalId: string) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <Screen
        contentContainerStyle={styles.content}
        safeAreaEdges={['top', 'right', 'left']}
      >
        <DashboardHeader
          avatarLabel="Alex"
          greeting="Good morning, Alex"
          subtitle="Keep your momentum going."
        />
        <TodaySummaryCard
          completedCount={completedCount}
          totalCount={goals.length}
        />
        <GoalsPreviewSection
          goals={goals}
          onSeeAll={() => router.push('/goals')}
          onToggleGoal={toggleGoal}
        />
        <RewardsPreviewCard reward={movieNightReward} />
      </Screen>
      <View pointerEvents="box-none" style={styles.floatingAction}>
        <FloatingActionButton
          accessibilityHint="Opens the create Goal screen"
          accessibilityLabel="Add Goal"
          onPress={() => router.push('/goals/new')}
        />
      </View>
    </View>
  );
};
