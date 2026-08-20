import { zodResolver } from '@hookform/resolvers/zod';
import { type Href, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { ApiError } from '@/api/errors';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';
import { TextInput } from '@/ui/components/TextInput';

import { useRegisterMutation } from '@/features/auth/hooks/useRegisterMutation';
import { styles } from './AuthScreen.styles';

const registerSchema = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .max(128, 'Use no more than 128 characters.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterScreen = () => {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(registerSchema),
  });
  const serverError = registerMutation.error
    ? ApiError.fromUnknown(registerMutation.error).message
    : null;

  const submit = handleSubmit((values) => {
    registerMutation.register(values, {
      onSuccess: () => router.replace('/login?registered=1' as Href),
    });
  });

  return (
    <Screen contentContainerStyle={styles.content} centered>
      <View style={styles.header}>
        <Text variant="heading">Create your account</Text>
        <Text tone="muted">
          Start with an email and a secure password. You can add goals next.
        </Text>
      </View>

      <Card padding="large" style={styles.card}>
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
                autoComplete="new-password"
                error={errors.password?.message}
                hint="Use 8–128 characters."
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
            label="Create account"
            loading={registerMutation.isPending}
            onPress={submit}
          />
          <Button
            disabled={registerMutation.isPending}
            label="Back to sign in"
            onPress={() => router.replace('/login' as Href)}
            variant="ghost"
          />
        </View>
      </Card>
    </Screen>
  );
};
