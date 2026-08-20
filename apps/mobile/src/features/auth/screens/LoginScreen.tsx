import { zodResolver } from '@hookform/resolvers/zod';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { ApiError } from '@/api/errors';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';
import { TextInput } from '@/ui/components/TextInput';

import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation';
import { styles } from './AuthScreen.styles';

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Enter your password.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const router = useRouter();
  const { registered } = useLocalSearchParams<{ registered?: string }>();
  const loginMutation = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });
  const serverError = loginMutation.error
    ? ApiError.fromUnknown(loginMutation.error).message
    : null;

  const submit = handleSubmit((values) => loginMutation.login(values));

  return (
    <Screen contentContainerStyle={styles.content} centered>
      <View style={styles.header}>
        <Text variant="heading">Welcome back</Text>
        <Text tone="muted">Sign in to continue working toward your goals.</Text>
      </View>

      <Card padding="large" style={styles.card}>
        {registered ? (
          <Text accessibilityRole="alert" tone="success">
            Account created. Sign in with your new credentials.
          </Text>
        ) : null}
        {serverError ? (
          <Text accessibilityRole="alert" tone="danger">
            {serverError}
          </Text>
        ) : null}

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email?.message}
                keyboardType="email-address"
                label="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                returnKeyType="next"
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                autoCapitalize="none"
                autoComplete="current-password"
                error={errors.password?.message}
                label="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={submit}
                returnKeyType="done"
                secureTextEntry
                value={value}
              />
            )}
          />
        </View>

        <View style={styles.actions}>
          <Button
            label="Sign in"
            loading={loginMutation.isPending}
            onPress={submit}
          />
          <Button
            disabled={loginMutation.isPending}
            label="Create an account"
            onPress={() => router.push('/register' as Href)}
            variant="ghost"
          />
        </View>
      </Card>
    </Screen>
  );
};
