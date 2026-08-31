import { View } from 'react-native';

import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { useAuth } from '@/providers/AuthProvider';
import { styles } from './SessionRestoreScreen.styles';

export const SessionRestoreScreen = () => {
  const { clearAuthentication, restoreError, retryRestore, status } = useAuth();

  if (status === 'restoring') {
    return <Loader fullScreen label="Restoring your session" />;
  }

  return (
    <Screen contentContainerStyle={styles.content} centered scroll={false}>
      <Card padding="large" style={styles.card}>
        <View style={styles.header}>
          <Text variant="title">We could not restore your session</Text>
          <Text tone="muted">
            {restoreError ??
              'Check your connection and try again. Your saved session is still secure on this device.'}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label="Try again" onPress={() => void retryRestore()} />
          <Button
            label="Sign in instead"
            onPress={() => void clearAuthentication()}
            variant="ghost"
          />
        </View>
      </Card>
    </Screen>
  );
};
