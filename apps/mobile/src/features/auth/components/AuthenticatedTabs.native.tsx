import { useMemo } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useUnistyles } from 'react-native-unistyles';

export const AuthenticatedTabs = () => {
  const { theme } = useUnistyles();
  const iconColor = useMemo(
    () => ({
      default: theme.colors.textMuted,
      selected: theme.colors.primary,
    }),
    [theme.colors.primary, theme.colors.textMuted],
  );

  return (
    <NativeTabs
      backBehavior="history"
      backgroundColor={theme.colors.surface}
      iconColor={iconColor}
      tintColor={theme.colors.primary}
    >
      <NativeTabs.Trigger
        accessibilityLabel="Goals tab"
        name="index"
        testID="goals-tab"
      >
        <NativeTabs.Trigger.Icon sf="target" md="target" />
        <NativeTabs.Trigger.Label>Goals</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        accessibilityLabel="Account tab"
        name="account"
        testID="account-tab"
      >
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};
