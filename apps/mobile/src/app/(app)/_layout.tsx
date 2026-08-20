import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="goals/[goalId]" />
      <Stack.Screen name="goals/[goalId]/edit" />
      <Stack.Screen name="goals/new" />
    </Stack>
  );
}
