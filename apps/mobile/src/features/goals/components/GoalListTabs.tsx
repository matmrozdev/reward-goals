import { Pressable, View } from 'react-native';

import type { GoalListTab } from '@/features/goals/types/goal-list.types';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalListTabs.styles';

type GoalListTabsProps = {
  onChange: (tab: GoalListTab) => void;
  value: GoalListTab;
};

const tabs: { label: string; value: GoalListTab }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
];

export const GoalListTabs = ({ onChange, value }: GoalListTabsProps) => (
  <View accessibilityRole="tablist" style={styles.container}>
    {tabs.map((tab) => {
      const selected = tab.value === value;

      return (
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          key={tab.value}
          onPress={() => onChange(tab.value)}
          style={({ pressed }) => [
            styles.tab,
            selected && styles.tabSelected,
            pressed && styles.tabPressed,
          ]}
        >
          <Text
            style={styles.label}
            tone={selected ? 'primary' : 'muted'}
            variant={selected ? 'label' : 'body'}
          >
            {tab.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
