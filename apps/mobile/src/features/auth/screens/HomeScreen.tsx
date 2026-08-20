import { View } from 'react-native';

import { ApiError } from '@/api/errors';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { useAuth } from '@/features/auth/AuthProvider';
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';
import { styles } from './AuthScreen.styles';

export const HomeScreen = () => {
  const { isUserLoading, retryCurrentUser, user, userError } = useAuth();
  const logoutMutation = useLogoutMutation();
  const logoutError = logoutMutation.error
    ? ApiError.fromUnknown(logoutMutation.error).message
    : null;

  return (
    <Screen contentContainerStyle={styles.content} centered>
      <View style={styles.header}>
        <Text variant="heading">Reward Goals</Text>
        <Text tone="muted">Your authenticated workspace is ready.</Text>
      </View>
      <Card padding="large" style={styles.card}>
        <View style={styles.header}>
          <Text variant="label">Signed in as</Text>
          {isUserLoading ? <Text>Loading your account…</Text> : null}
          {user ? <Text>{user.email}</Text> : null}
          {userError ? (
            <>
              <Text accessibilityRole="alert" tone="danger">
                {userError}
              </Text>
              <Button
                label="Try loading account again"
                onPress={() => void retryCurrentUser()}
                variant="ghost"
              />
            </>
          ) : null}
        </View>
        {logoutError ? (
          <Text accessibilityRole="alert" tone="danger">
            {logoutError}
          </Text>
        ) : null}
        <Button
          label="Sign out"
          loading={logoutMutation.isPending}
          onPress={() => logoutMutation.mutate()}
          variant="secondary"
        />
      </Card>
    </Screen>
  );
};
