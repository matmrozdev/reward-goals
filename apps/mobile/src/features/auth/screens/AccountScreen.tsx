import { View } from 'react-native';

import { ApiError } from '@/api/errors';
import { useAuth } from '@/providers/AuthProvider';
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './AccountScreen.styles';

export const AccountScreen = () => {
  const { isUserLoading, retryCurrentUser, user, userError } = useAuth();
  const logoutMutation = useLogoutMutation();
  const logoutError = logoutMutation.error
    ? ApiError.fromUnknown(logoutMutation.error).message
    : null;

  return (
    <Screen
      contentContainerStyle={styles.content}
      safeAreaEdges={['top', 'right', 'left']}
    >
      <View style={styles.header}>
        <Text variant="heading">Account</Text>
        <Text tone="muted">Manage your authenticated session.</Text>
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
