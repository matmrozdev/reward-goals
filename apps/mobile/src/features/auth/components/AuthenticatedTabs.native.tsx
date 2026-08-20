import {
  createNativeBottomTabNavigator,
  type NativeBottomTabNavigationEventMap,
  type NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

const NativeBottomTabNavigator = createNativeBottomTabNavigator().Navigator;
const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof NativeBottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(NativeBottomTabNavigator);

export const AuthenticatedTabs = () => {
  const { theme } = useUnistyles();
  const tabBarStyle = useMemo(
    () => ({ backgroundColor: theme.colors.surface }),
    [theme.colors.surface],
  );

  return (
    <Tabs
      backBehavior="history"
      tabBarActiveTintColor={theme.colors.primary}
      tabBarInactiveTintColor={theme.colors.textMuted}
      tabBarStyle={tabBarStyle}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarButtonTestID: 'goals-tab',
          tabBarIcon: () =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'target' }
              : MaterialDesignIcons.getImageSourceSync('target', 24, 'black'),
          tabBarLabel: 'Goals',
          title: 'Goals',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarButtonTestID: 'account-tab',
          tabBarIcon: () =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'person.crop.circle' }
              : MaterialDesignIcons.getImageSourceSync(
                  'account-circle',
                  24,
                  'black',
                ),
          tabBarLabel: 'Account',
          title: 'Account',
        }}
      />
    </Tabs>
  );
};
