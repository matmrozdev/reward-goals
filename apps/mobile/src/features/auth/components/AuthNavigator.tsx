import { Stack } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';
import { SessionRestoreScreen } from '@/features/auth/screens/SessionRestoreScreen';

export const AuthNavigator = () => {
  const { status } = useAuth();

  if (status === 'restoring' || status === 'restore-error') {
    return <SessionRestoreScreen />;
  }

  const isAuthenticated = status === 'authenticated';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
};
