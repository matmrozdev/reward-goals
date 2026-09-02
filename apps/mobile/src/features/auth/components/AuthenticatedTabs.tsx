import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { testIds } from '@reward-goals/test-ids';

export const AuthenticatedTabs = () => {
  const { theme } = useUnistyles();
  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    }),
    [theme.colors.border, theme.colors.surface],
  );

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="(goals)"
        options={{
          tabBarAccessibilityLabel: 'Goals tab',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="target" size={size} />
          ),
          tabBarLabel: 'Goals',
          tabBarButtonTestID: testIds.navigation.goalsTab,
          title: 'Goals',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarAccessibilityLabel: 'Account tab',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              color={color}
              name="account-circle"
              size={size}
            />
          ),
          tabBarLabel: 'Account',
          tabBarButtonTestID: testIds.navigation.accountTab,
          title: 'Account',
        }}
      />
    </Tabs>
  );
};
