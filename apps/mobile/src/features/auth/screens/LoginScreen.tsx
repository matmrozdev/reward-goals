import { zodResolver } from '@hookform/resolvers/zod';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useUnistyles, withUnistyles } from 'react-native-unistyles';
import { z } from 'zod';

import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';
import { TextInput } from '@/ui/components/TextInput';

import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation';
import { getLoginErrorMessage } from '@/features/auth/utils/get-login-error-message';
import { styles } from './LoginScreen.styles';

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Enter your password.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ThemedImage = withUnistyles(Image);

export const LoginScreen = () => {
  const router = useRouter();
  const { rt, theme } = useUnistyles();
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
    ? getLoginErrorMessage(loginMutation.error)
    : null;
  const isDarkTheme = rt.colorScheme === 'dark';

  const submit = handleSubmit((values) => loginMutation.login(values));

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        {isDarkTheme ? null : (
          <>
            <ThemedImage
              accessible={false}
              contentFit="contain"
              source={require('../../../../assets/images/auth/login-journey-hero.webp')}
              style={styles.heroImage}
            />
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={styles.heroBottomFade}
            >
              <View style={styles.heroBottomFadeTop} />
              <View style={styles.heroBottomFadeBottom} />
            </View>
          </>
        )}
        <View style={styles.heroCopy}>
          <Text style={styles.brandTitle} variant="heading">
            Reward{`\n`}Goals
          </Text>
          <Text style={styles.tagline} tone="muted">
            Small actions.{`\n`}Meaningful rewards.
          </Text>
        </View>
      </View>

      <Card padding="large" style={styles.card} variant="elevated">
        <View style={styles.header}>
          <Text variant="heading">Welcome back</Text>
          <Text tone="muted">
            Sign in to continue working toward your goals.
          </Text>
        </View>

        {registered ? (
          <View style={styles.successMessage}>
            <MaterialCommunityIcons
              color={theme.colors.success}
              name="check-circle-outline"
              size={theme.spacing.xl}
            />
            <Text
              accessibilityRole="alert"
              style={styles.successText}
              tone="success"
            >
              Account created. Sign in with your new credentials.
            </Text>
          </View>
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
            size="large"
          />
          <View style={styles.registerPrompt}>
            <Text tone="muted">New here?</Text>
            <Button
              disabled={loginMutation.isPending}
              label="Create an account"
              onPress={() => router.push('/register' as Href)}
              size="small"
              style={styles.registerButton}
              variant="ghost"
            />
          </View>
        </View>
      </Card>
    </Screen>
  );
};
