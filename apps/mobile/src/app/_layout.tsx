import '@/theme/unistyles';

import { StatusBar } from 'expo-status-bar';

import { AuthNavigator } from '@/features/auth/components/AuthNavigator';
import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <AuthNavigator />
    </AppProviders>
  );
}
