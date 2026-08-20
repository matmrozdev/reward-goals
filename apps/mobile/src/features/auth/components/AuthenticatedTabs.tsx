import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

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
        name="index"
        options={{
          tabBarAccessibilityLabel: 'Goals tab',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="target" size={size} />
          ),
          tabBarLabel: 'Goals',
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
          title: 'Account',
        }}
      />
    </Tabs>
  );
};
